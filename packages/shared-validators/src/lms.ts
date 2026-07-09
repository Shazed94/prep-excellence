import { z } from "zod";

// ============= Local Enums (matching Prisma-generated values) =============
export const QuestionType = {
  MCQ_SINGLE: "MCQ_SINGLE",
  MCQ_MULTIPLE: "MCQ_MULTIPLE",
  TRUE_FALSE: "TRUE_FALSE",
  SHORT: "SHORT",
  LONG: "LONG",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export const COURSE_TYPE = {
  COACHING: "COACHING",
  LMS: "LMS",
} as const;

export type COURSE_TYPE = (typeof COURSE_TYPE)[keyof typeof COURSE_TYPE];

export const LESSON_TYPE = {
  LIVE_CLASS: "LIVE_CLASS",
  VIDEO_CONTENT: "VIDEO_CONTENT",
  READING_MATERIAL: "READING_MATERIAL",
  ASSIGNMENT: "ASSIGNMENT",
  EXAM: "EXAM",
} as const;

export type LESSON_TYPE = (typeof LESSON_TYPE)[keyof typeof LESSON_TYPE];

export const ENROLLMENT_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  SUSPENDED: "SUSPENDED",
  CANCELLED: "CANCELLED",
} as const;

export type ENROLLMENT_STATUS =
  (typeof ENROLLMENT_STATUS)[keyof typeof ENROLLMENT_STATUS];

// ============= Enums =============
export const ZDifficultyLevel = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

// ============= LMS Course Validators =============
export const createLMSCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  longDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  categoryId: z.cuid(),
  teacherId: z.cuid(),
  thumbnail: z.any().optional(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  discount: z.coerce.number().min(0).max(100).optional(),
  level: ZDifficultyLevel.default("BEGINNER"),
  duration: z.coerce.number().int().positive().optional(),
  tags: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  whatYouLearn: z.array(z.string()).optional().default([]),
});

export const updateLMSCourseSchema = createLMSCourseSchema.partial();

export const publishLMSCourseSchema = z.object({
  isPublished: z.boolean(),
});

// ============= LMS Module Validators =============
export const createLMSModuleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0),
  courseId: z.cuid(),
});

export const updateLMSModuleSchema = createLMSModuleSchema
  .partial()
  .omit({ courseId: true });

export const reorderLMSModulesSchema = z.object({
  modules: z.array(
    z.object({
      id: z.cuid(),
      orderIndex: z.number().int().min(0),
    }),
  ),
});

export const ZCExamQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(10000, "Question is too long"),

  type: z.enum(QuestionType).default(QuestionType.MCQ_SINGLE),

  orderIndex: z.number().int().min(0),

  points: z.number().int().min(1).default(1),

  explanation: z.string().trim().max(10000).optional().nullable(),

  examId: z.cuid("Invalid exam id"),
});

export const ZUExamQuestionSchema = ZCExamQuestionSchema.partial().omit({
  examId: true,
});

export const ZCExamQuestionOptionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Option text is required")
    .max(10000, "Option text is too long"),

  isCorrect: z.boolean().default(false),

  orderIndex: z.number().int().min(0),

  questionId: z.cuid("Invalid question id"),
});

export const ZUExamQuestionOptionSchema = ZCExamQuestionOptionSchema.omit({
  questionId: true,
}).partial();

// ============= LMS Lesson Validators =============
export const createLMSLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0),
  isPublished: z.boolean().default(false),
  lessonType: z.enum(LESSON_TYPE).default("VIDEO_CONTENT"),
  content: z.string().optional(),
});

export const updateLMSLessonSchema = createLMSLessonSchema.partial();

export const uploadLessonVideoSchema = z.object({
  lessonId: z.cuid(),
});

export const selectLessonThumbnailSchema = z.object({
  thumbnailId: z.string(),
});

// ============= LMS Quiz Validators =============

// Question Type Enum matching Prisma
export const ZQuestionType = z.enum([
  "MCQ_SINGLE", // One correct option
  "MCQ_MULTIPLE", // Multiple correct options
  "TRUE_FALSE", // Yes/No
  "SHORT", // Short text answer
  "LONG", // Essay / Writing
]);

