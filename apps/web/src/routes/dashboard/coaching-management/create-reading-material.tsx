import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileIcon, Loader2, Paperclip, Plus, Trash2, X } from "lucide-react";
import { useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	useAddLessonAttachments,
	useDeleteLessonAttachment,
	useGetLessonAttachments,
} from "@/hooks/coaching";

const searchSchema = z.object({
	lessonId: z.string().min(1, "lessonId is required"),
	courseTitle: z.string().optional(),
	moduleTitle: z.string().optional(),
	lessonTitle: z.string().optional(),
});

export const Route = createFileRoute(
	"/dashboard/coaching-management/create-reading-material",
)({
	validateSearch: searchSchema,
	component: RouteComponent,
});

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const materialItemSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, "Title is required")
		.max(150, "Title must be under 150 characters"),
	file: z
		.instanceof(File, { message: "Please choose a file" })
		.refine(
			(f) => f.size <= MAX_FILE_SIZE_BYTES,
			`File must be ${MAX_FILE_SIZE_MB}MB or smaller`,
		),
});

const formSchema = z.object({
	items: z
		.array(materialItemSchema)
		.min(1, "Add at least one reading material"),
});

export type ReadingMaterialFormValues = z.infer<typeof formSchema>;
type ReadingMaterialItem = z.infer<typeof materialItemSchema>;

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function getFileIcon(fileType: string): string {
	if (fileType.startsWith("image/")) return "🖼️";
	if (fileType.startsWith("video/")) return "🎬";
	if (fileType.includes("pdf")) return "📄";
	if (fileType.includes("spreadsheet") || fileType.includes("excel"))
		return "📊";
	if (fileType.includes("presentation") || fileType.includes("powerpoint"))
		return "📑";
	if (fileType.includes("word") || fileType.includes("document")) return "📝";
	return "📎";
}

const emptyItem: ReadingMaterialItem = {
	title: "" as unknown as string,
	file: undefined as unknown as File,
};

