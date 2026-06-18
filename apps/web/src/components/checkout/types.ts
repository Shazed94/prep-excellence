export type Step = "billing" | "payment" | "confirm";
export type AccountTab = "login" | "create" | null;
export type PaymentMethod = "card" | "paypal" | "googlepay" | "klarna";

export interface BillingInfo {
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

export interface CardInfo {
	cardNumber: string;
	firstName: string;
	lastName: string;
	expiry: string;
	cvv: string;
	saveCard: boolean;
}

export interface LoginInfo {
	email: string;
	password: string;
}

export interface CreateInfo {
	email: string;
	password: string;
	confirmPassword: string;
}

export interface AppliedCoupon {
	couponCode: string;
	discount: number;
	subtotal: number;
	payableAmount: number;
}

export const STEP_ORDER: Step[] = ["billing", "payment", "confirm"];
