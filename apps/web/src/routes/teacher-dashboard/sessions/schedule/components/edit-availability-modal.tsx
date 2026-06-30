import { addDays, format } from "date-fns";
import {
	CalendarIcon,
	DollarSign,
	Loader2,
	MapPin,
	Trash2,
	Video,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { useDeleteAvailability, useUpdateAvailability } from "@/hooks/teacher";
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

export function EditAvailabilityModal() {
	const { editAvailabilityOpen, closeEditAvailability, editingSlot } =
		useScheduleStore();

	const updateAvail = useUpdateAvailability();
	const deleteAvail = useDeleteAvailability();

	const [isRecurring, setIsRecurring] = useState(false);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [startTime, setStartTime] = useState("09:00");
	const [endTime, setEndTime] = useState("13:00");
	const [sessionDuration, setSessionDuration] = useState("30");
	const [bufferTime, setBufferTime] = useState("10");
	const [isOnline, setIsOnline] = useState(true);
	const [rate, setRate] = useState("");

	// Pre-fill form when editing slot opens
	useEffect(() => {
		if (editAvailabilityOpen && editingSlot) {
			// Parse the editing slot data
			const isRecurringSlot = !!editingSlot.dayOfWeek;
			setIsRecurring(isRecurringSlot);

			if (isRecurringSlot) {
				// For recurring, get days of week
				const dayMap: Record<string, string> = {
					SUNDAY: "0",
					MONDAY: "1",
					TUESDAY: "2",
					WEDNESDAY: "3",
					THURSDAY: "4",
					FRIDAY: "5",
					SATURDAY: "6",
				};
				const dayValue = dayMap[editingSlot.dayOfWeek ?? ""];
				setSelectedDays(dayValue ? [dayValue] : []);

				// Set date range from first to last occurrence (simplified)
				setStartDate(new Date(editingSlot.specificDate ?? ""));
				setEndDate(
					editingSlot.specificDate
						? addDays(new Date(editingSlot.specificDate), 7)
						: undefined,
				);
			} else {
				// For one-time slot
				setIsRecurring(false);
				setSelectedDays([]);
				setStartDate(new Date(editingSlot.specificDate ?? ""));
				setEndDate(undefined);
			}

			// Set times
			setStartTime(
				editingSlot.specificStartTime
					? format(new Date(editingSlot.specificStartTime), "HH:mm")
					: "09:00",
			);
			setEndTime(
				editingSlot.specificEndTime
					? format(new Date(editingSlot.specificEndTime), "HH:mm")
					: "13:00",
			);

			// Set other fields
			setSessionDuration(String(editingSlot.sessionDuration ?? 30));
			setBufferTime(String(editingSlot.bufferTime ?? 10));
			setIsOnline(editingSlot.availabilityType === "ONLINE");
			setRate(String(editingSlot.hourlyRate ?? ""));
		}
	}, [editAvailabilityOpen, editingSlot]);

	// Reset form when dialog opens
	useEffect(() => {
		if (!editAvailabilityOpen) {
			setIsRecurring(false);
			setSelectedDays(["1", "2", "3", "4", "5"]);
			setStartDate(new Date());
			setEndDate(addDays(new Date(), 7));
			setStartTime("09:00");
			setEndTime("13:00");
			setSessionDuration("30");
			setBufferTime("10");
			setIsOnline(true);
			setRate("");
		}
	}, [editAvailabilityOpen]);

	// Sync rate when toggling between Online / In-Person modes
	useEffect(() => {
		if (editAvailabilityOpen) {
			// Get default rates from store or use defaults
			const defaultOnlineRate = 0; // Would come from profile in real implementation
			const defaultInPersonRate = 0; // Would come from profile in real implementation
			const defaultRate = isOnline ? defaultOnlineRate : defaultInPersonRate;
			setRate(defaultRate > 0 ? String(defaultRate) : "");
		}
	}, [isOnline, editAvailabilityOpen]);

	const toggleDay = (day: string) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	};

	const handleSave = () => {
		if (!editingSlot?.id) return;

		const fmt = (d: Date) => format(d, "yyyy-MM-dd");

		updateAvail.mutate(
			{
				id: editingSlot.id,
				body: {
					category: editingSlot.category,
					availabilityType: isOnline ? "ONLINE" : "OFFLINE",
					startDate: fmt(startDate),
					endDate: endDate ? fmt(endDate) : undefined,
					startTime,
					endTime,
					daysOfWeek: isRecurring ? selectedDays.map(Number) : undefined,
					sessionDuration: Number.parseInt(sessionDuration, 10),
					bufferTime: Number.parseInt(bufferTime, 10),
					hourlyRate: rate ? Number.parseFloat(rate) : undefined,
				},
			},
			{
				onSuccess: () => closeEditAvailability(),
			},
		);
	};

	// Auto-set end date when recurring is toggled ON and endDate is empty
	useEffect(() => {
		if (isRecurring && editAvailabilityOpen && !endDate) {
			setEndDate(addDays(startDate, 7));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRecurring, editAvailabilityOpen, endDate, startDate]);

	const handleDelete = () => {
		if (!editingSlot?.id) return;
		deleteAvail.mutate(editingSlot.id, {
			onSuccess: () => closeEditAvailability(),
		});
	};

	const isSubmitting = updateAvail.isPending || deleteAvail.isPending;
	const canSave =
		startTime < endTime &&
		(!isRecurring || (selectedDays.length > 0 && endDate != null));

	return (
		<Dialog open={editAvailabilityOpen} onOpenChange={closeEditAvailability}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Availability</DialogTitle>
					<DialogDescription>
						Update your available time slot.
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
							<Label>Start Date</Label>
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
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="avail-end">End Time</Label>
							<Input
								type="time"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
							/>
						</div>
						{startTime >= endTime && (
							<p className="col-span-2 text-xs text-destructive">
								End time must be after start time
							</p>
						)}
					</div>

					{/* Online / In-person toggle */}
					<div className="space-y-2">
						<Label>Session Mode</Label>
						<Tabs
							value={isOnline ? "online" : "inperson"}
							onValueChange={(v) => setIsOnline(v === "online")}
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
								(optional)
							</span>
						</Label>
						<div className="relative">
							<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								type="number"
								min="0"
								step="0.01"
								placeholder="Enter rate"
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
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground">
									{isRecurring ? "Multiple weeks" : "Single day"}
								</span>
								<Switch
									checked={isRecurring}
									onCheckedChange={(v) => {
										setIsRecurring(v);
										if (v && !endDate) {
											setEndDate(addDays(startDate, 7));
										}
									}}
								/>
							</div>
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
						onClick={closeEditAvailability}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={handleDelete}
						disabled={isSubmitting}
						className="gap-1.5"
					>
						{deleteAvail.isPending ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Trash2 className="size-4" />
						)}
						Delete
					</Button>
					<Button
						variant="gradient"
						onClick={handleSave}
						disabled={!canSave || isSubmitting}
					>
						{updateAvail.isPending && (
							<Loader2 className="size-4 animate-spin mr-1" />
						)}
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