// Quiz Question Option Schema
export const createQuizQuestionOptionSchema = z.object({
  text: z.string().min(1, "Option text is required").max(500),
  isCorrect: z.boolean().default(false),
  orderIndex: z.number().int().min(0).max(25), // Support up to 26 options (A-Z)
});

// Quiz Question Schema
export const createQuizQuestionSchema = z
  .object({
    question: z
      .string()
      .min(10, "Question must be at least 10 characters")
      .max(5000),
    type: ZQuestionType.default("MCQ_SINGLE"),
    orderIndex: z.number().int().min(0),
    points: z.number().int().positive().default(1),
    explanation: z.string().max(2000).optional(),
    options: z
      .array(createQuizQuestionOptionSchema)
      .min(2, "Add at least 2 options")
      .max(10, "Maximum 10 options allowed")
      .optional(),
  })
  .refine(
    (data) => {
      // For MCQ types, options are required
      if (
        data.type === "MCQ_SINGLE" ||
        data.type === "MCQ_MULTIPLE" ||
        data.type === "TRUE_FALSE"
      ) {
        return data.options && data.options.length >= 2;
      }
      return true;
    },
    {
      message:
        "Options are required for multiple choice and true/false questions",
      path: ["options"],
    },
  )
  .refine(
    (data) => {
      // For MCQ_SINGLE and TRUE_FALSE, exactly one option must be correct
      if (data.type === "MCQ_SINGLE" || data.type === "TRUE_FALSE") {
        const correctCount =
          data.options?.filter((opt) => opt.isCorrect).length || 0;
        return correctCount === 1;
      }
      // For MCQ_MULTIPLE, at least one option must be correct
      if (data.type === "MCQ_MULTIPLE") {
        const correctCount =
          data.options?.filter((opt) => opt.isCorrect).length || 0;
        return correctCount >= 1;
      }
      return true;
    },
    {
      message: "Invalid number of correct options for question type",
      path: ["options"],
    },
  );

// Complete Quiz Creation Schema (with nested questions and options)
export const createLMSQuizWithQuestionsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().max(2000).optional(),
  orderIndex: z.number().int().min(0),
  passingScore: z.number().int().min(0).max(100).default(70),
  timeLimit: z.number().int().positive().optional(), // in minutes
  maxAttempts: z.number().int().positive().optional(),
  shuffleQuestions: z.boolean().default(false),
  showResults: z.boolean().default(true),
  questions: z
    .array(createQuizQuestionSchema)
    .min(1, "Add at least one question")
    .max(100, "Maximum 100 questions allowed"),
});

// Simplified Quiz Creation (without questions - for later addition)
export const createLMSQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().max(2000).optional(),
  orderIndex: z.number().int().min(0),
  passingScore: z.number().int().min(0).max(100).default(70),
  timeLimit: z.number().int().positive().optional(),
  maxAttempts: z.number().int().positive().optional(),
  shuffleQuestions: z.boolean().default(false),
  showResults: z.boolean().default(true),
});

export const updateLMSQuizSchema = createLMSQuizSchema.partial();

// Add Question to Existing Quiz
export const addQuizQuestionSchema = createQuizQuestionSchema;

// Update Question in Existing Quiz (all fields optional)
export const updateQuizQuestionSchema = createQuizQuestionSchema.partial();

// Submit Quiz Attempt Schema
export const submitQuizAttemptSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().cuid(),
        selectedOptionId: z.string().cuid().optional(), // For MCQ types
        textAnswer: z.string().max(5000).optional(), // For SHORT/LONG types
      }),
    )
    .min(1, "At least one answer is required"),
  timeSpent: z.number().int().min(0), // in seconds
});

// Get Quiz Attempts with filters
export const getQuizAttemptsSchema = z.object({
  studentId: z.string().cuid().optional(),
  isPassed: z.boolean().optional(),
});

// ============= LMS Enrollment Validators =============
export const enrollInLMSCourseSchema = z.object({
  courseId: z.string().cuid(),
});

export const updateLMSProgressSchema = z.object({
  watchTimeSeconds: z.number().int().min(0),
  lastPosition: z.number().int().min(0),
  completionPercent: z.number().int().min(0).max(100),
  isCompleted: z.boolean().optional(),
});

// ============= LMS Discussion Validators =============
export const createLMSDiscussionSchema = z.object({
  lessonId: z.string().cuid(),
  content: z.string().min(1, "Content is required").max(5000),
  parentId: z.string().cuid().optional(),
});

