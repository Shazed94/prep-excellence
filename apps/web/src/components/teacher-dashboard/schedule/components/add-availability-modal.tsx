import { useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { CalendarIcon, DollarSign, Loader2, MapPin, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetOwnTeacherProfile, useGetTeacherMe } from "@/hooks/teacher";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "../store";

const DAYS_OF_WEEK = [
	{ value: "0", label: "Sun" },
	{ value: "1", label: "Mon" },
	{ value: "2", label: "Tue" },
	{ value: "3", label: "Wed" },
	{ value: "4", label: "Thu" },
	{ value: "5", label: "Fri" },
	{ value: "6", label: "Sat" },
];

export function AddAvailabilityModal() {
	const { addAvailabilityOpen, closeAddAvailability } = useScheduleStore();
	const queryClient = useQueryClient();

	const { data: teacherMe } = useGetTeacherMe();
	const { data: profileRes } = useGetOwnTeacherProfile(teacherMe?.id);

	const profile = profileRes?.data;
	const defaultOnlineRate = profile?.onlineHourlyRate ?? 0;
	const defaultInPersonRate = profile?.offlineHourlyRate ?? 0;

	const [isRecurring, setIsRecurring] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [selectedDays, setSelectedDays] = useState<string[]>([
		"1",
		"2",
		"3",
		"4",
		"5",
	]);
	const currentDate = useScheduleStore((s) => s.currentDate);
	const [startDate, setStartDate] = useState<Date>(currentDate);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [startTime, setStartTime] = useState("09:00");
	const [endTime, setEndTime] = useState("13:00");
	const [sessionDuration, setSessionDuration] = useState("30");
	const [bufferTime, setBufferTime] = useState("10");
	const [isOnline, setIsOnline] = useState(true);
	const [rate, setRate] = useState(String(defaultOnlineRate));

	// Reset form when dialog opens
	useEffect(() => {
		if (addAvailabilityOpen) {
			setIsRecurring(false);
			setSelectedDays(["1", "2", "3", "4", "5"]);
			setStartDate(currentDate);
			setEndDate(undefined);
			setStartTime("09:00");
			setEndTime("13:00");
			setSessionDuration("30");
			setBufferTime("10");
			setIsOnline(true);
			setRate(String(defaultOnlineRate));
		}
	}, [addAvailabilityOpen, currentDate, defaultOnlineRate]);

	const toggleDay = (day: string) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	};

	const handleSave = async () => {
		if (!teacherMe?.id) return;

		setIsSaving(true);

		const fmt = (d: Date) => format(d, "yyyy-MM-dd");
		const payload = {
			category: "AVAILABLE" as const,
			startDate: fmt(startDate),
			endDate: endDate ? fmt(endDate) : undefined,
			startTime,
			endTime,
			daysOfWeek: isRecurring ? selectedDays.map(Number) : undefined,
			sessionDuration: Number.parseInt(sessionDuration, 10),
			bufferTime: Number.parseInt(bufferTime, 10),
			availabilityType: isOnline ? "ONLINE" : "OFFLINE",
			hourlyRate: rate ? Number.parseFloat(rate) : undefined,
		};

		try {
			const { default: axios } = await import("@/lib/axios");

			await axios.post(
				`/onetoone/teachers/${teacherMe.id}/availability`,
				payload,
			);

			queryClient.invalidateQueries({ queryKey: ["teacher", "availability"] });
			closeAddAvailability();
			toast.success("Availability slot added");
		} catch (e: any) {
			toast.error(e.response?.data?.message ?? "Failed to create availability");
		} finally {
			setIsSaving(false);
		}
	};

	const canSave =
		startTime < endTime && (!isRecurring || selectedDays.length > 0);

	return (
		<Dialog open={addAvailabilityOpen} onOpenChange={closeAddAvailability}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Add Availability</DialogTitle>
					<DialogDescription>
						Set your available time slots. Your profile rates are pre-filled but
						you can override per slot.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5 py-2">
					{/* Date range */}
					<div
						className={cn(
							"grid gap-4",
							isRecurring ? "grid-cols-2" : "grid-cols-1",
						)}
					>
						<div className="space-y-2">
							<Label>{isRecurring ? "Start Date" : "Date"}</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className={cn("w-full justify-start text-left font-normal")}
									>
										<CalendarIcon className="size-3.5 mr-1.5" />
										{format(startDate, "MMM d, yyyy")}
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-auto p-0">
									<Calendar
										mode="single"
										selected={startDate}
										onSelect={(d) => d && setStartDate(d)}
										disabled={{ before: new Date() }}
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* End Date — only shown when recurring; hidden for single-day slots */}
						{isRecurring && (
							<div className="space-y-2">
								<Label>
									End Date{" "}
									<span className="text-xs text-destructive font-normal">
										(required)
									</span>
								</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className={cn(
												"w-full justify-start text-left font-normal",
												!endDate && "text-muted-foreground",
											)}
										>
											<CalendarIcon className="size-3.5 mr-1.5" />
											{endDate
												? format(endDate, "MMM d, yyyy")
												: "Select end date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent align="start" className="w-auto p-0">
										<Calendar
											mode="single"
											selected={endDate}
											onSelect={(d) => setEndDate(d)}
											disabled={{
												before: startDate,
												after: addDays(startDate, 7),
											}}
										/>
									</PopoverContent>
								</Popover>
								{endDate && endDate <= startDate && (
									<p className="text-xs text-destructive">
										End date must be after start date
									</p>
								)}
							</div>
						)}
					</div>

					{/* Time range */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="avail-start">Start Time</Label>
							<Input
								type="time"
								min="08:00"
								max="20:00"
								value={startTime}
								onChange={(e) =>
									setStartTime(
										e.target.value < "08:00"
											? "08:00"
											: e.target.value > "20:00"
												? "20:00"
												: e.target.value,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="avail-end">End Time</Label>
							<Input
								type="time"
								min="08:00"
								max="20:00"
								value={endTime}
								onChange={(e) =>
									setEndTime(
										e.target.value < "08:00"
											? "08:00"
											: e.target.value > "20:00"
												? "20:00"
												: e.target.value,
									)
								}
							/>
						</div>
						{startTime >= endTime && (
							<p className="col-span-2 text-xs text-destructive">
								End time must be after start time
							</p>
						)}
						<p className="col-span-2 text-xs text-muted-foreground">
							Available hours: 8:00 AM – 8:00 PM
						</p>
					</div>

					{/* Online / In-person toggle */}
					<div className="space-y-2">
						<Label>Session Mode</Label>
						<Tabs
							value={isOnline ? "online" : "inperson"}
							onValueChange={(v) => {
								const newIsOnline = v === "online";
								setIsOnline(newIsOnline);
								setRate(
									String(newIsOnline ? defaultOnlineRate : defaultInPersonRate),
								);
							}}
							className="w-full"
						>
							<TabsList className="w-full">
								<TabsTrigger value="online" className="flex-1 gap-1.5">
									<Video className="size-3.5" />
									Online
								</TabsTrigger>
								<TabsTrigger value="inperson" className="flex-1 gap-1.5">
									<MapPin className="size-3.5" />
									In-Person
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Hourly rate */}
					<div className="space-y-2">
						<Label htmlFor="avail-rate">
							Hourly Rate{" "}
							<span className="text-xs text-muted-foreground font-normal">
								($
								{isOnline
									? Number(defaultOnlineRate).toFixed(2)
									: Number(defaultInPersonRate).toFixed(2)}
								/hr from profile — override below)
							</span>
						</Label>
						<div className="relative">
							<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								type="number"
								min="0"
								step="0.01"
								placeholder={
									isOnline
										? String(defaultOnlineRate)
										: String(defaultInPersonRate)
								}
								value={rate}
								onChange={(e) => setRate(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>

					{/* Recurring toggle */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label htmlFor="recurring-toggle">Repeat weekly</Label>
							<Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
						</div>

						{isRecurring && (
							<div className="space-y-3 pl-0">
								<div className="space-y-2">
									<Label>Days of Week</Label>
									<div className="flex gap-1.5">
										{DAYS_OF_WEEK.map((day) => (
											<button
												key={day.value}
												type="button"
												onClick={() => toggleDay(day.value)}
												className={cn(
													"size-8 rounded-full text-xs font-medium transition-colors",
													selectedDays.includes(day.value)
														? "bg-primary text-primary-foreground"
														: "bg-muted/20 text-muted-foreground hover:bg-muted/40",
												)}
											>
												{day.label}
											</button>
										))}
									</div>
									{selectedDays.length === 0 && (
										<p className="text-xs text-destructive">
											Select at least one day
										</p>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={closeAddAvailability}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button
						variant="gradient"
						onClick={handleSave}
						disabled={!canSave || isSaving || (isRecurring && !endDate)}
					>
						{isSaving && <Loader2 className="size-4 animate-spin mr-1" />}
						Save Availability
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
