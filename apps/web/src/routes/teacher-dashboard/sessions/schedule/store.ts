import {
	addDays,
	addMonths,
	addWeeks,
	subDays,
	subMonths,
	subWeeks,
} from "date-fns";
import { create } from "zustand";
import { availabilitySlots, blockedTimes, bookedSessions } from "./dummy-data";
import type { BookedSession, CalendarView } from "./types";

interface ScheduleState {
	currentDate: Date;
	view: CalendarView;
	sidebarOpen: boolean;
	selectedBooking: BookedSession | null;
	addAvailabilityOpen: boolean;
	bookingDetailsOpen: boolean;
	blockTimeOpen: boolean;
	manageRatesOpen: boolean;
	bookedSessions: BookedSession[];
	availabilitySlots: typeof availabilitySlots;
	blockedTimes: typeof blockedTimes;

	setCurrentDate: (date: Date) => void;
	setView: (view: CalendarView) => void;
	toggleSidebar: () => void;
	setSidebarOpen: (open: boolean) => void;

	navigateNext: () => void;
	navigatePrev: () => void;
	goToToday: () => void;

	openAddAvailability: () => void;
	closeAddAvailability: () => void;
	openBookingDetails: (booking: BookedSession) => void;
	closeBookingDetails: () => void;
	openBlockTime: () => void;
	closeBlockTime: () => void;
	openManageRates: () => void;
	closeManageRates: () => void;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
	currentDate: new Date(),
	view: "month",
	sidebarOpen: true,
	selectedBooking: null,
	addAvailabilityOpen: false,
	bookingDetailsOpen: false,
	blockTimeOpen: false,
	manageRatesOpen: false,
	bookedSessions,
	availabilitySlots,
	blockedTimes,

	setCurrentDate: (date) => set({ currentDate: date }),
	setView: (view) => set({ view }),
	toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
	setSidebarOpen: (open) => set({ sidebarOpen: open }),

	navigateNext: () => {
		const { view, currentDate } = get();
		switch (view) {
			case "month":
				set({ currentDate: addMonths(currentDate, 1) });
				break;
			case "week":
				set({ currentDate: addWeeks(currentDate, 1) });
				break;
			case "day":
				set({ currentDate: addDays(currentDate, 1) });
				break;
		}
	},

	navigatePrev: () => {
		const { view, currentDate } = get();
		switch (view) {
			case "month":
				set({ currentDate: subMonths(currentDate, 1) });
				break;
			case "week":
				set({ currentDate: subWeeks(currentDate, 1) });
				break;
			case "day":
				set({ currentDate: subDays(currentDate, 1) });
				break;
		}
	},

	goToToday: () => set({ currentDate: new Date() }),

	openAddAvailability: () => set({ addAvailabilityOpen: true }),
	closeAddAvailability: () => set({ addAvailabilityOpen: false }),
	openBookingDetails: (booking) =>
		set({ selectedBooking: booking, bookingDetailsOpen: true }),
	closeBookingDetails: () =>
		set({ selectedBooking: null, bookingDetailsOpen: false }),
	openBlockTime: () => set({ blockTimeOpen: true }),
	closeBlockTime: () => set({ blockTimeOpen: false }),
	openManageRates: () => set({ manageRatesOpen: true }),
	closeManageRates: () => set({ manageRatesOpen: false }),
}));