export const updateLMSDiscussionSchema = z.object({
  content: z.string().min(1, "Content is required").max(5000),
});

// ============= LMS Review Validators =============
export const createLMSReviewSchema = z.object({
  courseId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const updateLMSReviewSchema = createLMSReviewSchema
  .partial()
  .omit({ courseId: true });

// ============= Question Bank (Legacy) =============
export const ZAddQuestion = z.object({
  testType: z.string().min(1, "Test type is required"),
  subject: z.string().min(1, "Subject is required"),
  section: z.string().min(1, "Section is required"),
  difficultyLevel: z.string().min(1, "Difficulty level is required"),
  domain: z.string().min(1, "Domain is required"),
  skill: z.string().min(1, "Skill is required"),
  questionType: z.string().min(1, "Question type is required"),
  question: z.string().min(10, "Question must be at least 10 characters"),
  answer: z.string().min(1, "Answer is required"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  optionD: z.string().min(1, "Option D is required"),
  correctOption: z.enum(["A", "B", "C", "D"], {
    error: "Please select the correct option",
  }),
  time: z.string().optional(),
  date: z.string().optional(),
});

export const ZEditQuestion = ZAddQuestion;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  category: z.string().min(1, "Please select a category"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(1000, "Duration must be less than 1000 minutes"),
  price: z.coerce
    .number()
    .min(0, "Price cannot be negative")
    .max(10000, "Price must be less than $10,000"),
  discount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .default(0),
  thumbnail: z.string().optional(),
  videoTrailer: z.string().optional(),
  documents: z.string().array().optional(),
  lessons: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Lesson title is required"),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        duration: z.coerce
          .number()
          .min(1, "Duration must be at least 1 minute")
          .optional(),
        order: z.number(),
      }),
    )
    .default([]),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export type TAddQuestion = z.infer<typeof ZAddQuestion>;
export type TEditQuestion = z.infer<typeof ZEditQuestion>;

export type TcreateLMSCourseSchema = z.infer<typeof createLMSCourseSchema>;
export type TcreateLMSModuleSchema = z.infer<typeof createLMSModuleSchema>;
export type TcreateLMSLessonSchema = z.infer<typeof createLMSLessonSchema>;

// Discussion types
export type CreateLMSDiscussionInput = z.infer<
  typeof createLMSDiscussionSchema
>;
export type UpdateLMSDiscussionInput = z.infer<
  typeof updateLMSDiscussionSchema
>;

// Review types
export type CreateLMSReviewInput = z.infer<typeof createLMSReviewSchema>;
export type UpdateLMSReviewInput = z.infer<typeof updateLMSReviewSchema>;

// ============= LMS Assignment Validators =============
export const createLMSAssignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  instructions: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  maxScore: z.number().int().positive().default(100),
  passingScore: z.number().int().min(0).default(60),
  maxAttempts: z.number().int().positive().default(1),
  lessonId: z.string().cuid(),
});

export const updateLMSAssignmentSchema = createLMSAssignmentSchema
  .partial()
  .omit({ lessonId: true });

export const submitLMSAssignmentSchema = z.object({
  assignmentId: z.string().cuid(),
  submissionText: z.string().optional(),
  attachmentUrls: z.array(z.string().url()).optional().default([]),
});

export const gradeLMSAssignmentSchema = z.object({
  score: z.number().int().min(0, "Score cannot be negative"),
  feedback: z.string().max(2000).optional(),
});

// ============= LMS Exam Option Validator =============
export const updateQuizQuestionOptionSchema = z.object({
  text: z.string().min(1).max(500).optional(),
  isCorrect: z.boolean().optional(),
  orderIndex: z.number().int().min(0).max(25).optional(),
});

// ============= LMS Exam Validators =============
export const createLMSExamSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(), // in minutes
  passingScore: z.number().int().min(0).max(100).default(70),
  lessonId: z.string().cuid(),
});

export const updateLMSExamSchema = createLMSExamSchema
  .partial()
  .omit({ lessonId: true });

export const submitLMSExamAttemptSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().cuid(),
        selectedOptionId: z.string().cuid().optional(),
        textAnswer: z.string().max(5000).optional(),
      }),
    )
    .min(1, "At least one answer is required"),
  timeSpent: z.number().int().min(0), // in seconds
});

