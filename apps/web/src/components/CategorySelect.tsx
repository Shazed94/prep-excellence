import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetCategories } from "@/hooks/course-management";

export function CategorySelect({ form }: any) {
	const { control, setValue } = useFormContext();
	const { data: categories, isLoading, isError } = useGetCategories();

	useEffect(() => {
		if (categories && categories.length > 0 && !form.getValues("categoryId")) {
			// set default to first category if none selected
			setValue("categoryId", categories[0].id);
		}
	}, [categories, setValue, form]);

	if (isLoading) return <p>Loading categories...</p>;
	if (isError) return <p>Failed to load categories</p>;

	return (
		<Controller
			name="categoryId"
			control={control}
			render={({ field }) => (
				<Select onValueChange={field.onChange} defaultValue={field.value}>
					<SelectTrigger className="h-11 border-2 border-slate-200">
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						{categories?.map((cat) => (
							<SelectItem key={cat.id} value={cat.id}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		/>
	);
}
