import { z } from "zod";
import { DAY_OF_WEEK } from "./../../../apps/api/src/generated/enums";

// ============= Coaching Course Validators =============

export const ZCCoachingCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  shortDescription: z
    .string()
    .min(1, "Description is required")
    .min(5, "Description must be at least 5 characters"),
  longDescription: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  video: z.string().optional(),
  thumbnail: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  tags: z.array(z.string()).optional(),
  price: z.number().min(0, "Price must be 0 or more"),
  discount: z.number().min(0, "Discount must be 0 or more"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  startDate: z.date().refine((date) => date > new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.date().refine((date) => date > new Date(), {
    message: "end date must be in the future",
  }),
  categoryId: z.string().optional(),
  teacherId: z.string().optional(),
  schedules: z
    .array(
      z.object({
        dayOfWeek: z.enum(DAY_OF_WEEK),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
      }),
    )
    .min(1, "Add at least one weekly session"),
});

export const ZUCoachingCourseSchema = ZCCoachingCourseSchema.partial();

export const ZPublishCoachingCourseSchema = z.object({
  isPublished: z.boolean(),
});

// ============= Coaching Module Validators =============
export const ZCCoachingModuleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0),
  teacherId: z.cuid().optional(),
});

export const ZUCoachingModuleSchema = ZCCoachingModuleSchema.partial();

export const reorderCoachingModulesSchema = z.object({
  modules: z.array(
    z.object({
      id: z.cuid(),
      orderIndex: z.number().int().min(0),
    }),
  ),
});

// ============= Coaching Topic Validators =============
export const ZCCoachingLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0),
  isPublished: z.boolean().default(false),
  lessonType: z.enum(["LIVE_CLASS", "READING_MATERIAL", "ASSIGNMENT", "EXAM"]),
  content: z.string().optional(),
});

export const ZUCoachingLessonSchema = ZCCoachingLessonSchema.partial();

// ============= Coaching Content Validators =============
const baseContentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0),
  contentType: z.enum([
    "VIDEO_RECORDED",
    "VIDEO_LIVE",
    "VIDEO_SCHEDULED",
    "QUIZ",
    "ASSIGNMENT",
    "TEST",
    "READING_MATERIAL",
  ]),
  content: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  topicId: z.string().cuid(),
});

export const createCoachingContentSchema = z.discriminatedUnion("contentType", [
  // Live session
  baseContentSchema.extend({
    contentType: z.literal("VIDEO_LIVE"),
    scheduledAt: z.string().datetime(),
    duration: z.number().int().positive(), // minutes
    instructorId: z.string().cuid(),
    maxParticipants: z.number().int().positive().optional(),
  }),
  // Scheduled video
  baseContentSchema.extend({
    contentType: z.literal("VIDEO_SCHEDULED"),
    scheduledAt: z.string().datetime(),
    duration: z.number().int().positive(),
    instructorId: z.string().cuid().optional(),
  }),
  // Recorded video
  baseContentSchema.extend({
    contentType: z.literal("VIDEO_RECORDED"),
  }),
  // Quiz
  baseContentSchema.extend({
    contentType: z.literal("QUIZ"),
    quizData: z.object({
      questions: z
        .array(
          z.object({
            question: z.string().min(10),
            questionType: z.enum([
              "MULTIPLE_CHOICE",
              "TRUE_FALSE",
              "SHORT_ANSWER",
            ]),
            options: z.array(z.string()).optional(),
            correctAnswer: z.string(),
            points: z.number().int().positive().default(1),
          }),
        )
        .min(1),
    }),
    passingScore: z.number().int().min(0).max(100),
    timeLimit: z.number().int().positive().optional(),
  }),
  // Assignment
  baseContentSchema.extend({
    contentType: z.literal("ASSIGNMENT"),
    assignmentData: z.object({
      instructions: z.string().min(10),
      rubric: z.string().optional(),
      acceptedFileTypes: z.array(z.string()).optional(),
      maxFileSize: z.number().int().positive().optional(),
    }),
    dueDate: z.string().datetime(),
    totalPoints: z.number().int().positive(),
  }),
  // Test
  baseContentSchema.extend({
    contentType: z.literal("TEST"),
    quizData: z.object({
      questions: z
        .array(
          z.object({
            question: z.string().min(10),
            questionType: z.enum([
              "MULTIPLE_CHOICE",
              "TRUE_FALSE",
              "SHORT_ANSWER",
            ]),
            options: z.array(z.string()).optional(),
            correctAnswer: z.string(),
            points: z.number().int().positive().default(1),
          }),
        )
        .min(1),
    }),
    passingScore: z.number().int().min(0).max(100),
    timeLimit: z.number().int().positive(),
    dueDate: z.string().datetime().optional(),
    totalPoints: z.number().int().positive(),
  }),
  // Reading material
  baseContentSchema.extend({
    contentType: z.literal("READING_MATERIAL"),
    content: z.string().min(10),
    attachments: z.array(z.string()).default([]),
  }),
]);