// ============= LMS Video Validators =============
export const createLMSVideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  url: z.string().url("Valid video URL is required"),
  duration: z.number().int().positive().optional(),
  lessonId: z.string().cuid(),
});

export const updateLMSVideoSchema = createLMSVideoSchema
  .partial()
  .omit({ lessonId: true });

export const updateLMSVideoStatusSchema = z.object({
  encodingStatus: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]),
});

// ============= LMS Enrollment Status Validator =============
export const updateLMSEnrollmentStatusSchema = z.object({
  status: z.enum(ENROLLMENT_STATUS),
});

// ============= Type Exports =============

// Assignment types
export type CreateLMSAssignmentInput = z.infer<
  typeof createLMSAssignmentSchema
>;
export type UpdateLMSAssignmentInput = z.infer<
  typeof updateLMSAssignmentSchema
>;
export type SubmitLMSAssignmentInput = z.infer<
  typeof submitLMSAssignmentSchema
>;
export type GradeLMSAssignmentInput = z.infer<typeof gradeLMSAssignmentSchema>;

// Exam types
export type CreateLMSExamInput = z.infer<typeof createLMSExamSchema>;
export type UpdateLMSExamInput = z.infer<typeof updateLMSExamSchema>;
export type SubmitLMSExamAttemptInput = z.infer<
  typeof submitLMSExamAttemptSchema
>;

// Video types
export type CreateLMSVideoInput = z.infer<typeof createLMSVideoSchema>;
export type UpdateLMSVideoInput = z.infer<typeof updateLMSVideoSchema>;
export type UpdateLMSVideoStatusInput = z.infer<
  typeof updateLMSVideoStatusSchema
>;

// Enrollment types
export type UpdateLMSEnrollmentStatusInput = z.infer<
  typeof updateLMSEnrollmentStatusSchema
>;

// ============= API Response Types =============
// These types represent the actual data returned from the backend API
// They include database-generated fields like id, timestamps, and relations

export interface LMSCourseResponse {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: string | null;
  price: number;
  discount: number | null;
  level: z.infer<typeof ZDifficultyLevel>;
  duration: number | null;
  startDate: string | null;
  endDate: string | null;
  categoryId: string | null;
  category?: { id: string; name: string; description?: string | null } | null;
  capacity: number | null;
  tags: string[];
  requirements: string[];
  whatYouLearn: string[];
  isPublished: boolean;
  teacherId: string;
  courseModules?: LMSModuleResponse[];
  createdById: string;
  createdBy?: { id: string; name: string; image: string | null };
  createdAt: string;
  updatedAt: string;
  _count: {
    enrollments: number;
  };
}

export interface LMSModuleResponse {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  courseId: string;
  lessons?: LMSLessonResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface LMSLessonResponse {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  lessonType: keyof typeof LESSON_TYPE;
  content: string | null;
  attachments: string[];
  videoUrl: string | null;
  videoDuration: number | null;
  videoEncodingStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | null;
  thumbnailUrl: string | null;
  courseModuleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LMSQuizResponse {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number | null;
  shuffleQuestions: boolean;
  showResults: boolean;
  moduleId: string;
  questions?: LMSQuizQuestionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface LMSQuizQuestionResponse {
  id: string;
  question: string;
  type: z.infer<typeof ZQuestionType>;
  orderIndex: number;
  points: number;
  explanation: string | null;
  quizId: string;
  options?: LMSQuizQuestionOptionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface LMSQuizQuestionOptionResponse {
  id: string;
  text: string;
  isCorrect: boolean;
  orderIndex: number;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LMSEnrollmentResponse {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface LMSProgressResponse {
  id: string;
  enrollmentId: string;
  lessonId: string;
  watchTimeSeconds: number;
  lastPosition: number;
  completionPercent: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LMSAssignmentResponse {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  dueDate: string | null;
  maxScore: number;
  passingScore: number;
  maxAttempts: number;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LMSAssignmentSubmissionResponse {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionText: string | null;
  attachmentUrls: string[];
  score: number | null;
  feedback: string | null;
  gradedBy: string | null;
  submittedAt: string;
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LMSExamResponse {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  passingScore: number;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LMSVideoResponse {
  id: string;
  title: string;
  description: string | null;
  url: string;
  duration: number | null;
  encodingStatus: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}
