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
	useDeleteSystemUser,
	useGetSystemUserById,
	useGetSystemUsers,
} from "@/hooks/user-management";

export function SystemUserListPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	const { data, isLoading } = useGetSystemUsers({ search: searchTerm });
	console.log("dsdsdsdsd", data);
	const { data: selectedUser } = useGetSystemUserById(selectedUserId || "");
	const deleteUser = useDeleteSystemUser();

	const users = data?.data ?? [];

	if (isLoading) return <p>Loading system users...</p>;

	return (
		<div className="p-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold">System Users</h1>
					<p className="text-muted-foreground">Manage admin and system staff</p>
				</div>

				<Button asChild className="gap-2">
					<Link to="/dashboard/user-management/system-users/add-system-user">
						<Plus className="h-4 w-4" />
						Add System User
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
			{selectedUser ? (
				<Card>
					<CardHeader className="flex flex-row justify-between">
						<CardTitle>{selectedUser.name}</CardTitle>
						<Button variant="outline" onClick={() => setSelectedUserId(null)}>
							Back
						</Button>
					</CardHeader>

					<CardContent>
						<Tabs defaultValue="basic">
							<TabsList className="grid grid-cols-2 mb-6">
								<TabsTrigger value="basic">Basic Info</TabsTrigger>
								<TabsTrigger value="professional">Professional</TabsTrigger>
							</TabsList>

							<TabsContent value="basic">
								{/* <UserForm user={selectedUser} isNew={false} /> */}
							</TabsContent>

							<TabsContent value="professional">
								{/* <ProfessionalFieldsForm
									initialData={selectedUser?.professionalInfo}
									onSubmit={(data) =>
										console.log("Professional Info Submitted:", data)
									}
								/> */}
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			) : (
				/* LIST MODE */
				<div className="grid gap-4">
					{users.map((user: any) => (
						<Card key={user.id} className="hover:shadow cursor-pointer">
							<CardContent className="pt-6">
								<div className="flex items-center gap-4">
									<img
										src={user?.image || "/placeholder.svg"}
										className="w-12 h-12 rounded-full"
										alt={user?.name}
									/>

									<div className="flex-1">
										<h3 className="font-semibold">{user?.name}</h3>
										<p className="text-sm text-muted-foreground">
											{user?.email}
										</p>
										<p className="text-sm text-muted-foreground">
											{user?.phone}
										</p>
									</div>

									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => setSelectedUserId(user.id)}
										>
											<Edit2 className="h-3 w-3" />
										</Button>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													size="sm"
													variant="outline"
													className="text-destructive"
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											</AlertDialogTrigger>

											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Delete System User?
													</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete{" "}
														<strong>{data?.user?.user?.name}</strong>? This
														action cannot be undone.
													</AlertDialogDescription>
												</AlertDialogHeader>

												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														className="bg-destructive text-destructive-foreground"
														onClick={() => deleteUser.mutate(data?.user.id)}
													>
														Yes, Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
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
