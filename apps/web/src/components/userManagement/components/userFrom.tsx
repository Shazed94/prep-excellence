"use client";

import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSystemUser } from "@/hooks/user-management";

type UserFormValues = {
	name: string;
	email: string;
	phone?: string;
	image?: string;
};

export function UserForm({ user }: any) {
	const updateUser = useUpdateSystemUser();

	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<UserFormValues>({
		defaultValues: {
			name: user?.user?.name || "",
			email: user?.user?.email || "",
			phone: user?.user?.phone || "",
			image: user?.user?.image || "",
		},
	});

	const onSubmit = (data: UserFormValues) => {
		updateUser.mutate({
			id: user.id,
			data,
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="grid md:grid-cols-2 gap-4">
				<div>
					<Label>Full Name</Label>
					<Input {...register("name", { required: true })} />
				</div>

				<div>
					<Label>Email</Label>
					<Input {...register("email")} disabled />
				</div>

				<div>
					<Label>Phone</Label>
					<Input {...register("phone")} />
				</div>

				<div>
					<Label>Profile Image</Label>
					<Input {...register("image")} />
				</div>
			</div>

			<div className="flex gap-2">
				<Button type="submit" disabled={isSubmitting}>
					<Check className="h-4 w-4 mr-1" />
					Update
				</Button>

				<Button type="button" variant="outline">
					<X className="h-4 w-4 mr-1" />
					Cancel
				</Button>
			</div>
		</form>
	);
}
