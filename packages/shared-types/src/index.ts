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

export interface Course {
	id: string;
	title: string;
	description: string;
	instructorId: string;
	instructor?: User;
	thumbnail?: string;
	price: number;
	isPublished: boolean;
	createdAt: Date;
	updatedAt: Date;
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
