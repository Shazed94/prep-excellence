// "use client";

// import { createFileRoute, useNavigate } from "@tanstack/react-router";
// import { useEffect, useId, useState } from "react";
// import {
// 	useGetTeacherProfile,
// 	useUpdateTeacher,
// } from "@/hooks/user-management";
// export const Route = createFileRoute("/dashboard/teacher/my-profile/")({
// 	component: TeacherProfilePage,
// });

// // Modal Component
// function Modal({
// 	isOpen,
// 	onClose,
// 	title,
// 	children,
// }: {
// 	isOpen: boolean;
// 	onClose: () => void;
// 	title: string;
// 	children: React.ReactNode;
// }) {
// 	if (!isOpen) return null;

// 	return (
// 		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
// 			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
// 				<div className="bg-linear-to-r from-amber-600 to-orange-600 px-6 py-4 flex justify-between items-center">
// 					<h3 className="text-xl font-bold text-white">{title}</h3>
// 					<button
// 						type="button"
// 						onClick={onClose}
// 						className="text-white hover:text-gray-200 transition-colors text-2xl leading-none"
// 					>
// 						×
// 					</button>
// 				</div>
// 				<div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
// 					{children}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// // Avatar Component
// function ProfileAvatar({
// 	image,
// 	name,
// }: {
// 	image?: string | null;
// 	name: string;
// }) {
// 	return (
// 		<div className="relative">
// 			{image ? (
// 				<img
// 					src={image}
// 					alt={name}
// 					className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
// 				/>
// 			) : (
// 				<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-blue-400 to-pink-400 flex items-center justify-center border-4 border-white shadow-lg">
// 					<span className="text-3xl sm:text-4xl font-bold text-white">
// 						{name?.charAt(0)?.toUpperCase() || "?"}
// 					</span>
// 				</div>
// 			)}
// 			<div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full border-4 border-white"></div>
// 		</div>
// 	);
// }

// // Info Item Component
// function InfoItem({
// 	label,
// 	value,
// 	icon,
// }: {
// 	label: string;
// 	value?: string | number;
// 	icon?: string;
// }) {
// 	return (
// 		<div className="space-y-1">
// 			<p className="text-sm text-gray-500 flex items-center gap-2">
// 				{icon && <span>{icon}</span>}
// 				{label}
// 			</p>
// 			<p className="font-medium text-gray-900 wrap-break-word">
// 				{value || "N/A"}
// 			</p>
// 		</div>
// 	);
// }

// // Status Badge Component
// function StatusBadge({ isActive, role }: { isActive: boolean; role?: string }) {
// 	return (
// 		<div className="flex flex-wrap gap-2">
// 			<span
// 				className={`px-3 py-1 rounded-full text-xs font-semibold border ${
// 					isActive
// 						? "bg-emerald-100 text-emerald-800 border-emerald-200"
// 						: "bg-gray-100 text-gray-800 border-gray-200"
// 				}`}
// 			>
// 				{isActive ? "Active" : "Inactive"}
// 			</span>
// 			{role && (
// 				<span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
// 					👨‍🏫 {role}
// 				</span>
// 			)}
// 		</div>
// 	);
// }

// // Badge List Component
// function BadgeList({
// 	items,
// 	label,
// 	icon,
// }: {
// 	items?: string[];
// 	label: string;
// 	icon?: string;
// }) {
// 	return (
// 		<div className="space-y-3">
// 			<p className="text-sm font-medium text-gray-500 flex items-center gap-2">
// 				{icon && <span>{icon}</span>}
// 				{label}
// 			</p>
// 			<div className="flex flex-wrap gap-2">
// 				{items && items.length > 0 ? (
// 					items.map((item, idx) => (
// 						<span
// 							key={idx}
// 							className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
// 						>
// 							{item}
// 						</span>
// 					))
// 				) : (
// 					<span className="text-sm text-gray-500">None</span>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

// function TeacherProfilePage() {
// 	const navigate = useNavigate();
// 	const { data: teacherResponse, isLoading, error } = useGetTeacherProfile();
// 	const updateProfile = useUpdateTeacher();
// 	const profileImageId = useId();
// 	const fullNameId = useId();
// 	const emailId = useId();
// 	const phoneId = useId();
// 	const addressId = useId();
// 	const bioId = useId();
// 	const experienceYearsId = useId();
// 	const qualificationsId = useId();
// 	const certificationsId = useId();
// 	const subjectsId = useId();

