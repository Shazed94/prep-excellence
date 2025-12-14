import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Company {
	id: string;
	name: string;
	logo: string; // image URL
	email?: string;
}

export const Route = createFileRoute(
	"/dashboard/content-management/trusted-companies",
)({
	component: TrustedCompanies,
});

export default function TrustedCompanies() {
	const [companies, setCompanies] = useState<Company[]>([
		{ id: "1", name: "Company A", logo: "https://via.placeholder.com/50" },
		{ id: "2", name: "Company B", logo: "https://via.placeholder.com/50" },
	]);

	//   const form = useForm({
	//     resolver: zodResolver(ZNewsletterSubscription),
	//     defaultValues: {
	//       name: "",
	//       logo: "",
	//     },
	//   });

	const [newCompanyName, setNewCompanyName] = useState("");
	const [newCompanyLogo, setNewCompanyLogo] = useState("");
	// const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

	const handleAddCompany = () => {
		if (!newCompanyName.trim() || !newCompanyLogo.trim()) return;
		const id = (companies.length + 1).toString();
		setCompanies([
			...companies,
			{ id, name: newCompanyName, logo: newCompanyLogo },
		]);
		setNewCompanyName("");
		setNewCompanyLogo("");
	};

	const handleDelete = (id: string) => {
		setCompanies(companies.filter((c) => c.id !== id));
	};

	const columns: ColumnDef<Company>[] = [
		{
			accessorKey: "sl",
			header: "SL",
			cell: ({ row }) => row.index + 1,
		},
		{
			accessorKey: "logo",
			header: "Logo",
			cell: ({ row }) => (
				<img
					src={row.getValue("logo")}
					alt={row.original.name}
					className="w-12 h-12 object-cover rounded"
				/>
			),
		},
		{
			accessorKey: "name",
			header: "Company Name",
			cell: ({ row }) => (
				<div className="truncate max-w-[200px]">{row.getValue("name")}</div>
			),
		},
		{
			id: "actions",
			header: () => <div className="text-right">Action</div>,
			cell: ({ row }) => {
				const original = row.original;
				return (
					<div className="flex justify-end gap-2">
						<DeleteConfirmationDialog
							trigger={
								<Button variant="destructive" size="sm">
									Delete
								</Button>
							}
							title="Delete Company"
							description={
								<>
									Are you sure you want to delete{" "}
									<span className="font-bold">{original.name}</span>?
								</>
							}
							confirmText="Delete"
							variant="destructive"
							onConfirm={() => handleDelete(original.id)}
						/>
					</div>
				);
			},
		},
	];

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			{/* Header + Add button */}
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold">Trusted Companies</h1>
					<p className="text-gray-600 mt-1">
						Manage companies that are trusted by your users.
					</p>
				</div>

				<Dialog>
					<DialogTrigger asChild>
						<Button className="bg-primary text-white hover:bg-primary/90">
							Add Company
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[400px]">
						<DialogHeader>
							<DialogTitle>Add Trusted Company</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col gap-4 mt-2">
							<Input
								placeholder="Company Name"
								value={newCompanyName}
								onChange={(e) => setNewCompanyName(e.target.value)}
							/>
							{/* <FormField
                control={form.control}
                name="thumbnail"
                render={() => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-slate-800 text-base">
                      Course Thumbnail
                    </FormLabel>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Upload className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {thumbnailPreview
                              ? "Change thumbnail"
                              : "Upload thumbnail"}
                          </p>
                          <p className="text-sm text-slate-500">
                            PNG, JPG up to 5MB. Recommended ratio 16:9.
                          </p>
                        </div>
                      </label>

                      {thumbnailPreview && (
                        <div className="w-full md:w-56">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-full h-32 object-cover rounded-lg border border-slate-200"
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              /> */}
						</div>
						<DialogFooter>
							<Button
								onClick={handleAddCompany}
								className="bg-primary text-white hover:bg-primary/90"
							>
								Add
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* DataTable */}
			<DataTable
				data={companies}
				columns={columns}
				searchKey="name"
				searchPlaceholder="Search by company name..."
				title=""
			/>
		</div>
	);
}
