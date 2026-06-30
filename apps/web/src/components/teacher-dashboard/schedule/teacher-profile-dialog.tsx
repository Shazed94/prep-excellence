import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { OwnTeacherProfile } from "@/hooks/teacher";
import {
	useCreateTeacherProfile,
	useGetOwnTeacherProfile,
	useGetTeacherMe,
	useUpdateTeacherProfile,
} from "@/hooks/teacher";

const createTeacherProfileSchema = z.object({
	onlineHourlyRate: z.coerce
		.number()
		.min(0, "Online hourly rate must be non-negative"),
	offlineHourlyRate: z.coerce
		.number()
		.min(0, "Offline hourly rate must be non-negative"),
	timezone: z.string().default("UTC"),
	videoUrl: z.string().optional(),
	isAvailable: z.boolean().default(true),
	specializations: z
		.array(
			z.object({
				subject: z.string().min(1, "Subject is required"),
				level: z
					.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
					.default("INTERMEDIATE"),
				yearsExp: z.number().int().min(0).optional(),
				description: z.string().optional(),
			}),
		)
		.min(1, "Add at least one specialization"),
});

type TeacherProfileFormValues = z.infer<typeof createTeacherProfileSchema>;

const TIMEZONES = [
	"UTC",
	"America/New_York",
	"America/Chicago",
	"America/Denver",
	"America/Los_Angeles",
	"America/Toronto",
	"America/Vancouver",
	"Europe/London",
	"Europe/Paris",
	"Europe/Berlin",
	"Europe/Madrid",
	"Europe/Rome",
	"Europe/Amsterdam",
	"Asia/Dubai",
	"Asia/Kolkata",
	"Asia/Singapore",
	"Asia/Hong_Kong",
	"Asia/Tokyo",
	"Asia/Seoul",
	"Australia/Sydney",
	"Australia/Melbourne",
	"Pacific/Auckland",
];

const DIFFICULTY_LEVELS = [
	{ value: "BEGINNER", label: "Beginner" },
	{ value: "INTERMEDIATE", label: "Intermediate" },
	{ value: "ADVANCED", label: "Advanced" },
	{ value: "EXPERT", label: "Expert" },
] as const;

function profileToFormValues(
	profile?: OwnTeacherProfile,
): TeacherProfileFormValues {
	return {
		onlineHourlyRate: profile?.onlineHourlyRate ?? 0,
		offlineHourlyRate: profile?.offlineHourlyRate ?? 0,
		timezone: profile?.timezone ?? "UTC",
		videoUrl: profile?.videoUrl ?? "",
		isAvailable: profile?.isAvailable ?? true,
		specializations: profile?.specializations?.map((s) => ({
			subject: s.subject,
			level: s.level,
			yearsExp: s.yearsExp ?? undefined,
			description: s.description ?? undefined,
		})) ?? [{ subject: "", level: "INTERMEDIATE" as const }],
	};
}

