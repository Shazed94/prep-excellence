export type CalendarView = "day" | "week" | "month";

export type BookingStatus =
	| "confirmed"
	| "pending"
	| "rescheduled"
	| "cancelled"
	| "completed";

export type AvailabilityCategory = "AVAILABLE" | "BLOCKED";
export type AvailabilityType = "ONLINE" | "OFFLINE";
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
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	category: AvailabilityCategory;
	availabilityType: AvailabilityType | null;
	bufferTime: number | null;
	sessionDuration: number | null;
	hourlyRate: number | null;
	reason: string | null;
	title: string | null;
	repeatDuration: number | null;
	endDate: string | null;
	dayOfWeek: string | null;
	specificDate: string | null;
	specificStartTime: string | null;
	specificEndTime: string | null;
	isBooked: boolean;
	profileId: string;
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

export type ScheduleEvent = AvailabilitySlot | BookedSession;

export interface DayCellInfo {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	availableSlots: number;
	bookedSessions: BookedSession[];
	blockedTimes: AvailabilitySlot[];
}
