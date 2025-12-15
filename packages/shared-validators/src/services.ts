import z from "zod";

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

// Form schema for frontend (accepts plain numbers)
export const ZCFreeSeminarFormInput = z.object({
	parentName: z.string().min(2, "Parent name must be at least 2 characters"),
	parentPhone: z.string().min(10, "Please enter a valid phone number"),
	parentCity: z.string().min(2, "City and ZIP code are required"),
	studentName: z.string().min(2, "Student name must be at least 2 characters"),
	studentEmail: z.email("Please enter a valid email address"),
	studentGrade: z.enum(["7", "8", "9", "10", "11", "12"], {
		error: "Please select a grade",
	}),
	studentSchool: z.string().min(2, "School name is required"),
	targetScore: z.string().min(1, "Target score is required"),
	dreamColleges: z.string().min(3, "Please list at least one college"),
	seminarGoals: z.string().min(5, "Please share your goals"),
	questions: z.string().min(5, "Please provide any questions you have"),
});

// API schema for backend (expects G-prefixed grades)
export const ZCFreeSeminarForm = z.object({
	parentName: z.string().min(2, "Parent name must be at least 2 characters"),
	parentPhone: z.string().min(10, "Please enter a valid phone number"),
	parentCity: z.string().min(2, "City and ZIP code are required"),
	studentName: z.string().min(2, "Student name must be at least 2 characters"),
	studentEmail: z.email("Please enter a valid email address"),
	studentGrade: z.enum(["G7", "G8", "G9", "G10", "G11", "G12"], {
		error: "Please select a grade",
	}),
	studentSchool: z.string().min(2, "School name is required"),
	targetScore: z.string().min(1, "Target score is required"),
	dreamColleges: z.string().min(3, "Please list at least one college"),
	seminarGoals: z.string().min(5, "Please share your goals"),
	questions: z.string().min(5, "Please provide any questions you have"),
});

export const ZCTutorRequestRegistrationSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	parentName: z.string().min(1, "Parent name is required"),
	phoneNumber: z.string().min(10, "Please enter a valid phone number"),
	address: z.string().min(1, "Address is required"),
	studentName: z.string().min(1, "Student name is required"),
	studentSchool: z.string().min(1, "Student school is required"),
	studentGrade: z.string().min(1, "Student grade is required"),
	studentPhone: z.string().min(10, "Please enter a valid phone number"),
	studentEmail: z.string().email("Please enter a valid email address"),
	needHelp: z.string().min(1, "Please describe what help you need"),
	studentNeed: z.string().min(1, "Please summarize student needs"),
	tutorType: z
		.array(z.string())
		.min(1, "Please select at least one tutor type"),
	callbackTime: z.string().min(1, "Please specify callback time"),
	tutoringDays: z.string().min(1, "Please specify preferred days"),
	referral: z.string().optional(),
	specificRequest: z.string().optional(),
	fullName: z.string().min(1, "Please enter your full name"),
	date: z.string().min(1, "Please select a date"),
	agreeTerms: z.boolean().refine((val) => val === true, {
		message: "You must agree to the terms and conditions",
	}),
});

export const ZCTutorRegistrationSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phoneNumber: z.string().min(1, "Phone number is required"),
	gender: z.enum(["male", "female", "other"], {
		error: "Please select a gender",
	}),
	dateOfBirth: z.string().min(1, "Date of birth is required"),
	address: z.string().min(1, "Address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	zipCode: z.string().min(1, "ZIP code is required"),
	emergencyContact: z.string().min(1, "Emergency contact is required"),
	emergencyPhone: z.string().min(1, "Emergency phone is required"),
	highestDegree: z.string().min(1, "Please select your highest degree"),
	institution: z.string().min(1, "Institution name is required"),
	graduationYear: z.string().min(1, "Graduation year is required"),
	major: z.string().min(1, "Major/field of study is required"),
	subjects: z.array(z.string()).min(1, "Select at least one subject"),
	gradeLevels: z.array(z.string()).min(1, "Select at least one grade level"),
	experience: z.string().min(1, "Please describe your experience"),
	teachingStyle: z.string().min(1, "Please describe your teaching style"),
	availability: z.array(z.string()).min(1, "Select at least one day"),
	hoursPerWeek: z.string().min(1, "Please specify hours per week"),
	onlineExperience: z.enum(["yes", "no"], {
		error: "Please select an option",
	}),
	references: z.string().min(1, "Please provide at least one reference"),
	backgroundCheck: z.boolean().refine((val) => val === true, {
		message: "You must consent to a background check",
	}),
	certifications: z.string().optional(),
	languages: z.string().min(1, "Please list languages you speak"),
	whyTutor: z.string().min(1, "Please tell us why you want to tutor"),
	terms: z.boolean().refine((val) => val === true, {
		message: "You must agree to the terms and conditions",
	}),
});

