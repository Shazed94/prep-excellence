// ConfirmationDialog.tsx

import type { ReactNode } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
	trigger: ReactNode;
	title?: string;
	description?: ReactNode;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	variant?: "default" | "destructive";
	isLoading?: boolean;
}

export function DeleteConfirmationDialog({
	trigger,
	title = "Are you sure?",
	description = "This action cannot be undone.",
	confirmText = "Continue",
	cancelText = "Cancel",
	onConfirm,
	variant = "default",
	isLoading = false,
}: DeleteConfirmationDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={(e) => {
							e.preventDefault();
							onConfirm();
						}}
						className={
							variant === "destructive"
								? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
								: ""
						}
						disabled={isLoading}
					>
						{isLoading ? "Processing..." : confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
