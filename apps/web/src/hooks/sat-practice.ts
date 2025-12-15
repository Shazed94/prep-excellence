import axiosInstance from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetTestTypes = () => {
	return useQuery({
		queryKey: ["test-types"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/test-types`);
			return response;
		},
	});
};

export const usePostTestTypes = () =>{
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post(`/sat-practice/test-types`, data);
            return response;
        },
    });
}

export const usePatchTestTypes = () =>{
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.patch(`/sat-practice/test-types/${data.id}`, data);
            return response;
        },
    });
}

export const useDeleteTestTypes = () =>{
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await axiosInstance.delete(`/sat-practice/test-types/${id}`);
            return response;
        },
    });
}
