import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Award,
	Calendar,
	ChevronRight,
	Download,
	ExternalLink,
	Loader2,
	Share2,
} from "lucide-react";
import { CoachingNav } from "@/components/CoachingNav";
import { Button } from "@/components/ui/button";
import { useGetCoachingCourse } from "@/hooks/coaching";

export const Route = createFileRoute(
	"/student-dashboard/coaching/$enrollmentId/certificate",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { enrollmentId } = Route.useParams();
	const { data: courseData, isLoading } = useGetCoachingCourse(enrollmentId);
	const course = courseData?.data ?? null;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 size={28} className="animate-spin text-primary" />
			</div>
		);
	}

	if (!course) {
		return (
			<div className="flex flex-col items-center py-20 gap-3">
				<p className="text-muted">Course not found</p>
				<Link to="/student-dashboard/coaching">
					<Button variant="outline" size="sm">
						Back to Coaching
					</Button>
				</Link>
			</div>
		);
	}

	const isCompleted = course.status === "COMPLETED";
	const completedDate = course.completedAt
		? new Date(course.completedAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: null;

	return (
		<div className="space-y-4 max-w-7xl">
			{/* Breadcrumb */}
			<div className="flex items-center gap-3">
				<Link to="/student-dashboard/coaching">
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-muted text-xs"
					>
						<ArrowLeft size={14} /> My Coaching
					</Button>
				</Link>
				<ChevronRight size={13} className="text-muted" />
				<span className="text-sm font-medium text-foreground truncate">
					{course?.title ?? "Certificate"}
				</span>
			</div>

			{/* Coaching Nav tabs */}
			<CoachingNav
				enrollmentId={enrollmentId}
				courseName={course?.title ?? ""}
			/>

			{/* Certificate */}
			{isCompleted ? (
				<div className="bg-white rounded-xl border-2 border-emerald-200 shadow-sm overflow-hidden">
					{/* Certificate header */}
					<div className="bg-linear-to-r from-emerald-500 to-emerald-600 p-8 text-center text-white">
						<Award size={48} className="mx-auto mb-3 opacity-90" />
						<h2 className="text-2xl font-bold font-switzer">
							Certificate of Completion
						</h2>
						<p className="text-emerald-100 text-sm mt-1">
							This certifies that you have successfully completed
						</p>
					</div>

					{/* Certificate body */}
					<div className="p-8 text-center space-y-4">
						<h3 className="text-xl font-bold text-foreground font-switzer">
							{course.title}
						</h3>
						{completedDate && (
							<div className="flex items-center justify-center gap-1.5 text-sm text-muted">
								<Calendar size={14} />
								<span>Completed on {completedDate}</span>
							</div>
						)}

						{/* Decorative divider */}
						<div className="border-t border-dashed border-border/60 my-6" />

						{/* Course details */}
						<div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
							<div>
								<p className="text-[11px] text-muted">Course Duration</p>
								<p className="text-sm font-semibold text-foreground">
									{course.duration ?? "—"} days
								</p>
							</div>
							<div>
								<p className="text-[11px] text-muted">Level</p>
								<p className="text-sm font-semibold text-foreground">
									{course.level ?? "—"}
								</p>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-center gap-3 pt-4">
							<Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
								<Download size={14} />
								Download PDF
							</Button>
							<Button variant="outline" className="gap-2">
								<Share2 size={14} />
								Share
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="bg-white rounded-xl border border-border/60 shadow-sm p-12 text-center space-y-4">
					<div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
						<Award size={36} className="text-muted/40" />
					</div>
					<h3 className="font-switzer font-bold text-lg text-foreground">
						Certificate Not Yet Available
					</h3>
					<p className="text-sm text-muted max-w-md mx-auto">
						Complete all lessons and requirements in this coaching program to
						unlock your certificate of completion.
					</p>
					<Link to={`/student-dashboard/coaching/${enrollmentId}` as "/"}>
						<Button variant="outline" size="sm" className="gap-2 mt-2">
							<ExternalLink size={14} />
							Continue Course
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
