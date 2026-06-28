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
// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentType = "VIDEO" | "LIVE" | "ASSIGNMENT" | "READING" | "QUIZ";
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface CoachingCategory {
	id: string;
	name: string;
	description?: string;
}

export interface CoachingCourse {
	id: string;
	title: string;
	slug: string;
	sortDescription: string;
	longDescription: string;
	thumbnail?: string;
	video?: string;
	regular_price: number;
	offer_price: number;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	duration?: number; // weeks
	capacity?: number;
	startDate?: string;
	endDate?: string;
	schedule: Record<string, unknown>;
	isPublished: boolean;
	category?: CoachingCategory;
	tags: string[];
	modules?: CoachingModule[];
	_count?: { enrollments: number };
}

export interface CoachingModule {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	unlockAtPercent: number; // 0, 25, 50, 75, 100 — payment gate
	courseId: string;
	instructor?: { id: string; user: { name: string; image?: string } };
	topics?: CoachingTopic[];
}

export interface CoachingTopic {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	moduleId: string;
	contents?: CoachingContent[];
}

export interface CoachingContent {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	contentType: ContentType;
	topicId: string;

	// VIDEO / LIVE
	scheduledAt?: string;
	duration?: number; // minutes
	jitsiRoomId?: string;
	jitsiRoomToken?: string;
	jitsiStartUrl?: string;
	actualStartTime?: string;
	actualEndTime?: string;
	recordingUrl?: string;
	masterPlaylistUrl?: string; // HLS streaming
	thumbnailUrl?: string;
	videoStatus?: "uploading" | "processing" | "ready" | "failed";

	// READING
	content?: string;
	attachments?: string[];

	// ASSIGNMENT / QUIZ
	assignmentData?: Record<string, unknown>;
	quizData?: Record<string, unknown>;
	dueDate?: string;
	totalPoints?: number;
	passingScore?: number;

	// Student progress for this content
	progress?: CoachingContentProgress;
}

export interface CoachingContentProgress {
	id: string;
	isCompleted: boolean;
	completedAt?: string;
	score?: number;
	grade?: string;
	feedback?: string;
}

export interface CoachingEnrollment {
	id: string;
	status: EnrollmentStatus;
	enrolledAt: string;
	completedAt?: string;
	progressPercent: number;
	certificateUrl?: string;
	lastAccessedAt?: string;
	courseId: string;
	course: CoachingCourse;
}

export interface CoachingSubmission {
	id: string;
	submittedAt: string;
	fileUrls: string[];
	textAnswer?: string;
	score?: number;
	grade?: string;
	feedback?: string;
	gradedAt?: string;
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
