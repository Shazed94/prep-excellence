import { DollarSign, Info, MapPin, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useScheduleStore } from "@/components/teacher-dashboard/schedule/store";
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
import {
	useGetOwnTeacherProfile,
	useGetTeacherMe,
	useUpdateTeacherProfile,
} from "@/hooks/teacher";

export function ManageRatesModal() {
	const { manageRatesOpen, closeManageRates } = useScheduleStore();
	const { data: teacherMe } = useGetTeacherMe();
	const { data: profileRes } = useGetOwnTeacherProfile(teacherMe?.id);
	const updateProfile = useUpdateTeacherProfile(teacherMe?.id);

	const profileData = profileRes?.data;
	const [onlineRate, setOnlineRate] = useState("0");
	const [inPersonRate, setInPersonRate] = useState("0");

	useEffect(() => {
		if (manageRatesOpen && profileData) {
			setOnlineRate(String(profileData.onlineHourlyRate));
			setInPersonRate(String(profileData.offlineHourlyRate));
		}
	}, [manageRatesOpen, profileData]);

	const handleSave = () => {
		updateProfile.mutate(
			{
				onlineHourlyRate: Number.parseFloat(onlineRate) || 0,
				offlineHourlyRate: Number.parseFloat(inPersonRate) || 0,
			},
			{ onSuccess: () => closeManageRates() },
		);
	};

	const onlineNum = Number.parseFloat(onlineRate) || 0;
	const inPersonNum = Number.parseFloat(inPersonRate) || 0;

	return (
		<Dialog open={manageRatesOpen} onOpenChange={closeManageRates}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<DollarSign className="size-4 text-primary" />
						Manage Hourly Rates
					</DialogTitle>
					<DialogDescription>
						Set your hourly booking rates. Online and in-person sessions can
						have different pricing.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5 py-2">
					<div className="rounded-lg border bg-blue-50/50 border-blue-100 p-4">
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
								<Video className="size-5 text-blue-600" />
							</div>
							<div className="flex-1">
								<Label
									htmlFor="online-rate"
									className="text-sm font-semibold text-foreground"
								>
									Online Sessions
								</Label>
								<p className="text-xs text-muted-foreground mt-0.5">
									Per hour rate for video call sessions
								</p>
							</div>
						</div>
						<div className="relative mt-3">
							<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								type="number"
								min="0"
								step="0.01"
								placeholder="75.00"
								value={onlineRate}
								onChange={(e) => setOnlineRate(e.target.value)}
								className="pl-9 h-11 text-lg font-semibold"
							/>
						</div>
						{onlineNum > 0 && (
							<p className="text-xs text-muted-foreground mt-1.5">
								30 min session = ${(onlineNum / 2).toFixed(2)} · 45 min = $
								{((onlineNum / 60) * 45).toFixed(2)} · 60 min = $
								{onlineNum.toFixed(2)}
							</p>
						)}
					</div>

					<div className="rounded-lg border bg-amber-50/50 border-amber-100 p-4">
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
								<MapPin className="size-5 text-amber-600" />
							</div>
							<div className="flex-1">
								<Label
									htmlFor="inperson-rate"
									className="text-sm font-semibold text-foreground"
								>
									In-Person Sessions
								</Label>
								<p className="text-xs text-muted-foreground mt-0.5">
									Per hour rate for face-to-face sessions
								</p>
							</div>
						</div>
						<div className="relative mt-3">
							<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								type="number"
								min="0"
								step="0.01"
								placeholder="100.00"
								value={inPersonRate}
								onChange={(e) => setInPersonRate(e.target.value)}
								className="pl-9 h-11 text-lg font-semibold"
							/>
						</div>
						{inPersonNum > 0 && (
							<p className="text-xs text-muted-foreground mt-1.5">
								30 min session = ${(inPersonNum / 2).toFixed(2)} · 45 min = $
								{((inPersonNum / 60) * 45).toFixed(2)} · 60 min = $
								{inPersonNum.toFixed(2)}
							</p>
						)}
					</div>

					<div className="flex items-start gap-2 rounded-lg bg-muted/20 p-3">
						<Info className="size-4 text-primary shrink-0 mt-0.5" />
						<p className="text-xs text-muted-foreground">
							These are your default rates. You can override the rate per
							session when adding specific availability slots. Changes apply to
							new bookings only.
						</p>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={closeManageRates}>
						Cancel
					</Button>
					<Button variant="gradient" onClick={handleSave}>
						Save Rates
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