// 	const teacher = teacherResponse?.data;

// 	const [isEditingPersonal, setIsEditingPersonal] = useState(false);
// 	const [isEditingProfessional, setIsEditingProfessional] = useState(false);
// 	const [isEditingAcademic, setIsEditingAcademic] = useState(false);
// 	const [imageFile, setImageFile] = useState<File | null>(null);
// 	const [imagePreview, setImagePreview] = useState<string | null>(null);

// 	const [personalForm, setPersonalForm] = useState({
// 		name: "",
// 		email: "",
// 		phone: "",
// 		address: "",
// 		bio: "",
// 	});

// 	const [professionalForm, setProfessionalForm] = useState({
// 		experienceYears: 0,
// 	});

// 	const [academicForm, setAcademicForm] = useState({
// 		qualifications: "",
// 		certifications: "" as string,
// 		subjects: "" as string,
// 	});

// 	// Check role-based access
// 	useEffect(() => {
// 		if (teacher && teacher.role?.name !== "Teacher") {
// 			navigate({ to: "/dashboard" });
// 		}
// 	}, [teacher, navigate]);

// 	// Update forms when teacher data loads
// 	useEffect(() => {
// 		if (teacher) {
// 			setPersonalForm({
// 				name: teacher.name || "",
// 				email: teacher.email || "",
// 				phone: teacher.phone || "",
// 				address: teacher.address || "",
// 				bio: teacher.bio || "",
// 			});

// 			setProfessionalForm({
// 				experienceYears: teacher.experienceYears || 0,
// 			});

// 			setAcademicForm({
// 				qualifications: teacher.qualifications || "",
// 				certifications: Array.isArray(teacher.certifications)
// 					? teacher.certifications.join(", ")
// 					: "",
// 				subjects: Array.isArray(teacher.subjects)
// 					? teacher.subjects.join(", ")
// 					: "",
// 			});
// 		}
// 	}, [teacher]);

// 	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = e.target.files?.[0];
// 		if (file) {
// 			setImageFile(file);
// 			const reader = new FileReader();
// 			reader.onloadend = () => {
// 				setImagePreview(reader.result as string);
// 			};
// 			reader.readAsDataURL(file);
// 		}
// 	};

// 	const handleSavePersonal = async () => {
// 		if (!teacher) return;
// 		try {
// 			const formData = new FormData();

// 			Object.keys(personalForm).forEach((key) => {
// 				formData.append(key, personalForm[key as keyof typeof personalForm]);
// 			});

// 			if (imageFile) {
// 				formData.append("image", imageFile);
// 			}

// 			await updateProfile.mutateAsync({
// 				id: teacher.id,
// 				data: formData,
// 			});
// 			setIsEditingPersonal(false);
// 			setImageFile(null);
// 			setImagePreview(null);
// 		} catch (error) {
// 			console.error("Failed to update personal info:", error);
// 		}
// 	};

// 	const handleCancelPersonal = () => {
// 		if (!teacher) return;
// 		setPersonalForm({
// 			name: teacher.name || "",
// 			email: teacher.email || "",
// 			phone: teacher.phone || "",
// 			address: teacher.address || "",
// 			bio: teacher.bio || "",
// 		});
// 		setImageFile(null);
// 		setImagePreview(null);
// 		setIsEditingPersonal(false);
// 	};

// 	const handleSaveProfessional = async () => {
// 		if (!teacher) return;
// 		try {
// 			await updateProfile.mutateAsync({
// 				id: teacher.id,
// 				data: {
// 					experienceYears: professionalForm.experienceYears,
// 				},
// 			});
// 			setIsEditingProfessional(false);
// 		} catch (error) {
// 			console.error("Failed to update professional info:", error);
// 		}
// 	};

// 	const handleCancelProfessional = () => {
// 		if (!teacher) return;
// 		setProfessionalForm({
// 			experienceYears: teacher.experienceYears || 0,
// 		});
// 		setIsEditingProfessional(false);
// 	};

// 	const handleSaveAcademic = async () => {
// 		if (!teacher) return;
// 		try {
// 			await updateProfile.mutateAsync({
// 				id: teacher.id,
// 				data: {
// 					qualifications: academicForm.qualifications,
// 					certifications: academicForm.certifications
// 						.split(",")
// 						.map((c) => c.trim())
// 						.filter(Boolean),
// 					subjects: academicForm.subjects
// 						.split(",")
// 						.map((s) => s.trim())
// 						.filter(Boolean),
// 				},
// 			});
// 			setIsEditingAcademic(false);
// 		} catch (error) {
// 			console.error("Failed to update academic info:", error);
// 		}
// 	};

