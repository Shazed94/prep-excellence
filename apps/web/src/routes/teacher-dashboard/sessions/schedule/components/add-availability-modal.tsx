import { DollarSign, MapPin, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { RadioGroup } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	const [availabilityType, setAvailabilityType] = useState<
		"available" | "blocked"
	>("available");
	const [recurring, setRecurring] = useState(false);
	const [selectedDays, setSelectedDays] = useState<string[]>([
		"1",
		"2",
		"3",
		"4",
		"5",
	]);
	const [startTime, setStartTime] = useState("09:00");
	const [endTime, setEndTime] = useState("13:00");
	const [sessionDuration, setSessionDuration] = useState("30");
	const [bufferTime, setBufferTime] = useState("10");
	const [isOnline, setIsOnline] = useState(true);
	const [rate, setRate] = useState("");
	const [recurrencePattern, setRecurrencePattern] = useState("weekly");

	const toggleDay = (day: string) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	};

	const handleSave = () => {
		closeAddAvailability();
	};

	return (
		<Dialog open={addAvailabilityOpen} onOpenChange={closeAddAvailability}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Add Availability</DialogTitle>
					<DialogDescription>
						Set your available time slots or block out time on your schedule.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5 py-2">
					<div className="space-y-2">
						<Label>Type</Label>
						<RadioGroup
							value={availabilityType}
							onValueChange={(v) =>
								setAvailabilityType(v as "available" | "blocked")
							}
							className="flex gap-4"
						>
							<div className="flex items-center gap-2">
								{/* <RadioGroupItem value="available" id="avail-type-avail" /> */}
								<Label
									htmlFor="avail-type-avail"
									className="text-sm font-normal"
								>
									Available
								</Label>
							</div>
							<div className="flex items-center gap-2">
								{/* <RadioGroupItem value="blocked" id="avail-type-blocked" /> */}
								<Label
									htmlFor="avail-type-blocked"
									className="text-sm font-normal"
								>
									Blocked Time
								</Label>
							</div>
						</RadioGroup>
					</div>

					{availabilityType === "available" && (
						<>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="avail-start">Start Time</Label>
									<Input
										// id="avail-start"
										type="time"
										value={startTime}
										onChange={(e) => setStartTime(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="avail-end">End Time</Label>
									<Input
										// id="avail-end"
										type="time"
										value={endTime}
										onChange={(e) => setEndTime(e.target.value)}
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="session-duration">Session Duration</Label>
									<Select
										value={sessionDuration}
										onValueChange={setSessionDuration}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="15">15 min</SelectItem>
											<SelectItem value="30">30 min</SelectItem>
											<SelectItem value="45">45 min</SelectItem>
											<SelectItem value="60">60 min</SelectItem>
											<SelectItem value="90">90 min</SelectItem>
											<SelectItem value="custom">Custom</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="buffer-time">Buffer Time</Label>
									<Select value={bufferTime} onValueChange={setBufferTime}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="0">None</SelectItem>
											<SelectItem value="5">5 min</SelectItem>
											<SelectItem value="10">10 min</SelectItem>
											<SelectItem value="15">15 min</SelectItem>
											<SelectItem value="30">30 min</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</>
					)}

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

					<div className="space-y-2">
						<Label htmlFor="avail-rate">
							Hourly Rate{" "}
							<span className="text-xs text-muted-foreground font-normal">
								(optional — defaults to {isOnline ? "$75/hr" : "$100/hr"})
							</span>
						</Label>
						<div className="relative">
							<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								// id="avail-rate"
								type="number"
								min="0"
								step="0.01"
								placeholder={isOnline ? "75" : "100"}
								value={rate}
								onChange={(e) => setRate(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label htmlFor="recurring-toggle">Repeats</Label>
							<Switch
								// id="recurring-toggle"
								checked={recurring}
								onCheckedChange={setRecurring}
							/>
						</div>

						{recurring && (
							<div className="space-y-3 pl-0">
								<div className="space-y-2">
									<Label>Repeat Pattern</Label>
									<Select
										value={recurrencePattern}
										onValueChange={setRecurrencePattern}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="daily">Daily</SelectItem>
											<SelectItem value="weekly">Weekly</SelectItem>
											<SelectItem value="custom">Custom</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Days of Week</Label>
									<div className="flex gap-1.5">
										{DAYS_OF_WEEK.map((day) => (
											<button
												key={day.value}
												type="button"
												onClick={() => toggleDay(day.value)}
												className={`
													size-8 rounded-full text-xs font-medium transition-colors
													${
														selectedDays.includes(day.value)
															? "bg-primary text-primary-foreground"
															: "bg-muted/20 text-muted-foreground hover:bg-muted/40"
													}
												`}
											>
												{day.label}
											</button>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={closeAddAvailability}>
						Cancel
					</Button>
					<Button variant="gradient" onClick={handleSave}>
						Save Availability
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
