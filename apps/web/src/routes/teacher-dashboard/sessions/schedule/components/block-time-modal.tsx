import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "../store";

const REASONS = [
	"Personal Appointment",
	"Holiday",
	"Admin Time",
	"Doctor's Appointment",
	"Family Commitment",
	"Professional Development",
	"Other",
];

export function BlockTimeModal() {
	const { blockTimeOpen, closeBlockTime } = useScheduleStore();
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [startTime, setStartTime] = useState("09:00");
	const [endTime, setEndTime] = useState("10:00");
	const [fullDay, setFullDay] = useState(false);
	const [reason, setReason] = useState("");
	const [recurring, setRecurring] = useState(false);
	const [recurrencePattern, setRecurrencePattern] = useState("weekly");
	const [customReason, setCustomReason] = useState("");

	const handleSave = () => {
		closeBlockTime();
	};

	return (
		<Dialog open={blockTimeOpen} onOpenChange={closeBlockTime}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Block Time</DialogTitle>
					<DialogDescription>
						Block out time on your schedule for personal appointments, holidays,
						or admin work.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5 py-2">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Start Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className={cn(
											"w-full justify-start text-left font-normal",
											!startDate && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="size-3.5 mr-1.5" />
										{startDate ? format(startDate, "MMM d, yyyy") : "Pick date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-auto p-0">
									<Calendar
										mode="single"
										selected={startDate}
										onSelect={(d) => d && setStartDate(d)}
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2">
							<Label>End Date</Label>
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
										{endDate ? format(endDate, "MMM d, yyyy") : "Pick date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-auto p-0">
									<Calendar
										mode="single"
										selected={endDate}
										onSelect={(d) => d && setEndDate(d)}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<Label htmlFor="full-day">Full Day</Label>
						<Switch checked={fullDay} onCheckedChange={setFullDay} />
					</div>

					{!fullDay && (
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="block-start">Start Time</Label>
								<Input
									type="time"
									value={startTime}
									onChange={(e) => setStartTime(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="block-end">End Time</Label>
								<Input
									type="time"
									value={endTime}
									onChange={(e) => setEndTime(e.target.value)}
								/>
							</div>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="block-reason">Reason</Label>
						<Select value={reason} onValueChange={setReason}>
							<SelectTrigger>
								<SelectValue placeholder="Select a reason" />
							</SelectTrigger>
							<SelectContent>
								{REASONS.map((r) => (
									<SelectItem
										key={r}
										value={r.toLowerCase().replace(/\s+/g, "-")}
									>
										{r}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{reason === "other" && (
							<Textarea
								placeholder="Describe the reason..."
								value={customReason}
								onChange={(e) => setCustomReason(e.target.value)}
								className="mt-2 h-20"
							/>
						)}
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label htmlFor="block-recurring">Repeats</Label>
							<Switch
								// id="block-recurring"
								checked={recurring}
								onCheckedChange={setRecurring}
							/>
						</div>

						{recurring && (
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
										<SelectItem value="weekdays">Weekdays</SelectItem>
										<SelectItem value="custom">Custom</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={closeBlockTime}>
						Cancel
					</Button>
					<Button
						variant="default"
						onClick={handleSave}
						className="bg-gray-700 hover:bg-gray-800"
					>
						Block Time
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
