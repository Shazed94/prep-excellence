import { useCallback, useState } from "react";

export function useGetCollegeAdmissions(
	page = 1,
	_pageSize = 10,
	_search = "",
) {
	const [data] = useState({
		data: [],
		pagination: {
			total: 0,
			page,
			totalPages: 0,
			hasNext: false,
			hasPrev: false,
		},
	});
	const isLoading = false;
	const error = null as any;
	const refetch = useCallback(() => Promise.resolve(), []);
	return {
		data: { data: data.data, pagination: data.pagination },
		isLoading,
		error,
		refetch,
	};
}
