import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Award,
	Calendar,
	ChevronRight,
	Download,
	ExternalLink,
	Share2,
} from "lucide-react";
import { CourseNav } from "@/components/CourseNav";
import { Button } from "@/components/ui/button";
import { getCourseCertificate, mockCourses } from "@/lib/mock-data";

export const Route = createFileRoute(
	"/student-dashboard/my-courses/$courseId/certificate",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { courseId } = Route.useParams();
	const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
	const certificate = getCourseCertificate(courseId);

	return (
		<div className="space-y-4 max-w-7xl">
			{/* Breadcrumb */}
			<div className="flex items-center gap-3">
				<Link to="/student-dashboard/my-courses">
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-muted text-xs"
					>
						<ArrowLeft size={14} /> My Courses
					</Button>
				</Link>
				<ChevronRight size={13} className="text-muted" />
				<span className="text-sm font-medium text-foreground truncate">
					{course?.title ?? "Course Player"}
				</span>
			</div>
			<CourseNav courseId={course.id} courseName={course.title} />
			<div className="">
				{certificate ? (
					<div className="space-y-8">
						{/* Certificate Preview */}
						<div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-8 sm:p-12 text-center shadow-sm">
							<div className="mb-6">
								<Award size={48} className="mx-auto text-amber-600 mb-4" />
								<h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">
									Certificate of Completion
								</h1>
								<div className="h-1 w-24 bg-primary mx-auto" />
							</div>

							<div className="my-8">
								<p className="text-muted-foreground text-sm mb-2">
									This is proudly presented to
								</p>
								<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
									Aryan Khandelwal
								</h2>
								<p className="text-muted-foreground text-sm mb-2">
									for successfully completing
								</p>
								<h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-8">
									{certificate.courseName}
								</h3>

								<div className="grid grid-cols-3 gap-4 my-8 text-center">
									<div>
										<p className="text-xs text-muted-foreground mb-1">
											Issued Date
										</p>
										<p className="font-semibold text-foreground">
											{certificate.issuedDate.toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
									</div>
									<div>
										<p className="text-xs text-muted-foreground mb-1">Score</p>
										<p className="font-semibold text-foreground">
											{certificate.score}%
										</p>
									</div>
									<div>
										<p className="text-xs text-muted-foreground mb-1">
											Certificate No.
										</p>
										<p className="font-semibold text-foreground text-sm">
											{certificate.certificateNumber}
										</p>
									</div>
								</div>

								<div className="my-8 text-left bg-white/50 rounded-lg p-4 border border-amber-100">
									<p className="text-xs text-muted-foreground mb-2">
										Instructor Signature
									</p>
									<p className="font-semibold text-foreground">
										{certificate.instructorName}
									</p>
								</div>
							</div>
						</div>

						{/* Certificate Details */}
						<div className="grid lg:grid-cols-2 gap-6">
							{/* Skills Verified */}
							<div className="bg-card border border-border rounded-lg p-6">
								<h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
									<Award size={20} className="text-primary" />
									Skills Verified
								</h3>

								<div className="space-y-2">
									{certificate.skillsVerified.map((skill, idx) => (
										<div
											key={idx}
											className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
										>
											<div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
											<span className="text-sm text-foreground font-medium">
												{skill}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Certificate Info */}
							<div className="bg-card border border-border rounded-lg p-6 space-y-4">
								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Course Completion
									</p>
									<p className="text-lg font-semibold text-foreground">
										{course.title}
									</p>
								</div>

								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Instructor
									</p>
									<p className="text-lg font-semibold text-foreground">
										{certificate.instructorName}
									</p>
								</div>

								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Completion Date
									</p>
									<div className="flex items-center gap-2 text-foreground">
										<Calendar size={18} className="text-primary" />
										<span className="font-semibold">
											{certificate.issuedDate.toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</span>
									</div>
								</div>

								<div>
									<p className="text-sm text-muted-foreground mb-2">
										Final Score
									</p>
									<div className="flex items-center gap-4">
										<div className="flex-1">
											<div className="h-3 bg-muted rounded-full overflow-hidden">
												<div
													className="h-full bg-primary"
													style={{ width: `${certificate.score}%` }}
												/>
											</div>
										</div>
										<span className="text-2xl font-bold text-foreground">
											{certificate.score}%
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="grid sm:grid-cols-3 gap-4">
							<button
								type="button"
								className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
							>
								<Download size={18} />
								Download PDF
							</button>

							<button
								type="button"
								className="flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
							>
								<Share2 size={18} />
								Share Certificate
							</button>

							<button
								type="button"
								className="flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
							>
								<ExternalLink size={18} />
								View Online
							</button>
						</div>

						{/* Certificate Security Info */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h4 className="font-semibold text-blue-900 mb-2">
								Certificate Verification
							</h4>
							<p className="text-sm text-blue-800 mb-3">
								This certificate is unique and can be verified online using the
								certificate number above.
							</p>
							<p className="text-xs text-blue-700">
								<strong>Certificate ID:</strong> {certificate.certificateNumber}
							</p>
						</div>
					</div>
				) : (
					<div className="text-center py-16 bg-card border border-border rounded-lg">
						<Award size={48} className="mx-auto text-muted-foreground mb-4" />
						<h3 className="text-xl font-bold text-foreground mb-2">
							No Certificate Yet
						</h3>
						<p className="text-muted-foreground mb-6 max-w-md mx-auto">
							Complete all required modules and quizzes to earn your certificate
							for this course.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								type="button"
								className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
							>
								Continue Learning
							</button>
							<button
								type="button"
								className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-muted"
							>
								View Progress
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
