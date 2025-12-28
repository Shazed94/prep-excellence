import type { TUpdateTeacher } from "@prepexcellence/shared-validators";
import { Loader2 } from "lucide-react";
// EditInstructorDialog.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Instructor } from "./view-instructor";

interface EditInstructorDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	instructor: Instructor | null;
	onSave: (data: TUpdateTeacher) => void;
	isLoading: boolean;
}

export default function EditInstructorDialog({
	open,
	onOpenChange,
	instructor,
	onSave,
	isLoading,
}: EditInstructorDialogProps) {
	const [formData, setFormData] = useState({
		experienceYears: 0,
		subjects: [] as string[],
		certifications: [] as string[],
		bio: "",
		user: {
			name: "",
			email: "",
			phone: "",
			address: "",
		},
	});

	const [subjectsInput, setSubjectsInput] = useState("");
	const [certificationsInput, setCertificationsInput] = useState("");

	useEffect(() => {
		if (instructor) {
			setFormData({
				experienceYears: instructor.experienceYears,
				subjects: instructor.subjects || [],
				certifications: instructor.certifications || [],
				bio: instructor.bio || "",
				user: {
					name: instructor.user?.name || "",
					email: instructor.user?.email || "",
					phone: instructor.user?.phone || "",
					address: instructor.user?.address || "",
				},
			});
			setSubjectsInput(instructor.subjects?.join(", ") || "");
			setCertificationsInput(instructor.certifications?.join(", ") || "");
		}
	}, [instructor]);

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleUserInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			user: {
				...prev.user,
				[field]: value,
			},
		}));
	};

	const handleSubjectsChange = (value: string) => {
		setSubjectsInput(value);
		const subjectsArray = value
			.split(",")
			.map((subject) => subject.trim())
			.filter((subject) => subject.length > 0);
		handleInputChange("subjects", subjectsArray);
	};

	const handleCertificationsChange = (value: string) => {
		setCertificationsInput(value);
		const certsArray = value
			.split(",")
			.map((cert) => cert.trim())
			.filter((cert) => cert.length > 0);
		handleInputChange("certifications", certsArray);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (instructor) {
			const updateData: TUpdateTeacher = {
				...formData,
				// id: instructor.id,
				// user: instructor.user
			};
			onSave(updateData);
		}
	};

	if (!instructor) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Instructor: {instructor.user?.name}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Personal Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Personal Information</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									value={formData.user.name}
									onChange={(e) =>
										handleUserInputChange("name", e.target.value)
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									type="email"
									value={formData.user.email}
									onChange={(e) =>
										handleUserInputChange("email", e.target.value)
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">Phone</Label>
								<Input
									type="tel"
									value={formData.user.phone}
									onChange={(e) =>
										handleUserInputChange("phone", e.target.value)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="experience">Experience (Years)</Label>
								<Input
									type="number"
									min="0"
									value={formData.experienceYears}
									onChange={(e) =>
										handleInputChange(
											"experienceYears",
											parseInt(e.target.value, 10) || 0,
										)
									}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="address">Address</Label>
							<Input
								value={formData.user.address}
								onChange={(e) =>
									handleUserInputChange("address", e.target.value)
								}
							/>
						</div>
					</div>

					{/* Professional Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Professional Information</h3>

						<div className="space-y-2">
							<Label htmlFor="subjects">Subjects (comma-separated)</Label>
							<Input
								value={subjectsInput}
								key={subjectsInput}
								onChange={(e) => handleSubjectsChange(e.target.value)}
								placeholder="e.g., Math, Physics, Chemistry"
							/>
							{formData.subjects.length > 0 && (
								<p className="text-sm text-gray-500">
									{formData.subjects.length} subject(s) added
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="certifications">
								Certifications (comma-separated)
							</Label>
							<Input
								value={certificationsInput}
								key={certificationsInput}
								onChange={(e) => handleCertificationsChange(e.target.value)}
								placeholder="e.g., TESOL, TEFL, CELTA"
							/>
							{formData.certifications.length > 0 && (
								<p className="text-sm text-gray-500">
									{formData.certifications.length} certification(s) added
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								value={formData.bio}
								key={formData.bio}
								onChange={(e) => handleInputChange("bio", e.target.value)}
								rows={4}
								placeholder="Write a brief bio about the instructor..."
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							Save Changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
