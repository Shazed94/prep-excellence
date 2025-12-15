"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type OnChangeFn,
	type PaginationState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import {
	ArrowUpDown,
	ChevronDown,
	Download,
	Eye,
	FileSpreadsheet,
	FileText,
	MoveRight,
	Search,
} from "lucide-react";
import * as React from "react";
import * as XLSX from "xlsx";

// Helper function to extract hex color from Tailwind class
const extractColor = (tailwindClass: string): string => {
	const match = tailwindClass?.match(/\[([#\w]+)\]/);
	return match ? match[1] : tailwindClass;
};

// Helper function to determine if a color is dark
const isColorDark = (hexColor: string): boolean => {
	const hex = hexColor.replace("#", "");
	const r = Number.parseInt(hex.substr(0, 2), 16);
	const g = Number.parseInt(hex.substr(2, 2), 16);
	const b = Number.parseInt(hex.substr(4, 2), 16);
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness < 128;
};

// Helper function to lighten a color
const lightenColor = (hex: string, percent: number): string => {
	const num = Number.parseInt(hex.replace("#", ""), 16);
	const amt = Math.round(2.55 * percent);
	const R = (num >> 16) + amt;
	const G = ((num >> 8) & 0x00ff) + amt;
	const B = (num & 0x0000ff) + amt;
	return `#${(
		0x1000000 +
		(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
		(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
		(B < 255 ? (B < 1 ? 0 : B) : 255)
	)
		.toString(16)
		.slice(1)}`;
};
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	title?: string;
	fileName?: string;
	searchKey?: keyof TData;
	searchPlaceholder?: string;
	enableColumnVisibility?: boolean;
	enableExport?: boolean;
	enablePagination?: boolean;
	pageSize?: number;
	isLoading?: boolean;
	emptyMessage?: string;
	className?: string;
	onRowClick?: (row: TData) => void;
	Component?: React.FC;
	LeftComponent?: React.FC;
	onSearch?: (value: string) => void;
	searchValue?: string;
	manualPagination?: boolean;
	pageCount?: number;
	pageIndex?: number;
	onPaginationChange?: OnChangeFn<PaginationState>;
	hasNext?: boolean;
	hasPrev?: boolean;
	total?: number;
}

// --- DataTable Component ---
export function DataTable<TData, TValue>({
	columns,
	data,
	title,
	fileName = "data",
	searchKey,
	searchPlaceholder = "Search...",
	enableColumnVisibility = true,
	enableExport = true,
	enablePagination = true,
	pageSize: initialPageSize = 10,
	isLoading = false,
	emptyMessage = "No results found.",
	className = "p-0 gap-2 border-0",
	onRowClick,
	Component,
	LeftComponent,
	onSearch,
	searchValue,
	manualPagination,
	pageCount,
	pageIndex,
	onPaginationChange,
	hasNext = false,
	hasPrev = false,
	total = 0,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [globalFilter, setGlobalFilter] = React.useState("");

	// For manual pagination, use the controlled pageIndex from props
	// Otherwise TanStack Table handles it internally
	const pagination = React.useMemo(
		() =>
			manualPagination && pageIndex !== undefined
				? { pageIndex, pageSize: initialPageSize }
				: undefined,
		[manualPagination, pageIndex, initialPageSize],
	); // Extract theme colors from CSS custom properties (Tailwind CSS variables)
	const getThemeColor = (property: string): string => {
		if (typeof window !== "undefined") {
			const root = document.documentElement;
			const color = getComputedStyle(root).getPropertyValue(property).trim();
			return color ? `hsl(${color})` : "#ffffff";
		}
		return "#ffffff";
	};
	// Get actual primary colors from CSS variables
	const primaryColor = getThemeColor("#0086C5") || "#0086C5"; // fallback to blue-500

	const backgroundColor = "#ffffff";

	// Determine if we're in a dark theme
	const isDarkTheme = isColorDark(backgroundColor);

	// Smart text color selection based on theme
	const primaryTextColor = isDarkTheme ? "#ffffff" : "#1f2937";
	const secondaryTextColor = isDarkTheme ? "#d1d5db" : "#6b7280";

	// Use theme's secondary text color if available
	const themeSecondaryTextColor = extractColor(
		isDarkTheme ? "text-[#d1d5db]" : "text-[#6b7280]",
	);
	const finalSecondaryTextColor = themeSecondaryTextColor.startsWith("text-")
		? secondaryTextColor
		: themeSecondaryTextColor;
	const exportToCSV = () => {
		const headers = table.getVisibleFlatColumns().map((column) => column.id);
		const rows = table.getFilteredRowModel().rows.map((row) =>
			headers.map((header) => {
				const cell = row.getValue(header);
				return typeof cell === "string" || typeof cell === "number" ? cell : "";
			}),
		);

		const csvContent = [headers, ...rows]
			.map((row) => row.join(","))
			.join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `${fileName || "data"}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportToXLSX = () => {
		const headers = table.getVisibleFlatColumns().map((column) => column.id);
		const rows = table.getFilteredRowModel().rows.map((row) =>
			headers.map((header) => {
				const cell = row.getValue(header);
				return typeof cell === "string" || typeof cell === "number" ? cell : "";
			}),
		);

		const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
		XLSX.writeFile(workbook, `${fileName || "data"}.xlsx`);
	};

	const exportToPDF = () => {
		const doc = new jsPDF();

		// Convert HSL to RGB for PDF - moved to top for use in title
		const hslToRgb = (hsl: string): [number, number, number] => {
			// Parse HSL string like "hsl(220, 14%, 96%)" or just "220 14% 96%"
			const match = hsl.match(
				/(?:hsl\()?(\d+)(?:deg)?,?\s*(\d+)%,?\s*(\d+)%\)?/,
			);
			if (!match) return [71, 85, 105]; // Default fallback

			const h = Number.parseInt(match[1], 10) / 360;
			const s = Number.parseInt(match[2], 10) / 100;
			const l = Number.parseInt(match[3], 10) / 100;

			const hue2rgb = (p: number, q: number, t: number) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			let r: number, g: number, b: number;
			if (s === 0) {
				r = g = b = l; // achromatic
			} else {
				const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				const p = 2 * l - q;
				r = hue2rgb(p, q, h + 1 / 3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1 / 3);
			}

			return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		};

		// === TITLE (Table Name) - Make it prominent and always visible ===
		if (title) {
			doc.setFontSize(20);
			doc.setFont("helvetica", "bold");

			// Use your primary color (convert HSL → RGB)
			const rgb = hslToRgb(primaryColor);
			doc.setTextColor(...rgb);

			// Left-aligned, 14mm from left, 20mm from top
			doc.text(title, 14, 22);

			// Optional: nice underline in the same color
			doc.setDrawColor(...rgb);
			doc.setLineWidth(0.8);
			doc.line(14, 26, 14 + doc.getTextWidth(title), 26);

			// Reset text color for the rest of the document
			doc.setTextColor(0, 0, 0);
		}
		// Prepare table data
		const headersKeys = table
			.getVisibleFlatColumns()
			.map((column) => column.id);
		// Human-readable header texts (string[]
		const headerTexts = table.getVisibleFlatColumns().map((col) => {
			const h = col.columnDef.header;
			return typeof h === "string" ? h : String(col.id);
		});

		const rows = table.getFilteredRowModel().rows.map((row) =>
			headersKeys.map((header) => {
				const cell = row.getValue(header);
				return typeof cell === "string" || typeof cell === "number"
					? String(cell)
					: "";
			}),
		);

		// Get primary colors in RGB format
		// const primaryRgb = hslToRgb(primaryColor);
		// const foregroundRgb = hslToRgb(primaryForeground);

		// Add table with your data table's primary theme colors (matching bg-primary and text-primary-foreground)
		autoTable(doc, {
			head: [headerTexts],
			body: rows,
			startY: title ? 30 : 15,
			theme: "grid",
			styles: {
				fontSize: 8,
				cellPadding: 3,
				lineColor: [229, 231, 235], // gray-200 for borders
				lineWidth: 0.3,
				textColor: [31, 41, 55], // gray-800 for body text
				fontStyle: "normal",
			},
			headStyles: {
				// fillColor: primaryRgb, // bg-primary color
				fillColor: "#0086C5", // slate-50
				textColor: [255, 255, 255], // text-primary-foreground color
				fontStyle: "bold",
				fontSize: 9,
				cellPadding: 5,
				lineColor: [229, 231, 235],
				lineWidth: 0.3,
				halign: "left",
			},
			bodyStyles: {
				textColor: [31, 41, 55], // gray-800
				fontSize: 8,
				cellPadding: 4,
				lineColor: [229, 231, 235],
				lineWidth: 0.1,
			},
			alternateRowStyles: {
				fillColor: [248, 250, 252], // slate-50 for alternate rows
			},
			columnStyles: {},
			margin: { top: 15 },
			didDrawPage: (data) => {
				// Add page numbers
				const pageCount = doc.getNumberOfPages();
				doc.setFontSize(8);
				doc.setTextColor(107, 114, 128); // gray-500
				doc.text(
					`Page ${data.pageNumber} of ${pageCount}`,
					data.settings.margin.left,
					doc.internal.pageSize.height - 10,
				);
			},
		});

		doc.save(`${title || "data"}.pdf`);
	};
	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "includesString",
		manualPagination,
		pageCount,
		onPaginationChange,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
			...(pagination && { pagination }),
		},
		initialState: {
			pagination: {
				pageSize: initialPageSize,
			},
		},
	});

	// Much more subtle and professional styling
	const cardStyle = {
		backgroundColor: backgroundColor,
		border: `1px solid ${isDarkTheme ? "#374151" : "#e5e7eb"}`,
		color: primaryTextColor,
	};

	// const headerStyle = {
	//   backgroundColor: isDarkTheme ? backgroundColor : backgroundColor,
	//   color: primaryTextColor,
	//   borderBottom: `1px solid ${isDarkTheme ? "#374151" : "#e5e7eb"}`,
	// };

	const buttonStyle = {
		backgroundColor: "transparent",
		color: primaryTextColor,
		border: `1px solid ${isDarkTheme ? "#4b5563" : "#d1d5db"}`,
	};

	const buttonHoverStyle = {
		backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
		color: primaryTextColor,
	};

	// Much more subtle table styling
	const tableHeaderStyle = {
		backgroundColor: isDarkTheme ? "#374151" : "#f9fafb",
		color: primaryTextColor,
		borderBottom: `1px solid ${isDarkTheme ? "#4b5563" : "#e5e7eb"}`,
	};

	const tableRowEvenStyle = {
		backgroundColor: backgroundColor,
		borderBottom: `1px solid ${isDarkTheme ? "#374151" : "#f3f4f6"}`,
		color: primaryTextColor,
	};

	const tableRowOddStyle = {
		backgroundColor: isDarkTheme ? lightenColor(backgroundColor, 2) : "#fafafa",
		borderBottom: `1px solid ${isDarkTheme ? "#374151" : "#f3f4f6"}`,
		color: primaryTextColor,
	};

	const dropdownStyle = {
		backgroundColor: isDarkTheme ? "#1f2937" : "#ffffff",
		border: `1px solid ${isDarkTheme ? "#374151" : "#e5e7eb"}`,
		color: primaryTextColor,
	};

	if (isLoading) {
		return (
			<Card className={className}>
				{title && (
					<CardHeader>
						<CardTitle style={{ color: primaryTextColor }}>{title}</CardTitle>
					</CardHeader>
				)}
				<CardContent>
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="h-8 animate-pulse rounded"
								style={{ backgroundColor: isDarkTheme ? "#374151" : "#e5e7eb" }}
							/>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div>
			<Card className={className} style={cardStyle}>
				<CardContent
					style={{ borderColor: isDarkTheme ? "#374151" : "#e5e7eb" }}
					className="p-0"
				>
					{/* Mobile Toolbar */}
					<div className="flex flex-col gap-4 p-4 border-b lg:flex-row lg:justify-between lg:items-center">
						{/* Title - Center on mobile, left on desktop */}
						{title && (
							<div className="order-1 text-center lg:order-2 lg:text-left">
								<CardTitle
									style={{ color: primaryTextColor }}
									className="text-xl font-semibold lg:text-2xl"
								>
									{title}
								</CardTitle>
							</div>
						)}

						{/* Search - Top on mobile */}

						<div className="order-2 lg:order-1 flex items-center gap-4">
							{LeftComponent && <LeftComponent />}
							{searchKey && (
								<div className="relative">
									<Search
										className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
										style={{ color: finalSecondaryTextColor }}
									/>
									<Input
										placeholder={searchPlaceholder}
										// value={globalFilter ?? ""}
										value={searchValue}
										onChange={
											onSearch ? (e) => onSearch(e.target.value) : undefined
										}
										className="pl-8 w-full lg:max-w-sm"
										// className="pl-8 w-full lg:max-w-sm"
										style={{
											border: `1px solid ${
												isDarkTheme ? "#4b5563" : "#d1d5db"
											}`,
											color: primaryTextColor,
											backgroundColor: backgroundColor,
										}}
									/>
								</div>
							)}
						</div>

						{/* Controls - Bottom on mobile */}
						<div className="flex flex-wrap items-center gap-2 order-3 lg:order-3">
							{enableExport && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											style={buttonStyle}
											onMouseEnter={(e) => {
												Object.assign(e.currentTarget.style, buttonHoverStyle);
											}}
											onMouseLeave={(e) => {
												Object.assign(e.currentTarget.style, buttonStyle);
											}}
										>
											<Download className="mr-2 h-4 w-4" />
											<span className="">Export</span>
											<ChevronDown className="ml-2 h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={exportToCSV}
											style={{ color: primaryTextColor }}
										>
											<FileText className="mr-2 h-4 w-4" />
											Export as CSV
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={exportToXLSX}
											style={{ color: primaryTextColor }}
										>
											<FileSpreadsheet className="mr-2 h-4 w-4" />
											Export as XLSX
										</DropdownMenuItem>
										<DropdownMenuItem onClick={exportToPDF}>
											<FileText
												className="mr-2 h-4 w-4"
												onClick={exportToPDF}
												style={{ color: primaryTextColor }}
											/>
											Export as PDF
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}

							{enableColumnVisibility && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											style={buttonStyle}
											onMouseEnter={(e) => {
												Object.assign(e.currentTarget.style, buttonHoverStyle);
											}}
											onMouseLeave={(e) => {
												Object.assign(e.currentTarget.style, buttonStyle);
											}}
										>
											<Eye className="mr-2 h-4 w-4" />
											Columns
											<ChevronDown className="ml-2 h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{table
											.getAllColumns()
											.filter((column) => column.getCanHide())
											.map((column) => {
												return (
													<DropdownMenuCheckboxItem
														key={column.id}
														className="capitalize"
														checked={column.getIsVisible()}
														onCheckedChange={(value) =>
															column.toggleVisibility(!!value)
														}
														style={{ color: primaryTextColor }}
													>
														{column.id}
													</DropdownMenuCheckboxItem>
												);
											})}
									</DropdownMenuContent>
								</DropdownMenu>
							)}

							<div>{Component && <Component />}</div>
						</div>
					</div>

					{/* Table Content */}
					<div style={{}}>
						<div style={{ overflowX: "auto" }}>
							<Table
								style={{ borderCollapse: "collapse", minWidth: "max-content" }}
							>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id} style={tableHeaderStyle}>
											{headerGroup.headers.map((header) => (
												<TableHead
													key={header.id}
													className="bg-primary-dark text-primary-foreground"
													style={{
														borderRight: `1px solid ${
															isDarkTheme ? "#4b5563" : "#e5e7eb"
														}`,
														fontWeight: "600",
														padding: "12px 16px",
														minWidth: "150px",
														whiteSpace: "nowrap",
													}}
												>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</TableHead>
											))}
										</TableRow>
									))}
								</TableHeader>
								<TableBody>
									{table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map((row, index) => (
											<TableRow
												key={row.id}
												data-state={row.getIsSelected() && "selected"}
												onClick={() => onRowClick?.(row.original)}
												style={
													index % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle
												}
												onMouseEnter={(e) => {
													e.currentTarget.style.backgroundColor = isDarkTheme
														? "#4b5563"
														: "#f0f9ff";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.backgroundColor =
														index % 2 === 0
															? backgroundColor
															: isDarkTheme
																? lightenColor(backgroundColor, 2)
																: "#fafafa";
												}}
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell
														key={cell.id}
														style={{
															borderRight: `1px solid ${
																isDarkTheme ? "#374151" : "#f3f4f6"
															}`,
															color: primaryTextColor,
															padding: "12px 16px",
															minWidth: "150px",
															whiteSpace: "nowrap",
														}}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												))}
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className="h-24 text-center"
												style={{
													color: finalSecondaryTextColor,
													padding: "48px 16px",
												}}
											>
												{emptyMessage}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>

					{/* Pagination */}
					{enablePagination && (
						<div
							className="flex items-center justify-between px-4 py-3  text-sm text-gray-600 "
							style={{ borderColor: isDarkTheme ? "#374151" : "#e5e7eb" }}
						>
							{/* Results info - Full width on mobile */}
							<div className="text-center lg:text-left">
								<p>
									Showing {data.length} of {total || 0} total entries{" "}
									{hasNext && " • More pages available"}
									{total &&
										` (Page ${(pageIndex ?? 0) + 1} of ${pageCount || 0})`}
								</p>
							</div>

							{/* Pagination controls */}
							<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
								{/* Page size selector */}
								<div className="flex items-center justify-center gap-2 lg:justify-start">
									<p
										className="text-sm font-medium"
										style={{ color: primaryTextColor }}
									>
										Rows per page
									</p>
									<Select
										value={`${initialPageSize}`}
										onValueChange={(value) => {
											const newPageSize = Number(value);
											if (onPaginationChange) {
												onPaginationChange({
													pageIndex: 0, // Reset to first page when changing page size
													pageSize: newPageSize,
												});
											} else {
												table.setPageSize(newPageSize);
											}
										}}
									>
										<SelectTrigger
											className="h-5 w-[70px] px-2"
											style={{
												border: `1px solid ${
													isDarkTheme ? "#4b5563" : "#d1d5db"
												}`,
												color: primaryTextColor,
												backgroundColor: backgroundColor,
											}}
										>
											<SelectValue
												placeholder={table.getState().pagination.pageSize}
											/>
										</SelectTrigger>
										<SelectContent side="top" style={dropdownStyle}>
											{[10, 20, 25, 30, 40, 50].map((pageSize) => (
												<SelectItem
													key={pageSize}
													value={`${pageSize}`}
													style={{ color: primaryTextColor }}
												>
													{pageSize}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Navigation buttons */}
								<div className="flex items-center justify-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											if (onPaginationChange && manualPagination) {
												// Use pageIndex from props for manual pagination
												const newPageIndex = (pageIndex ?? 0) - 1;
												onPaginationChange({
													pageIndex: newPageIndex,
													pageSize: initialPageSize,
												});
											} else {
												table.previousPage();
											}
										}}
										disabled={!hasPrev}
										style={buttonStyle}
										onMouseEnter={(e) => {
											if (!e.currentTarget.disabled) {
												Object.assign(e.currentTarget.style, buttonHoverStyle);
											}
										}}
										onMouseLeave={(e) => {
											if (!e.currentTarget.disabled) {
												Object.assign(e.currentTarget.style, buttonStyle);
											}
										}}
									>
										<MoveRight className="h-4 w-4 -scale-x-100" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											if (onPaginationChange && manualPagination) {
												// Use pageIndex from props for manual pagination
												const newPageIndex = (pageIndex ?? 0) + 1;
												onPaginationChange({
													pageIndex: newPageIndex,
													pageSize: initialPageSize,
												});
											} else {
												table.nextPage();
											}
										}}
										disabled={!hasNext}
										style={buttonStyle}
										onMouseEnter={(e) => {
											if (!e.currentTarget.disabled) {
												Object.assign(e.currentTarget.style, buttonHoverStyle);
											}
										}}
										onMouseLeave={(e) => {
											if (!e.currentTarget.disabled) {
												Object.assign(e.currentTarget.style, buttonStyle);
											}
										}}
									>
										<MoveRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

// Helper function to create sortable column header that integrates with Zustand store
// export function createSortableHeader(title: string, fieldName: string) {
//   const SortableHeader = ({ column }: { column: any }) => {
//     const { sorting, setSortBy, toggleSortOrder } = useTableStore();

//     const backgroundColor = extractColor("bg-primary");
//     const isDarkTheme = isColorDark(backgroundColor);
//     const textColor = isDarkTheme ? "#ffffff" : "text-primary";

//     const isActive = sorting.sortBy === fieldName;
//     const isSortedDesc = isActive && sorting.sortOrder === "desc";

//     const handleSort = () => {
//       if (isActive) {
//         // If already sorting by this field, toggle the order
//         toggleSortOrder();
//       } else {
//         // If not sorting by this field, set it as the sort field
//         setSortBy(fieldName);
//       }
//       // Also toggle the column sorting for DataTable's internal state
//       column.toggleSorting(column.getIsSorted() === "asc");
//     };

//     return (
//       <Button
//         variant="ghost"
//         onClick={handleSort}
//         className="h-auto p-0 font-medium text-xs hover:bg-transparent"
//         style={{ color: textColor }}
//       >
//         {title}
//         <ArrowUpDown
//           className={`ml-2 h-3 w-3 ${isActive ? "opacity-100" : "opacity-50"}`}
//           style={{
//             transform: isSortedDesc ? "rotate(180deg)" : "none",
//             transition: "transform 0.2s",
//           }}
//         />
//       </Button>
//     );
//   };
//   SortableHeader.displayName = "SortableHeader";
//   return SortableHeader;
// }

// Helper function to create sortable column header
export function createSortableHeader(title: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const SortableHeader = ({ column }: { column: any }) => {
		return (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="h-auto p-0 font-medium text-xs hover:bg-transparent hover:text-primary-foreground/80"
			>
				{title}
				<ArrowUpDown className="ml-2 h-3 w-3" />
			</Button>
		);
	};
	SortableHeader.displayName = "SortableHeader";
	return SortableHeader;
}
