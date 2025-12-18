"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BaseItem } from "./lib-data/types";

interface DeleteDialogProps<T extends BaseItem> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	item: T | null;
	tabLabel: string;
	onConfirm: () => void;
}

export function DeleteDialog<T extends BaseItem>({
	open,
	onOpenChange,
	item,
	tabLabel,
	onConfirm,
}: DeleteDialogProps<T>) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader className="space-y-4">
					<AlertDialogTitle className="text-center text-xl">
						Delete {tabLabel}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center space-y-2">
						<p>Are you sure you want to delete</p>
						<p className="font-semibold text-foreground text-lg px-4 py-2 bg-muted/10 rounded-lg">
							{item?.name}
						</p>
						<p className="text-sm">
							This action cannot be undone and will permanently remove this
							item.
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="">
					<AlertDialogCancel className="hover:bg-muted">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl transition-all duration-200"
					>
						Delete Permanently
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
