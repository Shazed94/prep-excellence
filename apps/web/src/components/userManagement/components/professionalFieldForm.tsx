"use client";

import { Save } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FieldType = "text" | "select" | "date" | "number";

interface FieldConfig {
	label: string;
	field: string;
	type: FieldType;
	options?: string[];
}

interface ProfessionalFieldsFormProps {
	role: "student" | "teacher" | "parent" | "system-user";
	initialData?: Record<string, string | number | null>;
	onSubmit?: (data: Record<string, string>) => void;
	isSubmitting?: boolean;
}

const professionalFields: Record<string, FieldConfig[]> = {
	student: [
		{ label: "Student ID", field: "student_id", type: "text" },
		{
			label: "Grade Level",
			field: "grade_level",
			type: "select",
			options: ["9", "10", "11", "12"],
		},
		{ label: "Section", field: "section", type: "text" },
		{ label: "Date of Birth", field: "dob", type: "date" },
		{ label: "Guardian Name", field: "guardian_name", type: "text" },
	],

	teacher: [
		{ label: "Employee ID", field: "employee_id", type: "text" },
		{
			label: "Designation",
			field: "designation",
			type: "select",
			options: [
				"Assistant Teacher",
				"Teacher",
				"Senior Teacher",
				"Head of Department",
			],
		},
		{
			label: "Department",
			field: "department",
			type: "select",
			options: ["English", "Mathematics", "Science", "Social Studies", "PE"],
		},
		{ label: "Qualification", field: "qualification", type: "text" },
		{ label: "Experience (Years)", field: "experience", type: "number" },
		{ label: "Specialization", field: "specialization", type: "text" },
	],

	parent: [
		{
			label: "Relationship",
			field: "relationship",
			type: "select",
			options: ["Father", "Mother", "Guardian", "Other"],
		},
		{ label: "Occupation", field: "occupation", type: "text" },
		{ label: "Organization", field: "organization", type: "text" },
		{ label: "Emergency Contact", field: "emergency_contact", type: "text" },
	],

	"system-user": [
		{
			label: "Role",
			field: "role_name",
			type: "select",
			options: ["Administrator", "Manager", "Support Staff", "Moderator"],
		},
		{ label: "Department", field: "department", type: "text" },
		{ label: "Employee ID", field: "employee_id", type: "text" },
		{
			label: "Access Level",
			field: "access_level",
			type: "select",
			options: ["Super Admin", "Admin", "Manager", "Staff"],
		},
		{ label: "Assigned Modules", field: "assigned_modules", type: "text" },
	],
};

export function ProfessionalFieldsForm({
	role,
	initialData = {},
	onSubmit,
	isSubmitting = false,
}: ProfessionalFieldsFormProps) {
	const [formData, setFormData] = useState<Record<string, string>>({});
	const notesId = useId();

	const fields = professionalFields[role] ?? [];

	// 🔹 Hydrate form when editing
	useEffect(() => {
		if (initialData) {
			const normalizedData: Record<string, string> = {};
			Object.entries(initialData).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					normalizedData[key] = String(value);
				}
			});
			setFormData(normalizedData);
		}
	}, [initialData]);

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = () => {
		onSubmit?.(formData);
	};

	return (
		<div className="space-y-6">
			{/* INFO BOX */}
			<div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
				<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
					Role-Based Professional Information
				</h3>
				<p className="text-sm text-blue-800 dark:text-blue-200">
					Information specific to the <strong>{role}</strong> role
				</p>
			</div>

			{/* FIELDS */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{fields.map((field) => (
					<div key={field.field}>
						<Label htmlFor={field.field}>{field.label}</Label>

						{field.type === "select" ? (
							<Select
								value={formData[field.field] ?? ""}
								onValueChange={(value) => handleChange(field.field, value)}
							>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder={`Select ${field.label}`} />
								</SelectTrigger>
								<SelectContent>
									{field.options?.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<Input
								id={field.field}
								type={field.type}
								value={formData[field.field] ?? ""}
								onChange={(e) => handleChange(field.field, e.target.value)}
								className="mt-2"
							/>
						)}
					</div>
				))}
			</div>

			{/* NOTES */}
			<div>
				<Label htmlFor={notesId}>Additional Notes</Label>
				<Textarea
					id={notesId}
					rows={4}
					value={formData.notes ?? ""}
					onChange={(e) => handleChange("notes", e.target.value)}
					className="mt-2"
					placeholder="Add any additional information…"
				/>
			</div>

			{/* ACTION */}
			<div className="flex gap-2 pt-4">
				<Button
					onClick={handleSubmit}
					disabled={isSubmitting}
					className="gap-2"
				>
					<Save className="h-4 w-4" />
					Save Professional Details
				</Button>
			</div>
		</div>
	);
}
