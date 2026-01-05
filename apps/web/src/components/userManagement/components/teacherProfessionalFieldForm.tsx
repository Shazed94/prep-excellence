"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TUpdateTeacher,
	ZUTeacher,
} from "@prepexcellence/shared-validators";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTeacher } from "@/hooks/user-management";
import type { TeacherProfile } from "../components/teacherUpdateForm";

interface TeacherProfessionalFieldsFormProps {
	teacher: TeacherProfile;
	onSuccess?: () => void;
}

export function TeacherProfessionalFieldsForm({
	teacher,
	onSuccess,
}: TeacherProfessionalFieldsFormProps) {
	const updateTeacher = useUpdateTeacher();

	console.log("Teacher professional data in form:", teacher);

	// Local state for array fields
	const [localCertifications, setLocalCertifications] = useState<string[]>(
		teacher?.certifications || [],
	);
	const [localSubjects, setLocalSubjects] = useState<string[]>(
		teacher?.subjects || [],
	);
	const [certInput, setCertInput] = useState("");
	const [subjectInput, setSubjectInput] = useState("");

	const form = useForm<TUpdateTeacher>({
		resolver: zodResolver(ZUTeacher) as any,
		defaultValues: {
			role: teacher?.role || "TEACHER",
			qualifications: teacher?.qualifications || "",
			experienceYears: teacher?.experienceYears || 0,
			certifications: teacher?.certifications || [],
			subjects: teacher?.subjects || [],
			bio: teacher?.bio || "",
		},
	});

	const { control, handleSubmit, formState, reset, setValue } = form;
	const { isSubmitting } = formState;

	// Reset form when teacher data changes
	useEffect(() => {
		if (teacher) {
			reset({
				role: teacher?.role || "TEACHER",
				qualifications: teacher?.qualifications || "",
				experienceYears: teacher?.experienceYears || 0,
				certifications: teacher?.certifications || [],
				subjects: teacher?.subjects || [],
				bio: teacher?.bio || "",
			});
			setLocalCertifications(teacher?.certifications || []);
			setLocalSubjects(teacher?.subjects || []);
		}
	}, [teacher, reset]);

	// Sync local arrays with form
	useEffect(() => {
		setValue("certifications", localCertifications);
	}, [localCertifications, setValue]);

	useEffect(() => {
		setValue("subjects", localSubjects);
	}, [localSubjects, setValue]);

	const onSubmit = async (data: TUpdateTeacher) => {
		try {
			// Ensure arrays are up to date
			data.certifications = localCertifications;
			data.subjects = localSubjects;

			console.log("Submitting professional data:", {
				teacherId: teacher.id,
				data,
			});

			const result = await updateTeacher.mutateAsync({
				id: teacher.id,
				data,
			});

			console.log("Update successful:", result);
			onSuccess?.();
		} catch (error) {
			console.error("Failed to update teacher:", error);
			throw error;
		}
	};

	const addCertification = () => {
		if (certInput.trim() && !localCertifications.includes(certInput.trim())) {
			setLocalCertifications([...localCertifications, certInput.trim()]);
			setCertInput("");
		}
	};

	const removeCertification = (index: number) => {
		setLocalCertifications(localCertifications.filter((_, i) => i !== index));
	};

	const addSubject = () => {
		if (subjectInput.trim() && !localSubjects.includes(subjectInput.trim())) {
			setLocalSubjects([...localSubjects, subjectInput.trim()]);
			setSubjectInput("");
		}
	};

	const removeSubject = (index: number) => {
		setLocalSubjects(localSubjects.filter((_, i) => i !== index));
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* INFO BOX */}
				<div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
					<h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
						Professional Information
					</h3>
					<p className="text-sm text-indigo-800 dark:text-indigo-200">
						Manage teacher's professional details, qualifications and experience
					</p>
				</div>

				{/* PROFESSIONAL FIELDS */}
				<div className="space-y-4">
					<h4 className="font-semibold text-sm text-muted-foreground">
						Professional Details
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<FormField
							control={control}
							name="experienceYears"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Years of Experience</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											min="0"
											max="50"
											disabled={isSubmitting}
											value={field.value ?? 0}
											onChange={(e) =>
												field.onChange(
													e.target.value ? Number(e.target.value) : 0,
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="md:col-span-1">
							<FormField
								control={control}
								name="qualifications"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Qualifications</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="e.g., M.Sc, PhD, B.Ed"
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Certifications Field */}
						<div className="md:col-span-3">
							<FormItem>
								<FormLabel>Certifications</FormLabel>
								<div className="space-y-2">
									<div className="flex gap-2">
										<Input
											type="text"
											value={certInput}
											onChange={(e) => setCertInput(e.target.value)}
											placeholder="Add a certification (e.g., TEFL, CELTA)"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addCertification();
												}
											}}
											disabled={isSubmitting}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={addCertification}
											disabled={isSubmitting || !certInput.trim()}
										>
											Add
										</Button>
									</div>
									<div className="flex flex-wrap gap-2 mt-2">
										{localCertifications.map((cert, index) => (
											<Badge
												key={index}
												variant="secondary"
												className="px-3 py-1"
											>
												🏆 {cert}
												<button
													type="button"
													onClick={() => removeCertification(index)}
													disabled={isSubmitting}
													className="ml-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										))}
									</div>
								</div>
								<FormDescription>
									Add relevant teaching certifications
								</FormDescription>
								<FormMessage />
							</FormItem>
						</div>

						{/* Subjects Field */}
						<div className="md:col-span-3">
							<FormItem>
								<FormLabel>Teaching Subjects</FormLabel>
								<div className="space-y-2">
									<div className="flex gap-2">
										<Input
											type="text"
											value={subjectInput}
											onChange={(e) => setSubjectInput(e.target.value)}
											placeholder="Add a subject (e.g., Mathematics, Physics)"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addSubject();
												}
											}}
											disabled={isSubmitting}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={addSubject}
											disabled={isSubmitting || !subjectInput.trim()}
										>
											Add
										</Button>
									</div>
									<div className="flex flex-wrap gap-2 mt-2">
										{localSubjects.map((subject, index) => (
											<Badge
												key={index}
												variant="outline"
												className="px-3 py-1"
											>
												📚 {subject}
												<button
													type="button"
													onClick={() => removeSubject(index)}
													disabled={isSubmitting}
													className="ml-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										))}
									</div>
								</div>
								<FormDescription>
									Add subjects this teacher can teach
								</FormDescription>
								<FormMessage />
							</FormItem>
						</div>

						{/* Bio Field */}
						<div className="md:col-span-3">
							<FormField
								control={control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Biography</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Tell us about the teacher's teaching philosophy and experience..."
												rows={4}
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormDescription>
											{field.value?.length || 0}/500 characters
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
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
