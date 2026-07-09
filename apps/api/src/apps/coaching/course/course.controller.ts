import type { Prisma } from "@/generated/client";
import { AuditAction } from "@/generated/enums";
import cached from "@/infrastructure/cache/cache";
import prisma from "@/infrastructure/database/connection";
import minioService from "@/infrastructure/storage/minio";
import { generateFileName } from "@/middleware/upload";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { createAuditLogFromRequest } from "@/utils/auditLog";
import { invalidateCachePattern } from "@/utils/cacheInvalidation";
import { buildWhere, castFilterValue } from "@/utils/filters";
import { toPublicUrl } from "@/utils/storageUrl";
import {
  ZCCoachingCourseSchema,
  ZPublishCoachingCourseSchema,
  ZQueryParams,
  ZUCoachingCourseSchema,
} from "@prepexcellence/shared-validators";
import type { Request, Response } from "express";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { schedules, ...validated } = ZCCoachingCourseSchema.parse(req.body);
    const createdById = req.user?.id;

    if (!createdById) {
      throw new AppError("User not authenticated", 401);
    }

    const slug = validated.title.toLowerCase().replaceAll(" ", "-");

    // Handle file uploads
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    let thumbnailPath: string | undefined;
    let videoPath: string | undefined;

    if (files?.thumbnail?.[0]) {
      thumbnailPath = `coaching-courses/${generateFileName(files.thumbnail[0].originalname, "thumbnail")}`;
      await minioService.uploadFile(
        thumbnailPath,
        files.thumbnail[0].buffer,
        files.thumbnail[0].mimetype,
      );
    }

    if (files?.video?.[0]) {
      videoPath = `coaching-courses/${generateFileName(files.video[0].originalname, "video")}`;
      await minioService.uploadFile(
        videoPath,
        files.video[0].buffer,
        files.video[0].mimetype,
      );
    }

    // Resolve teacherId from the authenticated user's teacher profile
    const teacherId =
      (req.user as any)?.teacher?.id ??
      (req.body as Record<string, string>)?.teacherId;

    if (!teacherId) {
      throw new AppError(
        "Teacher profile not found. Ensure you have a teacher account.",
        403,
      );
    }

    const course = await prisma.$transaction(async (tx) => {
      const created = await tx.course.create({
        data: {
          ...validated,
          courseType: "COACHING",
          teacherId,
          thumbnail: thumbnailPath ?? validated.thumbnail,
          video: videoPath ?? validated.video,
          slug,
          createdById,
        },
      });

      await tx.courseSchedule.createMany({
        data: schedules.map((schedule) => ({
          ...schedule,
          courseId: created.id,
        })),
      });

      return created;
    });

    // Audit log
    await createAuditLogFromRequest(req, {
      action: AuditAction.CREATE,
      module: "CoachingCourse",
      entityId: course.id,
      description: `Coaching course created: ${course.title}`,
      performedById: createdById,
    });

    await invalidateCachePattern("coaching-courses:*");

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: {
        ...course,
        thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
      },
    });
  },
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { schedules, ...validated } = ZUCoachingCourseSchema.parse(req.body);

    // Ownership: a teacher may only edit their own course. Admins (no teacher
    // profile) are allowed through.
    const teacherId = (req.user as any)?.teacher?.id;
    if (teacherId) {
      const existing = await prisma.course.findUnique({
        where: { id, courseType: "COACHING" },
        select: { teacherId: true },
      });
      if (!existing) throw new AppError("Course not found", 404);
      if (existing.teacherId !== teacherId && !req.user?.isSuperUser) {
        throw new AppError("You can only edit your own courses", 403);
      }
    }

    // Handle file uploads
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const updateData: Record<string, unknown> = { ...validated };

    if (files?.thumbnail?.[0]) {
      const thumbnailPath = `coaching-courses/${generateFileName(files.thumbnail[0].originalname, "thumbnail")}`;
      await minioService.uploadFile(
        thumbnailPath,
        files.thumbnail[0].buffer,
        files.thumbnail[0].mimetype,
      );
      updateData.thumbnail = thumbnailPath;
    }

    if (files?.video?.[0]) {
      const videoPath = `coaching-courses/${generateFileName(files.video[0].originalname, "video")}`;
      await minioService.uploadFile(
        videoPath,
        files.video[0].buffer,
        files.video[0].mimetype,
      );
      updateData.video = videoPath;
    }

    const course = await prisma.$transaction(async (tx) => {
      const updated = await tx.course.update({
        where: { id, courseType: "COACHING" },
        data: updateData,
      });

      await tx.courseSchedule.deleteMany({
        where: { courseId: id },
      });

      if (schedules?.length) {
        await tx.courseSchedule.createMany({
          data: schedules.map((schedule) => ({
            ...schedule,
            courseId: id,
          })),
        });
      }

      return updated;
    });

    // Audit log
    await createAuditLogFromRequest(req, {
      action: AuditAction.UPDATE,
      module: "CoachingCourse",
      entityId: id,
      description: `Coaching course updated: ${course.title}`,
      performedById: req.user?.id,
    });

    // Invalidate coaching courses cache
    await invalidateCachePattern("coaching-courses:*");

    res.json({
      success: true,
      data: {
        ...course,
        thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
      },
    });
  },
);

