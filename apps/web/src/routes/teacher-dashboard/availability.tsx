/**
 * Teacher Dashboard – Availability Manager
 * Route: /teacher-dashboard/availability
 *
 * Add/edit/delete recurring weekly slots and one-time slots.
 * Students will see these as bookable times on the tutor page.
 */

import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarPlus,
	Clock,
	Loader2,
	Plus,
	RefreshCcw,
	Trash2,
} from "lucide-react";
import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type DayOfWeek,
	useAddAvailability,
	useDeleteAvailability,
	useGetOwnAvailability,
} from "@/hooks/teacher";
import { getUser } from "@/store/useAuth";

export const Route = createFileRoute("/teacher-dashboard/availability")({
	component: AvailabilityPage,
});

const DAYS: DayOfWeek[] = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
];

const dayLabel = (d: DayOfWeek) => d.charAt(0) + d.slice(1).toLowerCase();

function AvailabilityPage() {
	const id = useId();
	const user = getUser();
	const { data, isLoading } = useGetOwnAvailability(user?.id);
	const slots = data?.data ?? [];

	const { mutate: addSlot, isPending: adding } = useAddAvailability(user?.id);
	const { mutate: deleteSlot } = useDeleteAvailability();

	// Dialog state
	const [recurringOpen, setRecurringOpen] = useState(false);
	const [oneTimeOpen, setOneTimeOpen] = useState(false);

	// Recurring form
	const [rDay, setRDay] = useState<DayOfWeek>("MONDAY");
	const [rStart, setRStart] = useState("09:00");
	const [rEnd, setREnd] = useState("10:00");

	// One-time form
	const [oDate, setODate] = useState("");
	const [oStart, setOStart] = useState("09:00");
	const [oEnd, setOEnd] = useState("10:00");

	const recurring = slots.filter(
		(s) => s.availabilityType === "RECURRING_WEEKLY",
	);
	const oneTime = slots.filter((s) => s.availabilityType === "ONE_TIME_SLOT");

	const handleAddRecurring = () => {
		addSlot(
			{
				availabilityType: "RECURRING_WEEKLY",
				dayOfWeek: rDay,
				startTime: rStart,
				endTime: rEnd,
			},
			{
				onSuccess: () => {
					setRecurringOpen(false);
					setRDay("MONDAY");
					setRStart("09:00");
					setREnd("10:00");
				},
			},
		);
	};

	const handleAddOneTime = () => {
		if (!oDate) return;
		addSlot(
			{
				availabilityType: "ONE_TIME_SLOT",
				specificDate: oDate,
				specificStartTime: oStart,
				specificEndTime: oEnd,
			},
			{
				onSuccess: () => {
					setOneTimeOpen(false);
					setODate("");
					setOStart("09:00");
					setOEnd("10:00");
				},
			},
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-switzer font-bold">My Availability</h1>
					<p className="text-muted text-sm mt-0.5">
						Set when students can book 1-on-1 sessions with you
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						className="gap-1.5 text-xs"
						onClick={() => setRecurringOpen(true)}
					>
						<RefreshCcw size={13} /> Recurring
					</Button>
					<Button
						size="sm"
						className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
						onClick={() => setOneTimeOpen(true)}
					>
						<CalendarPlus size={13} /> One-time
					</Button>
				</div>
			</div>

			{/* Info Banner */}
			<div className="bg-primary/5 rounded-xl border border-primary/10 p-4">
				<p className="text-xs text-primary font-medium mb-1">
					How availability works
				</p>
				<p className="text-xs text-muted leading-relaxed">
					<strong>Recurring slots</strong> repeat every week on the selected day
					and time. <strong>One-time slots</strong> are specific dates. Students
					see these as bookable times when browsing your profile. Once a slot is
					booked it becomes unavailable to others.
				</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<Loader2 size={28} className="animate-spin text-primary" />
				</div>
			) : slots.length === 0 ? (
				<div className="flex flex-col items-center py-20 gap-4">
					<div className="w-20 h-20 rounded-2xl bg-primary/8 flex items-center justify-center">
						<Clock size={36} className="text-primary/40" />
					</div>
					<div className="text-center">
						<h3 className="font-switzer font-semibold">No slots set</h3>
						<p className="text-sm text-muted mt-1">
							Add recurring weekly slots or specific one-time dates.
						</p>
					</div>
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							className="gap-1.5"
							onClick={() => setRecurringOpen(true)}
						>
							<RefreshCcw size={13} /> Add Recurring
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90 gap-1.5"
							onClick={() => setOneTimeOpen(true)}
						>
							<Plus size={13} /> Add One-time
						</Button>
					</div>
				</div>
			) : (
				<Tabs defaultValue="recurring">
					<TabsList>
						<TabsTrigger value="recurring">
							Recurring ({recurring.length})
						</TabsTrigger>
						<TabsTrigger value="onetime">
							One-time ({oneTime.length})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="recurring" className="mt-4">
						{recurring.length === 0 ? (
							<p className="text-sm text-muted py-6 text-center">
								No recurring slots yet
							</p>
						) : (
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{recurring.map((slot) => (
									<div
										key={slot.id}
										className="bg-white rounded-xl border border-border/60 shadow-sm p-4 flex items-center gap-3"
									>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<Badge className="bg-primary/10 text-primary border-0 text-[10px]">
													{slot.dayOfWeek && dayLabel(slot.dayOfWeek)}
												</Badge>
												{slot.isBooked && (
													<Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
														Booked
													</Badge>
												)}
												{!slot.isActive && (
													<Badge className="bg-muted/20 text-muted border-0 text-[10px]">
														Inactive
													</Badge>
												)}
											</div>
											<p className="text-sm font-semibold mt-1.5 flex items-center gap-1.5">
												<Clock size={13} className="text-muted" />
												{slot.startTime} – {slot.endTime}
											</p>
										</div>
										{!slot.isBooked && (
											<button
												type="button"
												onClick={() => deleteSlot(slot.id)}
												className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
											>
												<Trash2 size={14} />
											</button>
										)}
									</div>
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="onetime" className="mt-4">
						{oneTime.length === 0 ? (
							<p className="text-sm text-muted py-6 text-center">
								No one-time slots yet
							</p>
						) : (
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{oneTime.map((slot) => (
									<div
										key={slot.id}
										className="bg-white rounded-xl border border-border/60 shadow-sm p-4 flex items-center gap-3"
									>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<Badge className="bg-violet-100 text-violet-700 border-0 text-[10px]">
													{slot.specificDate &&
														new Date(slot.specificDate).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															},
														)}
												</Badge>
												{slot.isBooked && (
													<Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
														Booked
													</Badge>
												)}
											</div>
											<p className="text-sm font-semibold mt-1.5 flex items-center gap-1.5">
												<Clock size={13} className="text-muted" />
												{slot.specificStartTime} – {slot.specificEndTime}
											</p>
										</div>
										{!slot.isBooked && (
											<button
												type="button"
												onClick={() => deleteSlot(slot.id)}
												className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
											>
												<Trash2 size={14} />
											</button>
										)}
									</div>
								))}
							</div>
						)}
					</TabsContent>
				</Tabs>
			)}

			{/* Recurring Dialog */}
			<Dialog open={recurringOpen} onOpenChange={setRecurringOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="font-switzer">
							Add Recurring Slot
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-1.5">
							<label htmlFor={`${id}-r-day`} className="text-sm font-medium">
								Day of Week
							</label>
							<Select
								value={rDay}
								onValueChange={(v) => setRDay(v as DayOfWeek)}
							>
								<SelectTrigger id={`${id}-r-day`} className="text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{DAYS.map((d) => (
										<SelectItem key={d} value={d}>
											{dayLabel(d)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<label
									htmlFor={`${id}-r-start`}
									className="text-sm font-medium"
								>
									Start Time
								</label>
								<Input
									id={`${id}-r-start`}
									type="time"
									value={rStart}
									onChange={(e) => setRStart(e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor={`${id}-r-end`} className="text-sm font-medium">
									End Time
								</label>
								<Input
									id={`${id}-r-end`}
									type="time"
									value={rEnd}
									onChange={(e) => setREnd(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setRecurringOpen(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90"
							onClick={handleAddRecurring}
							disabled={adding}
						>
							{adding ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Add Slot"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* One-time Dialog */}
			<Dialog open={oneTimeOpen} onOpenChange={setOneTimeOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="font-switzer">
							Add One-time Slot
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-1.5">
							<label htmlFor={`${id}-o-date`} className="text-sm font-medium">
								Date
							</label>
							<Input
								id={`${id}-o-date`}
								type="date"
								value={oDate}
								onChange={(e) => setODate(e.target.value)}
								min={new Date().toISOString().split("T")[0]}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<label
									htmlFor={`${id}-o-start`}
									className="text-sm font-medium"
								>
									Start Time
								</label>
								<Input
									id={`${id}-o-start`}
									type="time"
									value={oStart}
									onChange={(e) => setOStart(e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor={`${id}-o-end`} className="text-sm font-medium">
									End Time
								</label>
								<Input
									id={`${id}-o-end`}
									type="time"
									value={oEnd}
									onChange={(e) => setOEnd(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setOneTimeOpen(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90"
							onClick={handleAddOneTime}
							disabled={adding || !oDate}
						>
							{adding ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Add Slot"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