export const updateCoachingContentSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().optional(),
    orderIndex: z.number().int().min(0).optional(),
    contentType: z
      .enum([
        "VIDEO_RECORDED",
        "VIDEO_LIVE",
        "VIDEO_SCHEDULED",
        "QUIZ",
        "ASSIGNMENT",
        "TEST",
        "READING_MATERIAL",
      ])
      .optional(),
    content: z.string().optional(),
    attachments: z.array(z.string()).optional(),
    // Video processing fields
    videoStatus: z.string().optional(),
    rawVideoUrl: z.string().optional(),
    masterPlaylistUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    thumbnailOptions: z.any().optional(),
    videoDuration: z.number().int().optional(),
    videoWidth: z.number().int().optional(),
    videoHeight: z.number().int().optional(),
    videoCodec: z.string().optional(),
    videoBitrate: z.number().int().optional(),
    videoFps: z.number().optional(),
    processedAt: z.string().datetime().optional(),
    processingError: z.string().optional(),
    // Quiz fields
    quizData: z.any().optional(),
    passingScore: z.number().int().min(0).max(100).optional(),
    timeLimit: z.number().int().positive().optional(),
    // Assignment fields
    assignmentData: z.any().optional(),
    dueDate: z.string().datetime().optional(),
    totalPoints: z.number().int().positive().optional(),
    // Live session fields
    scheduledAt: z.string().datetime().optional(),
    duration: z.number().int().positive().optional(),
    instructorId: z.string().optional(),
    maxParticipants: z.number().int().positive().optional(),
    actualStartTime: z.string().datetime().optional(),
    actualEndTime: z.string().datetime().optional(),
    recordingUrl: z.string().optional(),
    jitsiRoomId: z.string().optional(),
    jitsiRoomToken: z.string().optional(),
    jitsiStartUrl: z.string().optional(),
    // Topic reference
    topicId: z.string().cuid().optional(),
  })
  .passthrough();

export const uploadContentVideoSchema = z.object({
  contentId: z.string().cuid(),
});

export const selectContentThumbnailSchema = z.object({
  thumbnailId: z.string(),
});

// ============= Coaching Enrollment Validators =============
export const enrollInCoachingCourseSchema = z.object({
  courseId: z.string().cuid(),
  installmentSchedule: z
    .array(
      z.object({
        amount: z.number().min(0),
        dueDate: z.string().datetime(),
        percentage: z.number().int().min(0).max(100),
      }),
    )
    .min(1, "At least one installment required"),
});

export const updateCoachingProgressSchema = z.object({
  contentId: z.string().cuid(),
  isCompleted: z.boolean(),
  score: z.number().int().min(0).max(100).optional(),
  grade: z.string().optional(),
  feedback: z.string().optional(),
});

// ============= Coaching Submission Validators =============
export const createCoachingSubmissionSchema = z.object({
  contentId: z.string().cuid(),
  fileUrls: z.array(z.string()).default([]),
  textAnswer: z.string().optional(),
});

export const gradeSubmissionSchema = z.object({
  submissionId: z.string().cuid(),
  score: z.number().int().min(0).max(100).optional(),
  grade: z.string().optional(),
  feedback: z.string().optional(),
});

// ============= Coaching Attendance Validators =============
export const recordAttendanceSchema = z.object({
  contentId: z.string().cuid(),
  studentId: z.string().cuid(),
  joinedAt: z.string().datetime(),
  leftAt: z.string().datetime().optional(),
  isPresent: z.boolean().default(true),
});

// ============= Coaching Assignment Validators =============
export const ZCCoachingAssignmentSchema = z.object({
  lessonId: z.string().cuid("Invalid lesson ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  totalPoints: z.coerce.number().int().positive().default(100),
  allowLateSubmission: z.boolean().default(false),
  lateSubmissionPenalty: z.coerce.number().int().min(0).max(100).optional(),
});

export const ZUCoachingAssignmentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200)
    .optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  totalPoints: z.coerce.number().int().positive().optional(),
  allowLateSubmission: z.boolean().optional(),
  lateSubmissionPenalty: z.coerce.number().int().min(0).max(100).optional(),
});

