import { useApplyCoupon, useCreateOrder, useGetMyOrders } from "./order";

export interface OrderItem {
	id: string;
	courseId: string;
	unitPrice: number;
	course: {
		title: string;
	};
}

export interface Order {
	id: string;
	userId: string;
	subtotal: number;
	discount: number;
	total: number;
	status: string;
	items: OrderItem[];
	createdAt: string;
	updatedAt: string;
}

export interface CouponResult {
	couponCode: string;
	subtotal: number;
	discount: number;
	payableAmount: number;
}

export interface OrderResponse {
	success: boolean;
	data: Order;
	message: string;
}

export interface CouponResponse {
	success: boolean;
	data: CouponResult;
	message: string;
}

/**
 * Composite hook combining all order operations
 * Use this in components for convenient access to order state and mutations
 */
export function useOrder() {
	const createOrderMutation = useCreateOrder();
	const applyCouponMutation = useApplyCoupon();
	const getMyOrdersQuery = useGetMyOrders();

	return {
		// Mutations
		createOrder: createOrderMutation.mutate,
		createOrderAsync: createOrderMutation.mutateAsync,
		isCreatingOrder: createOrderMutation.isPending,
		createOrderData: createOrderMutation.data,

		applyCoupon: applyCouponMutation.mutate,
		applyCouponAsync: applyCouponMutation.mutateAsync,
		isApplyingCoupon: applyCouponMutation.isPending,
		couponData: applyCouponMutation.data,

		// Queries
		myOrders: getMyOrdersQuery.data,
		isLoadingOrders: getMyOrdersQuery.isLoading,
		ordersError: getMyOrdersQuery.error,
		refetchOrders: getMyOrdersQuery.refetch,
	};
}

import { useCallback, useRef } from "react";

export function useDebouncedCallback<T extends (...args: never[]) => void>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	return useCallback(
		(...args: Parameters<T>) => {
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => fn(...args), delay);
		},
		[fn, delay],
	);
}
