import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { useGetCourses } from "@/hooks/course-management";

export const Route = createFileRoute("/dashboard/course-management/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: courses, isLoading, isError } = useGetCourses();

	const columns: ColumnDef<any>[] = [
		{
			accessorKey: "sl",
			header: "SL",
			cell: ({ row }) => {
				const sl = row.index + 1;
				return <div className="text-left">{sl}</div>;
			},
		},
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => {
				const title = row.getValue("title") as string;
				return <div className="truncate max-w-[260px]">{title}</div>;
			},
		},
		{
			accessorKey: "startDate",
			header: "Start Date",
			cell: ({ row }) => {
				const startDate = row.original?.startDate;

				if (!startDate) return "";

				const date = new Date(startDate);

				const formatted = date
					.toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					})
					.replace(",", ""); // gives "11 Dec 2025"

				// Convert "11 Dec 2025" → "11-Dec-2025"
				const finalFormat = formatted.replace(/ /g, "-");

				return (
					<div className="truncate max-w-[150px]" title={startDate}>
						{finalFormat}
					</div>
				);
			},
		},
		{
			accessorKey: "price",
			header: () => <div className="text-center">Price</div>,
			cell: ({ row }) => {
				const price = row.original?.price;
				return <div className="text-center">{price}</div>;
			},
		},
		{
			accessorKey: "capacity",
			header: () => <div className="text-center">Capacity</div>,
			cell: ({ row }) => {
				const capacity = row.original?.capacity;
				return <div className="text-center">{capacity}</div>;
			},
		},
		{
			id: "actions",
			header: () => <div className="text-right">Action</div>,
			cell: ({ row }) => {
				const original = row.original as { id: string | number };
				const id = original.id;

				return (
					<div className="flex justify-end gap-2">
						<Link
							to={`/dashboard/course-management/${id}` as "/"}
							className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						>
							View
						</Link>
						<Link
							to={`/dashboard/course-management/${id}/edit` as "/"}
							className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						>
							Edit
						</Link>
					</div>
				);
			},
		},
	];

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error</p>;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Course Management</h1>
					<p className="text-sm text-muted-foreground">
						Manage and organize all your courses
					</p>
				</div>

				<Link
					to="/dashboard/course-management/create"
					className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				>
					+ Create Course
				</Link>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border bg-background">
				<DataTable
					data={courses?.data?.data || []}
					columns={columns}
					searchKey="title"
					searchPlaceholder="Search by title..."
					title=""
				/>
			</div>
		</div>
	);
}

export default RouteComponent;