export const ZSubmitAssignmentSchema = z.object({
  textAnswer: z.string().min(1, "Answer text is required"),
});

export const ZGradeSubmissionSchema = z.object({
  grade: z.coerce.number().min(0, "Grade must be at least 0"),
  feedback: z.string().optional(),
});

// ============= Coaching Exam Validators =============
export const ZCCoachingExamSchema = z.object({
  lessonId: z.string().cuid("Invalid lesson ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().optional(),
  timeLimit: z.coerce
    .number()
    .int()
    .positive("Time limit must be positive in minutes")
    .optional(),
  passingScore: z.coerce.number().int().min(0).max(100).default(70),
  maxAttempts: z.coerce.number().int().positive().optional(),
  shuffleQuestions: z.boolean().default(false),
  showResults: z.boolean().default(true),
});

export const ZUCoachingExamSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200)
    .optional(),
  description: z.string().optional(),
  timeLimit: z.coerce.number().int().positive().optional(),
  passingScore: z.coerce.number().int().min(0).max(100).optional(),
  maxAttempts: z.coerce.number().int().positive().optional(),
  shuffleQuestions: z.boolean().optional(),
  showResults: z.boolean().optional(),
});

export const ZSubmitExamAttemptSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().cuid("Invalid question ID"),
        selectedOptionId: z.string().cuid("Invalid option ID").optional(),
        textAnswer: z.string().optional(),
      }),
    )
    .min(1, "At least one answer is required"),
});

// ============= Coaching Attendance Validators =============
export const ZMarkAttendanceSchema = z.object({
  studentId: z.string().cuid("Invalid student ID"),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"], {
    message: "Invalid attendance status",
  }),
  joinedAt: z.string().datetime().optional(),
  leftAt: z.string().datetime().optional(),
  duration: z.coerce.number().int().positive().optional(),
});

export const ZBulkAttendanceSchema = z.object({
  records: z
    .array(
      z.object({
        studentId: z.string().cuid("Invalid student ID"),
        status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"], {
          message: "Invalid attendance status",
        }),
        joinedAt: z.string().datetime().optional(),
        leftAt: z.string().datetime().optional(),
        duration: z.coerce.number().int().positive().optional(),
      }),
    )
    .min(1, "At least one attendance record is required"),
});

// ============= Coaching Schedule Validators =============
export const ZCCoachingRecurringScheduleSchema = z.object({
  dayOfWeek: z.string().min(1, "Day of week is required"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:mm format"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "End time must be in HH:mm format"),
  room: z.string().optional(),
});

export const ZUCoachingRecurringScheduleSchema = z.object({
  dayOfWeek: z.string().min(1).optional(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:mm format")
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "End time must be in HH:mm format")
    .optional(),
  room: z.string().optional(),
});

export const ZCCoachingScheduleExceptionSchema = z.object({
  exceptionDate: z.string().datetime("Invalid date format"),
  isCancelled: z.boolean().default(false),
  reason: z.string().optional(),
  rescheduleDate: z.string().datetime().optional(),
});

export const ZCCoachingScheduledClassSchema = z.object({
  classDate: z.string().datetime("Invalid class date"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:mm format"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "End time must be in HH:mm format"),
  dayOfWeek: z.string().min(1, "Day of week is required"),
  orderIndex: z.coerce.number().int().min(0),
  lessonId: z.string().cuid().optional(),
});

// ============= Type Exports =============
export type TCreateCourseSchema = z.infer<typeof ZCCoachingCourseSchema>;
export type TUpdateCourseSchema = z.infer<typeof ZUCoachingCourseSchema>;

export type TCCoachingModuleInput = z.infer<typeof ZCCoachingModuleSchema>;
export type TUCoachingModuleInput = z.infer<typeof ZUCoachingModuleSchema>;
export type TCCoachingLessonInput = z.infer<typeof ZCCoachingLessonSchema>;
export type TUCoachingLessonInput = z.infer<typeof ZUCoachingLessonSchema>;

export type CreateCoachingContentInput = z.infer<
  typeof createCoachingContentSchema
>;
export type EnrollInCoachingCourseInput = z.infer<
  typeof enrollInCoachingCourseSchema
>;
export type CreateCoachingSubmissionInput = z.infer<
  typeof createCoachingSubmissionSchema
>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
