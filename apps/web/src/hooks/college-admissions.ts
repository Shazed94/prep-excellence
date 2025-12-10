import type { TCollegeAdmissionsGuidanceForm } from "@prepexcellence/shared-validators";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";
import axios from "@/lib/axios";


export function useSubmitCollegeAdmissions() {
	return useMutation({
		mutationFn: async (data: TCollegeAdmissionsGuidanceForm) => {
			return await fetch(`${BACKEND_URL_V1}/guidance`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data),

			});
		},
	});
}

export function useGetCollegeAdmissions(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	console.log( page, limit, search, sortBy, orderBy);
	return useQuery({
		queryKey: ["college-admissions"],
		queryFn: async () => {
			const response = await axios.get(`/guidance?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`);
			return response;
		},
	});
}
