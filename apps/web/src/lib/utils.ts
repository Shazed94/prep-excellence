import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const dayMap: Record<string, string> = {
	sunday: "Sun",
	monday: "Mon",
	tuesday: "Tue",
	wednesday: "Wed",
	thursday: "Thu",
	friday: "Fri",
	saturday: "Sat",
};

export const formatTime = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);

	const period = hour >= 12 ? "PM" : "AM";
	const adjustedHour = hour % 12 || 12;

	return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};
