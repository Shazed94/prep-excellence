// hooks/useCart.ts
import { useMemo } from "react";
import {
	useGetCart,
	useAddToCart,
	useRemoveCartItem,
	useUpdateCartItemQuantity,
	useClearCart,
} from "./cart";

export interface CartItem {
	id: string;
	cartId: string;
	courseId: string;
	quantity: number;
	course: {
		title: string;
		offer_price: number;
		regular_price: number;
		thumbnail: string;
	};
	createdAt?: string;
	updatedAt?: string;
}

export interface Cart {
	id: string;
	userId: string;
	items: CartItem[];
	createdAt?: string;
	updatedAt?: string;
}

export interface CartResponse {
	success: boolean;
	data: Cart | CartItem;
	message: string;
}

export interface GetCartResponse {
	success: boolean;
	data: Cart;
	message: string;
}

/**
 * Composite hook combining all cart operations
 * Use this in components for convenient access to cart state and mutations
 */
export function useCart(enabled: boolean = false) {
	// Queries & Mutations
	const getCartQuery = useGetCart({ enabled });
	const addToCartMutation = useAddToCart();
	const removeCartItemMutation = useRemoveCartItem();
	const updateQuantityMutation = useUpdateCartItemQuantity();
	const clearCartMutation = useClearCart();

	// Compute cart totals
	const cartStats = useMemo(() => {
		if (!getCartQuery.data) {
			return {
				items: [],
				itemCount: 0,
				subtotal: 0,
				tax: 0,
				total: 0,
			};
		}

		const items = getCartQuery.data.items || [];
		const itemCount = items.reduce(
			(sum: number, item: CartItem) => sum + item.quantity,
			0,
		);
		const subtotal = items.reduce(
			(sum: number, item: CartItem) =>
				sum +
				(item.course.offer_price || item.course.regular_price) * item.quantity,
			0,
		);
		const tax = subtotal * 0.1; // Adjust tax rate as needed
		const total = subtotal + tax;

		return {
			items,
			itemCount,
			subtotal,
			tax,
			total,
		};
	}, [getCartQuery.data]);

	return {
		// Data
		cart: getCartQuery.data,
		items: cartStats.items,
		itemCount: cartStats.itemCount,
		subtotal: cartStats.subtotal,
		tax: cartStats.tax,
		total: cartStats.total,

		// State
		isLoading: getCartQuery.isLoading,
		isError: getCartQuery.isError,
		error: getCartQuery.error,

		// Mutations
		addToCart: addToCartMutation.mutate,
		addToCartAsync: addToCartMutation.mutateAsync,
		isAddingToCart: addToCartMutation.isPending,

		removeItem: removeCartItemMutation.mutate,
		removeItemAsync: removeCartItemMutation.mutateAsync,
		isRemovingItem: removeCartItemMutation.isPending,

		updateQuantity: updateQuantityMutation.mutate,
		updateQuantityAsync: updateQuantityMutation.mutateAsync,
		isUpdatingQuantity: updateQuantityMutation.isPending,

		clearCart: clearCartMutation.mutate,
		clearCartAsync: clearCartMutation.mutateAsync,
		isClearingCart: clearCartMutation.isPending,

		// Utility
		refetch: getCartQuery.refetch,
	};
}
