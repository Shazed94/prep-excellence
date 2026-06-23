import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { getLocalCartItems, useLocalCart } from "@/store/Localcartstore";

import { useAuth } from "@/store/useAuth";
import {
	useAddToCart,
	useClearCart,
	useGetCart,
	useRemoveCartItem,
	useUpdateCartItemQuantity,
} from "./cart"; // adjust import path

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
 * Zustand store for managing sync state
 * Prevents multiple syncs and race conditions
 */
interface SyncState {
	hasSynced: boolean;
	isSyncing: boolean;
	setHasSynced: (value: boolean) => void;
	setIsSyncing: (value: boolean) => void;
	reset: () => void;
}

const useSyncStore = create<SyncState>((set) => ({
	hasSynced: false,
	isSyncing: false,
	setHasSynced: (value) => set({ hasSynced: value }),
	setIsSyncing: (value) => set({ isSyncing: value }),
	reset: () => set({ hasSynced: false, isSyncing: false }),
}));

/**
 * Hybrid cart hook that seamlessly switches between localStorage (guest) and backend (authenticated)
 * Handles migration of guest cart to backend when user logs in
 */
export function useCart(_enabled: boolean = false) {
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const isAuthenticated = !!user?.id;

	// Local cart for guests (now using Zustand)
	const localCart = useLocalCart();

	// Backend cart queries & mutations
	const getCartQuery = useGetCart({ enabled: isAuthenticated }) as {
		data: Cart | undefined;
		isLoading: boolean;
		isError: boolean;
		error: Error | null;
		refetch: () => void;
	};

	const addToCartMutation = useAddToCart();
	const removeCartItemMutation = useRemoveCartItem();
	const updateQuantityMutation = useUpdateCartItemQuantity();
	const clearCartMutation = useClearCart();

	// Sync state from Zustand
	const { isSyncing, setHasSynced, setIsSyncing, reset } = useSyncStore();

	// Ref to prevent multiple sync attempts
	const syncAttemptRef = useRef(0);

	/**
	 * Sync local cart items to backend when user logs in
	 * Only runs once per login. Uses synchronous Zustand getState() to check/set
	 * the syncing flag, avoiding React 18 batching issues where setIsSyncing(true)
	 * inside useEffect isn't applied immediately — which caused multiple sync
	 * attempts to start simultaneously and cancel each other out.
	 */
	useEffect(() => {
		if (!isAuthenticated) {
			// Reset sync state on logout
			reset();
			return;
		}

		// Use Zustand's synchronous getState() to avoid React batching issues.
		// Hook-level isSyncing/hasSynced can be stale when the effect re-runs
		// (Strict Mode double-invocation, or re-renders before state commits).
		const storeState = useSyncStore.getState();
		if (storeState.isSyncing || storeState.hasSynced || !localCart.isHydrated) {
			return;
		}

		// Set syncing flag synchronously BEFORE any async work
		storeState.setIsSyncing(true);

		const localItems = getLocalCartItems();

		// If no items to sync, mark as done
		if (localItems.length === 0) {
			setHasSynced(true);
			return;
		}

		// Prevent multiple sync attempts
		syncAttemptRef.current += 1;
		const currentAttempt = syncAttemptRef.current;

		// Fetch the backend cart first to do a bidirectional sync.
		// This ensures items removed from local cart (while logged out) are also
		// removed from the backend, and new items added locally are added to backend.
		queryClient
			.fetchQuery({ queryKey: ["cart"], staleTime: 0 })
			.then(async (backendCart: any) => {
				if (currentAttempt !== syncAttemptRef.current) return;

				const backendItems = backendCart?.items ?? [];
				const backendCourseIds = new Set(
					backendItems.map((i: any) => i.courseId),
				);
				const localCourseIds = new Set(localItems.map((i) => i.courseId));

				// Items to ADD to backend (in local but NOT in backend)
				const itemsToAdd = localItems.filter(
					(item) => !backendCourseIds.has(item.courseId),
				);

				// Items to REMOVE from backend (in backend but NOT in local)
				const itemsToRemove = backendItems.filter(
					(item: any) => !localCourseIds.has(item.courseId),
				);

				if (itemsToAdd.length === 0 && itemsToRemove.length === 0) {
					queryClient.invalidateQueries({ queryKey: ["cart"] });
					setIsSyncing(false);
					setHasSynced(true);
					return;
				}

				const promises: Promise<any>[] = [];

				for (const item of itemsToRemove) {
					promises.push(removeCartItemMutation.mutateAsync(item.id));
				}
				for (const item of itemsToAdd) {
					promises.push(
						addToCartMutation.mutateAsync({ courseId: item.courseId }),
					);
				}

				return Promise.all(promises);
			})
			.then(() => {
				if (currentAttempt !== syncAttemptRef.current) return;

				queryClient.invalidateQueries({ queryKey: ["cart"] });
				setIsSyncing(false);
				setHasSynced(true);
			})
			.catch((error) => {
				if (currentAttempt !== syncAttemptRef.current) return;

				console.error("❌ Sync failed:", error);
				setIsSyncing(false);
			});
	}, [
		isAuthenticated,
		localCart.isHydrated,
		reset,
		setHasSynced,
		setIsSyncing,
		queryClient,
		addToCartMutation.mutateAsync,
		removeCartItemMutation.mutateAsync,
	]);

	// Decide which cart data to use
	const activeCart = isAuthenticated ? getCartQuery.data : null;
	const activeItems = isAuthenticated
		? activeCart?.items || []
		: localCart.items;

	// Compute cart totals
	const cartStats = useMemo(() => {
		const items = activeItems || [];
		const itemCount = items.reduce(
			(sum: number, item: any) => sum + (item.quantity || 1),
			0,
		);
		const subtotal = items.reduce((sum: number, item: any) => {
			const price = item.course?.offer_price || item.course?.regular_price || 0;
			return sum + price * (item.quantity || 1);
		}, 0);
		const tax = subtotal * 0.1;
		const total = subtotal + tax;

		return {
			items,
			itemCount,
			subtotal,
			tax,
			total,
		};
	}, [activeItems]);

	/**
	 * Add to cart - use local or backend based on auth status
	 */
	const addToCart = (
		data: { courseId: string },
		courseData?: any,
		options?: any,
	) => {
		// Normalize: if courseData looks like options (has onSuccess/onError), shift args
		if (courseData && (courseData.onSuccess || courseData.onError)) {
			options = courseData;
			courseData = undefined;
		}

		if (isAuthenticated) {
			// Use backend + mirror to local cart so it survives logout
			const syncedOptions = {
				...options,
				onSuccess: (...args: any[]) => {
					localCart.addItem({
						courseId: data.courseId,
						quantity: 1,
						course: courseData?.title
							? courseData
							: {
									id: data.courseId,
									title: "Course",
									offer_price: 0,
									regular_price: 0,
									thumbnail: "",
								},
					});
					options?.onSuccess?.(...args);

					// Invalidate cart query to refetch updated cart
					queryClient.invalidateQueries({ queryKey: ["cart"] });
				},
			};
			return addToCartMutation.mutate(data, syncedOptions);
		} else {
			// Use localStorage
			localCart.addItem({
				courseId: data.courseId,
				quantity: 1,
				course: courseData || {
					id: data.courseId,
					title: "Course",
					offer_price: 0,
					regular_price: 0,
					thumbnail: "",
				},
			});

			// Call success callback
			options?.onSuccess?.({
				data: { message: "Course added to cart" },
			});
		}
	};

	/**
	 * Remove item - use local or backend based on auth status
	 */
	const removeItem = (courseId: string, options?: any) => {
		if (isAuthenticated) {
			// CartDrawer always passes courseId.  Look up the backend cart item
			// by courseId to get the cart item id for the API call.
			const items = getCartQuery.data?.items || [];
			const cartItem = items.find((i: CartItem) => i.courseId === courseId);
			const cartItemId = cartItem?.id;

			if (!cartItemId) {
				// Item not found in backend cart — still mirror to local cart
				localCart.removeItem(courseId);
				options?.onSuccess?.({ message: "Item removed from cart" });
				return;
			}

			const syncedOptions = {
				...options,
				onSuccess: (...args: any[]) => {
					// Mirror removal to local cart so it persists on logout
					localCart.removeItem(courseId);
					options?.onSuccess?.(...args);
				},
			};
			return removeCartItemMutation.mutate(cartItemId, syncedOptions);
		} else {
			localCart.removeItem(courseId);
			options?.onSuccess?.({
				message: "Item removed from cart",
			});
		}
	};

	/**
	 * Update quantity - use local or backend based on auth status
	 */
	const updateQuantity = (
		courseId: string,
		quantity: number,
		options?: any,
	) => {
		if (isAuthenticated) {
			const items = getCartQuery.data?.items || [];
			const cartItem = items.find((i: CartItem) => i.courseId === courseId);
			const cartItemId = cartItem?.id;

			if (!cartItemId) {
				localCart.updateQuantity(courseId, quantity);
				options?.onSuccess?.({ message: "Quantity updated" });
				return;
			}

			const syncedOptions = {
				...options,
				onSuccess: (...args: any[]) => {
					localCart.updateQuantity(courseId, quantity);
					options?.onSuccess?.(...args);
				},
			};
			return updateQuantityMutation.mutate(
				{ id: cartItemId, quantity },
				syncedOptions,
			);
		} else {
			localCart.updateQuantity(courseId, quantity);
			options?.onSuccess?.({
				message: "Quantity updated",
			});
		}
	};

	/**
	 * Clear cart - use local or backend based on auth status
	 */
	const clearCart = (data?: any, options?: any) => {
		if (isAuthenticated) {
			const syncedOptions = {
				...options,
				onSuccess: (...args: any[]) => {
					// Mirror clear to local cart
					localCart.clearCart();
					options?.onSuccess?.(...args);
				},
			};
			return clearCartMutation.mutate(data, syncedOptions);
		} else {
			localCart.clearCart();
			options?.onSuccess?.({
				message: "All items removed from cart",
			});
		}
	};

	const refetch = () => {
		if (isAuthenticated) {
			getCartQuery.refetch();
		}
	};

	return {
		// Data
		cart: activeCart,
		items: cartStats.items,
		itemCount: cartStats.itemCount,
		subtotal: cartStats.subtotal,
		tax: cartStats.tax,
		total: cartStats.total,

		// State
		isLoading: isAuthenticated ? getCartQuery.isLoading : !localCart.isHydrated,
		isError: isAuthenticated ? getCartQuery.isError : false,
		error: isAuthenticated ? getCartQuery.error : null,
		isAuthenticated,
		isSyncing,

		// Mutations
		addToCart,
		addToCartAsync: isAuthenticated ? addToCartMutation.mutateAsync : undefined,
		isAddingToCart: isAuthenticated ? addToCartMutation.isPending : false,

		removeItem,
		removeItemAsync: isAuthenticated
			? removeCartItemMutation.mutateAsync
			: undefined,
		isRemovingItem: isAuthenticated ? removeCartItemMutation.isPending : false,

		updateQuantity,
		updateQuantityAsync: isAuthenticated
			? updateQuantityMutation.mutateAsync
			: undefined,
		isUpdatingQuantity: isAuthenticated
			? updateQuantityMutation.isPending
			: false,

		clearCart,
		clearCartAsync: isAuthenticated ? clearCartMutation.mutateAsync : undefined,
		isClearingCart: isAuthenticated ? clearCartMutation.isPending : false,

		// Utility
		refetch,
	};
}
