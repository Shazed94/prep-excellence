import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type {
	AccountTab,
	BillingInfo,
	CardInfo,
	CreateInfo,
	LoginInfo,
	PaymentMethod,
	Step,
} from "@/components/checkout";
import {
	BillingStep,
	CheckoutHeader,
	ConfirmStep,
	PaymentStep,
	STEP_ORDER,
	StepIndicator,
} from "@/components/checkout";
import { useApplyCoupon, useCreateOrder } from "@/hooks/order";
import { useCart } from "@/hooks/useCart";
import { useCheckoutPersistence } from "@/hooks/useCheckoutPersistence";
import { useAuth } from "@/store/useAuth";

export const Route = createFileRoute("/checkout/")({
	component: RouteComponent,
});

// ─── Main ───────────────────────────────────────────────────────────────────────

function RouteComponent() {
	const queryClient = useQueryClient();
	const {
		getInitialStep,
		persistNow,
		initialBilling,
		initialCouponCode,
		initialAppliedCoupon,
		initialPaymentMethod,
		initialAccountTab,
		clearCheckoutState,
	} = useCheckoutPersistence();

	const { user } = useAuth();

	const [step, setStep] = useState<Step>(() => getInitialStep("billing"));
	const [accountTab, setAccountTab] = useState<AccountTab>(initialAccountTab);
	const [couponCode, setCouponCode] = useState(initialCouponCode);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
		initialPaymentMethod || "card",
	);
	const [appliedCoupon, setAppliedCoupon] = useState<{
		couponCode: string;
		discount: number;
		subtotal: number;
		payableAmount: number;
	} | null>(initialAppliedCoupon);

	const [billing, setBilling] = useState<BillingInfo>(
		initialBilling || {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			country: "",
			address: "",
			city: "",
			state: "",
			postal: "",
		},
	);

	const [login, setLogin] = useState<LoginInfo>({ email: "", password: "" });
	const [create, setCreate] = useState<CreateInfo>({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [card, setCard] = useState<CardInfo>({
		cardNumber: "",
		firstName: "",
		lastName: "",
		expiry: "",
		cvv: "",
		saveCard: false,
	});

	// Track initial mount to avoid saving incomplete state on first render
	const isFirstRender = useRef(true);

	// ── Persist state changes to sessionStorage ──
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		persistNow({ step });
	}, [step, persistNow]);

	useEffect(() => {
		if (isFirstRender.current) return;
		persistNow({ couponCode });
	}, [couponCode, persistNow]);

	useEffect(() => {
		if (isFirstRender.current) return;
		persistNow({ appliedCoupon });
	}, [appliedCoupon, persistNow]);

	useEffect(() => {
		if (isFirstRender.current) return;
		persistNow({ paymentMethod });
	}, [paymentMethod, persistNow]);

	useEffect(() => {
		if (isFirstRender.current) return;
		persistNow({ billing });
	}, [billing, persistNow]);

	useEffect(() => {
		if (isFirstRender.current) return;
		persistNow({ accountTab });
	}, [accountTab, persistNow]);

	// ── Cart data ──
	const { items: rawItems } = useCart(true);
	const cartItems =
		rawItems?.map(
			(ci: {
				id: string;
				course?: {
					title: string;
					offer_price?: number;
					regular_price?: number;
				};
				quantity: number;
			}) => ({
				id: ci.id,
				name: ci.course?.title || "Course",
				price: (ci.course?.offer_price ?? ci.course?.regular_price) || 0,
				quantity: ci.quantity,
			}),
		) || [];
	const cartSubtotal = cartItems.reduce(
		(s: number, i: { price: number; quantity: number }) =>
			s + i.price * i.quantity,
		0,
	);
	const cartDiscount = appliedCoupon?.discount || 0;
	const cartTotal =
		appliedCoupon?.payableAmount ?? Math.max(0, cartSubtotal - cartDiscount);

	// ── Coupon mutation ──
	const { mutateAsync: applyCouponAsync, isPending: isApplyingCoupon } =
		useApplyCoupon();

	const handleApplyCoupon = async () => {
		if (!couponCode.trim()) return;
		try {
			const res = await applyCouponAsync({ couponCode: couponCode.trim() });
			const data = res.data;
			setAppliedCoupon({
				couponCode: data.couponCode,
				discount: Number(data.discount),
				subtotal: Number(data.subtotal),
				payableAmount: Number(data.payableAmount),
			});
			toast.success("Coupon applied!");
		} catch (err: unknown) {
			toast.error(
				err instanceof AxiosError
					? err?.response?.data?.message
					: "Failed to apply coupon",
			);
		}
	};

	const handleRemoveCoupon = () => {
		setAppliedCoupon(null);
		setCouponCode("");
		toast.info("Coupon removed");
	};

	// ── Order creation mutation ──
	const { mutateAsync: createOrderAsync, isPending: isCreatingOrder } =
		useCreateOrder();

	const handlePay = async () => {
		try {
			await createOrderAsync({
				couponCode: appliedCoupon?.couponCode || undefined,
				payableAmount: cartTotal,
			});
			toast.success("Order placed successfully!");
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			queryClient.invalidateQueries({ queryKey: ["my-orders"] });
			clearCheckoutState();
			setStep("confirm");
		} catch (err: unknown) {
			toast.error(
				err instanceof AxiosError
					? err?.response?.data?.message
					: "Failed to place order",
			);
		}
	};

	// Clicking a completed step in the indicator goes back to it
	const handleStepClick = (target: Step) => {
		const targetIdx = STEP_ORDER.indexOf(target);
		const currentIdx = STEP_ORDER.indexOf(step);
		if (targetIdx < currentIdx) setStep(target);
	};

	return (
		<div className="min-h-screen">
			<CheckoutHeader />
			<StepIndicator currentStep={step} onStepClick={handleStepClick} />

			{step === "billing" && (
				<BillingStep
					accountTab={accountTab}
					setAccountTab={setAccountTab}
					billing={billing}
					setBilling={setBilling}
					login={login}
					setLogin={setLogin}
					create={create}
					setCreate={setCreate}
					user={user}
					onContinue={() => setStep("payment")}
					cartItems={cartItems}
					cartSubtotal={cartSubtotal}
					cartDiscount={cartDiscount}
					cartTotal={cartTotal}
					couponCode={couponCode}
					setCouponCode={setCouponCode}
					appliedCoupon={appliedCoupon}
					onApplyCoupon={handleApplyCoupon}
					onRemoveCoupon={handleRemoveCoupon}
					isApplyingCoupon={isApplyingCoupon}
				/>
			)}

			{step === "payment" && (
				<PaymentStep
					card={card}
					setCard={setCard}
					paymentMethod={paymentMethod}
					setPaymentMethod={setPaymentMethod}
					billing={billing}
					onPay={handlePay}
					onBack={() => setStep("billing")}
					cartItems={cartItems}
					cartSubtotal={cartSubtotal}
					cartDiscount={cartDiscount}
					cartTotal={cartTotal}
					couponCode={couponCode}
					setCouponCode={setCouponCode}
					appliedCoupon={appliedCoupon}
					onApplyCoupon={handleApplyCoupon}
					onRemoveCoupon={handleRemoveCoupon}
					isApplyingCoupon={isApplyingCoupon}
					isCreatingOrder={isCreatingOrder}
				/>
			)}

			{step === "confirm" && (
				<ConfirmStep
					name={`${user?.name} `}
					email={billing.email}
					total={cartTotal}
				/>
			)}
		</div>
	);
}
