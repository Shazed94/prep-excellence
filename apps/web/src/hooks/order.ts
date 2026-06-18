import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useCreateOrder = () => {
	return useMutation({
		mutationFn: async (data: {
			couponCode?: string;
			payableAmount: number;
		}) => {
			const res = await axiosInstance.post("/orders", data);
			return res.data;
		},
	});
};

export const useApplyCoupon = () => {
	return useMutation({
		mutationFn: async (data: { couponCode: string }) => {
			const res = await axiosInstance.post("/orders/apply-coupon", data);
			console.log("resssssssssssssssssssssssssss", res);
			return res.data;
		},
	});
};

export const useGetMyOrders = () => {
	return useQuery({
		queryKey: ["my-orders"],
		queryFn: async () => {
			const res = await axiosInstance.get("/orders/my");
			return res.data.data;
		},
	});
};

export const useGetMyOrder = (id?: string) => {
	return useQuery({
		queryKey: ["my-order", id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/orders/my/${id}`);
			return res.data.data;
		},
		enabled: !!id,
	});
};

// ---------------------- COUPON MANAGEMENT ----------------------

export const useCreateCoupon = () => {
	return useMutation({
		mutationFn: async (data: {
			code: string;
			discountType: "PERCENT" | "FIXED";
			value: number;
			maxUses?: number;
			minOrderAmount?: number;
			expiresAt?: string;
			isActive?: boolean;
		}) => {
			const res = await axiosInstance.post("/coupons", data);
			return res.data;
		},
	});
};

export const useGetCoupons = () => {
	return useQuery({
		queryKey: ["coupons"],
		queryFn: async () => {
			const res = await axiosInstance.get("/coupons");
			return res;
		},
	});
};

export const useGetCoupon = (id?: string) => {
	return useQuery({
		queryKey: ["coupon", id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/coupons/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
};

export const useUpdateCoupon = () => {
	return useMutation({
		mutationFn: async ({
			id,
			...data
		}: {
			id: string;
			code?: string;
			discountType?: "PERCENT" | "FIXED";
			value?: number;
			maxUses?: number | null;
			minOrderAmount?: number | null;
			expiresAt?: string | null;
			isActive?: boolean;
		}) => {
			const res = await axiosInstance.patch(`/coupons/${id}`, data);
			return res.data;
		},
	});
};

export const useDeleteCoupon = () => {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/coupons/${id}`);
			return res.data;
		},
	});
};
