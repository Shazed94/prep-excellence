import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodObject } from "zod";
import logger from "@/utils/logger";
import { AppError } from "../utils/AppError";

/**
 * Middleware to parse multipart form data fields back to proper types.
 * Multer leaves all form fields as strings; this converts JSON arrays/objects,
 * numeric strings, and date strings back to their original types before validation.
 */
export function parseMultipartBody(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.body || typeof req.body !== "object") {
    return next();
  }

  const body = req.body as Record<string, unknown>;

  // Parse numeric fields
  for (const field of ["duration", "capacity", "price", "discount"] as const) {
    if (typeof body[field] === "string") {
      body[field] = Number(body[field]);
    }
  }

  // Parse date fields
  for (const field of ["startDate", "endDate"] as const) {
    if (typeof body[field] === "string") {
      body[field] = new Date(body[field] as string);
    }
  }

  // Parse JSON array/object fields
  for (const field of [
    "tags",
    "schedules",
    "schedule",
    "requirements",
    "whatYouLearn",
  ] as const) {
    if (typeof body[field] === "string") {
      try {
        body[field] = JSON.parse(body[field] as string);
      } catch {
        body[field] = [];
      }
    }
  }

  next();
}

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // validate request body
      const parsed = await schema.parseAsync(req.body);

      req.body = { ...req.body, ...parsed };

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues[0]?.message || "Validation failed";

        logger.error({
          msg: "Validation error",
          errors: err.issues,
        });

        return next(AppError.badRequest(message));
      }

      next(err);
    }
  };
};

export const validateQuery =
  (schema: ZodObject<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = result.error.issues[0].message;
      return next(AppError.badRequest(message));
    }

    // ✔️ SAFE: merge validated values instead of overwriting
    Object.assign(req.query, result.data);

    next();
  };

export const validateId =
  (schema: ZodObject<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      throw AppError.badRequest("Invalid ID parameter");
    }

    req.params = result.data as any;
    next();
  };
