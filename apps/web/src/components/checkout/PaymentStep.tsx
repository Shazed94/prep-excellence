import { CheckoutSummary } from "./CheckoutSummary";
import { Field, inputCls } from "./Field";
import type { BillingInfo, CardInfo, PaymentMethod } from "./types";

interface PaymentStepProps {
  card: CardInfo;
  setCard: (c: CardInfo) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  billing: BillingInfo;
  onPay: () => void;
  onBack: () => void;
  cartItems: Array<{
    id?: string;
    name: string;
    price: number;
    quantity: number;
    type?: string;
  }>;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  couponCode: string;
  setCouponCode: (v: string) => void;
  appliedCoupon: { couponCode: string; discount: number } | null;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  isApplyingCoupon: boolean;
  isCreatingOrder: boolean;
}

const methods: { key: PaymentMethod; img: string; label: string }[] = [
  { key: "card", img: "/icons/credit-card.png", label: "Card" },
  { key: "paypal", img: "/icons/paypal.png", label: "PayPal" },
  { key: "googlepay", img: "/icons/google-pay.png", label: "Google Pay" },
  { key: "klarna", img: "/icons/klarna.png", label: "Klarna" },
];

export function PaymentStep({
  card,
  setCard,
  paymentMethod,
  setPaymentMethod,
  billing,
  onPay,
  onBack,
  cartItems,
  cartSubtotal,
  cartDiscount,
  cartTotal,
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
  isCreatingOrder,
}: PaymentStepProps) {
  return (
    <div className="flex flex-col md:flex-row gap-7 container mx-auto px-6 pb-12 items-start">
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
                  "flex items-center gap-2.5 w-[180px] h-16 border rounded-lg text-sm font-medium transition-all min-w-[110px] overflow-hidden",
                  paymentMethod === m.key
                    ? "border-blue-600 text-[#1552FD]"
                    : "border-gray-200 text-[#141B34] hover:border-gray-300 bg-white",
                ].join(" ")}
              >
                <span className="bg-[#F8F8F9] p-5">
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
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
            >
              Edit Information
            </button>
          </div>
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <div className="w-full md:w-[450px] shrink-0">
        <CheckoutSummary
          items={cartItems}
          subtotal={cartSubtotal}
          discount={cartDiscount}
          total={cartTotal}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
          isApplyingCoupon={isApplyingCoupon}
          ctaLabel={`Pay $${cartTotal.toFixed(2)}`}
          onCta={onPay}
          isCreatingOrder={isCreatingOrder}
        />
      </div>
    </div>
  );
}
