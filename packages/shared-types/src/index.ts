// ============= API Response Types =============
export interface ApiResponse<T = any> {
	success: boolean;
	message?: string;
	data?: T;
	errors?: any;
}

export interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

// ============= User Types =============

export type UserRole =
	| "Student"
	| "Referral"
	| "Affiliate"
	| "Admin"
	| "Instructor";

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	phone?: string;
	address?: string;
	image?: string;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponse {
	user: User;
	tokens: AuthTokens;
}

// ============= Course Types (for future phases) =============

export interface CourseResponse {
	success: boolean;
	data: Course[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}
export interface Course {
	id: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	title: string;
	slug: string;
	sortDescription: string;
	longDescription: string;
	video: string;
	thumbnail: string;
	regular_price: string;
	offer_price: string;
	discount: string;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	duration: number;
	category: string;
	tags: string[];
	capacity: number;
	categoryId: string;
	startDate: string;
	endDate: any;
	modules: Module[];
	schedule: Schedule[];
	publishedAt: string;
	isPublished: boolean;
	createdById: string;
	createdBy: CreatedBy;
	_count: Count;
}

export interface Module {
	id: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	title: string;
	description: string;
	orderIndex: number;
	unlockAtPercent: number;
	courseId: string;
	instructorId: string;
	topics: Topic[];
	instructor: Instructor;
}

export interface Topic {
	id: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	title: string;
	description: string;
	orderIndex: number;
	moduleId: string;
	contents: any[];
}

export interface Instructor {
	role: string;
	experienceYears: number;
	subjects: string[];
	user: {
		name: string;
		image: string;
	};
}

export interface Schedule {
	day: string;
	endTime: string;
	startTime: string;
	activity?: string;
}

export interface CreatedBy {
	name: string;
	image: any;
}

export interface Count {
	enrollments: number;
}

export interface Video {
	id: string;
	courseId: string;
	title: string;
	description?: string;
	url: string;
	duration: number;
	order: number;
	isPublished: boolean;
}

// ============= Enrollment Types (for future phases) =============

export interface Enrollment {
	id: string;
	userId: string;
	courseId: string;
	progress: number;
	completedAt?: Date;
	enrolledAt: Date;
}
