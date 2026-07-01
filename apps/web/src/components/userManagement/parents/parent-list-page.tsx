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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteParent, useGetParents } from "@/hooks/user-management";

export function ParentListPage() {
	const [searchTerm, setSearchTerm] = useState("");

	// ================= QUERIES =================
	const { data, isLoading } = useGetParents({ search: searchTerm });
	const deleteParent = useDeleteParent();

	const parents = data?.data ?? [];

	if (isLoading) return <p>Loading parents...</p>;

	return (
		<div className="p-8">
			{/* ================= HEADER ================= */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold">Parents</h1>
					<p className="text-muted-foreground">
						Manage parent / guardian accounts
					</p>
				</div>

				<Button asChild className="gap-2">
					<Link to="/dashboard/user-management/parents/add-parent">
						<Plus className="h-4 w-4" />
						Add Parent
					</Link>
				</Button>
			</div>

			{/* ================= SEARCH ================= */}
			<div className="mb-6 relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search by name or email..."
					className="pl-10"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* ================= LIST ================= */}
			<div className="grid gap-4">
				{parents.map((parent: any) => (
					<Card key={parent.id} className="hover:shadow cursor-pointer">
						<CardContent className="pt-6">
							<div className="flex items-center gap-4">
								<img
									src={parent?.image || "/placeholder.svg"}
									alt={parent?.name}
									className="w-12 h-12 rounded-full"
								/>

								<div className="flex-1">
									<h3 className="font-semibold">{parent?.name}</h3>
									<p className="text-sm text-muted-foreground">
										{parent?.email}
									</p>
									<p className="text-sm text-muted-foreground">
										{parent?.phone}
									</p>
								</div>

								<div className="flex gap-2">
									{/* EDIT */}
									<Button size="sm" variant="outline" asChild>
										<Link
											to="/dashboard/user-management/parents/$parentId"
											params={{ parentId: parent.id }}
										>
											<Edit2 className="h-3 w-3" />
										</Link>
									</Button>

									{/* DELETE */}
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
												<AlertDialogTitle>Delete Parent?</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to delete{" "}
													<strong>{parent?.name}</strong>? This action cannot
													be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>

											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													className="bg-destructive text-destructive-foreground"
													onClick={() => deleteParent.mutate(parent.id)}
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
		</div>
	);
}
