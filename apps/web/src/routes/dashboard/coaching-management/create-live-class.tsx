import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateLiveClass,
	useGetLiveClass,
} from "@/hooks/coaching";

const liveClassSearchSchema = z.object({
	lessonId: z.string().min(1, "lessonId is required"),
	courseTitle: z.string().optional(),
	moduleTitle: z.string().optional(),
	lessonTitle: z.string().optional(),
});

export const Route = createFileRoute(
	"/dashboard/coaching-management/create-live-class",
)({
	validateSearch: liveClassSearchSchema,
	component: CreateLiveClassPage,
});

const liveClassFormSchema = z.object({
	provider: z.string().min(1, "Provider is required"),
	meetingUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
	meetingId: z.string().optional(),
	password: z.string().optional(),
	scheduledStartAt: z.string().min(1, "Start date/time is required"),
	durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute"),
	maxParticipants: z.coerce.number().min(0).optional(),
	isRecorded: z.boolean().default(false),
	description: z.string().optional(),
});

type LiveClassFormValues = z.infer<typeof liveClassFormSchema>;

function CreateLiveClassPage() {
	const navigate = useNavigate();
	const { lessonId, courseTitle, moduleTitle, lessonTitle } = Route.useSearch();

	const { data: existingLiveClass, isLoading: isLoadingExisting } =
		useGetLiveClass(lessonId);
	const { mutate: saveLiveClass, isPending } = useCreateLiveClass(lessonId);

	const form = useForm<LiveClassFormValues>({
		resolver: zodResolver(liveClassFormSchema as any),
		defaultValues: {
			provider: "GOOGLE_MEET",
			meetingUrl: "",
			meetingId: "",
			password: "",
			scheduledStartAt: "",
			durationMinutes: 60,
			maxParticipants: 100,
			isRecorded: false,
			description: "",
		},
	});

	useEffect(() => {
		if (existingLiveClass?.data) {
			const data = existingLiveClass.data;
			form.reset({
				provider: data.provider || "GOOGLE_MEET",
				meetingUrl: data.meetingUrl || "",
				meetingId: data.meetingId || "",
				password: data.password || "",
				scheduledStartAt: data.scheduledStartAt
					? new Date(data.scheduledStartAt).toISOString().slice(0, 16)
					: "",
				durationMinutes: data.durationMinutes || 60,
				maxParticipants: data.maxParticipants || 100,
				isRecorded: data.isRecorded ?? false,
				description: data.description || "",
			});
		}
	}, [existingLiveClass, form]);

	const provider = form.watch("provider");

	const onSubmit = (values: LiveClassFormValues) => {
		saveLiveClass(values, {
			onSuccess: () => {
				navigate({ to: "/dashboard/coaching-management" });
			},
		});
	};

	return (
		<div className="mx-auto max-w-3xl px-6 py-6">
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="mb-4 -ml-2"
				onClick={() => navigate({ to: "/dashboard/coaching-management" })}
			>
				<ArrowLeft className="mr-1 h-4 w-4" />
				Back
			</Button>

			<h1 className="mb-1 text-2xl font-bold">Manage Live Class</h1>

			{(courseTitle || moduleTitle || lessonTitle) && (
				<p className="mb-6 text-sm text-muted-foreground">
					{[courseTitle, moduleTitle, lessonTitle].filter(Boolean).join(" / ")}
				</p>
			)}

			{isLoadingExisting ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-6 w-6 animate-spin text-muted" />
				</div>
			) : (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="provider"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Meeting Provider</FormLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select provider" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="GOOGLE_MEET">
													Google Meet
												</SelectItem>
												<SelectItem value="ZOOM">Zoom</SelectItem>
												<SelectItem value="MICROSOFT_TEAMS">
													Microsoft Teams
												</SelectItem>
												<SelectItem value="OTHER">Other</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="scheduledStartAt"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Scheduled Start *</FormLabel>
										<FormControl>
											<Input type="datetime-local" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="meetingUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Meeting Link</FormLabel>
										<FormControl>
											<Input
												placeholder={
													provider === "GOOGLE_MEET"
														? "https://meet.google.com/..."
														: provider === "ZOOM"
															? "https://zoom.us/j/..."
															: "https://..."
												}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="meetingId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Meeting ID / Code</FormLabel>
										<FormControl>
											<Input placeholder="e.g., 123-456-789" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password (optional)</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Meeting password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="durationMinutes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Duration (minutes) *</FormLabel>
										<FormControl>
											<Input type="number" min={1} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="maxParticipants"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Max Participants</FormLabel>
										<FormControl>
											<Input type="number" min={0} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description (optional)</FormLabel>
									<FormControl>
										<Textarea
											rows={3}
											placeholder="Instructions or notes for students..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isRecorded"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div>
										<FormLabel>Record this session</FormLabel>
										<p className="text-sm text-muted-foreground">
											Students will be able to watch the recording later.
										</p>
									</div>
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isPending} className="w-full">
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								"Save Live Class"
							)}
						</Button>
					</form>
				</Form>
			)}
		</div>
	);
}
