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
import { useLoginMutation, useSignupMutation } from "@/hooks/auth";
import { useAddToCart, useClearCart } from "@/hooks/cart";
import { useApplyCoupon, useCreateOrder } from "@/hooks/order";
import { useCart } from "@/hooks/useCart";
import { useCheckoutPersistence } from "@/hooks/useCheckoutPersistence";
import { clearLocalCart, getLocalCartItems } from "@/store/Localcartstore";
import { useAuth } from "@/store/useAuth";
import FooterTwo from "@/components/FooterTwo";

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
    // Don't persist the confirm step — it should never be shown on next visit
    if (step === "confirm") return;
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

  // ── Login & Signup mutations ──
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

  const isCreateFormValid = Boolean(
    create.email?.trim() &&
    create.password?.trim() &&
    create.confirmPassword?.trim(),
  );

  const isCtaDisabled =
    !user &&
    (accountTab === "login" || (accountTab === "create" && !isCreateFormValid));

  // ── Cart data ──
  const { items: rawItems } = useCart(true);
  const cartItems =
    rawItems?.map(
      (ci: {
        courseId: string;
        course?: {
          title: string;
          discount?: number;
          price?: number;
        };
        quantity: number;
      }) => ({
        courseId: ci.courseId,
        name: ci.course?.title || "Course",
        price: ci.course?.price || 0,
        discount: ci.course?.discount || 0,
        quantity: ci.quantity,
      }),
    ) || [];
  const cartSubtotal = cartItems.reduce(
    (s: number, i: { price: number; discount: number; quantity: number }) =>
      s + (i.price - i.discount),
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

  // ── Login handler ──
  const handleLogin = async () => {
    try {
      const res = await loginMutation.mutateAsync({
        email: login.email,
        password: login.password,
      });
      useAuth
        .getState()
        .setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      setAccountTab(null);
      toast.success("Login successful!");
    } catch (err: unknown) {
      toast.error(
        err instanceof AxiosError
          ? err?.response?.data?.message
          : "Login failed",
      );
    }
  };

  // ── Order creation & cart mutations ──
  const { mutateAsync: createOrderAsync, isPending: isCreatingOrder } =
    useCreateOrder();
  const addToCartMutation = useAddToCart();
  const clearCartMutation = useClearCart();

  const [lastOrder, setLastOrder] = useState<{
    orderNumber: string;
    total: number;
    items: Array<{ name: string; price: number }>;
  } | null>(null);

  const handlePay = async () => {
    try {
      // Sign up first if this is a create-account flow
      if (!user && accountTab === "create") {
        // Step 1: Sign up the user (reference from signup page)
        const signupRes = await signupMutation.mutateAsync({
          name: `${billing.firstName} ${billing.lastName}`.trim(),
          email: create.email,
          password: create.password,
          confirmPassword: create.confirmPassword,
          role: "Student",
        });

        // Step 2: Set auth immediately so subsequent API calls have the token
        useAuth
          .getState()
          .setAuth(
            signupRes.data.user,
            signupRes.data.accessToken,
            signupRes.data.refreshToken,
          );

        // Step 3: Sync local cart items to backend before creating order
        const localItems = getLocalCartItems();
        if (localItems.length > 0) {
          await Promise.all(
            localItems.map((item) =>
              addToCartMutation.mutateAsync({ courseId: item.courseId }),
            ),
          );
        }

        // Step 4: Create order with the new user ID
        const orderRes = await createOrderAsync({
          couponCode: appliedCoupon?.couponCode || undefined,
          payableAmount: cartTotal,
          items: cartItems.map((i: { courseId: string; quantity: number }) => ({
            courseId: i.courseId,
            quantity: i.quantity,
          })),
          userId: signupRes.data.user.id,
          billing: {
            firstName: billing.firstName,
            lastName: billing.lastName,
            email: billing.email,
            phone: billing.phone,
            address: billing.address,
            city: billing.city,
            state: billing.state,
            postalCode: billing.postal,
            country: billing.country,
          },
        });

        setLastOrder({
          orderNumber: orderRes.data.orderNumber,
          total: cartTotal,
          items: cartItems.map(
            (i: { name: string; price: number; discount: number }) => ({
              name: i.name,
              price: i.price - i.discount,
            }),
          ),
        });
      } else {
        const orderRes = await createOrderAsync({
          couponCode: appliedCoupon?.couponCode || undefined,
          payableAmount: cartTotal,
          items: cartItems.map((i: { courseId: string; quantity: number }) => ({
            courseId: i.courseId,
            quantity: i.quantity,
          })),
          userId: user?.id,
          billing: {
            firstName: billing.firstName,
            lastName: billing.lastName,
            email: billing.email,
            phone: billing.phone,
            address: billing.address,
            city: billing.city,
            state: billing.state,
            postalCode: billing.postal,
            country: billing.country,
          },
        });
        setLastOrder({
          orderNumber: orderRes.data.orderNumber,
          total: cartTotal,
          items: cartItems.map(
            (i: { name: string; price: number; discount: number }) => ({
              name: i.name,
              price: i.price - i.discount,
            }),
          ),
        });
      }

      // Clear local cart storage
      clearLocalCart();
      // Clear backend cart
      try {
        await clearCartMutation.mutateAsync();
      } catch {
        // Ignore if cart is already empty
      }

      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      // Clear state BEFORE setting confirm so the step effect doesn't re-persist it
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
          onLogin={handleLogin}
          isLoginLoading={loginMutation.isPending}
          isCtaDisabled={isCtaDisabled}
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
          isCreatingOrder={
            isCreatingOrder ||
            signupMutation.isPending ||
            addToCartMutation.isPending ||
            clearCartMutation.isPending
          }
        />
      )}

      {step === "confirm" && lastOrder && (
        <ConfirmStep
          name={`${user?.name || billing.firstName} `}
          email={billing.email}
          total={lastOrder.total}
          orderId={lastOrder.orderNumber}
          items={lastOrder.items}
        />
      )}
      <FooterTwo />
    </div>
  );
}
