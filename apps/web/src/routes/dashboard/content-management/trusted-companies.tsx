import { useState } from "react";
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

export default function TrustedCompanies() {
	const [companies, setCompanies] = useState<{ id: number; name: string }[]>([
		{ id: 1, name: "Company A" },
		{ id: 2, name: "Company B" },
		{ id: 3, name: "Company C" },
	]);
	const [newCompany, setNewCompany] = useState("");

	const handleAddCompany = () => {
		if (!newCompany.trim()) return;
		const id = companies.length + 1;
		setCompanies([...companies, { id, name: newCompany }]);
		setNewCompany("");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold">Trusted Companies</h1>
					<p className="text-gray-600 mt-1">
						Manage the companies that are trusted by your users.
					</p>
				</div>

				{/* Add Company Button */}
				<Dialog>
					<DialogTrigger asChild>
						<Button className="bg-primary text-white hover:bg-primary/90 mt-4 md:mt-0">
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
								value={newCompany}
								onChange={(e) => setNewCompany(e.target.value)}
							/>
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

			{/* Table/List */}
			<div className="overflow-x-auto rounded-lg border bg-white">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
								#
							</th>
							<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
								Company Name
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{companies.map((company, index) => (
							<tr key={company.id}>
								<td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
								<td className="px-6 py-4 text-sm text-gray-700">
									{company.name}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
