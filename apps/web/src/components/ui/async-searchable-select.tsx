"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface AsyncSearchableSelectOption {
	value: string;
	label: string;
}

interface AsyncSearchableSelectProps {
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	emptyText?: string;
	searchPlaceholder?: string;
	className?: string;
	disabled?: boolean;
	isLoading?: boolean;
	options: AsyncSearchableSelectOption[];
	onSearchChange?: (search: string) => void;
	debounceMs?: number;
}

export function AsyncSearchableSelect({
	value,
	onValueChange,
	placeholder = "Select an option...",
	emptyText = "No option found.",
	searchPlaceholder = "Search...",
	className,
	disabled = false,
	isLoading = false,
	options,
	onSearchChange,
	debounceMs = 300,
}: AsyncSearchableSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");
	const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const selectedOption = options.find((option) => option.value === value);

	// Debounced search handler
	const handleSearchChange = React.useCallback(
		(search: string) => {
			setSearchValue(search);

			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			searchTimeoutRef.current = setTimeout(() => {
				onSearchChange?.(search);
			}, debounceMs);
		},
		[onSearchChange, debounceMs],
	);

	// Cleanup timeout on unmount
	React.useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	// Reset search when popover closes
	React.useEffect(() => {
		if (!open) {
			setSearchValue("");
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		}
	}, [open]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-full justify-between",
						!value && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
				>
					<span className="truncate">
						{selectedOption
							? selectedOption?.label?.length > 30
								? `${selectedOption?.label?.slice(0,30)}...`
								: selectedOption?.label
							: placeholder}
					</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[var(--radix-popover-trigger-width)] p-0"
				align="start"
			>
				<Command shouldFilter={false}>
					<CommandInput
						placeholder={searchPlaceholder}
						value={searchValue}
						onValueChange={handleSearchChange}
					/>
					<CommandList>
						{isLoading ? (
							<div className="flex items-center justify-center py-6">
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
								<span className="ml-2 text-sm text-muted-foreground">
									Loading...
								</span>
							</div>
						) : options.length === 0 ? (
							<CommandEmpty>{emptyText}</CommandEmpty>
						) : (
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={(currentValue) => {
											onValueChange?.(
												currentValue === value ? "" : currentValue,
											);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === option.value ? "opacity-100" : "opacity-0",
											)}
										/>
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