// 	const handleCancelAcademic = () => {
// 		if (!teacher) return;
// 		setAcademicForm({
// 			qualifications: teacher.qualifications || "",
// 			certifications: Array.isArray(teacher.certifications)
// 				? teacher.certifications.join(", ")
// 				: "",
// 			subjects: Array.isArray(teacher.subjects)
// 				? teacher.subjects.join(", ")
// 				: "",
// 		});
// 		setIsEditingAcademic(false);
// 	};

// 	if (isLoading) {
// 		return (
// 			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// 				<div className="text-center">
// 					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
// 					<p className="mt-4 text-gray-600">Loading profile...</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	if (error) {
// 		return (
// 			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// 				<div className="text-center">
// 					<p className="text-red-600 text-lg">Failed to load profile</p>
// 					<p className="text-gray-600 mt-2">{(error as Error).message}</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	if (!teacher) {
// 		return (
// 			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// 				<p className="text-gray-600">No profile data available</p>
// 			</div>
// 		);
// 	}

// 	if (teacher.role?.name !== "Teacher") {
// 		return (
// 			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// 				<div className="text-center">
// 					<p className="text-red-600 text-lg">Access Denied</p>
// 					<p className="text-gray-600 mt-2">
// 						Only teachers can access this page
// 					</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	const certifications = Array.isArray(teacher.certifications)
// 		? teacher.certifications
// 		: [];

// 	const subjects = Array.isArray(teacher.subjects) ? teacher.subjects : [];

// 	return (
// 		<div className="min-h-screen bg-gray-50">
// 			<div className="space-y-4 sm:space-y-6 pb-8 max-w-7xl mx-auto p-4 sm:p-6">
// 				{/* Header */}
// 				<div className="flex justify-between items-start">
// 					<div>
// 						<h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
// 							Teacher Profile
// 						</h1>
// 						<p className="text-sm sm:text-base text-gray-600 mt-1">
// 							View and manage your professional information
// 						</p>
// 					</div>
// 				</div>

// 				{/* Profile Header Card */}
// 				<div className="bg-linear-to-r from-blue-500 to-pink-400 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white shadow-xl">
// 					<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
// 						<ProfileAvatar image={teacher.image} name={teacher.name} />

// 						<div className="flex-1 text-center sm:text-left space-y-2 sm:space-y-3 w-full">
// 							<div>
// 								<h2 className="text-2xl sm:text-4xl font-bold wrap-break-word">
// 									{teacher.name}
// 								</h2>
// 								<p className="text-amber-100 text-sm sm:text-lg break-all">
// 									{teacher.email}
// 								</p>
// 							</div>

// 							<StatusBadge
// 								isActive={teacher.isActive}
// 								role={teacher.role?.name}
// 							/>

// 							<div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 pt-2">
// 								<div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2">
// 									<p className="text-xs text-amber-100">Experience</p>
// 									<p className="text-lg sm:text-2xl font-bold">
// 										{teacher.experienceYears || 0} yrs
// 									</p>
// 								</div>
// 								<div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2">
// 									<p className="text-xs text-amber-100">Status</p>
// 									<p className="text-lg sm:text-2xl font-bold">
// 										{teacher.isActive ? "Active" : "Inactive"}
// 									</p>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Information Grid */}
// 				<div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
// 					{/* Personal Information */}
// 					<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
// 						<div className="flex justify-between items-center mb-4">
// 							<h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
// 								👤 Personal Information
// 							</h3>
// 							<button
// 								type="button"
// 								onClick={() => setIsEditingPersonal(true)}
// 								className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
// 							>
// 								Edit
// 							</button>
// 						</div>

// 						<div className="space-y-3 sm:space-y-4">
// 							<InfoItem label="Full Name" value={teacher.name} icon="📝" />
// 							<InfoItem label="Email Address" value={teacher.email} icon="📧" />
// 							<InfoItem label="Phone Number" value={teacher.phone} icon="📱" />
// 							<InfoItem label="Address" value={teacher.address} icon="🏠" />
// 							<InfoItem label="Bio" value={teacher.bio} icon="💬" />
// 							<InfoItem label="Role" value={teacher.role?.name} icon="👨‍🏫" />
// 						</div>
// 					</div>

