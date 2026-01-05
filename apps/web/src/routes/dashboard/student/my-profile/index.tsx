"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	useGetStudentProfile,
	useUpdateStudent,
} from "@/hooks/user-management";

export const Route = createFileRoute("/dashboard/student/my-profile/")({
	component: MyProfilePage,
});

// Validation Schemas
const personalInfoSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone must be at least 10 characters"),
	address: z.string().min(5, "Address must be at least 5 characters"),
	image: z.any().optional(),
});

const academicInfoSchema = z.object({
	grade: z.string().min(1, "Grade is required"),
	class: z.string().min(1, "Class is required"),
	section: z.string().min(1, "Section is required"),
	currentLevel: z.string().min(1, "Level is required"),
	gpa: z.number().min(0).max(4.0, "GPA must be between 0 and 4.0"),
	totalCredits: z.number().min(0, "Credits must be positive"),
});

const guardianInfoSchema = z.object({
	guardianName: z
		.string()
		.min(2, "Guardian name must be at least 2 characters"),
	guardianPhone: z.string().min(10, "Phone must be at least 10 characters"),
	guardianEmail: z.string().email("Invalid email address"),
});

// Modal Component
function Modal({
	isOpen,
	onClose,
	title,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
				<div className="bg-linear-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center">
					<h3 className="text-xl font-bold text-white">{title}</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-white hover:text-gray-200 text-2xl"
					>
						×
					</button>
				</div>
				<div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
					{children}
				</div>
			</div>
		</div>
	);
}

// Avatar Component
function ProfileAvatar({
	image,
	name,
}: {
	image?: string | null;
	name: string;
}) {
	return (
		<div className="relative">
			{image ? (
				<img
					src={image}
					alt={name}
					className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
				/>
			) : (
				<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
					<span className="text-3xl sm:text-4xl font-bold text-white">
						{name?.charAt(0)?.toUpperCase() || "?"}
					</span>
				</div>
			)}
			<div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-4 border-white"></div>
		</div>
	);
}

// Info Item Component
function InfoItem({
	label,
	value,
	icon,
}: {
	label: string;
	value?: string | number;
	icon?: string;
}) {
	return (
		<div className="space-y-1">
			<p className="text-sm text-gray-500 flex items-center gap-2">
				{icon && <span>{icon}</span>}
				{label}
			</p>
			<p className="font-medium text-gray-900 wrap-break-word">
				{value || "N/A"}
			</p>
		</div>
	);
}

// Status Badge Component
function StatusBadge({
	status,
	verified,
}: {
	status: string;
	verified: boolean;
}) {
	const statusColors: Record<string, string> = {
		ACTIVE: "bg-green-100 text-green-800 border-green-200",
		PROBATION: "bg-yellow-100 text-yellow-800 border-yellow-200",
		GRADUATED: "bg-blue-100 text-blue-800 border-blue-200",
	};

	return (
		<div className="flex flex-wrap gap-2">
			<span
				className={`px-3 py-1 rounded-full text-xs font-semibold border ${
					statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"
				}`}
			>
				{status}
			</span>
			{verified && (
				<span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
					✓ Verified
				</span>
			)}
		</div>
	);
}

