"use client";
import { Check, ChevronsUpDown } from "lucide-react";
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

export interface SearchableSelectOption {
	value: string;
	label: string;
}

interface SearchableSelectProps {
	options?: SearchableSelectOption[] | string[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	emptyText?: string;
	searchPlaceholder?: string;
	className?: string;
	disabled?: boolean;
	// New props for backend search
	useSearchHook?: (search: string) => {
		data: any;
		isLoading: boolean;
		error?: any;
	};
	dataExtractor?: (data: any) => SearchableSelectOption[] | string[];
	debounceMs?: number;
}

export function SearchableSelect({
	options = [],
	value,
	onValueChange,
	placeholder = "Select an option...",
	emptyText = "No option found.",
	searchPlaceholder = "Search...",
	className,
	disabled = false,
	useSearchHook,
	dataExtractor,
	debounceMs = 300,
}: SearchableSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [debouncedSearch, setDebouncedSearch] = React.useState("");

	// Debounce search query
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [searchQuery, debounceMs]);

	// Use the hook if provided
	const hookResult = useSearchHook?.(debouncedSearch);
	const isLoading = hookResult?.isLoading || false;

	// Extract data from hook result
	const backendOptions = React.useMemo(() => {
		if (!hookResult?.data) return [];
		if (dataExtractor) {
			return dataExtractor(hookResult.data);
		}
		// Default: assume data is array or has a data property
		const rawData = Array.isArray(hookResult.data)
			? hookResult.data
			: hookResult.data?.data || [];
		return rawData;
	}, [hookResult?.data, dataExtractor]);

	// Use backend options if hook is provided, otherwise use static options
	const displayOptions = useSearchHook ? backendOptions : options;

	// Normalize options to always have value/label structure
	const normalizedOptions: SearchableSelectOption[] = React.useMemo(() => {
		return displayOptions.map((option: any) => {
			if (typeof option === "string") {
				return { value: option, label: option };
			}
			return option;
		});
	}, [displayOptions]);

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
			<PopoverContent
				className="w-[var(--radix-popover-trigger-width)] p-0"
				align="start"
			>
				<Command shouldFilter={!useSearchHook}>
					<CommandInput
						placeholder={searchPlaceholder}
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						{isLoading ? (
							<CommandEmpty>Loading...</CommandEmpty>
						) : (
							<>
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
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