// 					{/* Professional Information */}
// 					<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
// 						<div className="flex justify-between items-center mb-4">
// 							<h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
// 								💼 Professional Information
// 							</h3>
// 							<button
// 								type="button"
// 								onClick={() => setIsEditingProfessional(true)}
// 								className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
// 							>
// 								Edit
// 							</button>
// 						</div>

// 						<div className="space-y-3 sm:space-y-4">
// 							<InfoItem
// 								label="Experience Years"
// 								value={teacher.experienceYears}
// 								icon="⏱️"
// 							/>
// 							<InfoItem label="User ID" value={teacher.userId} icon="🆔" />
// 						</div>
// 					</div>

// 					{/* Academic Information */}
// 					<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm sm:col-span-2">
// 						<div className="flex justify-between items-center mb-4">
// 							<h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
// 								📚 Academic Information
// 							</h3>
// 							<button
// 								type="button"
// 								onClick={() => setIsEditingAcademic(true)}
// 								className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
// 							>
// 								Edit
// 							</button>
// 						</div>

// 						<div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
// 							<div className="space-y-4">
// 								<InfoItem
// 									label="Qualifications"
// 									value={teacher.qualifications}
// 									icon="🎓"
// 								/>
// 							</div>
// 							<div className="space-y-4">
// 								<BadgeList
// 									items={certifications}
// 									label="Certifications"
// 									icon="📜"
// 								/>
// 								<BadgeList items={subjects} label="Subjects" icon="📖" />
// 							</div>
// 						</div>
// 					</div>

// 					{/* Account Status */}
// 					<div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm sm:col-span-2">
// 						<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
// 							⚙️ Account Status
// 						</h3>
// 						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
// 							<InfoItem
// 								label="Account Status"
// 								value={teacher.isActive ? "Active" : "Inactive"}
// 								icon="✅"
// 							/>
// 							<InfoItem
// 								label="Email Verified"
// 								value={teacher.isVerified ? "Yes" : "No"}
// 								icon="📧"
// 							/>
// 							<InfoItem
// 								label="Created At"
// 								value={new Date(teacher.createdAt).toLocaleDateString()}
// 								icon="📅"
// 							/>
// 							<InfoItem
// 								label="Updated At"
// 								value={new Date(teacher.updatedAt).toLocaleDateString()}
// 								icon="🔄"
// 							/>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			<Modal
// 				isOpen={isEditingPersonal}
// 				onClose={handleCancelPersonal}
// 				title="Edit Personal Information"
// 			>
// 				<div className="space-y-4">
// 					<div>
// 						<label
// 							htmlFor={profileImageId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Profile Image
// 						</label>
// 						<input
// 							id={profileImageId}
// 							type="file"
// 							accept="image/*"
// 							onChange={handleImageChange}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 						/>
// 						{(imagePreview || teacher.image) && (
// 							<img
// 								src={imagePreview || teacher.image || ""}
// 								alt="Preview"
// 								className="mt-3 w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
// 							/>
// 						)}
// 					</div>

// 					<div>
// 						<label
// 							htmlFor={fullNameId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Full Name
// 						</label>
// 						<input
// 							id={fullNameId}
// 							type="text"
// 							value={personalForm.name}
// 							onChange={(e) =>
// 								setPersonalForm({ ...personalForm, name: e.target.value })
// 							}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 						/>
// 					</div>

// 					<div>
// 						<label
// 							htmlFor={emailId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Email Address
// 						</label>
// 						<input
// 							id={emailId}
// 							type="email"
// 							value={personalForm.email}
// 							onChange={(e) =>
// 								setPersonalForm({ ...personalForm, email: e.target.value })
// 							}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 						/>
// 					</div>

// 					<div>
// 						<label
// 							htmlFor={phoneId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Phone Number
// 						</label>
// 						<input
// 							id={phoneId}
// 							type="tel"
// 							value={personalForm.phone}
// 							onChange={(e) =>
// 								setPersonalForm({ ...personalForm, phone: e.target.value })
// 							}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 						/>
// 					</div>

// 					<div>
// 						<label
// 							htmlFor={addressId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Address
// 						</label>
// 						<input
// 							id={addressId}
// 							type="text"
// 							value={personalForm.address}
// 							onChange={(e) =>
// 								setPersonalForm({ ...personalForm, address: e.target.value })
// 							}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 						/>
// 					</div>

