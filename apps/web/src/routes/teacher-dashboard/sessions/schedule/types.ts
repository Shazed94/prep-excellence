export type CalendarView = "day" | "week" | "month";

export type BookingStatus =
	| "confirmed"
	| "pending"
	| "rescheduled"
	| "cancelled"
	| "completed";

export type AvailabilityType = "available" | "blocked";

export type RecurrencePattern = "daily" | "weekly" | "custom";

export interface CoachProfile {
	id: string;
	name: string;
	photoUrl: string;
	email: string;
	totalSessions: number;
	upcomingSessions: number;
	rating: number;
	defaultOnlineRate: number;
	defaultInPersonRate: number;
}

export interface AvailabilitySlot {
	id: string;
	type: "availability";
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	daysOfWeek?: number[];
	recurrence?: {
		pattern: RecurrencePattern;
		interval?: number;
		customDays?: number[];
		endsOn?: string;
		neverEnds?: boolean;
		occurrences?: number;
	};
	sessionDuration: number;
	bufferTime: number;
	isOnline: boolean;
	rate?: number;
	meetingLink?: string;
	notes?: string;
}

export interface BlockedTime {
	id: string;
	type: "blocked";
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	fullDay?: boolean;
	reason: string;
	daysOfWeek?: number[];
	recurrence?: {
		pattern: RecurrencePattern;
		interval?: number;
		endsOn?: string;
		neverEnds?: boolean;
		occurrences?: number;
	};
}

export interface BookedSession {
	id: string;
	studentName: string;
	studentEmail: string;
	studentPhone?: string;
	studentPhotoUrl?: string;
	date: string;
	startTime: string;
	endTime: string;
	sessionType: string;
	duration: number;
	status: BookingStatus;
	paymentStatus: "paid" | "pending" | "refunded";
	isOnline: boolean;
	rate?: number;
	totalAmount?: number;
	meetingLink?: string;
	notes?: string;
}

export type ScheduleEvent = AvailabilitySlot | BlockedTime | BookedSession;

export interface AvailabilityTemplate {
	id: string;
	name: string;
	description: string;
	slots: Omit<AvailabilitySlot, "id" | "type">[];
}

export interface DayCellInfo {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	availableSlots: number;
	bookedSessions: BookedSession[];
	blockedTimes: BlockedTime[];
}
