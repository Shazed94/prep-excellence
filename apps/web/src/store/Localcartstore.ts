import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocalCartItem {
	courseId: string;
	quantity: number;
	course: {
		id: string;
		title: string;
		discount: number;
		price: number;
		thumbnail: string;
	};
}

interface LocalCartStore {
	items: LocalCartItem[];
	isHydrated: boolean;

	// Actions
	addItem: (item: LocalCartItem) => void;
	removeItem: (courseId: string) => void;
	updateQuantity: (courseId: string, quantity: number) => void;
	clearCart: () => void;
	setHydrated: (value: boolean) => void;
	getItems: () => LocalCartItem[];
}

const initializer = (set: any, get: any) => ({
	items: [] as LocalCartItem[],
	isHydrated: false,

	addItem: (item: LocalCartItem) => {
		set((state: any) => {
			const existingIndex = state.items.findIndex(
				(i: any) => i.courseId === item.courseId,
			);

			if (existingIndex > -1) {
				const updated = [...state.items];
				updated[existingIndex].quantity = 1;
				return { items: updated };
			}

			return { items: [...state.items, item] };
		});
	},

	removeItem: (courseId: string) =>
		set((state: any) => ({
			items: state.items.filter((i: any) => i.courseId !== courseId),
		})),

	updateQuantity: (courseId: string, quantity: number) => {
		if (quantity <= 0) {
			get().removeItem(courseId);
			return;
		}
		set((state: any) => ({
			items: state.items.map((i: any) =>
				i.courseId === courseId ? { ...i, quantity } : i,
			),
		}));
	},

	clearCart: () => set({ items: [] }),

	setHydrated: (value: boolean) => set({ isHydrated: value }),

	getItems: () => get().items,
});

const persistOptions = {
	name: "prepexcellence_guest_cart",
	onRehydrateStorage: () => (state: any) => {
		if (state) state.setHydrated(true);
	},
};

export const useLocalCartStore =
	typeof window !== "undefined"
		? create<LocalCartStore>()(persist(initializer, persistOptions))
		: create<LocalCartStore>()(initializer as any);

/**
 * Get cart items from store (for migration)
 */
export function getLocalCartItems(): LocalCartItem[] {
	return useLocalCartStore.getState().items;
}

/**
 * Clear cart from store (after sync)
 */
export function clearLocalCart() {
	useLocalCartStore.getState().clearCart();
}

/**
 * Hook for accessing local cart (alternative to store directly)
 */
export function useLocalCart() {
	const items = useLocalCartStore((state) => state.items);
	const isHydrated = useLocalCartStore((state) => state.isHydrated);
	const addItem = useLocalCartStore((state) => state.addItem);
	const removeItem = useLocalCartStore((state) => state.removeItem);
	const updateQuantity = useLocalCartStore((state) => state.updateQuantity);
	const clearCart = useLocalCartStore((state) => state.clearCart);

	return {
		items,
		isHydrated,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
		subtotal: items.reduce(
			(sum, item) =>
				sum + (item.course.discount || item.course.price) * item.quantity,
			0,
		),
	};
}
