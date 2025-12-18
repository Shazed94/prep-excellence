import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreateLMSDiscussionInput,
	createLMSDiscussionSchema,
} from "@prepexcellence/shared-validators";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDiscussion } from "@/hooks/lms-discussions";

interface DiscussionFormProps {
	lessonId: string;
	parentId?: string;
	onSuccess?: () => void;
	placeholder?: string;
	submitButtonText?: string;
}

export function DiscussionForm({
	lessonId,
	parentId,
	onSuccess,
	placeholder = "Share your thoughts or ask a question...",
	submitButtonText = "Post",
}: DiscussionFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createDiscussion = useCreateDiscussion();

	const form = useForm<CreateLMSDiscussionInput>({
		resolver: zodResolver(createLMSDiscussionSchema),
		defaultValues: {
			lessonId,
			parentId: parentId || undefined,
			content: "",
		},
	});

	const onSubmit = async (data: CreateLMSDiscussionInput) => {
		setIsSubmitting(true);
		try {
			await createDiscussion.mutateAsync(data);
			toast.success(
				parentId
					? "Reply posted successfully"
					: "Discussion posted successfully",
			);
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to post discussion");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{parentId ? "Your Reply" : "Start a Discussion"}
							</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder={placeholder}
									rows={4}
									className="resize-none"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => form.reset()}
						disabled={isSubmitting}
					>
						Clear
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Posting..." : submitButtonText}
					</Button>
				</div>
			</form>
		</Form>
	);
}
