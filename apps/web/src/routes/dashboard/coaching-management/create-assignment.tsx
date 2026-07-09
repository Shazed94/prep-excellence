import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ArrowLeft,
	CalendarIcon,
	Edit3,
	FileText,
	Loader2,
	Plus,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateAssignment,
	useGetAssignmentByLesson,
	useUpdateAssignment,
} from "@/hooks/coaching";
import { cn } from "@/lib/utils";
import {
	type CoachingAssignmentFormValues,
	ZCCoachingAssignmentSchema,
} from "../../../lib/assignment-schema";

const assignmentSearchSchema = z.object({
	lessonId: z.string().min(1, "lessonId is required"),
	moduleId: z.string().optional(),
	courseTitle: z.string().optional(),
	moduleTitle: z.string().optional(),
	lessonTitle: z.string().optional(),
});

export const Route = createFileRoute(
	"/dashboard/coaching-management/create-assignment",
)({
	validateSearch: assignmentSearchSchema,
	component: CreateAssignmentPage,
});

function CreateAssignmentPage() {
	const navigate = useNavigate();
	const { lessonId, courseTitle, moduleTitle, lessonTitle } = Route.useSearch();

	const { data: existingData, isLoading: isLoadingExisting } =
		useGetAssignmentByLesson(lessonId);
	const { mutate: createAssignment, isPending: isCreating } =
		useCreateAssignment(lessonId);

	const existingAssignment = existingData?.data;
	const assignmentId = existingAssignment?.id;
	const { mutate: updateAssignment, isPending: isUpdating } =
		useUpdateAssignment(assignmentId);

	const isEditing = !!assignmentId;
	const isPending = isCreating || isUpdating;

	const form = useForm<CoachingAssignmentFormValues>({
		resolver: zodResolver(ZCCoachingAssignmentSchema) as any,
		defaultValues: {
			title: "",
			description: "",
			instructions: "",
			totalPoints: 100,
			allowLateSubmission: false,
			lateSubmissionPenalty: undefined,
			dueDate: undefined,
		},
	});

	useEffect(() => {
		if (existingAssignment) {
			form.reset({
				title: existingAssignment.title || "",
				description: existingAssignment.description || "",
				instructions: existingAssignment.instructions || "",
				totalPoints: existingAssignment.totalPoints ?? 100,
				allowLateSubmission: existingAssignment.allowLateSubmission ?? false,
				lateSubmissionPenalty:
					existingAssignment.lateSubmissionPenalty ?? undefined,
				dueDate: existingAssignment.dueDate
					? new Date(existingAssignment.dueDate)
					: undefined,
			});
		}
	}, [existingAssignment, form]);

	const allowLateSubmission = form.watch("allowLateSubmission");

	const onSubmit = (values: CoachingAssignmentFormValues) => {
		if (isEditing && assignmentId) {
			updateAssignment(values, {
				onSuccess: () => {
					toast.success("Assignment updated");
					navigate({ to: "/dashboard/coaching-management" });
				},
				onError: (error: any) => {
					toast.error(
						error?.response?.data?.message ?? "Couldn't update the assignment.",
					);
				},
			});
		} else {
			createAssignment(values, {
				onSuccess: () => {
					toast.success("Assignment created");
					form.reset();
					navigate({ to: "/dashboard/coaching-management" });
				},
				onError: (error: any) => {
					toast.error(
						error?.response?.data?.message ?? "Couldn't create the assignment.",
					);
				},
			});
		}
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

			<div className="flex items-center gap-3 mb-1">
				{isEditing ? (
					<Edit3 className="w-6 h-6 text-blue-600" />
				) : (
					<Plus className="w-6 h-6 text-blue-600" />
				)}
				<h1 className="text-2xl font-bold">
					{isEditing ? "Edit Assignment" : "Create Assignment"}
				</h1>
				{isEditing && (
					<Badge variant="secondary" className="text-xs">
						{existingAssignment?.totalPoints || "?"} pts
					</Badge>
				)}
			</div>

			{(courseTitle || moduleTitle || lessonTitle) && (
				<p className="mb-6 text-sm text-muted-foreground">
					{[courseTitle, moduleTitle, lessonTitle].filter(Boolean).join(" / ")}
				</p>
			)}

			{isLoadingExisting ? (
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			) : (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="Chapter 3 Practice Set" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="totalPoints"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Total Points</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={1}
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? undefined
															: Number(e.target.value),
													)
												}
											/>
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
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											className="resize-none"
											placeholder="Assignment description"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="instructions"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Instructions</FormLabel>
									<FormControl>
										<Textarea
											rows={5}
											placeholder="Instructions for students"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="dueDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Due Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													type="button"
													variant="outline"
													className={cn(
														"justify-start text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a due date</span>
													)}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) =>
													date < new Date(new Date().setHours(0, 0, 0, 0))
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>
										Leave empty if there is no deadline.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="allowLateSubmission"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={(checked) => {
													field.onChange(checked);
													if (!checked) {
														form.setValue("lateSubmissionPenalty", undefined);
													}
												}}
											/>
										</FormControl>
										<div>
											<FormLabel>Allow late submission</FormLabel>
											<FormDescription>
												Students may submit after the due date.
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							{allowLateSubmission && (
								<FormField
									control={form.control}
									name="lateSubmissionPenalty"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Late Penalty (%)</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={0}
													max={100}
													value={field.value ?? ""}
													onChange={(e) =>
														field.onChange(
															e.target.value === ""
																? undefined
																: Number(e.target.value),
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>

						<div className="flex items-center gap-3 pt-2">
							<Button type="submit" disabled={isPending} className="flex-1">
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{isEditing ? "Updating..." : "Creating..."}
									</>
								) : (
									<>
										{isEditing ? (
											<Edit3 className="mr-2 h-4 w-4" />
										) : (
											<FileText className="mr-2 h-4 w-4" />
										)}
										{isEditing ? "Update Assignment" : "Create Assignment"}
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}
