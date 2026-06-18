import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PermissionPanelProps {
	permissions: string[];
	availablePermissions: Array<{ id: string; label: string }>;
}

export function PermissionPanel({
	permissions,
	availablePermissions,
}: PermissionPanelProps) {
	const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
		new Set(permissions),
	);

	const handlePermissionChange = (permissionId: string, checked: boolean) => {
		const newPermissions = new Set(selectedPermissions);
		if (checked) {
			newPermissions.add(permissionId);
		} else {
			newPermissions.delete(permissionId);
		}
		setSelectedPermissions(newPermissions);
	};

	return (
		<div className="space-y-4">
			<div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
				<h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
					Permission Management
				</h4>
				<p className="text-sm text-amber-800 dark:text-amber-200">
					Select which permissions this user should have access to
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{availablePermissions.map((permission) => (
					<div
						key={permission.id}
						className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
					>
						<Checkbox
							id={permission.id}
							checked={selectedPermissions.has(permission.id)}
							onCheckedChange={(checked) =>
								handlePermissionChange(permission.id, checked as boolean)
							}
						/>
						<Label htmlFor={permission.id} className="cursor-pointer flex-1">
							<div className="flex items-center gap-2">
								<span>{permission.label}</span>
								<Badge variant="outline" className="text-xs">
									{permission.id}
								</Badge>
							</div>
						</Label>
					</div>
				))}
			</div>

			{selectedPermissions.size > 0 && (
				<div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
					<h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">
						Active Permissions ({selectedPermissions.size})
					</h5>
					<div className="flex flex-wrap gap-2">
						{Array.from(selectedPermissions).map((perm) => {
							const permLabel =
								availablePermissions.find((p) => p.id === perm)?.label || perm;
							return (
								<Badge
									key={perm}
									className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
								>
									{permLabel}
								</Badge>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
