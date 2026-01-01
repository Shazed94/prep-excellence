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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useDeleteInstructor,
	useGetInstructorById,
	useGetInstructors,
} from "@/hooks/instructor";
import { ProfessionalFieldsForm } from "../components/professionalFieldForm";
import { UserForm } from "../components/userFrom";

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

	const teachers: Instructor[] = instructorsResponse?.data || [];

	// Fetch a single teacher when selected (for edit mode)
	const selectedTeacher = selectedTeacherId
		? teachers.find((t) => t.id === selectedTeacherId)
		: null;

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

			{/* VIEW MODAL - Responsive Modal for Viewing Teacher Details */}
			<Dialog
				open={!!viewTeacherId}
				onOpenChange={(open) => {
					if (!open) setViewTeacherId(null);
				}}
			>
				<DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Teacher Details</DialogTitle>
					</DialogHeader>
					{isViewLoading ? (
						<p className="py-8 text-center">Loading teacher details...</p>
					) : viewTeacherData ? (
						<div className="grid gap-6 py-4">
							{/* Basic Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label className="text-sm font-medium text-muted-foreground">
										Name
									</Label>
									<p className="text-base mt-1">{viewTeacherData?.name}</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-muted-foreground">
										Email
									</Label>
									<p className="text-base mt-1">{viewTeacherData.email}</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-muted-foreground">
										Phone
									</Label>
									<p className="text-base mt-1">
										{viewTeacherData.phone || "N/A"}
									</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-muted-foreground">
										Address
									</Label>
									<p className="text-base mt-1">
										{viewTeacherData.address || "N/A"}
									</p>
								</div>
							</div>

							{/* Professional Details */}
							<div className="border-t pt-4">
								<h3 className="font-semibold mb-4">Professional Details</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium text-muted-foreground">
											Experience (Years)
										</Label>
										<p className="text-base mt-1">
											{viewTeacherData.experienceYears || 0}
										</p>
									</div>
									<div>
										<Label className="text-sm font-medium text-muted-foreground">
											Subjects
										</Label>
										<p className="text-base mt-1">
											{Array.isArray(viewTeacherData.subjects) &&
											viewTeacherData.subjects.length > 0
												? viewTeacherData.subjects.join(", ")
												: "N/A"}
										</p>
									</div>
									<div className="md:col-span-2">
										<Label className="text-sm font-medium text-muted-foreground">
											Certifications
										</Label>
										<p className="text-base mt-1">
											{Array.isArray(viewTeacherData.certifications) &&
											viewTeacherData.certifications.length > 0
												? viewTeacherData.certifications.join(", ")
												: "N/A"}
										</p>
									</div>
									<div className="md:col-span-2">
										<Label className="text-sm font-medium text-muted-foreground">
											Bio
										</Label>
										<p className="text-base mt-1">
											{viewTeacherData.bio || "N/A"}
										</p>
									</div>
								</div>
							</div>

							{/* Timestamps */}
							<div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
								<p>
									Created:{" "}
									{new Date(viewTeacherData.createdAt).toLocaleString()}
								</p>
								<p>
									Last Updated:{" "}
									{new Date(viewTeacherData.updatedAt).toLocaleString()}
								</p>
							</div>
						</div>
					) : null}
				</DialogContent>
			</Dialog>

			{/* VIEW / EDIT MODE */}
			{selectedTeacher ? (
				<Card>
					<CardHeader className="flex justify-between items-center">
						<CardTitle>{selectedTeacher.name}</CardTitle>
						<Button
							variant="outline"
							onClick={() => setSelectedTeacherId(null)}
						>
							Back
						</Button>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="basic">
							<TabsList className="grid grid-cols-2 mb-6">
								<TabsTrigger value="basic">Basic Information</TabsTrigger>
								<TabsTrigger value="professional">
									Professional Details
								</TabsTrigger>
							</TabsList>

							<TabsContent value="basic" className="space-y-6">
								<UserForm
									user={{
										...selectedTeacher,
										user: { user: selectedTeacher?.name },
									}}
									isNew={false}
								/>
							</TabsContent>
							<TabsContent value="professional">
								<ProfessionalFieldsForm
									userType="teacher"
									initialData={{
										experienceYears: selectedTeacher?.experienceYears,
										subjects: selectedTeacher?.subjects?.join(", ") || "",
										certifications:
											selectedTeacher?.certifications?.join(", ") || "",
										bio: selectedTeacher?.bio || "",
									}}
									onSubmit={(data) =>
										console.log("Professional Info Submitted:", data)
									}
								/>
							</TabsContent>
						</Tabs>
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
