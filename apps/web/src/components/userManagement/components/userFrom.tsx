"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSystemUser } from "@/hooks/user-management";
import { PermissionPanel } from "./permissionPanel";

export function UserForm({ user }: any) {
	const updateUser = useUpdateSystemUser();

	const [formData, setFormData] = useState({
		name: user?.user?.name,
		email: user?.user?.email,
		phone: user?.user?.phone,
		image: user?.user?.image || "",
		isStaff: user?.user?.isStaff,
		permissions: user?.user?.permissions || [],
	});

	const handleSave = () => {
		updateUser.mutate({
			id: user.id,
			data: {
				...formData,
				jobTitle: "ADMIN",
				department: user.department,
				qualifications: user.qualifications || [],
				certifications: user.certifications || [],
				experienceYears: user.experienceYears || 0,
				address: user.address || "",
				bio: user.bio || "",
				isVerified: user.isVerified,
			},
		});
	};

	return (
		<div className="space-y-6">
			<div className="grid md:grid-cols-2 gap-4">
				<div>
					<Label>Full Name</Label>
					<Input
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					/>
				</div>

				<div>
					<Label>Email</Label>
					<Input value={formData.email} disabled />
				</div>

				<div>
					<Label>Phone</Label>
					<Input
						value={formData.phone}
						onChange={(e) =>
							setFormData({ ...formData, phone: e.target.value })
						}
					/>
				</div>

				<div>
					<Label>Profile Image</Label>
					<Input
						value={formData.image}
						onChange={(e) =>
							setFormData({ ...formData, image: e.target.value })
						}
					/>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Checkbox
					checked={formData.isStaff}
					onCheckedChange={(v) =>
						setFormData({ ...formData, isStaff: Boolean(v) })
					}
				/>
				<Label>Staff User</Label>
			</div>

			<PermissionPanel
				permissions={formData.permissions}
				availablePermissions={[
					{ id: "manage_users", label: "Manage Users" },
					{ id: "view_reports", label: "View Reports" },
					{ id: "manage_all", label: "Full Access" },
				]}
			/>

			<div className="flex gap-2">
				<Button onClick={handleSave}>
					<Check className="h-4 w-4" />
					Update
				</Button>
				<Button variant="outline">
					<X className="h-4 w-4" />
					Cancel
				</Button>
			</div>
		</div>
	);
}
