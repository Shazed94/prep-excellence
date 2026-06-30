import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Edit } from "lucide-react";
import { useGetCourse } from "@/hooks/course-management";

export const Route = createFileRoute(
	"/dashboard/course-management/$courseId/view",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { courseId } = Route.useParams();
	const { data: course, isLoading, isError } = useGetCourse(courseId);

	console.log("course", course);

	const formatTime = (timeString: string | undefined) => {
		if (!timeString) return "Not set";
		try {
			const [hours, minutes] = timeString.split(":");
			const hour = parseInt(hours, 10);
			const period = hour >= 12 ? "PM" : "AM";
			const displayHour = hour % 12 || 12;
			return `${displayHour}:${minutes} ${period}`;
		} catch {
			return timeString;
		}
	};

	const formatDay = (day: string | undefined) => {
		if (!day) return "Not set";
		return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
	};
	if (isLoading) return <div className="p-8">Loading course...</div>;
	if (isError)
		return <div className="p-8 text-red-500">Error loading course</div>;
	if (!course) return <div className="p-8">Course not found</div>;

	return (
		<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold text-slate-900">
						{course.title}
					</h1>
					<p className="text-slate-600">Course details and information</p>
				</div>
				<div className="flex gap-3">
					<Link
						to={`/dashboard/course-management/${course?.id}/edit` as "/"}
						className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						<Edit className="w-4 h-4 mr-2" />
						Edit Course
					</Link>
					<Link
						to="/dashboard/course-management"
						className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Courses
					</Link>
				</div>
			</div>

			{/* Course Details */}
			<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
				{/* Basic Info Section */}
				<div className="mb-8">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						Basic Information
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Category
							</h3>
							<p className="text-slate-600">{course.category}</p>
						</div>
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">Level</h3>
							<p className="text-slate-600 capitalize">{course.level}</p>
						</div>
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Capacity
							</h3>
							<p className="text-slate-600">{course.capacity} students</p>
						</div>
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Duration
							</h3>
							<p className="text-slate-600">{course.duration} days</p>
						</div>
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Start Date
							</h3>
							<p className="text-slate-600">
								{format(parseISO(course.startDate), "PPP")}
							</p>
						</div>
						<div className="md:col-span-2">
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Short Description
							</h3>
							<p className="text-slate-600 line-clamp-3">
								{course.shortDescription}
							</p>
						</div>
					</div>
				</div>

				{/* Pricing Section */}
				<div className="mb-8">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						Pricing
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Regular Price
							</h3>
							<p className="text-slate-600 text-2xl font-bold">
								${course.regular_price || "0.00"}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Offer Price
							</h3>
							<p className="text-slate-600 text-2xl font-bold">
								${course.offer_price || "0.00"}
							</p>
							{course.offer_price &&
							course.regular_price &&
							course.offer_price < course.regular_price ? (
								<p className="text-xs text-green-600 mt-1">
									Save ${course.regular_price - course.offer_price}
								</p>
							) : null}
						</div>
					</div>
				</div>

				{/* Media Section */}
				{course.thumbnail || course.video ? (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-slate-900 mb-4">
							Course Media
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{course.thumbnail ? (
								<div>
									<h3 className="text-lg font-medium text-slate-800 mb-2">
										Thumbnail
									</h3>
									<img
										src={course.thumbnail}
										alt={`${course.title} thumbnail`}
										className="w-full h-48 object-cover rounded-lg border border-slate-200"
									/>
								</div>
							) : null}
							{course.video ? (
								<div>
									<h3 className="text-lg font-medium text-slate-800 mb-2">
										Video Preview
									</h3>
									<video
										controls
										className="w-full rounded-lg border border-slate-200"
										poster={course.thumbnail || "/placeholder-video.jpg"}
									>
										<track kind="captions" />
										<source src={course.video} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								</div>
							) : null}
						</div>
					</div>
				) : null}

				{/* Long Description Section */}
				{course.longDescription ? (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-slate-900 mb-4">
							Long Description
						</h2>
						<div className="prose prose-slate max-w-none">
							{course.longDescription}
						</div>
					</div>
				) : null}

				{/* Tags Section */}
				{course.tags && course.tags.length > 0 ? (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-slate-900 mb-4">Tags</h2>
						<div className="flex flex-wrap gap-2">
							{course.tags.map((tag: string, index: number) => (
								<span
									key={index}
									className="px-3 py-1 bg-primary/10 text-primary font-medium text-xs rounded-full"
								>
									#{tag}
								</span>
							))}
						</div>
					</div>
				) : null}

				{/* Weekly Sessions Section */}
				{course.schedules && course.schedules.length > 0 ? (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-slate-900 mb-4">
							Weekly Class Schedule
						</h2>
						<p className="text-sm text-slate-600 mb-4">
							Example: Sunday 1:00 PM - 2:00 PM, Monday 1:00 PM - 2:00 PM
							(repeats weekly).
						</p>
						<div className="space-y-3">
							{course.schedules.map((session: any, index: number) => (
								<div
									key={index}
									className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-slate-50 border border-slate-200 rounded-lg p-4"
								>
									<div className="md:col-span-2">
										<p className="text-slate-600">
											<strong>Day:</strong> {formatDay(session.day)}
										</p>
									</div>
									<div>
										<p className="text-slate-600">
											<strong>Start:</strong> {formatTime(session.startTime)}
										</p>
									</div>
									<div>
										<p className="text-slate-600">
											<strong>End:</strong> {formatTime(session.endTime)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				) : null}

				{/* Course Stats */}
				<div className="pt-6 border-t border-slate-200">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						Course Statistics
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Total Enrollments
							</h3>
							<p className="text-slate-600 text-2xl font-bold">
								{/* {course._count?.enrollments || 0} */}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Status
							</h3>
							<p
								className={`text-slate-600 text-xl font-medium ${course.isPublished ? "text-green-600" : "text-amber-600"}`}
							>
								{course.isPublished ? "Published" : "Draft"}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium text-slate-800 mb-2">
								Created By
							</h3>
							<div className="flex items-center gap-3">
								{course.createdBy?.image ? (
									<img
										src={course.createdBy.image}
										alt={`${course.createdBy?.name}'s avatar`}
										className="w-10 h-10 rounded-full border border-slate-200"
									/>
								) : (
									<div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
										{course.createdBy?.name?.charAt(0) || "?"}
									</div>
								)}
								<div>
									<p className="text-slate-600 font-medium">
										{course.createdBy?.name || "Unknown"}
									</p>
									<p className="text-xs text-slate-500">Instructor</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
