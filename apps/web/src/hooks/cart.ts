import axiosInstance from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCart = (options?: any) => {
	return useQuery({
		queryKey: ["cart"],
		queryFn: async () => {
			const res = await axiosInstance.get("/cart");
			return res.data.data;
		},
		...options,
	});
};

export const useAddToCart = () => {
	return useMutation({
		mutationFn: async (item: { courseId: string }) => {
			const res = await axiosInstance.post("/cart/items", item);
			return res.data;
		},
	});
};
export const useRemoveCartItem = () => {
	return useMutation({
		mutationFn: async (itemId: string) => {
			const res = await axiosInstance.delete(`/cart/items/${itemId}`);
			return res.data;
		},
	});
};

export const useUpdateCartItemQuantity = () => {
	return useMutation({
		mutationFn: async (item: { id: string; quantity: number }) => {
			const res = await axiosInstance.put(`/cart/items/${item.id}`, {
				quantity: item.quantity,
			});
			return res.data;
		},
	});
};

export const useClearCart = () => {
	return useMutation({
		mutationFn: async () => {
			const res = await axiosInstance.delete("/cart/items");
			return res.data;
		},
	});
};
