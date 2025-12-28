// courses/index.tsx
"use client";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	CheckCircle2,
	Clock,
	DollarSign,
	Edit,
	FileText,
	LayoutGrid,
	List,
	Loader2,
	MoreVertical,
	Plus,
	Search,
	Trash2,
	TrendingUp,
	Users,
	Video,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useDeleteCourse,
	useGetCourses,
	usePublishCourse,
} from "@/hooks/lms-course";

export const Route = createFileRoute("/dashboard/instructor-portal/courses")({
	component: RouteComponent,
});

function RouteComponent() {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [filterLevel, setFilterLevel] = useState<string>("all");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

	const { data: courses, isLoading, error } = useGetCourses();
	const deleteMutation = useDeleteCourse();
	const publishMutation = usePublishCourse();

	const handleDeleteClick = (courseId: string) => {
		setCourseToDelete(courseId);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (courseToDelete) {
			try {
				await deleteMutation.mutateAsync(courseToDelete);
				toast.success("Course deleted successfully");
				setDeleteDialogOpen(false);
				setCourseToDelete(null);
			} catch (error) {
				console.error("Failed to delete course:", error);
			}
		}
	};

	const handlePublishToggle = async (
		courseId: string,
		currentPublishedState: boolean,
	) => {
		try {
			await publishMutation.mutateAsync({
				courseId,
				isPublished: !currentPublishedState,
			});
		} catch (error) {
			console.error("Failed to publish/unpublish course:", error);
		}
	};

	// Filter courses
	const filteredCourses =
		courses?.filter((course: any) => {
			const matchesSearch =
				course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.description?.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus =
				filterStatus === "all" ||
				(filterStatus === "published" && course.published) ||
				(filterStatus === "draft" && !course.published);

			const matchesLevel =
				filterLevel === "all" || course.level === filterLevel;

			return matchesSearch && matchesStatus && matchesLevel;
		}) || [];

	// Calculate statistics
	const stats = {
		total: courses?.length || 0,
		published: courses?.filter((c: any) => c.published).length || 0,
		draft: courses?.filter((c: any) => !c.published).length || 0,
		totalStudents:
			courses?.reduce(
				(acc: number, c: any) => acc + (c.enrolledCount || 0),
				0,
			) || 0,
		totalRevenue:
			courses?.reduce(
				(acc: number, c: any) => acc + (c.enrolledCount || 0) * (c.price || 0),
				0,
			) || 0,
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<p className="text-lg text-slate-700">Failed to load courses</p>
					<p className="text-sm text-slate-500">Please try again later</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full bg-slate-50 min-h-screen py-8 px-4 md:px-8 lg:px-10">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold text-slate-900">
							My Courses
						</h1>
						<p className="text-slate-600 mt-1">
							Manage and track your course content
						</p>
					</div>
					<Link
						to="/dashboard/instructor-portal/create-course"
						className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
					>
						<Plus className="w-4 h-4 mr-2" />
						Create Course
					</Link>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
					<StatCard
						title="Total Courses"
						value={stats.total}
						icon={<BookOpen className="w-6 h-6 text-blue-600" />}
						bgColor="bg-blue-100"
					/>

					<StatCard
						title="Published"
						value={stats.published}
						icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
						bgColor="bg-green-100"
						valueColor="text-green-600"
					/>

					<StatCard
						title="Drafts"
						value={stats.draft}
						icon={<FileText className="w-6 h-6 text-orange-600" />}
						bgColor="bg-orange-100"
						valueColor="text-orange-600"
					/>

					<StatCard
						title="Students"
						value={stats.totalStudents}
						icon={<Users className="w-6 h-6 text-purple-600" />}
						bgColor="bg-purple-100"
						valueColor="text-purple-600"
					/>

					<StatCard
						title="Revenue"
						value={`$${stats.totalRevenue.toLocaleString()}`}
						icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
						bgColor="bg-emerald-100"
						valueColor="text-emerald-600"
					/>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6">
					<div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
						<div className="flex-1 w-full md:max-w-md">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<Input
									placeholder="Search courses by title or description..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="flex items-center gap-3 flex-wrap">
							<Select value={filterStatus} onValueChange={setFilterStatus}>
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="published">Published</SelectItem>
									<SelectItem value="draft">Draft</SelectItem>
								</SelectContent>
							</Select>

							<Select value={filterLevel} onValueChange={setFilterLevel}>
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Levels</SelectItem>
									<SelectItem value="BEGINNER">Beginner</SelectItem>
									<SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
									<SelectItem value="ADVANCED">Advanced</SelectItem>
								</SelectContent>
							</Select>

							<div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
								<Button
									variant={viewMode === "grid" ? "secondary" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className="h-8 w-8 p-0"
								>
									<LayoutGrid className="w-4 h-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "secondary" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className="h-8 w-8 p-0"
								>
									<List className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Courses Display */}
			{filteredCourses.length === 0 ? (
				<div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
					<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<BookOpen className="w-8 h-8 text-slate-400" />
					</div>
					<h3 className="text-lg font-semibold text-slate-900 mb-2">
						No courses found
					</h3>
					<p className="text-slate-600 mb-6">
						{searchQuery || filterStatus !== "all" || filterLevel !== "all"
							? "Try adjusting your filters or search terms"
							: "Get started by creating your first course"}
					</p>
					{!searchQuery && filterStatus === "all" && filterLevel === "all" && (
						<Link
							to="/dashboard/instructor-portal/create-course"
							className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
						>
							<Plus className="w-4 h-4 mr-2" />
							Create Your First Course
						</Link>
					)}
				</div>
			) : viewMode === "grid" ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredCourses.map((course: any) => (
						<CourseCard
							key={course.id}
							course={course}
							onDelete={handleDeleteClick}
							onPublishToggle={handlePublishToggle}
							publishLoading={publishMutation.isPending}
						/>
					))}
				</div>
			) : (
				<div className="space-y-4">
					{filteredCourses.map((course: any) => (
						<CourseListItem
							key={course.id}
							course={course}
							onDelete={handleDeleteClick}
							onPublishToggle={handlePublishToggle}
							publishLoading={publishMutation.isPending}
						/>
					))}
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Course</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this course? This action cannot be
							undone. All modules, lessons, and student progress will be
							permanently removed.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
							disabled={deleteMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirmDelete}
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete Course"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function StatCard({
	title,
	value,
	icon,
	bgColor,
	valueColor = "text-slate-900",
}: {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	bgColor: string;
	valueColor?: string;
}) {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-slate-600 font-medium">{title}</p>
						<p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
					</div>
					<div
						className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
					>
						{icon}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function CourseCard({
	course,
	onDelete,
	onPublishToggle,
	publishLoading,
}: {
	course: any;
	onDelete: (id: string) => void;
	onPublishToggle: (id: string, isPublished: boolean) => void;
	publishLoading: boolean;
}) {
	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200">
			<div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
				{course.thumbnail ? (
					<img
						src={course.thumbnail}
						alt={course.title}
						className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<BookOpen className="w-16 h-16 text-white/50" />
					</div>
				)}
				<div className="absolute top-3 right-3 flex gap-2">
					<Badge
						variant={course.published ? "default" : "secondary"}
						className="shadow-sm backdrop-blur-sm bg-white/20 text-white border-0"
					>
						{course.published ? "Published" : "Draft"}
					</Badge>
				</div>
			</div>

			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg line-clamp-2 mb-1">
							{course.title}
						</CardTitle>
						<CardDescription className="line-clamp-2 text-slate-600">
							{course.description?.replace(/<[^>]*>/g, "").substring(0, 100)}
							{course.description?.length > 100 ? "..." : ""}
						</CardDescription>
					</div>
					<CourseDropdownMenu
						course={course}
						onDelete={onDelete}
						onPublishToggle={onPublishToggle}
						publishLoading={publishLoading}
					/>
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-3">
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center gap-4">
							<span className="flex items-center gap-1 text-slate-600">
								<Clock className="w-4 h-4" />
								{course.duration || 0}h
							</span>
							<span className="flex items-center gap-1 text-slate-600">
								<Video className="w-4 h-4" />
								{course.modules?.length || 0} modules
							</span>
						</div>
						<Badge variant="outline" className="capitalize">
							{course.level?.toLowerCase()}
						</Badge>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Users className="w-4 h-4 text-slate-500" />
							<span className="text-sm text-slate-600">
								{course.enrolledStudents?.length || 0} students
							</span>
						</div>
						<div className="flex items-center gap-1">
							<DollarSign className="w-4 h-4 text-green-600" />
							<span className="font-semibold text-slate-900">
								${course.price || 0}
							</span>
							{course.discount && (
								<span className="text-xs text-slate-400 line-through ml-1">
									${course.discount}
								</span>
							)}
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="bg-slate-50 border-t pt-4">
				<div className="flex gap-2 w-full">
					<Button variant="default" size="sm" className="flex-1" asChild>
						<Link to="/dashboard/instructor-portal/create-course">
							<Edit className="w-4 h-4 mr-2" />
							Edit
						</Link>
					</Button>
					<CourseDropdownMenu
						course={course}
						onDelete={onDelete}
						onPublishToggle={onPublishToggle}
						publishLoading={publishLoading}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}

function CourseListItem({
	course,
	onDelete,
	onPublishToggle,
	publishLoading,
}: {
	course: any;
	onDelete: (id: string) => void;
	onPublishToggle: (id: string, isPublished: boolean) => void;
	publishLoading: boolean;
}) {
	return (
		<Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
			<div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4">
				<div className="w-full md:w-32 h-40 md:h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 overflow-hidden">
					{course.thumbnail ? (
						<img
							src={course.thumbnail}
							alt={course.title}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<BookOpen className="w-8 h-8 text-white/50" />
						</div>
					)}
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
						<div className="flex-1 min-w-0">
							<h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-1">
								{course.title}
							</h3>
							<p className="text-sm text-slate-600 line-clamp-2 mb-2 md:mb-0">
								{course.description?.replace(/<[^>]*>/g, "").substring(0, 150)}
								{course.description?.length > 150 ? "..." : ""}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant={course.published ? "default" : "secondary"}
								className="flex-shrink-0"
							>
								{course.published ? "Published" : "Draft"}
							</Badge>
							<CourseDropdownMenu
								course={course}
								onDelete={onDelete}
								onPublishToggle={onPublishToggle}
								publishLoading={publishLoading}
							/>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
						<span className="flex items-center gap-1">
							<Clock className="w-4 h-4" />
							{course.duration || 0}h
						</span>
						<span className="flex items-center gap-1">
							<Video className="w-4 h-4" />
							{course.modules?.length || 0} modules
						</span>
						<span className="flex items-center gap-1">
							<Users className="w-4 h-4" />
							{course.enrolledStudents?.length || 0} students
						</span>
						<Badge variant="outline" className="capitalize ml-auto">
							{course.level?.toLowerCase()}
						</Badge>
						<div className="flex items-center gap-1 font-semibold text-slate-900">
							<DollarSign className="w-4 h-4 text-green-600" />$
							{course.price || 0}
							{course.discount && (
								<span className="text-xs text-slate-400 line-through ml-1">
									${course.discount}
								</span>
							)}
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button variant="default" size="sm" asChild>
							<Link to="/dashboard/instructor-portal/create-course">
								<Edit className="w-4 h-4 mr-2" />
								Edit Course
							</Link>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPublishToggle(course.id, course.published)}
							disabled={publishLoading}
						>
							{publishLoading ? (
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							) : course.published ? (
								"Unpublish"
							) : (
								"Publish"
							)}
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
}

function CourseDropdownMenu({
	course,
	onDelete,
	onPublishToggle,
	publishLoading,
}: {
	course: any;
	onDelete: (id: string) => void;
	onPublishToggle: (id: string, isPublished: boolean) => void;
	publishLoading: boolean;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
					<MoreVertical className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Link
						to="/dashboard/instructor-portal/create-course"
						className="flex items-center cursor-pointer"
					>
						<Edit className="w-4 h-4 mr-2" />
						Edit Course
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onPublishToggle(course.id, course.published)}
					disabled={publishLoading}
					className="cursor-pointer"
				>
					{publishLoading ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : course.published ? (
						<>
							<XCircle className="w-4 h-4 mr-2" />
							Unpublish
						</>
					) : (
						<>
							<CheckCircle2 className="w-4 h-4 mr-2" />
							Publish
						</>
					)}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => onDelete(course.id)}
					className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50"
				>
					<Trash2 className="w-4 h-4 mr-2" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default RouteComponent;
