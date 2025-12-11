import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/course-management/")({
	component: RouteComponent,
});

const courses = [
	{
		id: 1,
		title: "Full-Stack Web Development",
		duration: "8 weeks",
		cost: "$199",
		capacity: 30,
		status: "Active",
	},
	{
		id: 2,
		title: "Cybersecurity Fundamentals",
		duration: "6 weeks",
		cost: "$149",
		capacity: 25,
		status: "Upcoming",
	},
	{
		id: 3,
		title: "UI/UX Design Basics",
		duration: "4 weeks",
		cost: "$99",
		capacity: 20,
		status: "Draft",
	},
];

function RouteComponent() {
	return (
		<div className="p-6 space-y-6">
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
				<table className="w-full text-sm">
					<thead className="bg-muted/50">
						<tr className="text-left">
							<th className="px-4 py-3 font-medium">Course Title</th>
							<th className="px-4 py-3 font-medium">Duration</th>
							<th className="px-4 py-3 font-medium">Cost</th>
							<th className="px-4 py-3 font-medium">Capacity</th>
							<th className="px-4 py-3 font-medium">Status</th>
							<th className="px-4 py-3 font-medium text-right">Actions</th>
						</tr>
					</thead>

					<tbody>
						{courses.map((course) => (
							<tr key={course.id} className="border-t hover:bg-muted/30">
								<td className="px-4 py-3 font-medium">{course.title}</td>
								<td className="px-4 py-3">{course.duration}</td>
								<td className="px-4 py-3">{course.cost}</td>
								<td className="px-4 py-3">{course.capacity}</td>
								<td className="px-4 py-3">
									<span
										className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium
											${
												course.status === "Active"
													? "bg-green-100 text-green-700"
													: course.status === "Upcoming"
														? "bg-blue-100 text-blue-700"
														: "bg-gray-100 text-gray-600"
											}`}
									>
										{course.status}
									</span>
								</td>
								<td className="px-4 py-3 text-right">
									<div className="flex justify-end gap-2">
										<button
											type="button"
											className="text-xs px-3 py-1 rounded-md border hover:bg-muted"
										>
											View
										</button>
										<button
											type="button"
											className="text-xs px-3 py-1 rounded-md border hover:bg-muted"
										>
											Edit
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
