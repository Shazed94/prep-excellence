import type { TCollegeAdmissionsGuidanceForm } from "@prepexcellence/shared-validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSubmitCollegeAdmissions() {
  return useMutation({
    mutationFn: async (data: TCollegeAdmissionsGuidanceForm) => {
      return await fetch("/api/college-admissions/guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
  });
}
