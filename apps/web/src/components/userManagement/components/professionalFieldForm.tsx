import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TUpdateStudent,
	ZUStudent,
} from "@prepexcellence/shared-validators";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUpdateStudent } from "@/hooks/user-management";
import type { StudentProfile } from "../students/StudentListPage";

interface ProfessionalFieldsFormProps {
	student: StudentProfile;
	onSuccess?: () => void;
}

export function ProfessionalFieldsForm({
	student,
	onSuccess,
}: ProfessionalFieldsFormProps) {
	const updateStudent = useUpdateStudent();

	const form = useForm<TUpdateStudent>({
		resolver: zodResolver(ZUStudent) as any,
		defaultValues: {
			grade: student?.grade || "",
			class: student?.class || "",
			section: student?.section || "",
			enrollmentDate: student?.enrollmentDate
				? new Date(student.enrollmentDate)
				: undefined,
			currentLevel: student?.currentLevel || "",
			gpa: student?.gpa || undefined,
			totalCredits: student?.totalCredits || undefined,
			academicStatus:
				student?.academicStatus === "SUSPENDED" ||
				student?.academicStatus === "DROPPED"
					? "ACTIVE"
					: (student?.academicStatus as "ACTIVE" | "GRADUATED" | "PROBATION") ||
						"ACTIVE",
			guardianName: student?.guardianName || "",
			guardianPhone: student?.guardianPhone || "",
			guardianEmail: student?.guardianEmail || "",
		},
	});

	const { control, handleSubmit, formState, reset } = form;
	const { isSubmitting } = formState;

	// Reset form when student data changes
	useEffect(() => {
		if (student) {
			reset({
				grade: student?.grade || "",
				class: student?.class || "",
				section: student?.section || "",
				enrollmentDate: student?.enrollmentDate
					? new Date(student.enrollmentDate)
					: undefined,
				currentLevel: student?.currentLevel || "",
				gpa: student?.gpa || undefined,
				totalCredits: student?.totalCredits || undefined,
				academicStatus:
					student?.academicStatus === "SUSPENDED" ||
					student?.academicStatus === "DROPPED"
						? "ACTIVE"
						: (student?.academicStatus as
								| "ACTIVE"
								| "GRADUATED"
								| "PROBATION") || "ACTIVE",
				guardianName: student?.guardianName || "",
				guardianPhone: student?.guardianPhone || "",
				guardianEmail: student?.guardianEmail || "",
			});
		}
	}, [student, reset]);

	const onSubmit = async (data: TUpdateStudent) => {
		try {
			await updateStudent.mutateAsync({
				id: student.id,
				data,
			});
			onSuccess?.();
		} catch (error) {
			console.error("Failed to update student:", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* INFO BOX */}
				<div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
					<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
						Academic & Guardian Information
					</h3>
					<p className="text-sm text-blue-800 dark:text-blue-200">
						Manage student's academic records and guardian details
					</p>
				</div>

				{/* ACADEMIC FIELDS */}
				<div className="space-y-4">
					<h4 className="font-semibold text-sm text-muted-foreground">
						Academic Information
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<FormField
							control={control}
							name="grade"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Grade</FormLabel>
									<FormControl>
										<Input {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="class"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Class</FormLabel>
									<FormControl>
										<Input {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="section"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section</FormLabel>
									<FormControl>
										<Input {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="currentLevel"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Level</FormLabel>
									<FormControl>
										<Input {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="gpa"
							render={({ field }) => (
								<FormItem>
									<FormLabel>GPA</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											step="0.01"
											min="0"
											max="4"
											disabled={isSubmitting}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined,
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="totalCredits"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Total Credits</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											min="0"
											disabled={isSubmitting}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined,
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="academicStatus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Academic Status</FormLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isSubmitting}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="ACTIVE">Active</SelectItem>
											<SelectItem value="PROBATION">Probation</SelectItem>
											<SelectItem value="GRADUATED">Graduated</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="enrollmentDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Enrollment Date</FormLabel>
									<FormControl>
										<Input
											type="date"
											disabled={isSubmitting}
											value={
												field.value instanceof Date
													? field.value.toISOString().split("T")[0]
													: ""
											}
											onChange={(e) =>
												field.onChange(
													e.target.value ? new Date(e.target.value) : undefined,
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* GUARDIAN FIELDS */}
				<div className="space-y-4">
					<h4 className="font-semibold text-sm text-muted-foreground">
						Guardian Information
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<FormField
							control={control}
							name="guardianName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Guardian Name</FormLabel>
									<FormControl>
										<Input {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="guardianPhone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Guardian Phone</FormLabel>
									<FormControl>
										<Input {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="guardianEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Guardian Email</FormLabel>
									<FormControl>
										<Input {...field} type="email" disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* ACTIONS */}
				<div className="flex gap-2 pt-4">
					<Button type="submit" disabled={isSubmitting}>
						<Check className="mr-2 h-4 w-4" />
						{isSubmitting ? "Updating..." : "Update Professional Details"}
					</Button>

					<Button
						type="button"
						variant="outline"
						onClick={() => reset()}
						disabled={isSubmitting}
					>
						<X className="mr-2 h-4 w-4" />
						Reset
					</Button>
				</div>
			</form>
		</Form>
	);
}
