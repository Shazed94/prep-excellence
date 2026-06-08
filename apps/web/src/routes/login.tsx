import { zodResolver } from "@hookform/resolvers/zod";
import { type TLogin, ZLogin } from "@prepexcellence/shared-validators";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/auth";
import { useAuth } from "@/store/useAuth";

interface FeatureCard {
	id: string;
	icon: React.ReactNode;
	title: string;
	description: string;
}

const FEATURES: FeatureCard[] = [
	{
		id: "structured",
		icon: "⚡",
		title: "Structured system",
		description: "Clear weekly goals keep students on track from day one.",
	},
	{
		id: "group",
		icon: "👥",
		title: "Group instruction",
		description:
			"Focused attention in every session so no student is left behind.",
	},
	{
		id: "experts",
		icon: "🏆",
		title: "Expert Instructors",
		description:
			"We have expert instructors dedicated to every student's success.",
	},
];

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

export default function LoginPage() {
	const emailId = useId();
	const passwordId = useId();

	const { setAuth } = useAuth();
	const navigate = useNavigate();
	const loginMutation = useLoginMutation();
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const form = useForm<TLogin>({
		resolver: zodResolver(ZLogin),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: TLogin) => {
		setIsLoading(true);
		setServerError("");

		try {
			await loginMutation.mutate(data, {
				onSuccess: (response) => {
					const { accessToken, refreshToken, user } = response.data;
					if (!accessToken || !refreshToken || !user) {
						setServerError("Invalid response from server");
						return;
					}

					setAuth(user, accessToken, refreshToken);

					// Redirect based on user role
					if (user.role === "SuperAdmin") {
						navigate({ to: "/dashboard" });
					} else {
						navigate({ to: "/" });
					}
				},
				onError: (error) => {
					setServerError("Invalid email or password");
					console.error("Login failed:", error);
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex w-full">
			{/* Left Column - Form */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="flex flex-1 px-6 sm:px-10 md:px-12 py-8 sm:py-12 flex-col justify-center mx-auto lg:mx-0"
			>
				<div className="max-w-2xl mx-auto ">
					{/* Logo & Back */}
					<div className="mb-12">
						<div className="flex items-center gap-2 mb-6">
							<img
								src="/logo.png"
								alt="PrepExcellence Logo"
								className="w-full max-w-40 h-auto"
							/>
						</div>

						<button
							type="button"
							onClick={() => navigate({ to: "/" })}
							className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							Go Back
						</button>
					</div>

					{/* Heading */}
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-3">
							Welcome back
						</h1>
						<p className="text-gray-600 text-sm leading-relaxed">
							Log in with your email and password
						</p>
					</div>

					{/* Error Message */}
					{serverError && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium"
						>
							{serverError}
						</motion.div>
					)}

					{/* Form */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
							{/* Email Field */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor={emailId}
											className="text-gray-900 font-medium"
										>
											Email
										</FormLabel>
										<FormControl>
											<Input
												id={emailId}
												type="email"
												placeholder="Ex: nayerjumon@gmail.com"
												className="h-12 rounded-lg border border-gray-200 bg-gray-50 placeholder:text-gray-400 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-0 transition-colors"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password Field */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor={passwordId}
											className="text-gray-900 font-medium"
										>
											Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													id={passwordId}
													type={showPassword ? "text" : "password"}
													placeholder="Enter Your Password"
													className="h-12 rounded-lg border border-gray-200 bg-gray-50 placeholder:text-gray-400 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-0 transition-colors pr-10"
													{...field}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
												>
													{showPassword ? (
														<EyeOff size={20} />
													) : (
														<Eye size={20} />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Remember & Forgot */}
							<div className="flex items-center justify-between text-sm">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
										className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
									/>
									<span className="text-gray-700">Remember me</span>
								</label>
								<a
									href="/"
									className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
								>
									Forgot Password?
								</a>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
							>
								{isLoading ? "Logging in..." : "Log In"}
							</button>

							{/* Sign Up Link */}
							<p className="text-center text-gray-700 text-sm">
								Don't have an account?{" "}
								<a
									href="/"
									className="text-blue-600 font-semibold hover:underline"
								>
									Create Account
								</a>
							</p>

							{/* Divider */}
							<div className="flex items-center gap-3 my-6">
								<div className="flex-1 h-px bg-gray-200" />
								<span className="text-gray-500 text-xs font-medium">
									Or continue with
								</span>
								<div className="flex-1 h-px bg-gray-200" />
							</div>

							{/* Social Login */}
							<div className="space-y-3">
								<button
									type="button"
									className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-medium transition-colors"
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										{" "}
										<title>asd</title>
										<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
										<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
										<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
										<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
									</svg>
									Google
								</button>

								<button
									type="button"
									className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-medium transition-colors"
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<title> df</title>
										<path d="M17.05 13.5c-.91 0-1.74.46-2.24 1.14.5.5 1.01 1.02 1.49 1.53.28-.09.58-.14.89-.14 1.66 0 3 1.34 3 3 0 .23-.03.45-.07.67H22c.55 0 1-.45 1-1 0-2.76-2.24-5-5-5zm-5.05-3c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-3.5c0-2.33-4.67-3.5-7-3.5z" />
									</svg>
									Apple
								</button>
							</div>
						</form>
					</Form>

					{/* Footer */}
					<p className="text-xs text-gray-500 mt-8 pt-8 border-t border-gray-200 text-center leading-relaxed">
						By joining you agree to the{" "}
						<a href="/" className="text-gray-700 underline hover:text-gray-900">
							Terms of Service
						</a>{" "}
						and to occasionally receive emails from us. Please read{" "}
						<a href="/" className="text-gray-700 underline hover:text-gray-900">
							Privacy Policy
						</a>{" "}
						to learn how we use your personal data.
					</p>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
				className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
				style={{
					backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=900&fit=crop&q=80')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-black/30" />

				{/* Feature Cards - Positioned at Bottom */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="relative z-10 grid grid-cols-3 gap-4 w-full max-w-2xl mt-auto"
				>
					{FEATURES.map((feature, idx) => (
						<motion.div
							key={feature.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
							className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm"
						>
							<div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl mb-3">
								{feature.icon}
							</div>
							<h3 className="font-bold text-gray-900 text-sm mb-2">
								{feature.title}
							</h3>
							<p className="text-xs text-gray-600 leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>

				{/* Bottom Padding */}
				<div className="h-8" />
			</motion.div>
		</div>
	);
}
