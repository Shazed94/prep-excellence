import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { useGetCollegeAdmissions } from "@/hooks/college-admissions";

export const Route = createFileRoute("/dashboard/data_table/")({
	component: RouteComponent,
});

function RouteComponent() {
	// State for pagination and search
	const [searchTerm, setSearchTerm] = useState("");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	// Handles both direct value and updater function patterns
	const handlePaginationChange = useCallback((updaterOrValue: any) => {
		setPagination((prev) => {
			if (typeof updaterOrValue === "function") {
				return updaterOrValue(prev);
			}
			return updaterOrValue;
		});
	}, []);

	// Fetch data using the real backend API
	const {
		data: admissionData,
		isLoading,
		error,
		refetch,
	} = useGetCollegeAdmissions(
		pagination.pageIndex + 1,
		pagination.pageSize,
		searchTerm,
		"firstName",
		"asc",
	);

	useEffect(() => {
		refetch();
	}, [pagination, searchTerm, refetch]);


	console.log(pagination.pageIndex, pagination.pageSize, searchTerm);
	
	// Define columns for the data table
	const columns: ColumnDef<any>[] = [
		
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => {
				const id = row.getValue("id") as string;
				return <div className="truncate max-w-[150px]" title={id}>{id}</div>;
			},
		},
		{
			accessorKey: "firstName",
			header: "First Name",
		},
		{
			accessorKey: "lastName",
			header: "Last Name",
		},
		{
			accessorKey: "email",
			header: "Email",
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
	if (isLoading && !admissionData) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg">Loading data...</div>
			</div>
		);
	}

	// Handle error state
	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-red-500">
					Error loading data: {error.message}
				</div>
			</div>
		);
	}

	// Extract data from axios response
	const responseData = admissionData?.data?.data || [];
	const paginationInfo = admissionData?.data?.pagination;

	return (
		<div className="p-6">
			<DataTable
				columns={columns}
				data={responseData}
				title="College Admissions Table"
				searchKey="firstName"
				Component={addButton}
				manualPagination
				pageCount={paginationInfo?.totalPages}
				pageIndex={pagination.pageIndex}
				onPaginationChange={handlePaginationChange}
				onSearch={setSearchTerm}
				searchValue={searchTerm}
				isLoading={isLoading}
				emptyMessage="No data found. Try adjusting your search."
				hasNext={paginationInfo?.hasNext}
				hasPrev={paginationInfo?.hasPrev}
				total={paginationInfo?.total}
				
			/>

			{/* Display pagination info */}
			<div className="mt-4 text-sm text-gray-600">
				<p>
					Showing {responseData.length} of {paginationInfo?.total || 0} total
					entries
					{paginationInfo?.hasNext && " • More pages available"}
					{paginationInfo && ` (Page ${paginationInfo.page} of ${paginationInfo.totalPages})`}
				</p>
			</div>
		</div>
	);
}
