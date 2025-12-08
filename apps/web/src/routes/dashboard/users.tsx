import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/users")({
	component: UsersPage,
});

function UsersPage() {
	// In a real app, you would fetch this data from the API
	const [users] = useState([
		{ id: 1, name: "John Doe", email: "john@example.com", role: "Student" },
		{
			id: 2,
			name: "Jane Smith",
			email: "jane@example.com",
			role: "Instructor",
		},
		{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Student" },
	])

	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-800 mb-6">
				Users Management
			</h1>

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Role
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{users.map((user) => (
							<tr key={user.id}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{user.name}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500">{user.email}</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
										{user.role}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<button
										type="button"
										className="text-blue-600 hover:text-blue-900 mr-4"
									>
										Edit
									</button>
									<button
										type="button"
										className="text-red-600 hover:text-red-900"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