function RouteComponent() {
	const { lessonId, courseTitle, moduleTitle, lessonTitle } = Route.useSearch();
	const { mutate: addAttachments, isPending: isAdding } =
		useAddLessonAttachments(lessonId);
	const { mutate: deleteAttachment, isPending: isDeleting } =
		useDeleteLessonAttachment(lessonId);
	const { data: existingData, isLoading: isLoadingExisting } =
		useGetLessonAttachments(lessonId);

	const existingAttachments = existingData?.data || [];

	const {
		control,
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<ReadingMaterialFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { items: [emptyItem] },
		mode: "onSubmit",
	});

	const navigate = useNavigate();
	const { fields, append, remove } = useFieldArray({ control, name: "items" });

	const onSubmit = (values: ReadingMaterialFormValues) => {
		addAttachments(values.items, {
			onSuccess: () => {
				reset({ items: [emptyItem] });
			},
		});
	};

	return (
		<div className="mx-auto max-w-3xl px-6 py-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold">Reading Materials</h1>
					{(courseTitle || moduleTitle || lessonTitle) && (
						<p className="mt-1 text-sm text-muted-foreground">
							{[courseTitle, moduleTitle, lessonTitle]
								.filter(Boolean)
								.join(" / ")}
						</p>
					)}
				</div>
				<Button
					type="button"
					variant="outline"
					onClick={() => navigate({ to: "/dashboard/coaching-management" })}
				>
					Back
				</Button>
			</div>

			{isLoadingExisting ? (
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			) : (
				<div className="space-y-8">
					{/* Existing Attachments */}
					{existingAttachments.length > 0 && (
						<div>
							<h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
								<Paperclip className="w-4 h-4" />
								Existing Materials ({existingAttachments.length})
							</h2>
							<div className="space-y-2">
								{existingAttachments.map((att: any) => (
									<div
										key={att.id}
										className="flex items-center justify-between p-3 border rounded-lg bg-muted/5"
									>
										<div className="flex items-center gap-3 min-w-0">
											<span className="text-lg shrink-0">
												{getFileIcon(att.fileType || "")}
											</span>
											<div className="min-w-0">
												<p className="text-sm font-medium truncate">
													{att.title}
												</p>
												<p className="text-xs text-muted-foreground">
													{att.fileType || "Unknown type"}
													{att.fileSize
														? ` · ${formatBytes(att.fileSize)}`
														: ""}
												</p>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => deleteAttachment(att.id)}
											disabled={isDeleting}
											className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Add New Materials */}
					<div>
						<h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
							<Plus className="w-4 h-4" />
							Add New Materials
						</h2>

						<form
							onSubmit={handleSubmit(onSubmit)}
							noValidate
							className="space-y-5"
						>
							{fields.map((field, index) => (
								<ReadingMaterialRow
									key={field.id}
									index={index}
									control={control}
									register={register}
									setValue={setValue}
									error={errors.items?.[index]}
									disabled={isAdding}
									onRemove={
										fields.length > 1 && !isAdding
											? () => remove(index)
											: undefined
									}
								/>
							))}

							{errors.items?.root && (
								<p className="text-xs text-red-600">
									{errors.items.root.message}
								</p>
							)}
							{errors.items && !Array.isArray(errors.items) && (
								<p className="text-xs text-red-600">
									{errors.items.message as string}
								</p>
							)}

							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={() => append(emptyItem)}
									disabled={isAdding}
									className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
								>
									<Plus className="h-4 w-4" />
									Add more
								</button>

								<button
									type="submit"
									disabled={isAdding}
									className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
									{isAdding ? "Uploading..." : "Upload Materials"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

function ReadingMaterialRow({
	index,
	control,
	register,
	setValue,
	error,
	disabled,
	onRemove,
}: {
	index: number;
	control: ReturnType<typeof useForm<ReadingMaterialFormValues>>["control"];
	register: ReturnType<typeof useForm<ReadingMaterialFormValues>>["register"];
	setValue: ReturnType<typeof useForm<ReadingMaterialFormValues>>["setValue"];
	error?: { title?: { message?: string }; file?: { message?: string } };
	disabled?: boolean;
	onRemove?: () => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const titleId = `title-${index}`;
	const fileId = `file-${index}`;

	return (
		<div className="flex items-start gap-2">
			<div className="grid flex-1 grid-cols-[60%_40%] gap-3">
				<div>
					<Label
						htmlFor={titleId}
						className="mb-1.5 block text-sm font-medium text-slate-700"
					>
						Title
					</Label>
					<Input
						id={titleId}
						type="text"
						placeholder="e.g. Chapter 4 — Photosynthesis notes"
						disabled={disabled}
						{...register(`items.${index}.title` as const)}
						className={
							error?.title ? "border-red-400 focus-visible:ring-red-400" : ""
						}
					/>
					{error?.title && (
						<p className="mt-1 text-xs text-red-600">{error.title.message}</p>
					)}
				</div>

				<Controller
					control={control}
					name={`items.${index}.file` as const}
					render={({ field }) => (
						<div>
							<Label
								htmlFor={fileId}
								className="mb-1.5 block text-sm font-medium text-slate-700"
							>
								File attachment
							</Label>
							<button
								id={fileId}
								type="button"
								disabled={disabled}
								onClick={() => inputRef.current?.click()}
								className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
									error?.file
										? "border-red-400 text-red-600"
										: "border-slate-300 text-slate-600 hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-600"
								}`}
							>
								<Paperclip className="h-4 w-4 shrink-0" />
								{field.value ? (
									<span className="truncate">{field.value.name}</span>
								) : (
									"Choose file"
								)}
							</button>
							<input
								ref={inputRef}
								type="file"
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file)
										setValue(`items.${index}.file`, file, {
											shouldValidate: true,
										});
									e.target.value = "";
								}}
							/>
							{error?.file && (
								<p className="mt-1 text-xs text-red-600">
									{error.file.message}
								</p>
							)}
							{field.value && (
								<p className="mt-1 text-xs text-slate-400">
									{formatBytes(field.value.size)}
								</p>
							)}
						</div>
					)}
				/>
			</div>

			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					aria-label="Remove item"
					className="mt-8 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
