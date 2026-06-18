import { Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutSummaryProps {
	items: Array<{
		id: string;
		name: string;
		price: number;
		quantity: number;
	}>;
	subtotal: number;
	discount: number;
	total: number;
	couponCode: string;
	setCouponCode: (v: string) => void;
	appliedCoupon: { couponCode: string; discount: number } | null;
	onApplyCoupon: () => void;
	onRemoveCoupon: () => void;
	isApplyingCoupon: boolean;
	ctaLabel: string;
	onCta: () => void;
	isCreatingOrder?: boolean;
}

export function CheckoutSummary({
	items,
	subtotal,
	discount,
	total,
	couponCode,
	setCouponCode,
	appliedCoupon,
	onApplyCoupon,
	onRemoveCoupon,
	isApplyingCoupon,
	ctaLabel,
	onCta,
	isCreatingOrder,
}: CheckoutSummaryProps) {
	return (
		<div className="bg-white rounded-xl border border-[#EBEBEB]">
			<h2 className="h6_class px-6 py-4 border-b border-[#EBEBEB]">
				Checkout Summary
			</h2>
			<div className="p-6">
				{/* Items — scrollable */}
				<div className="max-h-40 overflow-y-auto mb-4">
					{items.map((item, i) => (
						<div key={item.id || i} className="mb-4">
							<div className="flex justify-between items-start mb-1">
								<span className="text-sm font-semibold text-gray-900">
									{item.name}
								</span>
								<span className="text-sm font-semibold text-gray-900">
									${item.price}
								</span>
							</div>
							<div className="flex gap-1 text-xs text-gray-500 mb-0.5">
								<span className="w-14">Quantity</span>
								<span>:</span>
								<span>x{item.quantity}</span>
							</div>
						</div>
					))}
				</div>

				{/* Promo / Coupon code */}
				<div className="mb-4">
					<p className="text-sm font-medium text-gray-700 mb-2">
						Do you have a coupon code?
					</p>
					{appliedCoupon ? (
						<div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-2">
							<div className="flex items-center gap-2">
								<Tag className="h-4 w-4 text-green-600" />
								<span className="text-sm font-semibold text-green-700">
									{appliedCoupon.couponCode}
								</span>
							</div>
							<button
								type="button"
								onClick={onRemoveCoupon}
								className="text-xs text-red-500 hover:text-red-700 font-medium"
							>
								Remove
							</button>
						</div>
					) : (
						<div className="flex gap-2 mb-2">
							<input
								className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
								placeholder="Enter code"
								value={couponCode}
								onChange={(e) => setCouponCode(e.target.value)}
							/>
							<button
								type="button"
								onClick={onApplyCoupon}
								disabled={isApplyingCoupon}
								className="text-blue-600 font-semibold text-sm px-2 disabled:opacity-50"
							>
								{isApplyingCoupon ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Apply"
								)}
							</button>
						</div>
					)}
					{!appliedCoupon && (
						<p className="text-xs text-gray-400 leading-relaxed">
							ⓘ To get a promo code you can help our social media, there we
							share promo codes every month.
						</p>
					)}
				</div>

				{/* Totals */}
				<div className="border-t border-gray-100 mb-3 pt-3 space-y-2">
					<div className="flex justify-between text-sm text-gray-600">
						<span>Total Courses</span>
						<span>x{items.reduce((s, i) => s + i.quantity, 0)}</span>
					</div>
					<div className="flex justify-between text-sm text-gray-600">
						<span className="flex items-center gap-1">
							Subtotal <span className="text-gray-400 text-xs">ⓘ</span>
						</span>
						<span>${subtotal.toFixed(2)}</span>
					</div>
					{discount > 0 && (
						<div className="flex justify-between text-sm text-gray-600">
							<span className="flex items-center gap-2">
								Discount
								<span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
									COUPON
								</span>
							</span>
							<span>-${discount.toFixed(2)}</span>
						</div>
					)}
				</div>

				{/* Grand total */}
				<div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3 mb-4">
					<span>Total payment</span>
					<span>${total.toFixed(2)}</span>
				</div>

				{/* CTA */}
				<Button
					variant="gradient"
					onClick={onCta}
					className="w-full"
					disabled={isCreatingOrder}
				>
					{isCreatingOrder ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
						</>
					) : (
						ctaLabel
					)}
				</Button>
				<p className="text-[16px] text-[#6C7179] text-center mt-3 -tracking-[1px]">
					By clicking on this you agree to our{" "}
					<a href="/#" className="text-[#141B34] underline">
						Terms of Use, Sale, Return Policy, and Privacy Policy.
					</a>
				</p>
			</div>
		</div>
	);
}
