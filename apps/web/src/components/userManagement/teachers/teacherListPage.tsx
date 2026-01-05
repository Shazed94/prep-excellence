"use client";

import { Link } from "@tanstack/react-router";
import { Edit2, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useDeleteInstructor,
	useGetInstructorById,
	useGetInstructors,
} from "@/hooks/instructor";
import { TeacherProfessionalFieldsForm } from "../components/teacherProfessionalFieldForm";
import { TeacherUpdateForm } from "../components/teacherUpdateForm";

// Instructor interfaces

export interface Instructor {
	id: string;
	experienceYears: number;
	subjects: string[];
	certifications: string[];
	bio?: string;
	createdAt?: string;
	updatedAt?: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	image?: string;
}

export interface PaginatedInstructorResponse {
	data: Instructor[];
	meta?: {
		total: number;
		page: number;
		limit: number;
	};
}

export default function TeacherList() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
		null,
	);
	const [viewTeacherId, setViewTeacherId] = useState<string | null>(null);

	// Fetch all teachers with optional search
	const { data: instructorsResponse, isLoading } = useGetInstructors({
		page: 1,
		limit: 100,
		search: searchTerm,
		sortBy: "createdAt",
		orderBy: "desc",
	});

	// Fetch single teacher for view modal
	const { data: viewTeacherData, isLoading: isViewLoading } =
		useGetInstructorById(viewTeacherId || "");
	console.log(
		"View Teacher Data:=========================",
		viewTeacherData?.data,
	);

	const teachers: Instructor[] = instructorsResponse?.data || [];

	// Fetch a single teacher when selected (for edit mode)
	const { data: selectedTeacherData, isLoading: isSelectedLoading } =
		useGetInstructorById(selectedTeacherId || "");
	const selectedTeacher = selectedTeacherData || null;

	console.log("Selected Teacher Data:", selectedTeacher);

	// Delete teacher hook
	const deleteInstructor = useDeleteInstructor();

	if (isLoading) return <p>Loading teachers...</p>;

	return (
		<div className="p-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Teachers</h1>
					<p className="text-muted-foreground mt-1">
						Manage teacher accounts and profiles
					</p>
				</div>
				<Button asChild className="gap-2">
					<Link to="/dashboard/user-management/teachers/add-teacher">
						<Plus className="h-4 w-4" />
						Add Teacher
					</Link>
				</Button>
			</div>

			{/* Search */}
			<div className="mb-6 relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search by name or email..."
					className="pl-10"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* VIEW MODAL - Professional Modal for Viewing Teacher Details */}
			<Dialog
				open={!!viewTeacherId}
				onOpenChange={(open) => {
					if (!open) setViewTeacherId(null);
				}}
			>
				<DialogContent className="w-full max-w-3xl max-h-[95vh] overflow-y-auto p-0">
					{isViewLoading ? (
						<div className="flex items-center justify-center py-12">
							<p className="text-muted-foreground">
								Loading teacher details...
							</p>
						</div>
					) : viewTeacherData ? (
						<>
							{/* Profile Header Section */}
							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6">
								<div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
									{/* Profile Image */}
									<div className="flex-shrink-0">
										<img
											src={viewTeacherData?.data?.image || "/placeholder.svg"}
											alt={viewTeacherData?.data?.name || "Teacher"}
											className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
										/>
									</div>

									{/* Header Info */}
									<div className="flex-1">
										<DialogTitle className="text-2xl font-bold text-foreground mb-2">
											{viewTeacherData?.data?.name || "N/A"}
										</DialogTitle>
										<p className="text-sm text-muted-foreground mb-2">
											{viewTeacherData?.data?.email || "N/A"}
										</p>
										<div className="flex flex-wrap gap-3 text-sm">
											{viewTeacherData?.data?.phone && (
												<span className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-slate-700 text-foreground border border-slate-200 dark:border-slate-600">
													📱 {viewTeacherData.data.phone}
												</span>
											)}
											{viewTeacherData?.data?.experienceYears && (
												<span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
													⭐ {viewTeacherData.data.experienceYears} years exp.
												</span>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Content Section */}
							<div className="px-6 py-6 space-y-6">
								{/* Contact Information Section */}
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<span className="w-1 h-6 bg-blue-500 rounded"></span>
										Contact Information
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
										<div>
											<Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
												Email
											</Label>
											<p className="text-sm mt-1 text-foreground break-all">
												{	viewTeacherData?.data?.email || "N/A"}
											</p>
										</div>
										<div>
											<Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
												Phone
											</Label>
											<p className="text-sm mt-1 text-foreground">
												{viewTeacherData?.data?.phone || "N/A"}
											</p>
										</div>
										<div className="sm:col-span-2">
											<Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
												Address
											</Label>
											<p className="text-sm mt-1 text-foreground">
												{viewTeacherData?.data?.address || "N/A"}
											</p>
										</div>
									</div>
								</div>

								{/* Professional Information Section */}
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<span className="w-1 h-6 bg-indigo-500 rounded"></span>
										Professional Information
									</h3>
									<div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
										<div>
											<Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
												Experience Level
											</Label>
											<div className="flex items-center gap-2 mt-2">
												<div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
													<div
														className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full"
														style={{
															width: `${Math.min(
																((viewTeacherData?.data?.experienceYears || 0) / 20) *
																	100,
																100,
															)}%`,
														}}
													></div>
												</div>
												<span className="text-sm font-semibold text-foreground min-w-fit">
													{viewTeacherData?.data?.experienceYears || 0} years
												</span>
											</div>
										</div>

										<div>
											<Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
												Teaching Subjects
											</Label>
											<div className="flex flex-wrap gap-2 mt-2">
												{Array.isArray(viewTeacherData?.data?.subjects) &&
												viewTeacherData.data.subjects.length > 0 ? (
													viewTeacherData.data.subjects.map(
														(subject: string, idx: number) => (
															<span
																key={idx}
																className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-sm font-medium"
															>
																{subject}
															</span>
														),
													)
												) : (
													<span className="text-sm text-muted-foreground">
														N/A
													</span>
												)}
											</div>
										</div>

										<div>
											<Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
												Certifications
											</Label>
											<div className="flex flex-wrap gap-2 mt-2">
												{Array.isArray(viewTeacherData?.data?.certifications) &&
												viewTeacherData.data.certifications.length > 0 ? (
													viewTeacherData.data.certifications.map(
														(cert: string, idx: number) => (
															<span
																key={idx}
																className="inline-flex items-center px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-sm font-medium"
															>
																🏆 {cert}
															</span>
														),
													)
												) : (
													<span className="text-sm text-muted-foreground">
														N/A
													</span>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Bio Section */}
								{viewTeacherData?.data?.bio && (
									<div>
										<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
											<span className="w-1 h-6 bg-purple-500 rounded"></span>
											Biography
										</h3>
										<div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
											<p className="text-sm leading-relaxed text-foreground">
												{viewTeacherData?.data?.bio}
											</p>
										</div>
									</div>
								)}

								{/* Metadata Section */}
								<div className="border-t pt-4">
									<div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
										<div>
											<Label className="font-semibold">Created</Label>
											<p className="mt-1">
												{viewTeacherData?.data?.createdAt
													? new Date(
															viewTeacherData.data.createdAt,
														).toLocaleDateString("en-US", {
															year: "numeric",
															month: "short",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														})
													: "N/A"}
											</p>
										</div>
										<div>
											<Label className="font-semibold">Last Updated</Label>
											<p className="mt-1">
												{viewTeacherData?.data?.updatedAt
													? new Date(
															viewTeacherData.data.updatedAt,
														).toLocaleDateString("en-US", {
															year: "numeric",
															month: "short",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														})
													: "N/A"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</>
					) : null}
				</DialogContent>
			</Dialog>

			{/* VIEW / EDIT MODE */}
			{selectedTeacherId ? (
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Edit Teacher</CardTitle>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setSelectedTeacherId(null)}
							>
								Back to List
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{isSelectedLoading ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">
									Loading teacher details...
								</p>
							</div>
						) : selectedTeacher ? (
							<Tabs defaultValue="basic">
								<TabsList className="grid grid-cols-2 mb-6">
									<TabsTrigger value="basic">Basic Information</TabsTrigger>
									<TabsTrigger value="professional">
										Professional Details
									</TabsTrigger>
								</TabsList>

								<TabsContent value="basic" className="space-y-6">
									<TeacherUpdateForm
										teacher={(selectedTeacher?.data || selectedTeacher) as any}
										onSuccess={() => {
											setSelectedTeacherId(null);
										}}
									/>
								</TabsContent>
								<TabsContent value="professional">
									<TeacherProfessionalFieldsForm
										teacher={(selectedTeacher?.data || selectedTeacher) as any}
										onSuccess={() => {
											setSelectedTeacherId(null);
										}}
									/>
								</TabsContent>
							</Tabs>
						) : (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">Teacher not found</p>
							</div>
						)}
					</CardContent>
				</Card>
			) : (
				/* LIST MODE */
				<div className="grid gap-4">
					{teachers.map((teacher: Instructor) => (
						<Card
							key={teacher.id}
							className="hover:shadow-md transition-shadow cursor-pointer"
						>
							<CardContent className="pt-6 flex items-center gap-4">
								<img
									src={teacher?.image || "/placeholder.svg"}
									alt={teacher?.name}
									className="w-12 h-12 rounded-full"
								/>
								<div className="flex-1">
									<h3 className="font-semibold text-foreground">
										{teacher?.name}
									</h3>
									<p className="text-sm text-muted-foreground">
										{teacher?.email}
									</p>
									<p className="text-sm text-muted-foreground">
										{teacher?.phone || "No phone"}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{teacher.experienceYears} years exp. •{" "}
										{teacher.subjects?.join(", ") || "No subjects"}
									</p>
								</div>
								<div className="flex flex-col gap-2">
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											className="gap-1"
											onClick={() => setViewTeacherId(teacher.id)}
										>
											<Eye className="h-3 w-3" />
											View
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="gap-1"
											onClick={() => setSelectedTeacherId(teacher.id)}
										>
											<Edit2 className="h-3 w-3" />
											Edit
										</Button>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													size="sm"
													variant="outline"
													className="text-destructive gap-1"
												>
													<Trash2 className="h-3 w-3" />
													Delete
												</Button>
											</AlertDialogTrigger>

											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Delete Teacher?</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete{" "}
														<strong>{teacher?.name}</strong>? This action cannot
														be undone.
													</AlertDialogDescription>
												</AlertDialogHeader>

												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														className="bg-destructive text-destructive-foreground"
														onClick={() => deleteInstructor.mutate(teacher.id)}
													>
														Yes, Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