export const ZCCollecgeEssayReviewSchema = z.object({
	studentName: z.string().min(2, "Student name must be at least 2 characters"),
	parentName: z.string().min(2, "Parent name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone number must be at least 10 digits"),
	grade: z.string().min(1, "Please select a grade"),
	studentEmail: z.string().email("Invalid email address"),
	studentSchool: z.string().min(2, "School name is required"),
	studentPhone: z.string().optional(),
	address: z.string().min(5, "Address is required"),
	collegeTarget: z.string().min(2, "Please enter target college"),
	satExamDate: z.string().optional(),
	targetScore: z.string().optional(),
	lastSatScore: z.string().optional(),
	referral: z.string().optional(),
	parentQuestion: z.string().optional(),
	accommodationRequest: z.string().optional(),
	paymentDate: z.string().min(1, "Payment confirmation date is required"),
	fullName: z.string().min(2, "Full name is required for signature"),
	agreedToTerms: z.boolean().refine((val) => val === true, {
		message: "You must agree to the terms and conditions",
	}),
});

export const ZNewsletterSubscription = z.object({
	email: z.email("Please enter a valid email address"),
});

export const ZCTrustedCompanies = z.object({
	name: z.string().min(1, "Name is required"),
	logo: z.string().optional(),
});

export const ZCContactUsSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	state: z.string().min(1, "State/Region is required"),
	country: z.string().min(1, "Country is required"),
	studentGrade: z.string().min(1, "Student grade is required"),
	bestTime: z.string().min(1, "Please provide best time to call"),
	helpWith: z.array(z.string()).min(1, "Please select at least one option"),
	other: z.string().optional(),
	query: z.string().min(1, "Please describe how we can help you"),
});

export const ZCBlogSchema = z
	.object({
		// Use z.any() for image to support File objects from browser
		// Validation happens in the custom refine below
		image: z.any(),

		title: z
			.string()
			.min(1, "Title is required")
			.min(5, "Title must be at least 5 characters")
			.max(200, "Title must not exceed 200 characters"),

		author: z
			.string()
			.min(1, "Author name is required")
			.min(2, "Author name must be at least 2 characters")
			.max(100, "Author name must not exceed 100 characters"),

		description: z
			.string()
			.min(1, "Description is required")
			.min(50, "Description must be at least 50 characters"),

		socialShare: z
			.object({
				facebook: z.boolean().default(true),
				instagram: z.boolean().default(true),
				linkedin: z.boolean().default(true),
			})
			.default({
				facebook: true,
				instagram: true,
				linkedin: true,
			}),

		slug: z
			.string()
			.regex(
				/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
				"Slug must be lowercase with hyphens",
			)
			.optional(),

		status: z.enum(["draft", "published", "archived"]).default("draft"),

		tags: z.array(z.string()).optional(),

		publishedAt: z.string().datetime().optional(),
	})
	.refine(
		(data) => {
			// Validate image if it's a File object
			if (
				data.image &&
				typeof data.image === "object" &&
				"size" in data.image
			) {
				return data.image.size <= 5000000; // 5MB max
			}
			// If it's a string (URL) or undefined, allow it
			return true;
		},
		{
			message: "Image must be less than 5MB",
			path: ["image"],
		},
	)
	.refine(
		(data) => {
			// Validate image type if it's a File object
			if (
				data.image &&
				typeof data.image === "object" &&
				"type" in data.image
			) {
				return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
					data.image.type,
				);
			}
			// If it's a string (URL) or undefined, allow it
			return true;
		},
		{
			message: "Only .jpg, .jpeg, .png and .webp formats are supported",
			path: ["image"],
		},
	);

export const ZUCollegeAdmissionsGuidanceForm =
	ZCollegeAdmissionsGuidanceForm.partial();
export const ZUFreeSeminarForm = ZCFreeSeminarForm.partial();
export const ZUTutorRequestRegistrationSchema =
	ZCTutorRequestRegistrationSchema.partial();
export const ZTutorRegistrationSchema = ZCTutorRegistrationSchema.partial();
export const ZUBlogSchema = ZCBlogSchema.partial();

export type TCollegeAdmissionsGuidanceForm = z.infer<
	typeof ZCollegeAdmissionsGuidanceForm
>;
export type TCFreeSeminarFormInput = z.infer<typeof ZCFreeSeminarFormInput>;
export type TCFreeSeminarForm = z.infer<typeof ZCFreeSeminarForm>;
export type TCTutorRequestRegistrationSchema = z.infer<
	typeof ZCTutorRequestRegistrationSchema
>;
export type TCTutorRegistrationSchema = z.infer<
	typeof ZCTutorRegistrationSchema
>;

export const TUCollegeEssayReviewSchema = ZCCollecgeEssayReviewSchema.partial();
export type TCcollegeEssayReviewSchema = z.infer<
	typeof ZCCollecgeEssayReviewSchema
>;
export type TNewsletterSubscription = z.infer<typeof ZNewsletterSubscription>;
export type TCTrustedCompanies = z.infer<typeof ZCTrustedCompanies>;
export type TCContactUsSchema = z.infer<typeof ZCContactUsSchema>;
export type TCBlogSchema = z.infer<typeof ZCBlogSchema>;
export type TUBlogSchema = z.infer<typeof ZUBlogSchema>;
