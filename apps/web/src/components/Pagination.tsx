import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
	onPageChange: (page: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	onPrevious,
	onNext,
	onPageChange,
}: PaginationProps) {
	// Generate page numbers to display (e.g., show up to 5 pages)
	const getPageNumbers = () => {
		const pages = [];
		const maxPages = 5;

		if (totalPages <= maxPages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Show first page, current page range, and last page
			pages.push(1);

			const startPage = Math.max(2, currentPage - 1);
			const endPage = Math.min(totalPages - 1, currentPage + 1);

			if (startPage > 2) pages.push("...");

			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			if (endPage < totalPages - 1) pages.push("...");
			pages.push(totalPages);
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="container flex items-center justify-between gap-2">
			{/* Prev Button */}
			<button
				type="button"
				onClick={onPrevious}
				disabled={currentPage === 1}
				className="flex items-center gap-2 px-6 py-3 rounded-[6px] border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed  cursor-pointer transition-all"
			>
				<ChevronLeft className="w-4 h-4" />
				Prev
			</button>

			{/* Page Numbers */}
			<div className="flex items-center gap-1.5">
				{pageNumbers.map((page, index) => {
					if (page === "...") {
						return (
							<span
								key={`ellipsis-${index}`}
								className="px-2 py-2 text-gray-500 text-sm font-medium"
							>
								...
							</span>
						);
					}

					const isCurrentPage = page === currentPage;

					return (
						<button
							type="button"
							key={page}
							onClick={() => onPageChange(page as number)}
							className={`
                w-12 h-12 flex items-center justify-center rounded-[6px] text-sm font-semibold cursor-pointer transition-all
                ${
									isCurrentPage
										? "bg-blue-600 text-white shadow-sm shadow-blue-200"
										: "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
								}
              `}
						>
							{page}
						</button>
					);
				})}
			</div>

			{/* Next Button */}
			<button
				type="button"
				onClick={onNext}
				disabled={currentPage === totalPages}
				className="flex items-center gap-2 px-6 py-3 rounded-[6px] border border-gray-200 bg-[#1552FD] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed  cursor-pointer transition-all"
			>
				Next
				<ChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
}
