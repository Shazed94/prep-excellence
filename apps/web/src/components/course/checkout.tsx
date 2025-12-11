// components/checkout-page.tsx
"use client";

import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, CreditCard, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { coursesData } from "@/data/course-data";
import { useAuth } from "@/store/useAuth";

interface CheckoutPageProps {
	courseId: string;
}

interface CheckoutFormData {
	firstName: string;
	lastName: string;
	email: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	cardNumber: string;
	expiry: string;
	cvv: string;
}

export function CheckoutPage({ courseId }: CheckoutPageProps) {
	const router = useRouter();
	const { user } = useAuth();
	const [course, _setCourse] = useState<any>(null);
	const [paymentSuccess, _setPaymentSuccess] = useState(false);

	useEffect(() => {
		const found = coursesData.find((c) => String(c.id) === String(courseId));
		_setCourse(found);
	}, [courseId]);

	const isLoading = false;
	const form = useForm<CheckoutFormData>({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: user?.email || "",
			address: "",
			city: "",
			state: "",
			zip: "",
			cardNumber: "",
			expiry: "",
			cvv: "",
		},
	});

	const onSubmit = async () => {};

	if (!course) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Course not found</p>
			</div>
		);
	}

	if (paymentSuccess) {
		return (
			<div className="min-h-screen bg-gray-50 pt-8">
				<div className="container mx-auto px-4">
					<Card className="max-w-2xl mx-auto">
						<CardContent className="flex flex-col items-center justify-center py-16">
							<div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
								<CheckCircle2 className="h-12 w-12 text-green-600" />
							</div>
							<h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
								Payment Successful!
							</h2>
							<p className="text-muted-foreground text-center mb-6 max-w-md">
								You have successfully enrolled in {course.title}. Redirecting to
								your course...
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-8">
			<div className="container mx-auto px-4">
				{/* Back Button */}
				<div className="mb-6">
					<Button
						variant="ghost"
						size="sm"
						className="gap-2"
						onClick={() => router.navigate({ to: `/course/${courseId}` })}
						// disabled={isLoading}
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Course
					</Button>
				</div>

				<div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
					{/* Checkout Form */}
					<div className="lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle className="text-xl md:text-2xl">
									Secure Checkout
								</CardTitle>
								<CardDescription>
									Complete your enrollment by providing payment details
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-6"
									>
										{/* Billing Information */}
										<div>
											<h3 className="text-lg font-semibold mb-4">
												Billing Information
											</h3>
											<div className="space-y-4">
												<div className="grid md:grid-cols-2 gap-4">
													<FormField
														control={form.control}
														name="firstName"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	First Name{" "}
																	<span className="text-red-500">*</span>
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="John"
																		{...field}
																		// disabled={isLoading}
																	/>
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
																<FormLabel>
																	Last Name{" "}
																	<span className="text-red-500">*</span>
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Doe"
																		{...field}
																		// disabled={isLoading}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<FormField
													control={form.control}
													name="email"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Email <span className="text-red-500">*</span>
															</FormLabel>
															<FormControl>
																<Input
																	type="email"
																	placeholder="john@example.com"
																	{...field}
																	// disabled={isLoading}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="address"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Address <span className="text-red-500">*</span>
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="123 Main St"
																	{...field}
																	// disabled={isLoading}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<div className="grid md:grid-cols-3 gap-4">
													<FormField
														control={form.control}
														name="city"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	City <span className="text-red-500">*</span>
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="San Francisco"
																		{...field}
																		// disabled={isLoading}
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
																<FormLabel>
																	State <span className="text-red-500">*</span>
																</FormLabel>
																<Select
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																	// disabled={isLoading}
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select state" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		<SelectItem value="CA">
																			California
																		</SelectItem>
																		<SelectItem value="NY">New York</SelectItem>
																		<SelectItem value="TX">Texas</SelectItem>
																		<SelectItem value="FL">Florida</SelectItem>
																		<SelectItem value="IL">Illinois</SelectItem>
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name="zip"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	ZIP Code{" "}
																	<span className="text-red-500">*</span>
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="94102"
																		{...field}
																		// disabled={isLoading}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>
										</div>

										{/* Payment Information */}
										<div>
											<h3 className="text-lg font-semibold mb-4">
												Payment Information
											</h3>
											<div className="space-y-4">
												<FormField
													control={form.control}
													name="cardNumber"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Card Number{" "}
																<span className="text-red-500">*</span>
															</FormLabel>
															<FormControl>
																<div className="relative">
																	<Input
																		placeholder="4242 4242 4242 4242"
																		{...field}
																		// disabled={isLoading}
																	/>
																	<CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<div className="grid grid-cols-2 gap-4">
													<FormField
														control={form.control}
														name="expiry"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Expiry Date{" "}
																	<span className="text-red-500">*</span>
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="MM/YY"
																		{...field}
																		// disabled={isLoading}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name="cvv"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	CVV <span className="text-red-500">*</span>
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="123"
																		maxLength={4}
																		{...field}
																		// disabled={isLoading}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>
										</div>

										{/* Security Notice */}
										<div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg text-sm">
											<Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
											<p className="text-blue-900">
												Your payment information is secure and encrypted. We
												never store your card details.
											</p>
										</div>

										{/* Submit Button */}
										<Button
											type="submit"
											size="lg"
											className="w-full"
											// disabled={isLoading}
										>
											{isLoading
												? "Processing..."
												: `Pay $${course.price || 299} and Enroll`}
										</Button>

										<p className="text-xs text-center text-muted-foreground">
											By completing this purchase, you agree to our Terms of
											Service and Privacy Policy
										</p>
									</form>
								</Form>
							</CardContent>
						</Card>
					</div>

					{/* Order Summary */}
					<div>
						<Card className="lg:sticky lg:top-24">
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Course Image */}
								<div
									className="aspect-video rounded-lg"
									style={{ background: course.image }}
								/>

								{/* Course Info */}
								<div>
									<h3 className="font-semibold mb-2 line-clamp-2">
										{course.title}
									</h3>
									<p className="text-sm text-muted-foreground line-clamp-2">
										{course.description}
									</p>
								</div>

								{/* Price Breakdown */}
								<div className="border-t pt-4 space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Course Price</span>
										<span className="font-medium">${course.price || 299}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Platform Fee</span>
										<span className="font-medium">$0.00</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Tax</span>
										<span className="font-medium">$0.00</span>
									</div>
									<div className="border-t pt-3 flex justify-between">
										<span className="font-semibold">Total</span>
										<span className="font-bold text-xl">
											${course.price || 299}
										</span>
									</div>
								</div>

								{/* Features */}
								<div className="border-t pt-4 space-y-2 text-sm">
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
										<span>30-day money-back guarantee</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
										<span>Lifetime access to course</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
										<span>Certificate of completion</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
										<span>Access to discussion forums</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
