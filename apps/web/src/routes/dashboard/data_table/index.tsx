import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { useGetCollegeAdmissions } from "@/hooks/college-admissions";
import { type DemoPost, useDemoPosts } from "@/integrations/demo/hooks";

export const Route = createFileRoute("/dashboard/data_table/")({
	component: RouteComponent,
});

// Custom debounce hook
function useDebounce(value: string, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

function RouteComponent() {
	// State for pagination and search
	const [searchTerm, setSearchTerm] = useState("");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	// Stable callback to prevent infinite loops
	// Handles both direct value and updater function patterns
	const handlePaginationChange = useCallback((updaterOrValue: any) => {
		setPagination((prev) => {
			if (typeof updaterOrValue === "function") {
				return updaterOrValue(prev);
			}
			return updaterOrValue;
		});
	}, []);

	const [sortBy] = useState<"id" | "title" | "userId">("id");
	const [orderBy] = useState<"asc" | "desc">("desc");

	// Debounce search term to avoid excessive API calls
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	// Fetch data using the backend-supported hook
	const {
		data: apiResponse,
		isLoading,
		error,
	} = useDemoPosts({
		page: pagination.pageIndex + 1, // API uses 1-based indexing
		limit: pagination.pageSize,
		search: debouncedSearchTerm,
		sortBy,
		orderBy,
	});

	const {
		data: admissionData,
		isLoading: admissionLoading,
		error: admissionError,
	} = useGetCollegeAdmissions();

	console.log("admissionData", admissionData);

	console.log("Demo posts data:", apiResponse);

	// Define columns for the data table with proper typing
	const columns: ColumnDef<DemoPost>[] = [
		{
			accessorKey: "id",
			header: "ID",
		},
		{
			accessorKey: "userId",
			header: "User ID",
		},
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "body",
			header: "Body",
			cell: ({ row }) => {
				const body = row.getValue("body") as string;
				// Truncate long text
				return (
					<div className="max-w-md truncate" title={body}>
						{body}
					</div>
				);
			},
		},
	];

	const addButton = () => {
		return (
			<button
				type="button"
				className="bg-[#0086c5] hover:bg-[#0086c5]/90 text-white px-4 py-2 rounded-md"
			>
				Add Post
			</button>
		);
	};

	// Handle loading state
	if (isLoading && !apiResponse) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg">Loading posts...</div>
			</div>
		);
	}

	// Handle error state
	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-red-500">
					Error loading posts: {error.message}
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<DataTable
				columns={columns}
				data={admissionData?.data || []}
				title="Demo Posts Table (Backend Supported)"
				searchKey="title"
				Component={addButton}
				manualPagination
				pageCount={admissionData?.pagination.page}
				pageIndex={pagination.pageIndex}
				onPaginationChange={handlePaginationChange}
				onSearch={setSearchTerm}
				searchValue={searchTerm}
				isLoading={isLoading}
				emptyMessage="No posts found. Try adjusting your search."
			/>

			{/* Display pagination info */}
			<div className="mt-4 text-sm text-gray-600">
				<p>
					Showing {apiResponse?.data.length || 0} of{" "}
					{apiResponse?.pagination.total || 0} total posts
				</p>
			</div>
		</div>
	);
}
