"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	useGetDomains,
	useGetSubjects,
	useGetTestTypes,
} from "@/hooks/sat-practice";
import { SearchableSelect } from "../ui/searchable-select";
import type { BaseItem, TabType } from "./lib-data/types";

const baseSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name too long"),
	description: z.string().max(500, "Description too long").optional(),
});

const subjectSchema = baseSchema.extend({
	testTypeId: z.string().min(1, "Test type is required"),
});

const difficultySchema = baseSchema.extend({
	level: z.coerce
		.number()
		.int()
		.min(1, "Level must be at least 1")
		.max(10, "Level must be at most 10"),
});

const qtyTypeSchema = baseSchema.extend({
	minValue: z.coerce.number().int().min(0, "Min value must be at least 0"),
	maxValue: z.coerce.number().int().min(1, "Max value must be at least 1"),
});

function getSchema(tabType: TabType) {
	switch (tabType) {
		case "difficulty":
			return difficultySchema;
		case "qty-type":
			return qtyTypeSchema;
		case "subject":
			return subjectSchema;
		default:
			return baseSchema;
	}
}

function getDefaultValues(tabType: TabType) {
	const base = { name: "", description: "" };
	switch (tabType) {
		case "difficulty":
			return { ...base, level: 1 };
		case "subject":
			return { ...base, testTypeId: "" };
		default:
			return base;
	}
}

interface ItemDialogProps<T extends BaseItem> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	item: T | null;
	tabType: TabType;
	tabLabel: string;
	onSave: (data: Partial<T>) => void;
}

export function ItemDialog<T extends BaseItem>({
	open,
	onOpenChange,
	item,
	tabType,
	tabLabel,
	onSave,
}: ItemDialogProps<T>) {
	const schema = getSchema(tabType);
	type FormValues = z.infer<typeof schema>;
	const [subjectSearch, setSubjectSearch] = useState("");
	const [testTypeSearch, setTestTypeSearch] = useState("");
	const [domainSearch, setDomainSearch] = useState("");

	const { data: testTypesData, isLoading: testTypesLoading } = useGetTestTypes({
		search: testTypeSearch,
		limit: 50,
	});

	// Call hooks at the top level
	const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjects({
		limit: 100,
		search: subjectSearch,
	});

	const { data: domainsData, isLoading: domainsLoading } = useGetDomains({
		limit: 100,
		search: domainSearch,
	});

	// Extract and memoize options
	const subjectOptions = useMemo(
		() =>
			subjectsData?.data?.map((item: any) => ({
				value: item.id,
				label: item.name,
			})) || [],
		[subjectsData],
	);
	const testTypeOptions = useMemo(
		() =>
			testTypesData?.data?.map((item: any) => ({
				value: item.id,
				label: item.name,
			})) || [],
		[testTypesData],
	);
	const domainOptions = useMemo(
		() =>
			domainsData?.data?.map((item: any) => ({
				value: item.id,
				label: item.name,
			})) || [],
		[domainsData],
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: getDefaultValues(tabType) as FormValues,
	});

	useEffect(() => {
		if (open) {
			if (item) {
				// Editing: populate with item data
				const resetData = {
					name: item.name || "",
					description: (item as { description?: string }).description || "",
					...(tabType === "difficulty" && {
						level: (item as { level?: number }).level || 1,
					}),
					...(tabType === "qty-type" && {
						minValue: (item as { minValue?: number }).minValue || 0,
						maxValue: (item as { maxValue?: number }).maxValue || 10,
					}),
				};
				form.reset(resetData as FormValues);
			} else {
				// Creating: reset to defaults
				form.reset(getDefaultValues(tabType) as FormValues);
			}
		}
	}, [open, item, tabType, form]);

	const onSubmit = (data: FormValues) => {
		onSave(data as unknown as Partial<T>);
		onOpenChange(false);
		form.reset(getDefaultValues(tabType) as FormValues);
	};

	const handleCancel = () => {
		onOpenChange(false);
		form.reset(getDefaultValues(tabType) as FormValues);
	};

	const isEditing = !!item;

	return (
		<Dialog
			open={open}
			onOpenChange={(newOpen) => {
				if (!newOpen) {
					form.reset(getDefaultValues(tabType) as FormValues);
				}
				onOpenChange(newOpen);
			}}
		>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader className="space-y-3 pb-4 border-b">
					<div className="flex items-center gap-3">
						<div>
							<DialogTitle className="text-2xl font-bold">
								{isEditing ? `Edit ${tabLabel}` : `Create ${tabLabel}`}
							</DialogTitle>
							<DialogDescription className="text-sm">
								{isEditing
									? `Update the details for this ${tabLabel.toLowerCase()}.`
									: `Add a new ${tabLabel.toLowerCase()} to your list.`}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-5 pt-2"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold">
										Name *
									</FormLabel>
									<FormControl>
										<Input
											placeholder={`Enter ${tabLabel.toLowerCase()} name`}
											{...field}
											className="h-11 border-2 focus-visible:ring-2"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{tabType === "subject" && (
							<FormField
								control={form.control}
								name="testTypeId"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-semibold">
											Test Type *
										</FormLabel>
										<FormControl>
											<SearchableSelect
												value={field.value}
												onValueChange={field.onChange}
												options={testTypeOptions}
												loading={testTypesLoading}
												onSearchChange={setTestTypeSearch}
												emptyText="No test type found."
												placeholder="Select test type..."
												searchPlaceholder="Search test types..."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{tabType === "domain" && (
							<FormField
								control={form.control}
								name="subjectId"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-semibold">
											Subject *
										</FormLabel>
										<FormControl>
											<SearchableSelect
												value={field.value}
												onValueChange={field.onChange}
												options={subjectOptions}
												loading={subjectsLoading}
												onSearchChange={setSubjectSearch}
												emptyText="No subject found."
												placeholder="Select subject..."
												searchPlaceholder="Search subjects..."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{tabType === "skills" && (
							<FormField
								control={form.control}
								name="domainId"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-semibold">
											Domain *
										</FormLabel>
										<FormControl>
											<SearchableSelect
												value={field.value}
												onValueChange={field.onChange}
												options={domainOptions}
												loading={domainsLoading}
												onSearchChange={setDomainSearch}
												emptyText="No domain found."
												placeholder="Select domain..."
												searchPlaceholder="Search domains..."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold">
										Description
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Optional description"
											className="resize-none min-h-[100px] border-2 focus-visible:ring-2"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{tabType === "difficulty" && (
							<FormField
								control={form.control}
								name={"level" as keyof FormValues}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Level (1-10)</FormLabel>
										<FormControl>
											<Input type="number" min={1} max={10} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{tabType === "qty-type" && (
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name={"minValue" as keyof FormValues}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Min Value</FormLabel>
											<FormControl>
												<Input type="number" min={0} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={"maxValue" as keyof FormValues}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Max Value</FormLabel>
											<FormControl>
												<Input type="number" min={1} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}

						<DialogFooter className=" pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								className="hover:bg-muted"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="shadow-lg hover:shadow-xl transition-all duration-200"
							>
								{isEditing ? "Save Changes" : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
