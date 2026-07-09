import {
  ZCStudent,
  ZCuid,
  ZQueryParams,
  ZUStudent,
} from "@prepexcellence/shared-validators";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import type { UserWithRoleAndPermissions } from "@/utils/permission";
import config from "../../config";

export class StudentController {
  getMe = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const currentUser = req.user as UserWithRoleAndPermissions;

      const student = await prisma.student.findUnique({
        where: { userId: currentUser.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              image: true,
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!student) throw AppError.notFound("Student not found");

      const { user, ...s } = student;
      const { id: _skipUserId, ...safeUser } = user;
      const imageUrl = user.image
        ? /^https?:\/\//i.test(user.image)
          ? user.image
          : `${config.storage_url.public_url}/${user.image}`
        : null;
      const result = {
        ...s,
        ...safeUser,
        image: imageUrl,
      };

      res.status(200).json({
        success: true,
        data: result,
      });
    },
  );

  getById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = ZCuid.parse(req.params);

      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              image: true,
            },
          },
        },
      });

      if (!student) throw AppError.notFound("Student not found");

      const { user, ...s } = student;
      const { id: _skipUserId, ...safeUser } = user;
      const result = {
        ...s,
        ...safeUser,
        image: user.image
          ? `${config.storage_url.public_url}/${user.image}`
          : null,
      };

      res.status(200).json({
        success: true,
        data: result,
      });
    },
  );

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, orderBy } = ZQueryParams.parse(req.query);

    const skip = (page - 1) * limit;
    const cacheKey = `students:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}`;

    const cachedData = await cached.get(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return res.status(200).json({
        success: true,
        message: "Students fetched successfully (from cache)",
        data: parsed.data,
        pagination: parsed.pagination,
      });
    }

    const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        skip,
        take: limit,
        orderBy: orderClause,
        select: {
          id: true,
          userId: true,
          grade: true,
          class: true,
          section: true,
          enrollmentDate: true,
          currentLevel: true,
          gpa: true,
          totalCredits: true,
          academicStatus: true,
          guardianEmail: true,
          guardianName: true,
          guardianPhone: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              address: true,
              image: true,
            },
          },
        },
      }),
      prisma.student.count(),
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

    const result = students.map((s) => {
      const { user, ...studentData } = s;
      const hasImage = user.image && user.image.trim() !== "";
      if (!hasImage) {
        user.image = null;
      } else if (!/^https?:\/\//i.test(user.image!)) {
        user.image = `${config.storage_url.public_url}/${user.image}`;
      }
      return {
        ...studentData,
        ...user,
      };
    });

    await cached.set(
      cacheKey,
      JSON.stringify({ data: result, pagination }),
      60,
    );

    return res.status(200).json({
      success: true,
      data: result,
      pagination,
    });
  });

  create = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const data = ZCStudent.parse(req.body);
      const requestedUser = req.user!;
      const imageFile = req.file;

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        throw AppError.conflict("User already exists");
      }

      const existingRole = await prisma.role.findUnique({
        where: { name: "Student" },
        select: { id: true, name: true },
      });
      if (!existingRole) {
        throw AppError.badRequest("Invalid role specified");
      }

      // Handle image upload
      let imageUrl: string | undefined;
      if (imageFile) {
        const imageKey = `users/students/${generateFileName(
          imageFile.originalname,
          "student_",
        )}`;

        const minioService = (await import("@/infrastructure/storage/minio"))
          .default;
        await minioService.uploadFile(
          imageKey,
          imageFile.buffer,
          imageFile.mimetype,
          {
            originalName: imageFile.originalname,
            uploadedAt: new Date().toISOString(),
          },
        );
        imageUrl = imageKey;
      }

      const result = await prisma.$transaction(async (tx) => {
        // Extract relative path from full URL if present
        let finalImageUrl = imageUrl;
        if (!finalImageUrl && data.image) {
          if (data.image.startsWith("http")) {
            const publicUrl = config.storage_url.public_url;
            finalImageUrl = data.image.replace(`${publicUrl}/`, "");
          } else {
            finalImageUrl = data.image;
          }
        }

        const user = await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: await bcrypt.hash(data.password, 12),
            roleId: existingRole.id,
            phone: data.phone,
            address: data.address,
            image: finalImageUrl,
            isVerified: data.isVerified ?? true,
            createdById: requestedUser.id,
          },
        });

        const student = await tx.student.create({
          data: {
            userId: user.id,
            grade: data.grade,
            class: data.class,
            section: data.section,
            enrollmentDate: data.enrollmentDate,
            currentLevel: data.currentLevel,
            gpa: data.gpa,
            totalCredits: data.totalCredits,
            academicStatus: data.academicStatus,
            guardianEmail: data.guardianEmail,
            guardianName: data.guardianName,
            guardianPhone: data.guardianPhone,
          },
        });

        return { student, user };
      });

      // Audit log
      const currentUser = req.user as UserWithRoleAndPermissions | undefined;
      await createAuditLogFromRequest(req, {
        action: AuditAction.CREATE,
        module: "Student",
        entityId: result.student.id,
        description: `Student created: ${result.user.email}`,
        performedById: currentUser?.id,
      });

      await invalidateCachePattern("students:*");

      return res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: result.student.id,
      });
    },
  );

  update = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = ZCuid.parse(req.params);
      const data = ZUStudent.parse(req.body);
      const imageFile = req.file;
      const {
        name,
        email,
        phone,
        address,
        image,
        isVerified,
        isStaff = false,
        ...studentData
      } = data;

      // Handle image upload
      let imageUrl: string | undefined;
      if (imageFile) {
        const imageKey = `users/students/${generateFileName(
          imageFile.originalname,
          "student_",
        )}`;

        const minioService = (await import("@/infrastructure/storage/minio"))
          .default;
        await minioService.uploadFile(
          imageKey,
          imageFile.buffer,
          imageFile.mimetype,
          {
            originalName: imageFile.originalname,
            uploadedAt: new Date().toISOString(),
          },
        );
        imageUrl = imageKey;
      }

      await prisma.$transaction(async (tx) => {
        const studentIns = await tx.student.findUnique({
          where: { id },
          select: { id: true, userId: true },
        });
        if (!studentIns) throw AppError.notFound("Student not found");

        await prisma.student.update({
          where: { id },
          data: studentData,
        });

        const user = await prisma.user.findUnique({
          where: { id: studentIns.userId },
        });
        if (!user) throw AppError.notFound("User not found");

        const userData: Record<string, any> = {};
        if (name !== undefined) userData.name = name;
        if (email !== undefined) userData.email = email;
        if (phone !== undefined) userData.phone = phone;
        if (address !== undefined) userData.address = address;
        if (imageUrl !== undefined) userData.image = imageUrl;
        else if (image !== undefined) {
          // Extract relative path from full URL if present
          if (image.startsWith("http")) {
            const publicUrl = config.storage_url.public_url;
            userData.image = image.replace(`${publicUrl}/`, "");
          } else {
            userData.image = image;
          }
        }
        if (isVerified !== undefined) userData.isVerified = isVerified;
        if (isStaff !== undefined) userData.isStaff = isStaff;

        await tx.user.update({
          where: { id: studentIns.userId },
          data: userData,
        });
      });

      // Audit log
      const currentUser = req.user as UserWithRoleAndPermissions;
      await createAuditLogFromRequest(req, {
        action: AuditAction.UPDATE,
        module: "Student",
        entityId: id,
        description: `Student updated: ${data.email || "student"}`,
        performedById: currentUser.id,
      });

      await invalidateCachePattern("students:*");

      res.status(200).json({
        success: true,
        message: "Student updated successfully",
      });
    },
  );

  delete = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = ZCuid.parse(req.params);

      const student = await prisma.student.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });
      if (!student) throw AppError.notFound("Student not found");

      await prisma.$transaction(async (tx) => {
        await tx.student.delete({
          where: { id },
        });
        await tx.user.delete({
          where: { id: student.userId },
        });
      });

      // Audit log
      const currentUser = req.user as UserWithRoleAndPermissions;
      await createAuditLogFromRequest(req, {
        action: AuditAction.DELETE,
        module: "Student",
        entityId: id,
        description: `Student deleted: ${student.userId}`,
        performedById: currentUser.id,
      });

      await invalidateCachePattern("students:*");

      res.status(200).json({
        success: true,
        message: "Student deleted successfully",
      });
    },
  );
}
