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

// ============= Course Types =============

export type ContentType = "VIDEO" | "LIVE" | "ASSIGNMENT" | "READING" | "QUIZ";
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type LessonType =
	| "LIVE_CLASS"
	| "READING_MATERIAL"
	| "ASSIGNMENT"
	| "EXAM";
export type AvailabilityType = "ONLINE" | "OFFLINE";
export type AvailabilityCategory = "AVAILABLE" | "BLOCKED";

export interface CoachingCategory {
	id: string;
	name: string;
	description?: string;
}

export type ScheduleDay =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";

export interface Schedule {
	dayOfWeek: ScheduleDay;
	startTime: string;
	endTime: string;
}

export interface CoachingCourse {
	id: string;
	title: string;
	slug: string;
	shortDescription: string;
	longDescription: string;
	thumbnail?: string;
	video?: string;
	price: number;
	discount: number;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
	duration?: number;
	capacity?: number;
	startDate: string;
	endDate: string;
	schedules: Schedule[];
	isPublished: boolean;
	category?: CoachingCategory;
	categoryId: string;
	teacherId: string;
	tags: string[];
	courseModules?: CoachingModule[];
	instructorId?: string;
	createdBy?: { id: string; name: string; image?: string };
	createdAt?: string;
	updatedAt?: string;
	_count?: { enrollments: number };
	status?: EnrollmentStatus;
	progressPercent?: number;
	modules?: any[];
}

export interface CoachingModule {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	unlockAtPercent: number;
	courseId: string;
	instructor?: { id: string; user: { name: string; image?: string } };
	lessons?: CoachingTopic[];
	topics?: CoachingTopic[];
}

export interface CoachingTopic {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	moduleId: string;
	content?: string;
	lessonType: LessonType;
}

export interface CoachingContent {
	id: string;
	title: string;
	description?: string;
	contentType: ContentType;
	content?: string;
	orderIndex: number;
	moduleId?: string;
	topicId: string;
	duration?: number;
	scheduledAt?: string;
	actualStartTime?: string;
	actualEndTime?: string;
	jitsiStartUrl?: string;
	jitsiRoomId?: string;
	jitsiRoomToken?: string;
	masterPlaylistUrl?: string;
	recordingUrl?: string;
	thumbnailUrl?: string;
	videoStatus?: string;
	rawVideoUrl?: string;
	dueDate?: string;
	totalPoints?: number;
	assignmentData?: any;
	quizData?: any;
	passingScore?: number;
	timeLimit?: number;
	attachments?: string[];
	progress?: CoachingContentProgress;
	createdAt?: string;
	updatedAt?: string;
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
	title?: string;
	longDescription?: string;
	duration?: number;
	level?: string;
	capacity?: number;
	schedule?: Schedule[];
	modules?: CoachingModule[];
	_count?: { enrollments: number };
	discount?: number;
	regular_price?: number;
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

// ============= One-to-One Types =============

export interface OneToOneTeacher {
	id: string;
	userId: string;
	bio?: string;
	onlineHourlyRate: number;
	offlineHourlyRate: number;
	timezone: string;
	videoUrl?: string;
	isAvailable: boolean;
	rating: number;
	totalSessions: number;
	totalReviews: number;
	responseTime?: number;
	specializations: OneToOneSpecialization[];
	user?: { id: string; name: string; image?: string };
}

export interface OneToOneSpecialization {
	id: string;
	subject: string;
	level?: string;
	yearsExp?: number;
	description?: string;
}

export interface TeacherAvailabilitySlot {
	id: string;
	teacherId: string;
	teacherProfileId?: string;
	category: AvailabilityCategory;
	availabilityType: AvailabilityType;
	dayOfWeek?: ScheduleDay;
	specificDate?: string;
	specificStartTime?: string;
	specificEndTime?: string;
	startTime?: string;
	endTime?: string;
	startDate?: string;
	endDate?: string;
	sessionDuration?: number;
	bufferTime?: number;
	hourlyRate?: number;
	fullDay?: boolean;
	reason?: string;
	title?: string;
	isBooked: boolean;
	isRecurring?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export type TeacherSessionStatus =
	| "SCHEDULED"
	| "IN_PROGRESS"
	| "COMPLETED"
	| "CANCELLED"
	| "NO_SHOW";

export interface TeacherSession {
	id: string;
	status: TeacherSessionStatus;
	scheduledAt: string;
	duration: number;
	topic?: string;
	notes?: string;
	actualStartTime?: string;
	actualEndTime?: string;
	jitsiStartUrl?: string;
	jitsiRoomId?: string;
	jitsiRoomToken?: string;
	student?: { id: string; user?: { id: string; name: string; image?: string } };
	review?: OneToOneReview;
}

export interface OneToOneReview {
	id: string;
	rating: number;
	comment?: string;
	response?: string;
	isPublic: boolean;
	createdAt: string;
	student?: { id: string; user?: { id: string; name: string; image?: string } };
	sessionId?: string;
}

export interface AvailabilitySlot {
	id: string;
	category: AvailabilityCategory;
	availabilityType: AvailabilityType;
	dayOfWeek?: ScheduleDay;
	specificDate?: string;
	specificStartTime?: string;
	specificEndTime?: string;
	startTime?: string;
	endTime?: string;
	sessionDuration?: number;
	isBooked: boolean;
	isRecurring?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface SessionRecording {
	id: string;
	sessionId: string;
	status: "processing" | "ready" | "failed";
	expiresAt: string;
	masterPlaylistUrl?: string;
	downloadUrl?: string;
	isDownloadEnabled: boolean;
}

// ============= Enrollment Types =============

export interface Enrollment {
	id: string;
	userId: string;
	courseId: string;
	progress: number;
	completedAt?: Date;
	enrolledAt: Date;
}
