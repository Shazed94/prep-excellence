import { Link } from "@tanstack/react-router";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useDeleteStudent,
	useGetStudentById,
	useGetStudents,
} from "@/hooks/user-management";
import { ProfessionalFieldsForm } from "../components/professionalFieldForm";
import { StudentUpdateForm } from "../components/studentUpdateForm";

export interface StudentProfile {
	id: string;
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	isActive: boolean;
	// Academic info
	grade: string;
	class: string;
	section: string;
	rollId: number;
	enrollmentDate: string; // ISO date string
	currentLevel: string;
	gpa: number;
	totalCredits: number;
	academicStatus: "ACTIVE" | "GRADUATED" | "SUSPENDED" | "DROPPED"; // enum-like

	// Guardian info
	guardianName: string;
	guardianPhone: string;
	guardianEmail: string;

	// Referral
	referredById: string | null;
	referredByAffiliateId: string | null;

	// User basic info
	userId: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	image: string; // image URL
}

export function StudentListPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
		null,
	);

	// Fetch all students with optional search
	const { data, isLoading } = useGetStudents({ search: searchTerm });
	const students = data?.data ?? [];

	// Fetch a single student when selected
	// const { data: selectedStudent} = useGetStudentById(selectedStudentId || "");
	const { data: studentData } = useGetStudentById(selectedStudentId || "");
	const selectedStudent = studentData?.data as StudentProfile;



	// Delete student hook
	const deleteStudent = useDeleteStudent();

	if (isLoading) return <p>Loading students...</p>;

	return (
		<div className="p-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Students</h1>
					<p className="text-muted-foreground mt-1">
						Manage student accounts and profiles
					</p>
				</div>
				<Button asChild className="gap-2">
					<Link to="/dashboard/user-management/students/add-student">
						<Plus className="h-4 w-4" />
						Add Student
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

			{/* VIEW / EDIT MODE */}
			{selectedStudent ? (
				<Card>
					<CardHeader className="flex justify-between items-center">
						<CardTitle>{selectedStudent.name}</CardTitle>
						<Button
							variant="outline"
							onClick={() => setSelectedStudentId(null)}
						>
							Back to List
						</Button>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="basic">
							<TabsList className="grid grid-cols-2 mb-6">
								<TabsTrigger value="basic">Basic Information</TabsTrigger>
								<TabsTrigger value="professional">
									Academic & Guardian Info
								</TabsTrigger>
							</TabsList>

							<TabsContent value="basic" className="space-y-6">
								<StudentUpdateForm
									student={selectedStudent}
									onSuccess={() => {
										console.log("Student updated successfully");
									}}
								/>
							</TabsContent>
							<TabsContent value="professional">
								<ProfessionalFieldsForm
									student={selectedStudent}
									onSuccess={() => {
										console.log("Professional info updated successfully");
									}}
								/>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			) : (
				/* LIST MODE */
				<div className="grid gap-4">
					{students.map((student: any) => (
						<Card
							key={student.id}
							className="hover:shadow-md transition-shadow cursor-pointer"
						>
							<CardContent className="pt-6 flex items-center gap-4">
								<img
									src={student?.image || "/placeholder.svg"}
									alt={student.name}
									className="w-12 h-12 rounded-full"
								/>
								<div className="flex-1">
									<h3 className="font-semibold text-foreground">
										{student?.name}
									</h3>
									<p className="text-sm text-muted-foreground">
										{student?.email}
									</p>
									<p className="text-sm text-muted-foreground">
										{student?.phone}
									</p>
								</div>
								<div className="flex flex-col gap-2">
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											className="gap-1"
											onClick={() => setSelectedStudentId(student.id)}
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
													<AlertDialogTitle>Delete Student?</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete{" "}
														<strong>{student?.name}</strong>? This action cannot
														be undone.
													</AlertDialogDescription>
												</AlertDialogHeader>

												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														className="bg-destructive text-destructive-foreground"
														onClick={() => deleteStudent.mutate(student?.id)}
													>
														Yes, Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
									<div className="text-sm font-medium">
										Permissions:{" "}
										{student.permission ? "✓ Enabled" : "✗ Disabled"}
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