interface TeacherProfileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TeacherProfileDialog({
	open,
	onOpenChange,
}: TeacherProfileDialogProps) {
	const { data: teacherMe } = useGetTeacherMe();
	const { data: profileRes, isLoading: profileLoading } =
		useGetOwnTeacherProfile(teacherMe?.id);

	const createProfile = useCreateTeacherProfile();
	const updateProfile = useUpdateTeacherProfile(teacherMe?.id);

	const isEditing = !!profileRes?.data?.id;
	const profileData = profileRes?.data;

	const form = useForm<TeacherProfileFormValues>({
		resolver: zodResolver(createTeacherProfileSchema as any),
		defaultValues: profileToFormValues(profileData),
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "specializations",
	});

	useEffect(() => {
		if (open && profileData) {
			form.reset(profileToFormValues(profileData));
		} else if (open && !profileData && !profileLoading) {
			form.reset(profileToFormValues(undefined));
		}
	}, [open, profileData, profileLoading, form]);

	const onSubmit = (values: TeacherProfileFormValues) => {
		const body = {
			onlineHourlyRate: values.onlineHourlyRate,
			offlineHourlyRate: values.offlineHourlyRate,
			timezone: values.timezone,
			videoUrl: values.videoUrl || undefined,
			isAvailable: values.isAvailable,
			specializations: values.specializations.map((s) => ({
				subject: s.subject,
				level: s.level,
				yearsExp: s.yearsExp || undefined,
				description: s.description || undefined,
			})),
		};

		if (isEditing) {
			updateProfile.mutate(body, { onSuccess: () => onOpenChange(false) });
		} else {
			createProfile.mutate(body as any, {
				onSuccess: () => onOpenChange(false),
			});
		}
	};

	const isSubmitting = createProfile.isPending || updateProfile.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<GraduationCap className="size-5 text-primary" />
						{isEditing ? "Update Your Profile" : "Create Your Profile"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update your one-to-one coaching profile. Students will see this information when booking sessions."
							: "Set up your one-to-one coaching profile to start accepting student bookings."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-3 py-2"
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="onlineHourlyRate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Online Hourly Rate ($)</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												step="0.01"
												placeholder="100.00"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="offlineHourlyRate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Offline Hourly Rate ($)</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												step="0.01"
												placeholder="100.00"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="timezone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Timezone</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select timezone" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{TIMEZONES.map((tz) => (
													<SelectItem key={tz} value={tz}>
														{tz.replace(/_/g, " ")}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isAvailable"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Availability</FormLabel>
										<div className="flex items-center gap-3 h-9">
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<span className="text-sm text-muted-foreground">
												{field.value
													? "Available for bookings"
													: "Not accepting bookings"}
											</span>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="videoUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Intro Video URL (optional)</FormLabel>
									<FormControl>
										<Input
											type="url"
											placeholder="https://youtube.com/watch?v=..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Separator />

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium">Specializations</h3>
									<p className="text-xs text-muted-foreground">
										Add the subjects and topics you teach
									</p>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => append({ subject: "", level: "INTERMEDIATE" })}
									className="gap-1"
								>
									<Plus className="size-3.5" />
									Add Subject
								</Button>
							</div>

							{fields.length === 0 && (
								<div className="rounded-lg border border-dashed p-6 text-center">
									<p className="text-sm text-muted-foreground">
										No specializations added yet. Click "Add Subject" to get
										started.
									</p>
								</div>
							)}

							{fields.map((field, index) => (
								<div
									key={field.id}
									className="rounded-lg border bg-card p-4 space-y-3 relative"
								>
									<div className="flex items-center justify-between">
										<Badge variant="secondary" className="text-xs">
											Subject #{index + 1}
										</Badge>
										{fields.length > 1 && (
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												onClick={() => remove(index)}
												className="text-destructive hover:text-destructive hover:bg-destructive/10"
											>
												<Trash2 className="size-4" />
											</Button>
										)}
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
										<FormField
											control={form.control}
											name={`specializations.${index}.subject`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs">Subject</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g. Mathematics, Physics, SAT Prep"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`specializations.${index}.level`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs">Level</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{DIFFICULTY_LEVELS.map((lvl) => (
																<SelectItem key={lvl.value} value={lvl.value}>
																	{lvl.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`specializations.${index}.yearsExp`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs">
														Years Experience (optional)
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															min="0"
															placeholder="e.g. 5"
															{...field}
															value={field.value ?? ""}
															onChange={(e) => {
																const val = e.target.value;
																field.onChange(
																	val === "" ? undefined : Number(val),
																);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name={`specializations.${index}.description`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-xs">
													Description (optional)
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Briefly describe what this specialization covers..."
														className="min-h-[60px] resize-y"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							))}

							{form.formState.errors.specializations?.root && (
								<p className="text-sm text-destructive">
									{form.formState.errors.specializations.root.message}
								</p>
							)}
						</div>

						<DialogFooter className="gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button type="submit" variant="gradient" disabled={isSubmitting}>
								{isSubmitting && <Loader2 className="size-4 animate-spin" />}
								{isEditing ? "Save Changes" : "Create Profile"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