function MyProfilePage() {
	const navigate = useNavigate();
	const { data: studentResponse, isLoading, error } = useGetStudentProfile();
	const updateProfile = useUpdateStudent();
	const student = studentResponse?.data;

	const [isEditingGuardian, setIsEditingGuardian] = useState(false);
	const [isEditingAcademic, setIsEditingAcademic] = useState(false);
	const [isEditingPersonal, setIsEditingPersonal] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	// Form instances
	const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			address: "",
		},
	});

	const academicForm = useForm<z.infer<typeof academicInfoSchema>>({
		resolver: zodResolver(academicInfoSchema),
		defaultValues: {
			grade: "",
			class: "",
			section: "",
			currentLevel: "",
			gpa: 0,
			totalCredits: 0,
		},
	});

	const guardianForm = useForm<z.infer<typeof guardianInfoSchema>>({
		resolver: zodResolver(guardianInfoSchema),
		defaultValues: {
			guardianName: "",
			guardianPhone: "",
			guardianEmail: "",
		},
	});

	useEffect(() => {
		if (student && student.role?.name !== "Student")
			navigate({ to: "/dashboard" });
	}, [student, navigate]);

	useEffect(() => {
		if (student) {
			guardianForm.reset({
				guardianName: student.guardianName || "",
				guardianPhone: student.guardianPhone || "",
				guardianEmail: student.guardianEmail || "",
			});
			academicForm.reset({
				grade: student.grade || "",
				class: student.class || "",
				section: student.section || "",
				currentLevel: student.currentLevel || "",
				gpa: student.gpa || 0,
				totalCredits: student.totalCredits || 0,
			});
			personalForm.reset({
				name: student.name || "",
				email: student.email || "",
				phone: student.phone || "",
				address: student.address || "",
			});
		}
	}, [student, guardianForm, academicForm, personalForm]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const handlePersonalSubmit = async (
		values: z.infer<typeof personalInfoSchema>,
	) => {
		if (!student) return;
		try {
			const formData = new FormData();
			Object.keys(values).forEach((key) => {
				const value = values[key as keyof typeof values];
				if (value !== undefined && key !== "image") {
					formData.append(key, String(value));
				}
			});
			if (imageFile) formData.append("image", imageFile);
			await updateProfile.mutateAsync({ id: student.id, data: formData });
			setImageFile(null);
			setImagePreview(null);
			setIsEditingPersonal(false);
		} catch (error) {
			console.error("Failed to update personal info:", error);
		}
	};

	const handleAcademicSubmit = async (
		values: z.infer<typeof academicInfoSchema>,
	) => {
		if (!student) return;
		try {
			await updateProfile.mutateAsync({
				id: student.id,
				data: {
					...values,
					gpa: Number(values.gpa),
					totalCredits: Number(values.totalCredits),
				},
			});
			setIsEditingAcademic(false);
		} catch (error) {
			console.error("Failed to update academic info:", error);
		}
	};

	const handleGuardianSubmit = async (
		values: z.infer<typeof guardianInfoSchema>,
	) => {
		if (!student) return;
		try {
			await updateProfile.mutateAsync({ id: student.id, data: values });
			setIsEditingGuardian(false);
		} catch (error) {
			console.error("Failed to update guardian info:", error);
		}
	};

	const handleCancel = (type: "personal" | "academic" | "guardian") => {
		if (!student) return;
		if (type === "personal") {
			personalForm.reset({
				name: student.name || "",
				email: student.email || "",
				phone: student.phone || "",
				address: student.address || "",
			});
			setImageFile(null);
			setImagePreview(null);
			setIsEditingPersonal(false);
		} else if (type === "academic") {
			academicForm.reset({
				grade: student.grade || "",
				class: student.class || "",
				section: student.section || "",
				currentLevel: student.currentLevel || "",
				gpa: student.gpa || 0,
				totalCredits: student.totalCredits || 0,
			});
			setIsEditingAcademic(false);
		} else {
			guardianForm.reset({
				guardianName: student.guardianName || "",
				guardianPhone: student.guardianPhone || "",
				guardianEmail: student.guardianEmail || "",
			});
			setIsEditingGuardian(false);
		}
	};

	if (isLoading)
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Loading profile...</p>
				</div>
			</div>
		);
	if (error)
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="text-center">
					<p className="text-red-600 text-lg">Failed to load profile</p>
					<p className="text-gray-600 mt-2">{(error as Error).message}</p>
				</div>
			</div>
		);
	if (!student)
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<p className="text-gray-600">No profile data available</p>
			</div>
		);
	if (student.role?.name !== "Student")
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="text-center">
					<p className="text-red-600 text-lg">Access Denied</p>
					<p className="text-gray-600 mt-2">
						Only students can access this page
					</p>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="space-y-4 sm:space-y-6 pb-8 max-w-7xl mx-auto p-4 sm:p-6">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						My Profile
					</h1>
					<p className="text-sm sm:text-base text-gray-600 mt-1">
						View and manage your personal information
					</p>
				</div>

				<div className="bg-linear-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white shadow-xl">
					<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
						<ProfileAvatar image={student.image} name={student.name} />
						<div className="flex-1 text-center sm:text-left space-y-2 sm:space-y-3 w-full">
							<div>
								<h2 className="text-2xl sm:text-3xl font-bold wrap-break-word">
									{student.name}
								</h2>
								<p className="text-blue-100 text-sm sm:text-base break-all">
									{student.email}
								</p>
							</div>
							<StatusBadge
								status={student.academicStatus}
								verified={student.isVerified}
							/>
							<div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 pt-2">
								<div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2">
									<p className="text-xs text-blue-100">GPA</p>
									<p className="text-lg sm:text-2xl font-bold">
										{student.gpa?.toFixed(2) || "N/A"}
									</p>
								</div>
								<div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2">
									<p className="text-xs text-blue-100">Credits</p>
									<p className="text-lg sm:text-2xl font-bold">
										{student.totalCredits || 0}
									</p>
								</div>
								<div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2">
									<p className="text-xs text-blue-100">Grade</p>
									<p className="text-lg sm:text-2xl font-bold">
										{student.grade || "N/A"}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
					<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
								👤 Personal Information
							</h3>
							<button
								type="button"
								onClick={() => setIsEditingPersonal(true)}
								className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
							>
								Edit
							</button>
						</div>
						<div className="space-y-3 sm:space-y-4">
							<InfoItem label="Full Name" value={student.name} icon="📝" />
							<InfoItem label="Email" value={student.email} icon="📧" />
							<InfoItem label="Phone" value={student.phone} icon="📱" />
							<InfoItem label="Address" value={student.address} icon="🏠" />
							<InfoItem label="Roll ID" value={student.rollId} icon="🎓" />
						</div>
					</div>

					<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
								📚 Academic Information
							</h3>
							<button
								type="button"
								onClick={() => setIsEditingAcademic(true)}
								className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
							>
								Edit
							</button>
						</div>
						<div className="space-y-3 sm:space-y-4">
							<InfoItem label="Grade" value={student.grade} icon="🎯" />
							<InfoItem label="Class" value={student.class} icon="🏫" />
							<InfoItem label="Section" value={student.section} icon="📑" />
							<InfoItem label="Level" value={student.currentLevel} icon="📊" />
							<InfoItem label="GPA" value={student.gpa?.toFixed(2)} icon="⭐" />
							<InfoItem
								label="Credits"
								value={student.totalCredits}
								icon="🏆"
							/>
						</div>
					</div>

					<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
								👨‍👩‍👧 Guardian
							</h3>
							<button
								type="button"
								onClick={() => setIsEditingGuardian(true)}
								className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
							>
								Edit
							</button>
						</div>
						<div className="space-y-3 sm:space-y-4">
							<InfoItem label="Name" value={student.guardianName} icon="👤" />
							<InfoItem label="Phone" value={student.guardianPhone} icon="📱" />
							<InfoItem label="Email" value={student.guardianEmail} icon="📧" />
						</div>
					</div>

					<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
							⚙️ Status
						</h3>
						<div className="space-y-3 sm:space-y-4">
							<InfoItem
								label="Academic"
								value={student.academicStatus}
								icon="📋"
							/>
							<InfoItem
								label="Verified"
								value={student.isVerified ? "Yes ✓" : "No"}
								icon="✅"
							/>
							<InfoItem
								label="Active"
								value={student.isActive ? "Yes" : "No"}
								icon="🔵"
							/>
							{student.createdAt && (
								<InfoItem
									label="Since"
									value={new Date(student.createdAt).toLocaleDateString()}
									icon="📅"
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			<Modal
				isOpen={isEditingPersonal}
				onClose={() => handleCancel("personal")}
				title="Edit Personal Information"
			>
				<Form {...personalForm}>
					<form
						onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}
						className="space-y-4"
					>
						<FormItem>
							<FormLabel>Image</FormLabel>
							<FormControl>
								<Input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="w-full px-3 py-2 border rounded-lg"
								/>
							</FormControl>
							{(imagePreview || student.image) && (
								<img
									src={imagePreview || student.image || ""}
									alt="Preview"
									className="mt-3 w-24 h-24 rounded-lg object-cover border-2"
								/>
							)}
						</FormItem>

						<FormField
							control={personalForm.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={personalForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={personalForm.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="tel"
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={personalForm.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={3}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-3 pt-4">
							<button
								type="submit"
								disabled={updateProfile.isPending}
								className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
							>
								{updateProfile.isPending ? "Saving..." : "Save"}
							</button>
							<button
								type="button"
								onClick={() => handleCancel("personal")}
								className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
							>
								Cancel
							</button>
						</div>
					</form>
				</Form>
			</Modal>

			<Modal
				isOpen={isEditingAcademic}
				onClose={() => handleCancel("academic")}
				title="Edit Academic Information"
			>
				<Form {...academicForm}>
					<form
						onSubmit={academicForm.handleSubmit(handleAcademicSubmit)}
						className="space-y-4"
					>
						<FormField
							control={academicForm.control}
							name="grade"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Grade</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={academicForm.control}
							name="class"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Class</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={academicForm.control}
							name="section"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={academicForm.control}
							name="currentLevel"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Level</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={academicForm.control}
							name="gpa"
							render={({ field }) => (
								<FormItem>
									<FormLabel>GPA</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											step="0.01"
											onChange={(e) =>
												field.onChange(Number.parseFloat(e.target.value))
											}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={academicForm.control}
							name="totalCredits"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Credits</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											onChange={(e) =>
												field.onChange(Number.parseInt(e.target.value, 10))
											}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-3 pt-4">
							<button
								type="submit"
								disabled={updateProfile.isPending}
								className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
							>
								{updateProfile.isPending ? "Saving..." : "Save"}
							</button>
							<button
								type="button"
								onClick={() => handleCancel("academic")}
								className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
							>
								Cancel
							</button>
						</div>
					</form>
				</Form>
			</Modal>

			<Modal
				isOpen={isEditingGuardian}
				onClose={() => handleCancel("guardian")}
				title="Edit Guardian Information"
			>
				<Form {...guardianForm}>
					<form
						onSubmit={guardianForm.handleSubmit(handleGuardianSubmit)}
						className="space-y-4"
					>
						<FormField
							control={guardianForm.control}
							name="guardianName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={guardianForm.control}
							name="guardianPhone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="tel"
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={guardianForm.control}
							name="guardianEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											className="w-full px-3 py-2 border rounded-lg"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-3 pt-4">
							<button
								type="submit"
								disabled={updateProfile.isPending}
								className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
							>
								{updateProfile.isPending ? "Saving..." : "Save"}
							</button>
							<button
								type="button"
								onClick={() => handleCancel("guardian")}
								className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
							>
								Cancel
							</button>
						</div>
					</form>
				</Form>
			</Modal>
		</div>
	);
}