export const publishCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isPublished } = ZPublishCoachingCourseSchema.parse(req.body);

    const course = await prisma.course.update({
      where: { id, courseType: "COACHING" },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    await createAuditLogFromRequest(req, {
      action: isPublished ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
      module: "CoachingCourse",
      entityId: id,
      description: `Coaching course ${isPublished ? "published" : "unpublished"}: ${course.title}`,
      performedById: req.user?.id,
    });

    await invalidateCachePattern("coaching-courses:*");

    res.json({
      success: true,
      data: course,
    });
  },
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id, courseType: "COACHING" },
      select: { id: true, title: true, teacherId: true },
    });
    if (!course) {
      throw new AppError("Course not found", 404);
    }
    // Ownership: a teacher may only delete their own course. Admins allowed.
    const teacherId = (req.user as any)?.teacher?.id;
    if (teacherId && course.teacherId !== teacherId) {
      throw new AppError("You can only delete your own courses", 403);
    }

    await prisma.course.delete({
      where: { id, courseType: "COACHING" },
    });

    await createAuditLogFromRequest(req, {
      action: AuditAction.DELETE,
      module: "CoachingCourse",
      entityId: id,
      description: `Coaching course deleted: ${course.title}`,
      performedById: req.user?.id,
    });
    await invalidateCachePattern("coaching-courses:*");

    return res.json({
      success: true,
      message: "Course deleted successfully",
    });
  },
);

export const getMyCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!student) {
      throw new AppError("Student profile not found", 404);
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: student.id,
        course: {
          courseType: "COACHING",
          isPublished: true,
        },
      },
      select: {
        id: true,
        enrolledAt: true,
        status: true,

        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            level: true,
            teacher: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            courseProgress: {
              where: {
                studentId: student.id,
              },
              select: {
                progressPercent: true,
                lastActivityAt: true,
              },
            },
          },
        },
      },
      // include: {
      // 	course: {
      // 		include: {
      // 			_count: {
      // 				select: {
      // 					enrollments: true,
      // 				},
      // 			},
      // 			courseProgress: {
      // 				where: {
      // 					studentId: student.id,
      // 				},
      // 				select: {
      // 					progressPercent: true,
      // 					lastActivityAt: true,
      // 				},
      // 			},
      // 		},
      // 	},
      // },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    const data = enrollments.map(({ course, ...enrollment }) => ({
      ...course,
      thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
      //   video: course.video ? toPublicUrl(course.video) : null,
      enrollment: {
        id: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
      },
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  },
);

