import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CustomPhoneInput } from "@/utils/CustomPhoneInput";
import { CheckoutSummary } from "./CheckoutSummary";
import { Field, inputCls } from "./Field";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import type { AccountTab, BillingInfo, CreateInfo, LoginInfo } from "./types";

const billingSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.length(14, "Phone number must be exactly 11 digits"),
	country: z.string().min(1, "Country is required"),
	address: z.string().min(1, "Address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	postal: z.string().min(1, "Postal / ZIP code is required"),
});

interface BillingStepProps {
	accountTab: AccountTab;
	setAccountTab: (t: AccountTab) => void;
	billing: BillingInfo;
	setBilling: (b: BillingInfo) => void;
	login: LoginInfo;
	setLogin: (l: LoginInfo) => void;
	create: CreateInfo;
	setCreate: (c: CreateInfo) => void;
	user: { id: string } | null;
	onContinue: () => void;
	onLogin: () => void;
	isLoginLoading: boolean;
	isCtaDisabled: boolean;
	cartItems: Array<{
		id?: string;
		name: string;
		price: number;
		quantity: number;
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
	user,
	onContinue,
	onLogin,
	isLoginLoading,
	isCtaDisabled,
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

	const form = useForm<BillingInfo>({
		resolver: zodResolver(billingSchema),
		defaultValues: billing,
		mode: "onSubmit",
	});

	const handleContinue = form.handleSubmit((data) => {
		setBilling(data);
		onContinue();
	});

	return (
		<div className="flex flex-col md:flex-row gap-7 container mx-auto px-6 pb-12 items-start">
			{/* ── Left main ── */}
			<div className="flex-1 min-w-0 flex flex-col gap-6">
				{/* Choose Account */}
				{!user && (
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
									onClick={onLogin}
									disabled={isLoginLoading}
									className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors text-sm"
								>
									{isLoginLoading ? "Logging in..." : "Login"}
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
												setCreate({
													...create,
													confirmPassword: e.target.value,
												})
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
				)}

				{/* Billing Information */}
				<Form {...form}>
					<form className="" noValidate onSubmit={handleContinue}>
						<h2 className="h6_class mb-4">Billing Information</h2>
						<div className="flex flex-col gap-4">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First name</FormLabel>
											<FormControl>
												<Input placeholder="Ex : Nayamul" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last name</FormLabel>
											<FormControl>
												<Input placeholder="Ex : Roni" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="Ex : nayamulroni@gmail.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone number</FormLabel>
											<FormControl>
												<PhoneInput
													countrySelectProps={{ unicodeFlags: true }}
													international
													defaultCountry="BD"
													placeholder="Enter phone number"
													value={field.value}
													onChange={(value) => field.onChange(value || "")}
													inputComponent={CustomPhoneInput}
													className=""
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="country"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Country/region</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a country" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="United State of America">
														United State of America
													</SelectItem>
													<SelectItem value="Bangladesh">Bangladesh</SelectItem>
													<SelectItem value="United Kingdom">
														United Kingdom
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address</FormLabel>
											<FormControl>
												<Input
													placeholder="Start typing to search"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input
													placeholder="Start typing to search"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem>
											<FormLabel>State</FormLabel>
											<FormControl>
												<Input
													placeholder="Start typing to search"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="postal"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Postal / ZIP code</FormLabel>
										<FormControl>
											<Input placeholder="Enter code" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
			</div>

			{/* ── Right sidebar ── */}
			<div className="w-full md:w-[450px] shrink-0">
				<CheckoutSummary
					items={cartItems.map((item) => ({
						id: item.id || "",
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					}))}
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
					onCta={handleContinue}
					ctaDisabled={isCtaDisabled}
				/>
			</div>
		</div>
	);
}