// 					<div>
// 						<label
// 							htmlFor={bioId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Bio
// 						</label>
// 						<textarea
// 							id={bioId}
// 							value={personalForm.bio}
// 							onChange={(e) =>
// 								setPersonalForm({ ...personalForm, bio: e.target.value })
// 							}
// 							rows={3}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 						/>
// 					</div>

// 					<div className="flex gap-3 pt-4">
// 						<button
// 							type="button"
// 							onClick={handleSavePersonal}
// 							disabled={updateProfile.isPending}
// 							className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
// 						>
// 							{updateProfile.isPending ? "Saving..." : "Save Changes"}
// 						</button>
// 						<button
// 							type="button"
// 							onClick={handleCancelPersonal}
// 							disabled={updateProfile.isPending}
// 							className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
// 						>
// 							Cancel
// 						</button>
// 					</div>
// 				</div>
// 			</Modal>

// 			{/* Professional Information Edit Modal */}
// 			<Modal
// 				isOpen={isEditingProfessional}
// 				onClose={handleCancelProfessional}
// 				title="Edit Professional Information"
// 			>
// 				<div className="space-y-4">
// 					<div>
// 						<label
// 							htmlFor={experienceYearsId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Experience Years
// 						</label>
// 						<input
// 							id={experienceYearsId}
// 							type="number"
// 							min="0"
// 							value={professionalForm.experienceYears}
// 							onChange={(e) =>
// 								setProfessionalForm({
// 									...professionalForm,
// 									experienceYears: Number(e.target.value),
// 								})
// 							}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 						/>
// 					</div>

// 					<div className="flex gap-3 pt-4">
// 						<button
// 							type="button"
// 							onClick={handleSaveProfessional}
// 							disabled={updateProfile.isPending}
// 							className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
// 						>
// 							{updateProfile.isPending ? "Saving..." : "Save Changes"}
// 						</button>
// 						<button
// 							type="button"
// 							onClick={handleCancelProfessional}
// 							disabled={updateProfile.isPending}
// 							className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
// 						>
// 							Cancel
// 						</button>
// 					</div>
// 				</div>
// 			</Modal>

// 			{/* Academic Information Edit Modal */}
// 			<Modal
// 				isOpen={isEditingAcademic}
// 				onClose={handleCancelAcademic}
// 				title="Edit Academic Information"
// 			>
// 				<div className="space-y-4">
// 					<div>
// 						<label
// 							htmlFor={qualificationsId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Qualifications
// 						</label>
// 						<input
// 							id={qualificationsId}
// 							type="text"
// 							value={academicForm.qualifications}
// 							onChange={(e) =>
// 								setAcademicForm({
// 									...academicForm,
// 									qualifications: e.target.value,
// 								})
// 							}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 							placeholder="e.g., M.Ed, B.Sc in Mathematics"
// 						/>
// 					</div>

// 					<div>
// 						<label
// 							htmlFor={certificationsId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Certifications
// 						</label>
// 						<textarea
// 							id={certificationsId}
// 							value={academicForm.certifications}
// 							onChange={(e) =>
// 								setAcademicForm({
// 									...academicForm,
// 									certifications: e.target.value,
// 								})
// 							}
// 							rows={3}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 							placeholder="Enter certifications separated by commas"
// 						/>
// 						<p className="text-xs text-gray-500 mt-1">
// 							Separate multiple certifications with commas
// 						</p>
// 					</div>

// 					<div>
// 						<label
// 							htmlFor={subjectsId}
// 							className="block text-sm font-medium text-gray-700 mb-2"
// 						>
// 							Subjects
// 						</label>
// 						<textarea
// 							id={subjectsId}
// 							value={academicForm.subjects}
// 							onChange={(e) =>
// 								setAcademicForm({ ...academicForm, subjects: e.target.value })
// 							}
// 							rows={3}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
// 							placeholder="Enter subjects separated by commas"
// 						/>
// 						<p className="text-xs text-gray-500 mt-1">
// 							Separate multiple subjects with commas
// 						</p>
// 					</div>

// 					<div className="flex gap-3 pt-4">
// 						<button
// 							type="button"
// 							onClick={handleSaveAcademic}
// 							disabled={updateProfile.isPending}
// 							className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
// 						>
// 							{updateProfile.isPending ? "Saving..." : "Save Changes"}
// 						</button>
// 						<button
// 							type="button"
// 							onClick={handleCancelAcademic}
// 							disabled={updateProfile.isPending}
// 							className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
// 						>
// 							Cancel
// 						</button>
// 					</div>
// 				</div>
// 			</Modal>
// 		</div>
// 	);
// }
