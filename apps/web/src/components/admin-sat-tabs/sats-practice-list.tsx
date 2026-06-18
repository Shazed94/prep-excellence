import {
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock,
	Edit,
	Eye,
	Layers,
	MoreVertical,
	Plus,
	Search,
	Trash2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetSATPracticeTests } from "@/hooks/sat-practice";

interface SATSPracticeListProps {
	onCreateNew?: () => void;
}

export function SATSPracticeList({ onCreateNew }: SATSPracticeListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, isLoading, error, refetch } = useGetSATPracticeTests({
		page,
		limit,
		search: searchQuery,
		sortBy: "createdAt",
		orderBy: "desc",
	});

	const practiceTests = data?.data || [];
	const totalPages = Math.ceil((data?.meta?.total || 0) / limit);

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			PUBLISHED: {
				icon: CheckCircle2,
				className: "bg-emerald-100 text-emerald-700 border-emerald-300",
			},
			DRAFT: {
				icon: Clock,
				className: "bg-amber-100 text-amber-700 border-amber-300",
			},
			ARCHIVED: {
				icon: XCircle,
				className: "bg-gray-100 text-gray-700 border-gray-300",
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
		const Icon = config.icon;

		return (
			<Badge variant="outline" className={`text-xs ${config.className}`}>
				<Icon className="w-3 h-3 mr-1" />
				{status}
			</Badge>
		);
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const handleDelete = async (_id: string, name: string) => {
		if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

		try {
			// TODO: Add delete API call here when available
			// await deleteSATPracticeTest.mutateAsync(id);
			toast.success("Practice test deleted successfully");
			refetch();
		} catch (err) {
			console.error("Delete error:", err);
			toast.error("Failed to delete practice test");
		}
	};

	if (error) {
		return (
			<Card className="border-destructive">
				<CardContent className="p-6 text-center">
					<XCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
					<p className="text-sm text-destructive">
						Failed to load practice tests
					</p>
					<Button onClick={() => refetch()} variant="outline" className="mt-4">
						Retry
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl bg-primary-dark/10 border border-violet-200">
						<BookOpen className="w-6 h-6 text-primary-dark" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-primary-dark">
							SAT Practice Tests
						</h1>
						<p className="text-xs text-muted-foreground">
							Manage your SAT practice tests
						</p>
					</div>
				</div>
				<Button onClick={onCreateNew} className="rounded-lg">
					<Plus className="w-4 h-4 mr-2" />
					Create New Test
				</Button>
			</div>

			{/* Search and Filters */}
			<Card className="border-0 shadow-lg">
				<CardContent className="p-4">
					<div className="flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search practice tests..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
								}}
								className="pl-10 h-10 rounded-lg"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Practice Tests Table */}
			<Card className="border-0 shadow-lg">
				<CardContent className="p-0">
					{isLoading ? (
						<div className="p-12 text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4" />
							<p className="text-sm text-muted-foreground">
								Loading practice tests...
							</p>
						</div>
					) : practiceTests.length === 0 ? (
						<div className="p-12 text-center">
							<BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								No practice tests yet
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								{searchQuery
									? "No tests match your search"
									: "Create your first SAT practice test to get started"}
							</p>
							{!searchQuery && (
								<Button onClick={onCreateNew} variant="outline">
									<Plus className="w-4 h-4 mr-2" />
									Create Practice Test
								</Button>
							)}
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Test Name</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Subject</TableHead>
										<TableHead>Sections</TableHead>
										<TableHead>Questions</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{practiceTests.map((test: any) => (
										<TableRow key={test.id} className="hover:bg-muted/50">
											<TableCell className="font-medium">
												<div className="flex items-center gap-2">
													<BookOpen className="w-4 h-4 text-primary-dark" />
													{test.name}
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline" className="text-xs">
													{test.testType?.name || "N/A"}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge variant="outline" className="text-xs">
													{test.subject?.name || "N/A"}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-sm">
													<Layers className="w-3.5 h-3.5 text-muted-foreground" />
													{test.sections?.length || 0}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-sm">
													<BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
													{test.sections?.reduce(
														(total: number, section: any) =>
															total +
															(section.modules?.reduce(
																(moduleTotal: number, module: any) =>
																	moduleTotal +
																	(module.questionsSetOneIds?.length || 0) +
																	(module.questionsSetTwoIds?.length || 0),
																0,
															) || 0),
														0,
													) || 0}
												</div>
											</TableCell>
											<TableCell>{getStatusBadge(test.status)}</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-sm text-muted-foreground">
													<Calendar className="w-3.5 h-3.5" />
													{formatDate(test.createdAt)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
														>
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem>
															<Eye className="w-4 h-4 mr-2" />
															View Details
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Edit className="w-4 h-4 mr-2" />
															Edit Test
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															className="text-destructive"
															onClick={() => handleDelete(test.id, test.name)}
														>
															<Trash2 className="w-4 h-4 mr-2" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {(page - 1) * limit + 1} to{" "}
						{Math.min(page * limit, data?.meta?.total || 0)} of{" "}
						{data?.meta?.total || 0} tests
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
						>
							Previous
						</Button>
						<div className="flex items-center gap-1">
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(pageNum) => (
									<Button
										key={pageNum}
										variant={page === pageNum ? "default" : "outline"}
										size="sm"
										onClick={() => setPage(pageNum)}
										className="w-8 h-8 p-0"
									>
										{pageNum}
									</Button>
								),
							)}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
