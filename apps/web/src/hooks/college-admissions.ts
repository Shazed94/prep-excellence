import type { TCollegeAdmissionsGuidanceForm } from "@prepexcellence/shared-validators";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";

export function useSubmitCollegeAdmissions() {
	return useMutation({
		mutationFn: async (data: TCollegeAdmissionsGuidanceForm) => {
			return await fetch(`${BACKEND_URL_V1}/guidance`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
		},
	});
}


export function useGetCollegeAdmissions() {
	return useQuery({
		queryKey: ["college-admissions"],
		queryFn: async () => {
			const token = localStorage.getItem("accessToken");
			
			const response = await fetch(`${BACKEND_URL_V1}/guidance`, {
				headers: {
					"Content-Type": "application/json",
					...(token && { Authorization: `Bearer ${token}` }),
				},
			});
			
			if (!response.ok) {
				throw new Error(`Failed to fetch: ${response.statusText}`);
			}
			const data = await response.json();

			console.log("data", data);
			
			return data;
		},
	});
}