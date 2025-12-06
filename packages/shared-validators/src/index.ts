import { z } from "zod";

// ============= Authentication Validators =============

export const ZRegister = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["Student", "Referral", "Affiliate"]),
});

export const ZLogin = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ============= Common Validators =============

export const ZCuid = z.object({
  id: z.string().cuid({ message: "Invalid CUID format for id parameter" }),
});

export const ZPagination = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  orderBy: z.enum(["asc", "desc"]).default("desc"),
});

// ============= Role and Permission Validators =============


export const ZCRole = z.object({
  name: z
    .string()
    .min(1, "Role name is required"),
  description: z
    .string()
    .optional()
    .nullable(),
  permissionIds: z
    .array(z.string().min(1))
    .optional()
    .default([]),
});

export const ZURole = ZCRole.partial();


// ============= User Validators =============

export const ZUpdateUser = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .optional(),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .optional(),
  image: z.string().optional(),
});
export const ZCUser = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .optional(),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .optional(),
  image: z.string().optional(),
  roleId: z.cuid(),
  isStaff: z.boolean().default(false).optional(),
  isVerified: z.boolean().default(false).optional(),
});

export const ZUUser = ZCUser.partial();

export const ZCSystemUser = ZCUser.extend({
  jobTitle: z.enum([
    "ADMIN",
    "SUPPORT",
    "MANAGER",
    "ACCOUNTANT",
    "DEVELOPER",
    "INSTRUCTOR",
  ]),
  department: z.enum([
    "HR",
    "SALES",
    "IT",
    "FINANCE",
    "MARKETING",
    "OPERATIONS",
  ]),
  qualifications: z.array(z.string()).optional(),
  experienceYears: z.number().optional(),
  certifications: z.array(z.string()).optional(),
  bio: z.string().optional(),
});

export const ZCStudent = ZCUser.extend({
  grade: z.string().min(1, "Grade must be at least 1 character").optional(),
  class: z.string().min(1, "Class must be at least 1 character").optional(),
  section: z.string().min(1, "Section must be at least 1 character").optional(),
  enrollmentDate: z.coerce
    .date()
    .min(new Date(1900, 0, 1), "Enrollment year must be after 1900")
    .max(new Date(), "Enrollment year cannot be in the future")
    .optional(),
  currentLevel: z
    .string()
    .min(1, "Current level must be at least 1 character")
    .optional(),
  gpa: z
    .number()
    .min(0, "GPA cannot be less than 0")
    .max(4, "GPA cannot exceed 4")
    .optional(),
  totalCredits: z
    .number()
    .min(0, "Total credits cannot be negative")
    .optional(),
  academicStatus: z
    .enum(["ACTIVE", "PROBATION", "GRADUATED"])
    .default("ACTIVE")
    .optional(),

  guardianName: z
    .string()
    .min(2, "Guardian name must be at least 2 characters")
    .optional(),
  guardianPhone: z
    .string()
    .min(11, "Guardian phone number must be at least 11 digits")
    .regex(/^\d+$/, "Guardian phone must contain only digits")
    .optional(),
  guardianEmail: z.email("Invalid guardian email address").optional(),
});

export const ZUStudent = ZCStudent.partial();

export const ZCParent = ZCUser.extend({
  contactNumber: z
    .string()
    .min(11, "Contact number must be at least 11 digits")
    .regex(/^\d+$/, "Contact number must contain only digits")
    .optional(),
  relation: z.enum(["FATHER", "MOTHER", "GUARDIAN"]).optional(),
});

export const ZCTeacher = ZCUser.extend({
  qualifications: z.string().optional(),
  experienceYears: z.number().int().optional(),
  certifications: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),
  bio: z.string().optional(),
});

export const ZCReferral = ZCUser.extend({
  bio: z.string().optional(),
});

export const ZCAffiliate = ZCUser.extend({
  companyName: z.string().optional(),
  contactNumber: z
    .string()
    .min(11, "Contact number must be at least 11 digits")
    .regex(/^\d+$/, "Contact number must contain only digits")
    .optional(),
  contactEmail: z.string().email("Invalid email address").optional(),
  website: z.url("Invalid website URL").optional(),
  bio: z.string().optional(),
});

// ============= Question Validators =============

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

export const ZEditQuestion = z.object({
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

export const ZCollegeAdmissionsGuidanceForm = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  stateRegion: z.string().min(1, "State/Region is required"),
  country: z.string().min(1, "Country is required"),
  studentGrade: z.string().min(1, "Student grade is required"),
  gpa: z.string().min(1, "GPA is required"),
  takenSATACT: z.string().min(1, "Please select an option"),
  satActScore: z.string().min(1, "SAT/ACT score is required"),
  extracurricular: z.string().min(1, "Extracurricular activities are required"),
  targetColleges: z.string().min(1, "Target colleges are required"),
  questions: z.string().min(1, "Please provide your questions"),
  childDescription: z.string().min(1, "Child description is required"),
});

// Export types
export type TRegister = z.infer<typeof ZRegister>;
export type TLogin = z.infer<typeof ZLogin>;
export type TCuid = z.infer<typeof ZCuid>;
export type TPagination = z.infer<typeof ZPagination>;
export type TUpdateUser = z.infer<typeof ZUpdateUser>;
export type TCreateUser = z.infer<typeof ZCUser>;
export type TCreateStudent = z.infer<typeof ZCStudent>;
export type TUpdateStudent = z.infer<typeof ZUStudent>;
export type TCreateParent = z.infer<typeof ZCParent>;
export type TCreateTeacher = z.infer<typeof ZCTeacher>;
export type TCreateReferral = z.infer<typeof ZCReferral>;
export type TCreateAffiliate = z.infer<typeof ZCAffiliate>;
export type TAddQuestion = z.infer<typeof ZAddQuestion>;
export type TEditQuestion = z.infer<typeof ZEditQuestion>;
export type TCollegeAdmissionsGuidanceForm = z.infer<
  typeof ZCollegeAdmissionsGuidanceForm
>;

// ============= Blog Validators =============
export * from "./blog";
