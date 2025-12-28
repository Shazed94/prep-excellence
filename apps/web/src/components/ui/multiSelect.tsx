"use client";
import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
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

export interface SearchableSelectOption {
	value: string;
	label: string;
}

interface MultiSearchableSelectProps {
	options: SearchableSelectOption[] | string[];
	value?: string[];
	onValueChange?: (value: string[]) => void;
	placeholder?: string;
	emptyText?: string;
	searchPlaceholder?: string;
	className?: string;
	disabled?: boolean;
	loading?: boolean;
	onSearchChange?: (search: string) => void;
	debounceMs?: number;
	maxSelected?: number;
}

export function MultiSearchableSelect({
	options,
	value = [],
	onValueChange,
	placeholder = "Select options...",
	emptyText = "No option found.",
	searchPlaceholder = "Search...",
	className,
	disabled = false,
	loading = false,
	onSearchChange,
	debounceMs = 300,
	maxSelected,
}: MultiSearchableSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");

	// Debounce search and notify parent
	React.useEffect(() => {
		if (!onSearchChange) return;

		const timer = setTimeout(() => {
			onSearchChange(searchQuery);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [searchQuery, onSearchChange, debounceMs]);

	// Normalize options to always have value/label structure
	const normalizedOptions: SearchableSelectOption[] = React.useMemo(() => {
		return options.map((option) => {
			if (typeof option === "string") {
				return { value: option, label: option };
			}
			return option;
		});
	}, [options]);

	const selectedOptions = normalizedOptions.filter((option) =>
		value.includes(option.value),
	);

	const handleSelect = (selectedValue: string) => {
		const newValue = value.includes(selectedValue)
			? value.filter((v) => v !== selectedValue)
			: maxSelected && value.length >= maxSelected
				? value
				: [...value, selectedValue];

		onValueChange?.(newValue);
	};

	const handleRemove = (valueToRemove: string, e: React.MouseEvent) => {
		e.stopPropagation();
		onValueChange?.(value.filter((v) => v !== valueToRemove));
	};

	const handleClearAll = (e: React.MouseEvent) => {
		e.stopPropagation();
		onValueChange?.([]);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-full justify-between min-h-11 h-auto",
						!value.length && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
				>
					<div className="flex flex-wrap gap-1 flex-1">
						{selectedOptions.length > 0 ? (
							selectedOptions.map((option) => (
								<Badge key={option.value} variant="secondary" className="mr-1">
									{option.label}
									<button
										type="button"
										className="ml-1 cursor-pointer rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleRemove(option.value, e as any);
											}
										}}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onClick={(e) => handleRemove(option.value, e)}
									>
										<X className="h-3 w-3  text-muted-foreground hover:text-foreground" />
									</button>
								</Badge>
							))
						) : (
							<span>{placeholder}</span>
						)}
					</div>
					<div className="flex items-center gap-1 ml-2">
						{selectedOptions.length > 0 && (
							<button
								type="button"
								onClick={handleClearAll}
								className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 "
							>
								<X className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" />
							</button>
						)}
						<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[var(--radix-popover-trigger-width)] p-0 "
				align="start"
			>
				<Command shouldFilter={!onSearchChange}>
					<CommandInput
						placeholder={searchPlaceholder}
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						{loading ? (
							<CommandEmpty>Loading...</CommandEmpty>
						) : (
							<>
								<CommandEmpty>{emptyText}</CommandEmpty>
								<CommandGroup>
									{normalizedOptions.map((option) => {
										const isSelected = value.includes(option.value);
										const isDisabled =
											!isSelected &&
											maxSelected !== undefined &&
											value.length >= maxSelected;

										return (
											<CommandItem
												key={option.value}
												value={option.value}
												onSelect={handleSelect}
												disabled={isDisabled}
												className={cn(
													isDisabled && "opacity-50 cursor-not-allowed",
												)}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														isSelected ? "opacity-100" : "opacity-0",
													)}
												/>
												{option.label}
											</CommandItem>
										);
									})}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
