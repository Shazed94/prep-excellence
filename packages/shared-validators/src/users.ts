//shared-validators/src/users.ts
import { z } from "zod";

export const ZCRole = z.object({
	name: z.string().min(1, "Role name is required"),
	description: z.string().optional().nullable(),
	permissionIds: z.array(z.string().min(1)).optional().default([]),
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
	isVerified: z.boolean().default(true).optional(),
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
}).omit({ roleId: true });

export const ZUSystemUser = ZCSystemUser.partial();

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
}).omit({ roleId: true });

export const ZUStudent = ZCStudent.partial();

export const ZCParent = ZCUser.extend({
	contactNumber: z
		.string()
		.min(11, "Contact number must be at least 11 digits")
		.regex(/^\d+$/, "Contact number must contain only digits")
		.optional(),
	relation: z.enum(["FATHER", "MOTHER", "GUARDIAN"]).optional(),
}).omit({ roleId: true });

export const ZUParent = ZCParent.partial();

export const ZCTeacher = ZCUser.extend({
	qualifications: z.string().optional(),
	experienceYears: z.number().int().optional(),
	certifications: z.array(z.string()).optional(),
	subjects: z.array(z.string()).optional(),
	bio: z.string().optional(),
	role: z.enum(["TEACHER", "INSTRUCTOR"]).default("TEACHER"),
}).omit({ roleId: true });

export const ZUTeacher = ZCTeacher.partial();

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

export type TUpdateUser = z.infer<typeof ZUpdateUser>;
export type TCreateUser = z.infer<typeof ZCUser>;
export type TCreateStudent = z.infer<typeof ZCStudent>;
export type TUpdateStudent = z.infer<typeof ZUStudent>;
export type TCreateParent = z.infer<typeof ZCParent>;
export type TUpdateParent = z.infer<typeof ZUParent>;
export type TCreateTeacher = z.infer<typeof ZCTeacher>;
export type TUpdateTeacher = z.infer<typeof ZUTeacher>;
export type TCreateSystemUser = z.infer<typeof ZCSystemUser>;
export type TUpdateSystemUser = z.infer<typeof ZUSystemUser>;
export type TCreateReferral = z.infer<typeof ZCReferral>;
export type TCreateAffiliate = z.infer<typeof ZCAffiliate>;
