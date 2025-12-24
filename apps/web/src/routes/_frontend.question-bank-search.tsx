import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Search, X } from "lucide-react";
import { useState } from "react";
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

export const Route = createFileRoute("/_frontend/question-bank-search")({
	component: RouteComponent,
});

const DOMAINS = [
	"Algebra",
	"Advanced Math",
	"Problem Solving & Data Analysis",
	"Geometry & Trigonometry",
];

function RouteComponent() {
	const [assessment, setAssessment] = useState("SAT");
	const [section, setSection] = useState("Math");
	const [domains, setDomains] = useState<string[]>([]);

	const toggleDomain = (domain: string) => {
		setDomains((prev) =>
			prev.includes(domain)
				? prev.filter((d) => d !== domain)
				: [...prev, domain],
		);
	};

	const handleSearch = () => {
		console.log({ assessment, section, domains });
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
									<Select value={assessment} onValueChange={setAssessment}>
										<SelectTrigger className=" rounded-md w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="SAT">SAT</SelectItem>
											<SelectItem value="PSAT">PSAT</SelectItem>
											<SelectItem value="PSAT 10">PSAT 10</SelectItem>
											<SelectItem value="PSAT 8/9">PSAT 8/9</SelectItem>
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
									<Select value={section} onValueChange={setSection}>
										<SelectTrigger className=" rounded-md w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Math">Math</SelectItem>
											<SelectItem value="Reading & Writing">
												Reading & Writing
											</SelectItem>
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
								<div className="grid sm:grid-cols-2 gap-3">
									{DOMAINS.map((domain) => {
										const active = domains.includes(domain);
										return (
											<Label
												key={domain}
												className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition
                          ${
														active
															? "border-blue-600 bg-blue-50"
															: "hover:border-blue-400"
													}`}
											>
												<Checkbox
													checked={active}
													onCheckedChange={() => toggleDomain(domain)}
												/>
												<span className="text-sm font-medium">{domain}</span>
											</Label>
										);
									})}
								</div>

								{domains.length > 0 && (
									<>
										<Separator />
										<div className="flex flex-wrap gap-2">
											{domains.map((d) => (
												<Badge
													key={d}
													variant="secondary"
													className="flex items-center gap-1"
												>
													{d}
													<Button onClick={() => toggleDomain(d)}>
														<X className="w-3 h-3" />
													</Button>
												</Badge>
											))}
										</div>
									</>
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
									<p className="font-medium">{assessment}</p>
								</div>

								<div className="text-sm">
									<p className="text-slate-500">Section</p>
									<p className="font-medium">{section}</p>
								</div>

								<div className="text-sm">
									<p className="text-slate-500 mb-1">Domains</p>
									{domains.length === 0 ? (
										<p className="text-slate-400">Not selected</p>
									) : (
										<div className="flex flex-wrap gap-2">
											{domains.map((d) => (
												<Badge key={d}>{d}</Badge>
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
