import { z } from "zod";

// ============= Common Validators =============

export const ZCuid = z.object({
	id: z.cuid({ message: "Invalid CUID format for id parameter" }),
});

export const ZPagination = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	sortBy: z.string().default("createdAt"),
	orderBy: z.enum(["asc", "desc"]).default("desc"),
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



export type TCuid = z.infer<typeof ZCuid>;
export type TPagination = z.infer<typeof ZPagination>;
export type TCollegeAdmissionsGuidanceForm = z.infer<
	typeof ZCollegeAdmissionsGuidanceForm
>;


// ============= Blog Validators =============
export * from "./auth";
export * from "./users";
export * from "./lms";