export const listTeachers = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, sortBy, orderBy, search } = ZQueryParams.parse(
      req.query,
    );

    const skip = (page - 1) * limit;

    // Only allow sorting by valid teacher fields to prevent Prisma errors
    const ALLOWED_SORT_FIELDS = [
      "id",
      "experienceYears",
      "createdAt",
      "updatedAt",
    ];
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
      ? sortBy
      : "createdAt";
    const orderClause: Record<string, "asc" | "desc"> = {
      [safeSortBy]: orderBy,
    };

    const where: Prisma.TeacherWhereInput = {
      OR: [
        {
          coursesCreated: {
            some: { courseType: "COACHING", isActive: true },
          },
        },
        {
          courseModulesTeaching: {
            some: { course: { courseType: "COACHING", isActive: true } },
          },
        },
      ],
    };

    if (search) {
      where.AND = [
        {
          user: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderClause,
        include: {
          user: {
            select: {
              name: true,
              image: true,
              address: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: { coursesCreated: true },
          },
        },
      }),
      prisma.teacher.count({ where }),
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

    const data = teachers.map((teacher) => ({
      ...teacher,
      user: {
        name: teacher.user.name,
        image: teacher.user.image ? toPublicUrl(teacher.user.image) : null,
        address: teacher.user.address,
        email: teacher.user.email,
        phone: teacher.user.phone,
      },
    }));

    return res.status(200).json({
      success: true,
      data,
      pagination,
    });
  },
);

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sortBy, orderBy, search, filters } = ZQueryParams.parse(
    req.query,
  );

  const skip = (page - 1) * limit;

  const cacheKey = `coaching-courses:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

  const cachedData = await cached.get(cacheKey);
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully (from cache)",
      data: parsed.data,
      pagination: parsed.pagination,
    });
  }

  const ALLOWED_FILTERS = ["categoryId", "level", "isPublished"];
  const where = buildWhere(filters, ALLOWED_FILTERS);

  // Uppercase level to match Prisma DIFFICULTY_LEVEL enum
  if (where.level) {
    where.level = (where.level as string).toUpperCase();
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { sortDescription: { contains: search, mode: "insensitive" } },
      { longDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  if (filters?.isPublished !== undefined) {
    where.isPublished = castFilterValue(filters.isPublished);
  }

  where.courseType = "COACHING";

  const orderClause: Record<string, "asc" | "desc"> = { [sortBy]: orderBy };

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: orderClause,
    }),
    prisma.course.count({ where }),
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

  const data = courses.map((course) => ({
    ...course,
    thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
    video: course.video ? toPublicUrl(course.video) : null,
  }));

  await cached.set(cacheKey, JSON.stringify({ data, pagination }), 60);

  return res.status(200).json({
    success: true,
    data,
    pagination,
  });
});

/**
 * List the authenticated teacher's OWN coaching courses (the ones they teach).
 * GET /coaching/courses/teaching
 *
 * NOTE: `/coaching/courses/my-courses` is a STUDENT endpoint (enrollments).
 * This one is for the teacher panel and scopes by `teacherId = Teacher.id`.
 */
export const getMyTeachingCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = (req.user as any)?.teacher?.id;
    if (!teacherId) {
      throw new AppError(
        "Teacher profile not found. Ensure you have a teacher account.",
        403,
      );
    }

    const courses = await prisma.course.findMany({
      where: { courseType: "COACHING", teacherId },
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = courses.map((course) => ({
      ...course,
      enrollmentCount: course._count?.enrollments ?? 0,
      thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
      video: course.video ? toPublicUrl(course.video) : null,
    }));

    return res.status(200).json({ success: true, data });
  },
);

export const getPublishedCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, sortBy, orderBy, search, filters } =
      ZQueryParams.parse(req.query);

    const skip = (page - 1) * limit;

    const cacheKey = `coaching-courses-published:page=${page}:limit=${limit}:sortBy=${sortBy}:orderBy=${orderBy}:search=${search || ""}:filters=${JSON.stringify(filters || {})}`;

    const cachedData = await cached.get(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return res.status(200).json({
        success: true,
        message: "Published courses fetched successfully (from cache)",
        data: parsed.data,
        pagination: parsed.pagination,
      });
    }

    const ALLOWED_FILTERS = ["categoryId", "level"];
    const where = buildWhere(filters, ALLOWED_FILTERS);
    where.isPublished = true;
    where.courseType = "COACHING";

    // if subjectId is provided, filter by courses that have at least one module with that subjectId
    if (filters?.subjects) {
      where.courseModules.teacher = {
        subjects: {
          some: {
            has: filters.subjects,
          },
        },
      };
    }

    // Uppercase level to match Prisma DIFFICULTY_LEVEL enum
    if (where.level) {
      where.level = (where.level as string).toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
        {
          courseModules: {
            some: {
              teacher: {
                user: { name: { contains: search, mode: "insensitive" } },
              },
            },
          },
        },

        {
          courseModules: {
            some: {
              teacher: {
                subjects: {
                  has: search,
                },
              },
            },
          },
        },

        {
          teacher: {
            user: { name: { contains: search, mode: "insensitive" } },
          },
        },
        { teacher: { subjects: { has: search } } },
      ];
    }

    let orderClause: any;

    if (sortBy === "_count") {
      // For sorting by relation count (e.g., enrollments)
      orderClause = {
        enrollments: {
          _count: orderBy,
        },
      };
    } else {
      // For regular field sorting
      orderClause = { [sortBy]: orderBy };
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderClause,
        include: {
          createdBy: {
            select: { name: true, image: true },
          },
          _count: {
            select: { enrollments: true },
          },
          schedules: true,
        },
      }),
      prisma.course.count({ where }),
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

    const data = courses.map((course) => ({
      ...course,
      thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
      video: course.video ? toPublicUrl(course.video) : null,
    }));

    await cached.set(cacheKey, JSON.stringify({ data, pagination }), 60);

    return res.status(200).json({
      success: true,
      data,
      pagination,
    });
  },
);

export const getPublishedCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id, courseType: "COACHING" },
      include: {
        createdBy: {
          select: { name: true, image: true },
        },
        courseModules: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
            },
            teacher: {
              select: {
                experienceYears: true,
                subjects: true,
                user: { select: { name: true, image: true } },
              },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    res.json({
      success: true,
      data: {
        ...course,
        thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
        teacher: course.courseModules[0]?.teacher
          ? {
              ...course.courseModules[0].teacher,
              user: {
                ...course.courseModules[0].teacher.user,
                image: course.courseModules[0].teacher.user.image
                  ? toPublicUrl(course.courseModules[0].teacher.user.image)
                  : null,
              },
            }
          : null,
        video: course.video ? toPublicUrl(course.video) : null,
      },
    });
  },
);

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  });

  const course = await prisma.course.findUnique({
    where: { id, courseType: "COACHING" },
    include: {
      createdBy: {
        select: { name: true, image: true },
      },
      ...(student?.id && {
        courseProgress: {
          where: {
            studentId: student?.id,
          },
          select: {
            lastActivityAt: true,
            progressPercent: true,
          },
        },
      }),
      courseModules: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
          },
          teacher: {
            select: {
              experienceYears: true,
              subjects: true,
              user: { select: { name: true, image: true } },
            },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  res.json({
    success: true,
    data: {
      ...course,
      thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
      teacher: course.courseModules[0]?.teacher
        ? {
            ...course.courseModules[0].teacher,
            user: {
              ...course.courseModules[0].teacher.user,
              image: course.courseModules[0].teacher.user.image
                ? toPublicUrl(course.courseModules[0].teacher.user.image)
                : null,
            },
          }
        : null,
      video: course.video ? toPublicUrl(course.video) : null,
    },
  });
});

export const getPopularCourses = asyncHandler(async (_, res: Response) => {
  const courses = await prisma.course.findMany({
    where: { isPublished: true, courseType: "COACHING" },
    orderBy: {
      enrollments: {
        _count: "desc",
      },
    },
    take: 5,
    include: {
      createdBy: {
        select: { name: true, image: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  const data = courses.map((course) => ({
    ...course,
    thumbnail: course.thumbnail ? toPublicUrl(course.thumbnail) : null,
    video: course.video ? toPublicUrl(course.video) : null,
  }));

  res.json({
    success: true,
    data,
  });
});
