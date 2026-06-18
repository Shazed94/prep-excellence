import { useCallback, useState } from "react";
import type {
	Step,
	AppliedCoupon,
	BillingInfo,
	PaymentMethod,
} from "@/components/checkout/types";

const STORAGE_KEY = "checkout_state";

interface PersistedState {
	step: Step;
	couponCode: string;
	appliedCoupon: AppliedCoupon | null;
	billing: BillingInfo;
	paymentMethod: PaymentMethod;
	accountTab: "login" | "create" | null;
}

function loadPersistedState(): Partial<PersistedState> {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch {
		// ignore parse errors
	}
	return {};
}

function savePersistedState(state: Partial<PersistedState>) {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// ignore quota errors
	}
}

/**
 * A hook that persists checkout state to sessionStorage.
 * Returns initial values for useState and a cleanup function to call on successful order.
 */
export function useCheckoutPersistence() {
	const [persisted] = useState(loadPersistedState);

	const getInitialStep = useCallback(
		(fallback: Step): Step => {
			if (
				persisted.step &&
				["billing", "payment", "confirm"].includes(persisted.step)
			) {
				return persisted.step;
			}
			return fallback;
		},
		[persisted.step],
	);

	const persistNow = useCallback((patch: Partial<PersistedState>) => {
		const current = loadPersistedState();
		savePersistedState({ ...current, ...patch });
	}, []);

	/** Clears all persisted checkout state – call after successful order */
	const clearCheckoutState = useCallback(() => {
		try {
			sessionStorage.removeItem(STORAGE_KEY);
		} catch {
			// ignore
		}
	}, []);

	return {
		/** Initial step from persistence (or fallback) */
		getInitialStep,
		/** Persist a partial update */
		persistNow,
		/** Initial billing from persistence */
		initialBilling: persisted.billing,
		/** Initial coupon code from persistence */
		initialCouponCode: persisted.couponCode || "",
		/** Initial applied coupon from persistence */
		initialAppliedCoupon: persisted.appliedCoupon || null,
		/** Initial payment method from persistence */
		initialPaymentMethod: (persisted.paymentMethod as PaymentMethod) || "card",
		/** Initial account tab from persistence */
		initialAccountTab:
			(persisted.accountTab as "login" | "create" | null) || null,
		/** Clear all persisted state */
		clearCheckoutState,
	};
}
