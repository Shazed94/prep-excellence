import crypto from "node:crypto";
import type { PaginatedResponse } from "@prepexcellence/shared-types";
import {
  ZCUser,
  ZCuid,
  ZLogin,
  ZQueryParams,
  ZRegister,
} from "@prepexcellence/shared-validators";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import type ms from "ms";
import config from "@/config";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import emailService from "@/infrastructure/email/email";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import {
  PERMISSIONS,
  PermissionChecker,
  type UserWithRoleAndPermissions,
} from "@/utils/permission";

const googleClient = new OAuth2Client(
  "REDACTED",
);

export function generateTokens(userId: string, email: string) {
  const accessToken = jwt.sign({ userId, email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as ms.StringValue,
  });

  const refreshToken = jwt.sign({ userId, email }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as ms.StringValue,
  });

  return { accessToken, refreshToken };
}

export class AuthController {
  register = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const data = ZRegister.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw AppError.conflict("User already exists");
      }

      const roleIns = await prisma.role.findUnique({
        where: { name: data.role },
      });

      if (!roleIns) {
        throw AppError.badRequest("Invalid role specified");
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);
      const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            roleId: roleIns.id,
            password: hashedPassword,
          },
        });

        if (data.role === "Student") {
          await tx.student.create({
            data: {
              userId: newUser.id,
            },
          });
        }
        return newUser;
      });

      // Audit log
      await createAuditLogFromRequest(req, {
        action: AuditAction.CREATE,
        module: "User",
        entityId: user.id,
        description: `User registered: ${user.email}`,
        performedById: user.id,
      });

      // Send welcome email (non-blocking)
      emailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
        console.error("Failed to send welcome email:", err);
      });

      const { accessToken, refreshToken } = generateTokens(user.id, user.email);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: roleIns.name,
          },
          accessToken,
          refreshToken,
        },
      });
    },
  );

  login = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const data = ZLogin.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          role: { select: { name: true } },
        },
      });

      if (!user) {
        throw AppError.unauthorized("Invalid credentials");
      }

      const isValid = await bcrypt.compare(data.password, user.password);
      if (!isValid) {
        throw AppError.unauthorized("Invalid credentials");
      }

      // Audit log
      await createAuditLogFromRequest(req, {
        action: AuditAction.LOGIN,
        module: "User",
        entityId: user.id,
        description: `User logged in: ${user.email}`,
        performedById: user.id,
      });

      const { accessToken, refreshToken } = generateTokens(user.id, user.email);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
          },
          accessToken,
          refreshToken,
        },
      });
    },
  );

  googleLogin = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { accessToken: googleAccessToken } = req.body;

      if (!googleAccessToken) {
        throw AppError.badRequest("Google access token is required");
      }

      try {
        // ----------------------------------------------------------------
        // FIX: useGoogleLogin() returns an OAuth ACCESS TOKEN, not an ID
        // token JWT.  We must verify it with getTokenInfo() instead of
        // verifyIdToken(), then fetch the user profile separately via the
        // Google UserInfo API to get the user's name.
        // ----------------------------------------------------------------

        // Step 1 — Verify the access token and extract email / Google ID
        const tokenInfo = await googleClient.getTokenInfo(googleAccessToken);

        const email = tokenInfo.email;

        if (!email) {
          throw AppError.badRequest(
            "Email not provided by Google. Make sure the 'email' scope is requested.",
          );
        }

        // Step 2 — Fetch user profile (name, picture, etc.) via UserInfo API
        let name: string | undefined;
        let image: string | undefined;
        try {
          const userInfoRes = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${googleAccessToken}`,
              },
            },
          );

          if (userInfoRes.ok) {
            const userInfo: any = await userInfoRes.json();
            console.log("userInfooooooooo", userInfo);
            name = userInfo.name;
            image = userInfo.picture;
          }
        } catch {
          // Fallback to email prefix if UserInfo API fails
        }

        // Step 3 — Find or create user
        let user = await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });

        if (!user) {
          // Create new user with Student role
          const studentRole = await prisma.role.findUnique({
            where: { name: "Student" },
          });

          if (!studentRole) {
            throw AppError.internal("Student role not found");
          }

          user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
              data: {
                email,
                name: name || email.split("@")[0],
                roleId: studentRole.id,
                image: image,
                // Password is required in schema — set an unreachable hash
                password: await bcrypt.hash(crypto.randomUUID(), 12),
              },
              include: { role: true },
            });

            // Create student profile
            await tx.student.create({
              data: {
                userId: newUser.id,
              },
            });

            return newUser;
          });

          // Audit log for signup
          await createAuditLogFromRequest(req, {
            action: AuditAction.CREATE,
            module: "User",
            entityId: user.id,
            description: `User registered via Google: ${user.email}`,
            performedById: user.id,
          });

          // Send welcome email (non-blocking)
          emailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
            console.error("Failed to send welcome email:", err);
          });
        }

        // Audit log for login
        await createAuditLogFromRequest(req, {
          action: AuditAction.LOGIN,
          module: "User",
          entityId: user.id,
          description: `User logged in via Google: ${user.email}`,
          performedById: user.id,
        });

        const { accessToken, refreshToken } = generateTokens(
          user.id,
          user.email,
        );

        return res.status(200).json({
          success: true,
          message: "Google login successful",
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role.name,
            },
            accessToken,
            refreshToken,
          },
        });
      } catch (error: any) {
        console.error("Google login error:", error);
        throw AppError.unauthorized("Google login failed");
      }
    },
  );

  refreshToken = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { refreshToken } = req.body;

      if (!refreshToken) throw AppError.badRequest("Refresh token required");

      let decoded: { userId: string; email: string };
      try {
        decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
          userId: string;
          email: string;
        };
      } catch (_) {
        throw AppError.unauthorized("Invalid refresh token");
      }
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        decoded.userId,
        decoded.email,
      );

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: { accessToken, refreshToken: newRefreshToken },
      });
    },
  );

  logout = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const currentUser = req.user as UserWithRoleAndPermissions | undefined;

      // Audit log
      if (currentUser) {
        await createAuditLogFromRequest(req, {
          action: AuditAction.LOGOUT,
          module: "User",
          entityId: currentUser.id,
          description: `User logged out: ${currentUser.email}`,
          performedById: currentUser.id,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    },
  );

  forgotPassword = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email } = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw AppError.badRequest("Invalid email format");
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        // Return generic message to prevent email enumeration
        return res.status(200).json({
          success: true,
          message: "If the email exists in our system, an OTP has been sent.",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in separate OtpVerification table
      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          otp,
          expiresAt,
          isUsed: false,
        },
      });

      // Send OTP via email
      try {
        await this.sendOtpEmail(email, otp);
      } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw AppError.internal("Failed to send OTP email");
      }

      return res.status(200).json({
        success: true,
        message: "If the email exists in our system, an OTP has been sent.",
      });
    },
  );

  verifyOtp = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, otp } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw AppError.notFound("User not found");
      }

      const otpRecord = await prisma.otpVerification.findFirst({
        where: { userId: user.id, isUsed: false },
        orderBy: { createdAt: "desc" },
      });

      if (!otpRecord) {
        throw AppError.badRequest("No OTP found. Please request a new one.");
      }

      if (otpRecord.isUsed) {
        throw AppError.badRequest(
          "OTP has already been used. Please request a new one.",
        );
      }

      if (otpRecord.otp !== otp) {
        throw AppError.badRequest("Invalid OTP");
      }

      const now = new Date();
      if (otpRecord.expiresAt < now) {
        throw AppError.badRequest("OTP expired. Please request a new one.");
      }

      // Mark OTP as used/verified
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: {
          verifiedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    },
  );

  resendOtp = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw AppError.notFound("User not found");
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      // Store OTP in separate OtpVerification table
      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          otp,
          expiresAt,
          isUsed: false,
        },
      });
      // Send OTP via email
      try {
        await this.sendOtpEmail(email, otp);
      } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw AppError.internal("Failed to send OTP email");
      }
      return res.status(200).json({
        success: true,
        message: "If the email exists in our system, a new OTP has been sent.",
      });
    },
  );

  resetPassword = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword) {
        throw AppError.badRequest("Passwords do not match");
      }

      // Validate password strength
      if (newPassword.length < 8) {
        throw AppError.badRequest("Password must be at least 8 characters");
      }
      if (!/\d/.test(newPassword)) {
        throw AppError.badRequest("Password must contain at least 1 number");
      }
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) {
        throw AppError.badRequest("Password must contain at least 1 symbol");
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw AppError.notFound("User not found");
      }

      const otpRecord = await prisma.otpVerification.findFirst({
        where: { userId: user.id, verifiedAt: { not: null } },
        orderBy: { createdAt: "desc" },
      });

      if (!otpRecord || !otpRecord.verifiedAt) {
        throw AppError.badRequest("OTP not verified. Please verify OTP first.");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: {
          isUsed: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    },
  );

  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const html = `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2>Password Reset Request</h2>
				<p>You requested to reset your password. Use the following OTP to verify your identity:</p>
				<div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
					<strong>${otp}</strong>
				</div>
				<p>This OTP will expire in 10 minutes.</p>
				<p>If you didn't request this, please ignore this email.</p>
				<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
				<p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
			</div>
		`;

    await emailService.sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html,
    });
  }
}

export class UserController {
  getMe = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const currentUser = req.user as UserWithRoleAndPermissions;
      console.log("Current User ID:", currentUser.id, currentUser.name);

      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: {
            select: {
              name: true,
            },
          },
          image: true,
          address: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) throw AppError.notFound("User not found");

      return res.status(200).json({
        success: true,
        data: user,
      });
    },
  );

  getById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = ZCuid.parse(req.params);
      const currentUser = req.user as UserWithRoleAndPermissions;

      // Check if user can access this specific user
      const scope = PermissionChecker.getPermissionScope(
        currentUser,
        PERMISSIONS.USER.VIEW,
      );

      // If user has "own" scope and is trying to view someone else, check VIEW_OWN permission
      if (
        scope === "own" &&
        currentUser.id !== id &&
        !PermissionChecker.hasPermission(currentUser, PERMISSIONS.USER.VIEW)
      ) {
        throw AppError.forbidden("You can only view your own user information");
      }

      const cacheKey = `user:profile:${id}`;
      const cacheTTL = 120; // 2 minutes

      // Try cache first
      const cachedUser = await cached.getJSON(cacheKey);
      if (cachedUser) {
        return res.status(200).json({
          success: true,
          data: cachedUser,
        });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: {
            select: {
              name: true,
            },
          },
          image: true,
          address: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) throw AppError.notFound("User not found");

      // Cache the result
      await cached.setJSON(cacheKey, user, cacheTTL);

      return res.status(200).json({
        success: true,
        data: user,
      });
    },
  );

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);
    const currentUser = req.user as UserWithRoleAndPermissions;

    const skip = (page - 1) * limit;

    const cacheKey = `users:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:userId=${currentUser.id}`;

    const cachedData = await cached.get(cacheKey);

    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return res.status(200).json({
        success: true,
        message: "Users fetched successfully (from cache)",
        data: parsed.data,
        pagination: parsed.pagination,
      });
    }

    // Build scope-based filter
    const scopeFilter = await PermissionChecker.buildScopeFilter(
      currentUser,
      PERMISSIONS.USER.VIEW,
      "id", // User model uses "id" as the user identifier
    );

    if (scopeFilter === null) {
      throw AppError.forbidden("You do not have permission to view users");
    }

    const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: scopeFilter, // Apply scope-based filtering
        skip,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          email: true,
          name: true,
          isActive: true,
          address: true,
          phone: true,
          image: true,
          role: {
            select: {
              name: true,
            },
          },
        },
        orderBy: orderClause,
      }),

      prisma.user.count({ where: scopeFilter }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const pagination = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    await cached.set(cacheKey, JSON.stringify({ data: users, pagination }), 60);

    return res.status(200).json({
      success: true,
      data: users,
      pagination,
    } as PaginatedResponse<any>);
  });

  update = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = ZCuid.parse(req.params);
      const data = ZCUser.partial().parse(req.body);
      const currentUser = req.user as UserWithRoleAndPermissions;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw AppError.notFound("User not found");

      // Check if user can update this specific user
      if (
        !currentUser.isSuperUser &&
        currentUser.id !== id &&
        !PermissionChecker.hasPermission(currentUser, PERMISSIONS.USER.CHANGE)
      ) {
        throw AppError.forbidden("You can only update your own information");
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      });

      // Audit log
      await createAuditLogFromRequest(req, {
        action: AuditAction.UPDATE,
        module: "User",
        entityId: id,
        description: `User updated: ${updatedUser.email}`,
        performedById: currentUser.id,
      });

      // Invalidate caches
      await Promise.all([
        cached.del(`user:profile:${id}`),
        cached.del(`user:permissions:${id}`),
        cached
          .keys(`users:page=*`)
          .then((keys) => Promise.all(keys.map((key) => cached.del(key)))),
      ]);

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    },
  );

  isActive = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = ZCuid.parse(req.params);

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw AppError.notFound("User not found");

      const currentUser = req.user as UserWithRoleAndPermissions;

      await prisma.user.update({
        where: { id },
        data: { isActive: !user.isActive },
      });

      // Audit log
      await createAuditLogFromRequest(req, {
        action: AuditAction.CHANGE_STATUS,
        module: "User",
        entityId: id,
        description: `User ${user.isActive ? "deactivated" : "activated"}: ${user.email}`,
        performedById: currentUser.id,
      });

      // Invalidate caches
      await Promise.all([
        invalidateCachePattern(`user:profile:${id}`),
        invalidateCachePattern(`user:permissions:${id}`),
        invalidateCachePattern("users:*"),
      ]);

      res.status(200).json({
        success: true,
        message: `User ${user.isActive ? "deactivated" : "activated"} successfully`,
      });
    },
  );

  deleteUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = ZCuid.parse(req.params);
      const currentUser = req.user as UserWithRoleAndPermissions;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw AppError.notFound("User not found");

      await prisma.user.delete({ where: { id } });

      // Audit log
      await createAuditLogFromRequest(req, {
        action: AuditAction.DELETE,
        module: "User",
        entityId: id,
        description: `User deleted: ${user.email}`,
        performedById: currentUser.id,
      });

      // Invalidate caches
      await Promise.all([
        invalidateCachePattern(`user:profile:${id}`),
        invalidateCachePattern(`user:permissions:${id}`),
        invalidateCachePattern("users:*"),
      ]);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    },
  );
}
