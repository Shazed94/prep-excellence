import { create } from "zustand";

interface PaginationState {
	pageIndex: number;
	pageSize: number;
}

interface SortingState {
	sortBy: string | undefined;
	sortOrder: "asc" | "desc";
}

interface TableStore {
	// Pagination state
	pagination: PaginationState;
	setPagination: (
		pagination: PaginationState | ((prev: PaginationState) => PaginationState),
	) => void;
	setPageIndex: (pageIndex: number) => void;
	setPageSize: (pageSize: number) => void;

	// Search state
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;

	// Sorting state
	sorting: SortingState;
	setSorting: (
		sorting: SortingState | ((prev: SortingState) => SortingState),
	) => void;
	setSortBy: (sortBy: string) => void;
	setSortOrder: (sortOrder: "asc" | "desc") => void;
	toggleSortOrder: () => void;

	// Reset function
	resetTable: () => void;
}

const initialPagination: PaginationState = {
	pageIndex: 0,
	pageSize: 6,
};

const initialSorting: SortingState = {
	sortBy: undefined, // No default sortBy field
	sortOrder: "asc",
};

export const useTableStore = create<TableStore>((set) => ({
	// Initial state
	pagination: initialPagination,
	searchTerm: "",
	sorting: initialSorting,

	// Pagination actions
	setPagination: (pagination) =>
		set((state) => ({
			pagination:
				typeof pagination === "function"
					? pagination(state.pagination)
					: pagination,
		})),

	setPageIndex: (pageIndex) =>
		set((state) => ({
			pagination: { ...state.pagination, pageIndex },
		})),

	setPageSize: (pageSize) =>
		set((state) => ({
			pagination: { ...state.pagination, pageSize, pageIndex: 0 }, // Reset to first page
		})),

	// Search actions
	setSearchTerm: (searchTerm) =>
		set(() => ({
			searchTerm,
			pagination: { ...initialPagination }, // Reset pagination on search
		})),

	// Sorting actions
	setSorting: (sorting) =>
		set((state) => ({
			sorting: typeof sorting === "function" ? sorting(state.sorting) : sorting,
		})),

	setSortBy: (sortBy) =>
		set((state) => ({
			sorting: { ...state.sorting, sortBy },
			pagination: { ...state.pagination, pageIndex: 0 }, // Reset to first page
		})),

	setSortOrder: (sortOrder) =>
		set((state) => ({
			sorting: { ...state.sorting, sortOrder },
		})),

	toggleSortOrder: () =>
		set((state) => ({
			sorting: {
				...state.sorting,
				sortOrder: state.sorting.sortOrder === "asc" ? "desc" : "asc",
			},
		})),

	// Reset all state
	resetTable: () =>
		set(() => ({
			pagination: initialPagination,
			searchTerm: "",
			sorting: initialSorting,
		})),
}));
