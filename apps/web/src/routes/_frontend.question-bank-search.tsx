import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	useGetDomains,
	useGetSubjects,
	useGetTestTypes,
} from "@/hooks/sat-practice";

export const Route = createFileRoute("/_frontend/question-bank-search")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [selectedTestTypeId, setSelectedTestTypeId] = useState<string>("");
	const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
	const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>([]);

	// Fetch test types
	const { data: testTypesData, isLoading: isLoadingTestTypes } =
		useGetTestTypes({
			page: 1,
			limit: 100,
			search: "SAT",
		});

	// Fetch subjects based on selected test type
	const { data: subjectsData, isLoading: isLoadingSubjects } = useGetSubjects({
		page: 1,
		limit: 100,
		filters: selectedTestTypeId
			? { testTypeId: selectedTestTypeId }
			: undefined,
	});

	// Fetch domains based on selected subject
	const { data: domainsData, isLoading: isLoadingDomains } = useGetDomains({
		page: 1,
		limit: 100,
		filters: selectedSubjectId ? { subjectId: selectedSubjectId } : undefined,
	});

	const testTypes = testTypesData?.data || [];
	const subjects = subjectsData?.data || [];
	const domains = domainsData?.data || [];

	// Reset subject when test type changes
	useEffect(() => {
		if (selectedTestTypeId) {
			setSelectedSubjectId("");
			setSelectedDomainIds([]);
		}
	}, [selectedTestTypeId]);

	// Reset domains when subject changes
	useEffect(() => {
		if (selectedSubjectId) {
			setSelectedDomainIds([]);
		}
	}, [selectedSubjectId]);

	// Get display names for summary
	const selectedTestType = testTypes.find(
		(t: any) => t.id === selectedTestTypeId,
	);
	const selectedSubject = subjects.find((s: any) => s.id === selectedSubjectId);
	const selectedDomains = domains.filter((d: any) =>
		selectedDomainIds.includes(d.id),
	);

	const toggleDomain = (domainId: string) => {
		setSelectedDomainIds((prev) =>
			prev.includes(domainId)
				? prev.filter((d) => d !== domainId)
				: [...prev, domainId],
		);
	};

	const handleSearch = () => {
		navigate({
			to: "/question-bank-show",
			search: {
				testTypeId: selectedTestTypeId || undefined,
				subjectId: selectedSubjectId || undefined,

				domainIds:
					selectedDomainIds.length > 0
						? selectedDomainIds.join(",")
						: undefined,
			},
		});
	};

	return (
		<div className="bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<main className="px-4 sm:px-6 py-12">
				<div className="container mx-auto grid lg:grid-cols-[1fr_320px] gap-2">
					{/* ================= LEFT: FILTERS ================= */}
					<div className="space-y-2">
						{/* Header */}
						<div>
							<Badge className="mb-3 bg-blue-50 text-[#0086C5] border-blue-100">
								Question Builder
							</Badge>

							<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
								Build Your Question Set
							</h1>

							<p className="text-slate-600 mt-2 max-w-xl">
								Choose assessment, section and domains to instantly generate
								targeted SAT questions.
							</p>
						</div>

						<div className="flex gap-4 justify-center items-center sm:flex-row flex-col w-full">
							{/* Step 1 */}
							<Card className="rounded-2xl gap-1 w-full ">
								<CardHeader className="pb-0 py-0 pt-4 px-4">
									<CardTitle className="text-base flex items-center gap-2">
										<CheckCircle2 className="w-4 h-4 text-blue-600" />
										Assessment Type
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0  px-4">
									<Select
										value={selectedTestTypeId}
										onValueChange={setSelectedTestTypeId}
									>
										<SelectTrigger className=" rounded-md w-full">
											<SelectValue placeholder="Select assessment type" />
										</SelectTrigger>
										<SelectContent>
											{isLoadingTestTypes ? (
												<div className="flex items-center justify-center py-2">
													<Loader2 className="w-4 h-4 animate-spin" />
												</div>
											) : (
												testTypes.map((testType: any) => (
													<SelectItem key={testType.id} value={testType.id}>
														{testType.name}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								</CardContent>
							</Card>

							{/* Step 2 */}
							<Card className="rounded-2xl gap-1 w-full ">
								<CardHeader className="pb-0 py-0 pt-4 px-4">
									<CardTitle className="text-base flex items-center gap-2">
										<CheckCircle2 className="w-4 h-4 text-blue-600" />
										Section
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0  px-4">
									<Select
										value={selectedSubjectId}
										onValueChange={setSelectedSubjectId}
										disabled={!selectedTestTypeId}
									>
										<SelectTrigger className=" rounded-md w-full">
											<SelectValue
												placeholder={
													selectedTestTypeId
														? "Select section"
														: "Select assessment first"
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{isLoadingSubjects ? (
												<div className="flex items-center justify-center py-2">
													<Loader2 className="w-4 h-4 animate-spin" />
												</div>
											) : (
												subjects.map((subject: any) => (
													<SelectItem key={subject.id} value={subject.id}>
														{subject.name}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								</CardContent>
							</Card>
						</div>

						{/* Step 3 */}
						<Card className="rounded-2xl gap-1">
							<CardHeader className="pb-0 py-0 pt-4 px-4">
								<CardTitle className="text-base flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-blue-600" />
									Domains
								</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4 px-4">
								{!selectedSubjectId ? (
									<p className="text-sm text-slate-500">
										Select a section to view domains
									</p>
								) : isLoadingDomains ? (
									<div className="flex items-center justify-center py-4">
										<Loader2 className="w-5 h-5 animate-spin text-blue-600" />
									</div>
								) : domains.length === 0 ? (
									<p className="text-sm text-slate-500">
										No domains available for this section
									</p>
								) : (
									<div className="grid sm:grid-cols-2 gap-3">
										{domains.map((domain: any) => {
											const active = selectedDomainIds.includes(domain.id);
											return (
												<Label
													key={domain.id}
													className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition
                          ${
														active
															? "border-blue-600 bg-blue-50"
															: "hover:border-blue-400"
													}`}
												>
													<Checkbox
														checked={active}
														onCheckedChange={() => toggleDomain(domain.id)}
													/>
													<span className="text-sm font-medium">
														{domain.name}
													</span>
												</Label>
											);
										})}
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* ================= RIGHT: SUMMARY ================= */}
					<aside className="lg:sticky lg:top-42 h-fit">
						<Card className="rounded-2xl shadow-lg ">
							<CardHeader className="pb-0 ">
								<CardTitle className="text-base">Selected Filters</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="text-sm">
									<p className="text-slate-500">Assessment</p>
									<p className="font-medium">
										{selectedTestType?.name || "Not selected"}
									</p>
								</div>

								<div className="text-sm">
									<p className="text-slate-500">Section</p>
									<p className="font-medium">
										{selectedSubject?.name || "Not selected"}
									</p>
								</div>

								<div className="text-sm">
									<p className="text-slate-500 mb-1">Domains</p>
									{selectedDomains.length === 0 ? (
										<p className="text-slate-400">Not selected</p>
									) : (
										<div className="flex flex-wrap gap-2">
											{selectedDomains.map((d: any) => (
												<Badge key={d.id}>{d.name}</Badge>
											))}
										</div>
									)}
								</div>

								<Separator />

								<Button
									onClick={handleSearch}
									className="w-full gap-2 bg-gradient-to-r from-[#0086C5] to-[#005A8C]"
								>
									<Search className="w-4 h-4" />
									Search Questions
								</Button>
							</CardContent>
						</Card>
					</aside>
				</div>
			</main>
		</div>
	);
}
