import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { SearchSection } from "@/components/admin-sat-tabs/seachComponent";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
	"/dashboard/question-bank/practice-test-configuration/",
)({
	component: RouteComponent,
});

const data = [
	{
		id: 1,
		name: "John Doe",
		email: "john@example.com",
		role: "Admin",
		status: "Active",
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane@example.com",
		role: "User",
		status: "Inactive",
	},
	// ... more data
];
function RouteComponent() {
	const columns = [
		{
			accessorKey: "id",
			header: "ID",
		},
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			accessorKey: "role",
			header: "Role",
		},
		{
			accessorKey: "status",
			header: "Status",
		},
	];

	const addButton = () => {
		return (
			<Button
				type="button"
				className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-md"
			>
				<Link
					to={`/dashboard/question-bank/practice-test-configuration/add-question`}
					className="flex items-center"
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Question
				</Link>
			</Button>
		);
	};

	return (
		<div className="w-full space-y-6">
			<div>
				<SearchSection />
			</div>
			<div>
				<DataTable
					columns={columns}
					data={data}
					searchKey="name"
					title="Questions"
					Component={addButton}
				/>
			</div>
		</div>
	);
}
