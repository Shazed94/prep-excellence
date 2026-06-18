import { useState } from "react";
import type { CartItem } from "@/hooks/useCart";
import type { BillingInfo, LoginInfo, CreateInfo, AccountTab } from "./types";
import { inputCls, Field } from "./Field";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { CheckoutSummary } from "./CheckoutSummary";

interface BillingStepProps {
	accountTab: AccountTab;
	setAccountTab: (t: AccountTab) => void;
	billing: BillingInfo;
	setBilling: (b: BillingInfo) => void;
	login: LoginInfo;
	setLogin: (l: LoginInfo) => void;
	create: CreateInfo;
	setCreate: (c: CreateInfo) => void;
	onContinue: () => void;
	cartItems: CartItem[];
	cartSubtotal: number;
	cartDiscount: number;
	cartTotal: number;
	couponCode: string;
	setCouponCode: (v: string) => void;
	appliedCoupon: { couponCode: string; discount: number } | null;
	onApplyCoupon: () => void;
	onRemoveCoupon: () => void;
	isApplyingCoupon: boolean;
}

export function BillingStep({
	accountTab,
	setAccountTab,
	billing,
	setBilling,
	login,
	setLogin,
	create,
	setCreate,
	onContinue,
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
}: BillingStepProps) {
	const [showPw, setShowPw] = useState(false);
	const [showConfirmPw, setShowConfirmPw] = useState(false);

	return (
		<div className="flex flex-col md:flex-row gap-7 container mx-auto px-6 pb-12 items-start">
			{/* ── Left main ── */}
			<div className="flex-1 min-w-0 flex flex-col gap-6">
				{/* Choose Account */}
				<div className="b">
					<h2 className="h6_class mb-4">Choose Account</h2>
					<div className="flex gap-3 mb-4">
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
										<option>🇧🇩 +880</option>
										<option>🇺🇸 +1</option>
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
					ctaLabel="Continue to Pay"
					onCta={onContinue}
				/>
			</div>
		</div>
	);
}
