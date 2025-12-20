"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

export interface SearchableSelectOption {
	value: string;
	label: string;
}

interface SearchableSelectProps {
	options: SearchableSelectOption[] | string[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	emptyText?: string;
	searchPlaceholder?: string;
	className?: string;
	disabled?: boolean;
}

export function SearchableSelect({
	options,
	value,
	onValueChange,
	placeholder = "Select an option...",
	emptyText = "No option found.",
	searchPlaceholder = "Search...",
	className,
	disabled = false,
}: SearchableSelectProps) {
	const [open, setOpen] = React.useState(false);

	// Normalize options to always have value/label structure
	const normalizedOptions: SearchableSelectOption[] = React.useMemo(() => {
		return options.map((option) => {
			if (typeof option === "string") {
				return { value: option, label: option };
			}
			return option;
		});
	}, [options]);

	const selectedOption = normalizedOptions.find(
		(option) => option.value === value,
	);

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
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyText}</CommandEmpty>
						<CommandGroup>
							{normalizedOptions.map((option) => (
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
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
