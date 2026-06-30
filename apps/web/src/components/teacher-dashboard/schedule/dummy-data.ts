import type { AvailabilitySlot, BookedSession, CoachProfile } from "./types";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const day = (d: number) => new Date(year, month, d);
const formatDate = (d: Date) => {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day_ = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day_}`;
};

export const coachProfile: CoachProfile = {
	id: "coach-1",
	name: "Sarah Johnson",
	photoUrl: "",
	email: "sarah.johnson@prepexcellence.com",
	totalSessions: 342,
	upcomingSessions: 12,
	rating: 4.9,
	defaultOnlineRate: 75,
	defaultInPersonRate: 100,
};

export const availabilitySlots: AvailabilitySlot[] = [
	{
		id: "avail-1",
		createdAt: formatDate(day(1)),
		updatedAt: formatDate(day(1)),
		category: "AVAILABLE",
		availabilityType: "ONLINE",
		bufferTime: 10,
		sessionDuration: 30,
		hourlyRate: 75,
		reason: null,
		title: null,
		repeatDuration: null,
		dayOfWeek: "MONDAY",
		specificDate: null,
		specificStartTime: "09:00",
		specificEndTime: "13:00",
		isBooked: false,
		profileId: "coach-1",
	},
	{
		id: "avail-2",
		createdAt: formatDate(day(1)),
		updatedAt: formatDate(day(1)),
		category: "AVAILABLE",
		availabilityType: "OFFLINE",
		bufferTime: 5,
		sessionDuration: 45,
		hourlyRate: 100,
		reason: null,
		title: null,
		repeatDuration: null,
		dayOfWeek: "TUESDAY",
		specificDate: null,
		specificStartTime: "15:00",
		specificEndTime: "17:00",
		isBooked: false,
		profileId: "coach-1",
	},
];

export const blockedTimes = [
	{
		id: "block-1",
		createdAt: formatDate(day(1)),
		updatedAt: formatDate(day(1)),
		category: "BLOCKED",
		availabilityType: null,
		bufferTime: null,
		sessionDuration: null,
		hourlyRate: null,
		reason: "Lunch Break",
		title: null,
		repeatDuration: null,
		dayOfWeek: "MONDAY",
		specificDate: null,
		specificStartTime: "13:00",
		specificEndTime: "14:00",
		isBooked: false,
		profileId: "coach-1",
	},
];

const _prevDay = (d: number) => {
	const date = new Date(year, month, d);
	date.setDate(date.getDate() - 1);
	return date;
};

export const bookedSessions: BookedSession[] = [
	{
		id: "book-1",
		studentName: "Alice Johnson",
		studentEmail: "alice.j@example.com",
		studentPhone: "(555) 123-4567",
		date: formatDate(day(10)),
		startTime: "09:00",
		endTime: "09:30",
		sessionType: "30 min Online Consultation",
		duration: 30,
		status: "confirmed",
		paymentStatus: "paid",
		isOnline: true,
		rate: 75,
		totalAmount: 37.5,
		meetingLink: "https://meet.prepexcellence.com/alice-johnson",
	},
];

export const availabilityTemplates = [
	{
		id: "tpl-1",
		name: "Weekday Morning Slots",
		description: "Mon-Fri 9AM-1PM with 30min sessions",
		slots: [
			{
				startDate: "",
				endDate: "",
				startTime: "09:00",
				endTime: "13:00",
				daysOfWeek: [1, 2, 3, 4, 5],
				sessionDuration: 30,
				bufferTime: 10,
				isOnline: true,
				rate: 75,
			},
		],
	},
];

export function getUpcomingBookings(): BookedSession[] {
	return bookedSessions
		.filter((s) => s.status === "confirmed" || s.status === "pending")
		.slice(0, 5);
}
