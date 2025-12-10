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
import { BaseItem } from "./lib-data/types";

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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Delete {tabLabel}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-2">
            <p>Are you sure you want to delete</p>
            <p className="font-semibold text-foreground text-lg px-4 py-2 bg-muted rounded-lg">
              {item?.name}
            </p>
            <p className="text-sm">
              This action cannot be undone and will permanently remove this
              item.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
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
