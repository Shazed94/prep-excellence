import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import {
  CheckSvg,
  PaymentCardSvg,
  UserAccountSvg,
} from "@/components/SvgComponents";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout/")({
  component: RouteComponent,
});

// ─── Types ─────────────────────────────────────────────────────────────────────

type Step = "billing" | "payment" | "confirm";
type AccountTab = "login" | "create" | null;
type PaymentMethod = "card" | "paypal" | "googlepay" | "klarna";

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postal: string;
}

interface CardInfo {
  cardNumber: string;
  firstName: string;
  lastName: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

interface LoginInfo {
  email: string;
  password: string;
}

interface CreateInfo {
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const CHECKOUT_ITEMS = [
  {
    name: "SAT Course for Summer",
    price: 120.0,
    quantity: 1,
    type: "Group Class",
  },
  {
    name: "SAT Course for Summer",
    price: 120.0,
    quantity: 1,
    type: "Group Class",
  },
];

const SUBTOTAL = 754.5;
const TAX = 20.0;
const DISCOUNT = SUBTOTAL * 0.1;
const TOTAL = SUBTOTAL + TAX - DISCOUNT;

const STEP_ORDER: Step[] = ["billing", "payment", "confirm"];

// ─── StepIndicator ──────────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: Step;
  onStepClick: (step: Step) => void;
}) {
  const currentIdx = STEP_ORDER.indexOf(currentStep);

  const steps = [
    { key: "billing" as Step, label: "Billing Information" },
    { key: "payment" as Step, label: "Make Payment" },
    { key: "confirm" as Step, label: "Confirm" },
  ];

  return (
    <div className="">
      <div className="bg-[#F8F8F9] border-b border-gray-200 py-5 mb-8">
        <div className="container mx-auto">
          <div className="flex items-start justify-center max-w-xl mx-auto">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentIdx;
              const isActive = idx === currentIdx;
              const isClickable = idx < currentIdx;

              // Connector logic (between idx and idx+1)
              const isLineCompleted = idx < currentIdx; // line after this step is completed only if we moved past it

              return (
                <div key={step.key} className="flex items-start">
                  {/* Circle + label */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => isClickable && onStepClick(step.key)}
                      disabled={!isClickable}
                      className={[
                        "w-12 h-12 rounded-full flex items-center justify-center border transition-all",
                        isActive
                          ? "bg-blue-600 border-blue-600 text-white"
                          : isCompleted
                            ? "bg-blue-600 border-blue-600 text-white cursor-pointer hover:bg-blue-700"
                            : "bg-white border-gray-300 text-gray-400",
                      ].join(" ")}
                    >
                      {/* placeholder icon slot */}
                      <span className="">
                        {step.key === "billing" ? (
                          <UserAccountSvg className="text-white" />
                        ) : step.key === "payment" ? (
                          <PaymentCardSvg
                            className={cn({
                              "text-white": isCompleted || isActive,
                            })}
                          />
                        ) : (
                          <CheckSvg
                            className={cn({
                              "text-white": isActive || isCompleted,
                            })}
                          />
                        )}
                      </span>
                    </button>
                    <span
                      className={[
                        "text-[14px] md:text-[18px] mt-2 whitespace-nowrap",
                        isActive || isCompleted
                          ? "text-[#1552FD] font-medium"
                          : "text-gray-400",
                      ].join(" ")}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector line between steps */}
                  {idx < steps.length - 1 && (
                    <div className="flex items-center mt-5 mx-1">
                      {/* Left dot (belongs to current step) */}
                      <div
                        className={[
                          "w-2 h-2 rounded-full border flex-shrink-0",
                          isCompleted || isActive
                            ? "border-[#1552FD] bg-[#1552FD]"
                            : "border-gray-400 bg-white",
                        ].join(" ")}
                      />

                      {/* Main line */}
                      <div
                        className={[
                          "w-12 md:w-24 h-px flex-shrink-0",
                          isLineCompleted || isActive
                            ? "bg-[repeating-linear-gradient(to_right,#1552fd_0,#1552fd_4px,transparent_4px,transparent_8px)]" // solid blue - completed
                            : "bg-[repeating-linear-gradient(to_right,#9CA3AF_0,#9CA3AF_4px,transparent_4px,transparent_8px)]", // gray dotted
                        ].join(" ")}
                      />

                      {/* Right dot (belongs to next step) */}
                      <div
                        className={[
                          "w-2 h-2 rounded-full border flex-shrink-0",
                          idx + 1 < currentIdx || idx + 1 === currentIdx
                            ? "border-[#1552FD] bg-[#1552FD]"
                            : "border-gray-400 bg-white",
                        ].join(" ")}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CheckoutSummary ────────────────────────────────────────────────────────────

function CheckoutSummary({
  promoCode,
  setPromoCode,
  ctaLabel,
  onCta,
}: {
  promoCode: string;
  setPromoCode: (v: string) => void;
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <div className="bg-white rounded-xl  border border-[#EBEBEB]">
      <h2 className="h6_class px-6 py-4 border-b border-[#EBEBEB]">
        Checkout Summary
      </h2>
      <div className="p-6 ">
        {/* Items — scrollable */}
        <div className="max-h-40 overflow-y-auto mb-4 ">
          {CHECKOUT_ITEMS.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-semibold text-gray-900">
                  {item.name}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-1 text-xs text-gray-500 mb-0.5">
                <span className="w-14">Quantity</span>
                <span>:</span>
                <span>x{item.quantity}</span>
              </div>
              <div className="flex gap-1 text-xs text-gray-500">
                <span className="w-14">Type</span>
                <span>:</span>
                <span>{item.type}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Promo code */}
        <div className="mb-4 ">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Do you have a promo code?
          </p>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button
              type="button"
              className="text-blue-600 font-semibold text-sm px-2"
            >
              Apply
            </button>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            ⓘ To get a promo code you can help our social media, there we share
            promo codes every month.
          </p>
        </div>
        {/* Totals */}
        <div className="border-t border-gray-100 mb-3 pt-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Courses</span>
            <span>x1</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1">
              Subtotal <span className="text-gray-400 text-xs">ⓘ</span>
            </span>
            <span>${SUBTOTAL.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1">
              Estimated tax <span className="text-gray-400 text-xs">ⓘ</span>
            </span>
            <span>${TAX.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-2">
              Discount
              <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                10% OFF
              </span>
            </span>
            <span>-${DISCOUNT.toFixed(2)}</span>
          </div>
        </div>
        {/* Grand total */}
        <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3 mb-4">
          <span>Total payment</span>
          <span>${TOTAL.toFixed(2)}</span>
        </div>
        {/* CTA */}
        <Button variant={"gradient"} onClick={onCta} className="w-full">
          {ctaLabel}
        </Button>
        <p className="text-[16px] text-[#6C7179] text-center mt-3 -tracking-[1px]">
          By clicking on this you agree to our{" "}
          <a href="/#" className="text-[#141B34] underline">
            Terms of Use, Sale, Return Policy, and Privacy Policy.
          </a>
        </p>{" "}
      </div>
    </div>
  );
}

// ─── PasswordStrengthBar ────────────────────────────────────────────────────────

function PasswordStrengthBar({ password }: { password: string }) {
  const strength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;
  const colors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-green-500"];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1.5 mb-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`flex-1 h-1 rounded-full transition-colors ${
              strength >= level ? colors[strength] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">
        At least 1 number, 8 characters, 1 symbol
      </p>
    </div>
  );
}

// ─── Shared field primitives ────────────────────────────────────────────────────

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 transition-colors bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={label} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Step 1: Billing ────────────────────────────────────────────────────────────

function BillingStep({
  accountTab,
  setAccountTab,
  billing,
  setBilling,
  login,
  setLogin,
  create,
  setCreate,
  onContinue,
  promoCode,
  setPromoCode,
}: {
  accountTab: AccountTab;
  setAccountTab: (t: AccountTab) => void;
  billing: BillingInfo;
  setBilling: (b: BillingInfo) => void;
  login: LoginInfo;
  setLogin: (l: LoginInfo) => void;
  create: CreateInfo;
  setCreate: (c: CreateInfo) => void;
  onContinue: () => void;
  promoCode: string;
  setPromoCode: (v: string) => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  return (
    <div className="flex gap-7 container mx-auto px-6 pb-12 items-start">
      {/* ── Left main ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        {/* Choose Account */}
        <div className="b">
          <h2 className="h6_class mb-4">Choose Account</h2>
          <div className="flex gap-3">
            {(["login", "create"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setAccountTab(accountTab === tab ? null : tab)}
                className={[
                  "p flex items-center gap-2 px-5 py-3 mb-0! rounded-md border transition-all",
                  accountTab === tab
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-[#141B34] hover:border-gray-300",
                ].join(" ")}
              >
                {
                  <span
                    className={`w-5 h-5 rounded-full ${accountTab === tab ? "bg-blue-600" : "bg-gray-300"} inline-block`}
                  />
                }
                {tab === "login" ? "Log In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Login fields */}
          {accountTab === "login" && (
            <div className="flex flex-col gap-4">
              <Field label="Email">
                <input
                  className={inputCls}
                  type="email"
                  placeholder="Ex : nayamulroni@gmail.com"
                  value={login.email}
                  onChange={(e) =>
                    setLogin({ ...login, email: e.target.value })
                  }
                />
              </Field>
              <Field label="Password">
                <div className="relative">
                  <input
                    className={inputCls + " pr-11"}
                    type={showPw ? "text" : "password"}
                    placeholder="Enter Your Password"
                    value={login.password}
                    onChange={(e) =>
                      setLogin({ ...login, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    👁
                  </button>
                </div>
              </Field>
              <button
                type="button"
                onClick={onContinue}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Login
              </button>
            </div>
          )}

          {/* Create Account fields */}
          {accountTab === "create" && (
            <div className="flex flex-col gap-4">
              <Field label="Email">
                <input
                  className={inputCls}
                  type="email"
                  placeholder="Ex : nayamulroni@gmail.com"
                  value={create.email}
                  onChange={(e) =>
                    setCreate({ ...create, email: e.target.value })
                  }
                />
              </Field>
              <Field label="New Password">
                <div className="relative">
                  <input
                    className={inputCls + " pr-11"}
                    type={showPw ? "text" : "password"}
                    placeholder="Enter password"
                    value={create.password}
                    onChange={(e) =>
                      setCreate({ ...create, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    👁
                  </button>
                </div>
                <PasswordStrengthBar password={create.password} />
              </Field>
              <Field label="Confirm New Password">
                <div className="relative">
                  <input
                    className={inputCls + " pr-11"}
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="Confirm password"
                    value={create.confirmPassword}
                    onChange={(e) =>
                      setCreate({ ...create, confirmPassword: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    👁
                  </button>
                </div>
              </Field>
            </div>
          )}
        </div>

        {/* Billing Information */}
        <div className="">
          <h2 className="h6_class mb-4">Billing Information</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name">
                <input
                  className={inputCls}
                  placeholder="Ex : Nayamul"
                  value={billing.firstName}
                  onChange={(e) =>
                    setBilling({ ...billing, firstName: e.target.value })
                  }
                />
              </Field>
              <Field label="Last name">
                <input
                  className={inputCls}
                  placeholder="Ex : Roni"
                  value={billing.lastName}
                  onChange={(e) =>
                    setBilling({ ...billing, lastName: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <input
                  className={inputCls}
                  type="email"
                  placeholder="Ex : nayamulroni@gmail.com"
                  value={billing.email}
                  onChange={(e) =>
                    setBilling({ ...billing, email: e.target.value })
                  }
                />
              </Field>
              <Field label="Phone number">
                <div className="flex gap-2">
                  <select className="px-2 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500">
                    <option>🇺🇸 +1</option>
                    <option>🇧🇩 +880</option>
                    <option>🇬🇧 +44</option>
                  </select>
                  <input
                    className={inputCls}
                    placeholder="Enter your number"
                    value={billing.phone}
                    onChange={(e) =>
                      setBilling({ ...billing, phone: e.target.value })
                    }
                  />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Country/region">
                <select
                  className={inputCls}
                  value={billing.country}
                  onChange={(e) =>
                    setBilling({ ...billing, country: e.target.value })
                  }
                >
                  <option>United State of America</option>
                  <option>Bangladesh</option>
                  <option>United Kingdom</option>
                </select>
              </Field>
              <Field label="Address">
                <input
                  className={inputCls}
                  placeholder="Start typing to search"
                  value={billing.address}
                  onChange={(e) =>
                    setBilling({ ...billing, address: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <input
                  className={inputCls}
                  placeholder="Start typing to search"
                  value={billing.city}
                  onChange={(e) =>
                    setBilling({ ...billing, city: e.target.value })
                  }
                />
              </Field>
              <Field label="State">
                <input
                  className={inputCls}
                  placeholder="Start typing to search"
                  value={billing.state}
                  onChange={(e) =>
                    setBilling({ ...billing, state: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Postal / ZIP code">
              <input
                className={inputCls}
                placeholder="Enter code"
                value={billing.postal}
                onChange={(e) =>
                  setBilling({ ...billing, postal: e.target.value })
                }
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <div className="w-full md:w-[450px] flex-shrink-0">
        <CheckoutSummary
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          ctaLabel="Continue to Pay"
          onCta={onContinue}
        />
      </div>
    </div>
  );
}

// ─── Step 2: Payment ────────────────────────────────────────────────────────────

function PaymentStep({
  card,
  setCard,
  paymentMethod,
  setPaymentMethod,
  billing,
  onPay,
  onBack,
  promoCode,
  setPromoCode,
}: {
  card: CardInfo;
  setCard: (c: CardInfo) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  billing: BillingInfo;
  onPay: () => void;
  onBack: () => void;
  promoCode: string;
  setPromoCode: (v: string) => void;
}) {
  const methods: { key: PaymentMethod; img: string; label: string }[] = [
    { key: "card", img: "/icons/credit-card.png", label: "Card" },
    { key: "paypal", img: "/icons/paypal.png", label: "PayPal" },
    { key: "googlepay", img: "/icons/google-pay.png", label: "Google Pay" },
    { key: "klarna", img: "/icons/klarna.png", label: "Klarna" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-7 max-w-6xl mx-auto px-6 pb-12 items-start">
      {/* ── Left main ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        {/* Payment Method */}
        <div className="">
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            Payment Method
          </h2>
          <div className="flex flex-wrap gap-3">
            {methods.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setPaymentMethod(m.key)}
                className={[
                  "flex items-center  gap-2.5 w-[180px] h-16 border rounded-lg text-sm font-medium transition-all min-w-[110px] overflow-hidden",
                  paymentMethod === m.key
                    ? "border-blue-600  text-[#1552FD]"
                    : "border-gray-200 text-[#141B34] hover:border-gray-300 bg-white",
                ].join(" ")}
              >
                <span className="bg-[#F8F8F9] p-5 ">
                  <img src={m.img} alt={m.key} className="w-8 h-8" />
                </span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Information */}
        {paymentMethod === "card" && (
          <div className="">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Card Information
            </h2>
            <div className="flex flex-col gap-4">
              <Field label="Card Number">
                <input
                  className={inputCls}
                  placeholder="Ex : 1234 5678 1234 5678"
                  value={card.cardNumber}
                  onChange={(e) =>
                    setCard({ ...card, cardNumber: e.target.value })
                  }
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name">
                  <input
                    className={inputCls}
                    placeholder="Ex : Nayamul"
                    value={card.firstName}
                    onChange={(e) =>
                      setCard({ ...card, firstName: e.target.value })
                    }
                  />
                </Field>
                <Field label="Last name">
                  <input
                    className={inputCls}
                    placeholder="Ex : Roni"
                    value={card.lastName}
                    onChange={(e) =>
                      setCard({ ...card, lastName: e.target.value })
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry Date">
                  <input
                    className={inputCls}
                    placeholder="MM/YYYY"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: e.target.value })
                    }
                  />
                </Field>
                <Field label="CVV">
                  <input
                    className={inputCls}
                    placeholder="Ex: 123"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={card.saveCard}
                  onChange={(e) =>
                    setCard({ ...card, saveCard: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                Save credit card detail for later
              </label>
            </div>
          </div>
        )}

        {/* Billing summary (read-only) */}
        <div className="">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Billing Information
          </h2>
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-base font-bold text-gray-900 mb-2">
                {billing.firstName} {billing.lastName}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {billing.address}
              </p>
              <p className="text-sm text-gray-500">
                {billing.country || "United States"}
              </p>
              <p className="text-sm text-gray-500">{billing.phone}</p>
              <p className="text-sm text-gray-500">{billing.email}</p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Edit Information
            </button>
          </div>
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <div className="w-full md:w-80 flex-shrink-0">
        <CheckoutSummary
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          ctaLabel="Pay Now"
          onCta={onPay}
        />
      </div>
    </div>
  );
}

// ─── Step 3: Confirm ────────────────────────────────────────────────────────────

function ConfirmStep({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 pb-12 text-center">
      {/* placeholder icon — replace with your illustration */}
      <div className="text-8xl mb-8">📦✅</div>
      <h1 className="text-3xl font-extrabold text-gray-900 leading-snug mb-4">
        Thank Nayamul, your order
        <br />
        has been placed successfully
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-8">
        We will send the latest information and updates about your order to
        <br />
        <strong className="text-gray-700">
          {email || "nayamulroni@gmail.com"}
        </strong>
      </p>
      <button
        type="button"
        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
      >
        Continue to Dashboard
      </button>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────────

function RouteComponent() {
  const [step, setStep] = useState<Step>("billing");
  const [accountTab, setAccountTab] = useState<AccountTab>(null);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [billing, setBilling] = useState<BillingInfo>({
    firstName: "Nayamul",
    lastName: "Roni",
    email: "nayamulroni@gmail.com",
    phone: "+1 (555) 123-4567",
    country: "United State of America",
    address: "1220 Apple avenue, Internationally University, California, 22090",
    city: "",
    state: "California",
    postal: "22090",
  });

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

  // Clicking a completed step in the indicator goes back to it
  const handleStepClick = (target: Step) => {
    const targetIdx = STEP_ORDER.indexOf(target);
    const currentIdx = STEP_ORDER.indexOf(step);
    if (targetIdx < currentIdx) setStep(target);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <img src="logo.png" alt="" />
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2.5 bg-[#EEFCF5] px-7 py-3.5 rounded-[6px]">
              <img src="/icons/security-check.png" alt="" />
              <span className="text-[#1BA75C]">100% Secure Payment</span>
            </div>
            <button
              type="button"
              className="p-2.5 border border-[#EBEBEB] rounded-[6px] cursor-pointer"
            >
              <X />
            </button>
          </div>
        </div>
      </div>
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
          onContinue={() => setStep("payment")}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
        />
      )}

      {step === "payment" && (
        <PaymentStep
          card={card}
          setCard={setCard}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          billing={billing}
          onPay={() => setStep("confirm")}
          onBack={() => setStep("billing")}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
        />
      )}

      {step === "confirm" && <ConfirmStep email={billing.email} />}
    </div>
  );
}
