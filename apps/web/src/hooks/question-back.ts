import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const  useCreateQuestion = () =>{
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post(`/sat-practice/questions`, data);
            return response;
        },
    });
}