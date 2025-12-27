import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

// ========================
// Test Types
// ========================
export const useGetTestTypes = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
	filters?: any;
}) => {
	return useQuery({
		queryKey: ["test-types", params],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/test-types`, {
				params,
			});
			return response.data;
		},
	});
};

export const usePostTestTypes = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/test-types`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["test-types"] });
		},
	});
};

export const usePatchTestTypes = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.put(
				`/sat-practice/test-types/${data.id}`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["test-types"] });
		},
	});
};

export const useDeleteTestTypes = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(
				`/sat-practice/test-types/${id}`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["test-types"] });
		},
	});
};

// ========================
// Subjects
// ========================
export const useGetSubjects = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
	filters?: any;
}) => {
	return useQuery({
		queryKey: ["subjects", params],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/subjects`, {
				params,
			});
			return response.data;
		},
	});
};

export const usePostSubjects = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(`/sat-practice/subjects`, data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subjects"] });
		},
	});
};

export const usePatchSubjects = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.put(
				`/sat-practice/subjects/${data.id}`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subjects"] });
		},
	});
};

export const useDeleteSubjects = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(
				`/sat-practice/subjects/${id}`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subjects"] });
		},
	});
};

// ========================
// Difficulties
// ========================
export const useGetDifficulties = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
}) => {
	return useQuery({
		queryKey: ["difficulties", params],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/difficulties`, {
				params,
			});
			return response.data;
		},
	});
};

export const usePostDifficulties = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/difficulties`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["difficulties"] });
		},
	});
};

export const usePatchDifficulties = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.put(
				`/sat-practice/difficulties/${data.id}`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["difficulties"] });
		},
	});
};

export const useDeleteDifficulties = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(
				`/sat-practice/difficulties/${id}`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["difficulties"] });
		},
	});
};

// ========================
// Domains
// ========================
export const useGetDomains = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
	filters?: any;
}) => {
	return useQuery({
		queryKey: ["domains", params],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/domains`, {
				params,
			});
			return response.data;
		},
	});
};

export const usePostDomains = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(`/sat-practice/domains`, data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["domains"] });
		},
	});
};

export const usePatchDomains = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.put(
				`/sat-practice/domains/${data.id}`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["domains"] });
		},
	});
};

export const useDeleteDomains = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(
				`/sat-practice/domains/${id}`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["domains"] });
		},
	});
};

// ========================
// Skills
// ========================
export const useGetSkills = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
	filters?: any;
}) => {
	return useQuery({
		queryKey: ["skills", params],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/skills`, {
				params,
			});
			return response.data;
		},
	});
};

export const useGetSkillsByFilter = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
	filters?: any;
}) => {
	return useQuery({
		queryKey: ["skills-filtered", params],
		queryFn: async () => {
			const response = await axiosInstance.post(`/sat-practice/skills/filter`, {
				page: params?.page || 1,
				limit: params?.limit || 100,
				sortBy: params?.sortBy || "name",
				orderBy: params?.orderBy || "asc",
				search: params?.search,
				filters: params?.filters,
			});
			return response.data;
		},
	});
};

export const usePostSkills = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(`/sat-practice/skills`, data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["skills"] });
		},
	});
};

export const usePatchSkills = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.put(
				`/sat-practice/skills/${data.id}`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["skills"] });
		},
	});
};

export const useDeleteSkills = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(`/sat-practice/skills/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["skills"] });
		},
	});
};

// ========================
// Questions
// ========================
export const useGetQuestionsSat = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
	filters?: {
		testTypeId?: string;
		subjectId?: string;
		domainIds?: string[];
		difficultyId?: string;
		skillId?: string;
	};
}) => {
	return useQuery({
		queryKey: ["questions", params],
		queryFn: async () => {
			// Build query params with domainIds as array for backend
			const queryParams: Record<string, any> = {
				page: params?.page,
				limit: params?.limit,
				sortBy: params?.sortBy,
				orderBy: params?.orderBy,
				search: params?.search,
			};

			// Add filters
			if (params?.filters) {
				if (params.filters.testTypeId) {
					queryParams["filters[testTypeId]"] = params.filters.testTypeId;
				}
				if (params.filters.subjectId) {
					queryParams["filters[subjectId]"] = params.filters.subjectId;
				}
				if (params.filters.difficultyId) {
					queryParams["filters[difficultyId]"] = params.filters.difficultyId;
				}
				if (params.filters.skillId) {
					queryParams["filters[skillId]"] = params.filters.skillId;
				}
				// Handle multiple domainIds
				if (params.filters.domainIds && params.filters.domainIds.length > 0) {
					queryParams["filters[domainIds]"] = params.filters.domainIds;
				}
			}

			console.log("Query Params:", queryParams);

			const response = await axiosInstance.get(`/sat-practice/questions`, {
				params: queryParams,
				paramsSerializer: {
					indexes: null, // This serializes arrays as domainIds[]=a&domainIds[]=b
				},
			});
			return response.data;
		},
		enabled: !!(
			params?.filters?.testTypeId ||
			params?.filters?.subjectId ||
			(params?.filters?.domainIds && params.filters.domainIds.length > 0)
		),
	});
};

// New hook for filtering questions with multiple domains using POST
export const useGetQuestionsFiltered = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	filters?: {
		testTypeId?: string;
		subjectId?: string;
		domainIds?: string[];
		difficultyId?: string;
		// support filtering by difficulty name string (e.g., 'EASY', 'MEDIUM', 'HARD')
		difficulty?: string;
		skillId?: string;
		skillIds?: string[];
	};
}) => {
	return useQuery({
		queryKey: ["questions-filtered", params],
		queryFn: async () => {
			const response = await axiosInstance.post(
				`/sat-practice/questions/filter`,
				{
					page: params?.page || 1,
					limit: params?.limit || 100,
					sortBy: params?.sortBy,
					orderBy: params?.orderBy,
					filters: params?.filters,
				},
			);
			return response.data;
		},
		enabled: !!(
			params?.filters?.testTypeId ||
			params?.filters?.subjectId ||
			(params?.filters?.domainIds && params.filters.domainIds.length > 0)
		),
	});
};

export const useCreateQuestion = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/questions`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions"] });
		},
	});
};

export const useGetTestTypeSat = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
	filters?: any;
}) => {
	return useQuery({
		queryKey: ["test-types", params],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/test-types`, {
				params,
			});
			return response.data;
		},
	});
};
