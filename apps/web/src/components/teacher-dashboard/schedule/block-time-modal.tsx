import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useScheduleStore } from "@/components/teacher-dashboard/schedule/store";
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
import { useAddAvailability, useGetTeacherMe } from "@/hooks/teacher";
import { cn } from "@/lib/utils";

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
	const { data: teacherMe } = useGetTeacherMe();
	const addAvail = useAddAvailability(teacherMe?.id);

	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [startTime, setStartTime] = useState("09:00");
	const [endTime, setEndTime] = useState("10:00");
	const [fullDay, setFullDay] = useState(false);
	const [reason, setReason] = useState("");
	const [customReason, setCustomReason] = useState("");

	useEffect(() => {
		if (blockTimeOpen) {
			setStartDate(new Date());
			setEndDate(new Date());
			setStartTime("09:00");
			setEndTime("10:00");
			setFullDay(false);
			setReason("");
			setCustomReason("");
		}
	}, [blockTimeOpen]);

	const handleSave = () => {
		if (!teacherMe?.id) return;

		const fmt = (d: Date) => format(d, "yyyy-MM-dd");
		const finalReason = reason === "other" ? customReason : reason;

		addAvail.mutate(
			{
				category: "BLOCKED",
				startDate: fmt(startDate),
				endDate: fmt(endDate),
				startTime,
				endTime,
				fullDay,
				reason: finalReason || "Blocked Time",
			},
			{
				onSuccess: () => closeBlockTime(),
			},
		);
	};

	const isSubmitting = addAvail.isPending;

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
				</div>

				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={closeBlockTime}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						variant="default"
						onClick={handleSave}
						disabled={isSubmitting}
						className="bg-gray-700 hover:bg-gray-800"
					>
						{isSubmitting && <Loader2 className="size-4 animate-spin mr-1" />}
						Block Time
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
