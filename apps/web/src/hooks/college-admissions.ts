import type { TCollegeAdmissionsGuidanceForm } from "@prepexcellence/shared-validators";
import { useMutation } from "@tanstack/react-query";
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
