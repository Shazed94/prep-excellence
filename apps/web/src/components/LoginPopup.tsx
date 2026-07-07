import { zodResolver } from "@hookform/resolvers/zod";
import { type TLogin, ZLogin } from "@prepexcellence/shared-validators";
import { useGoogleLogin } from "@react-oauth/google";
import { isAxiosError } from "axios";
import { Eye, EyeOff, X } from "lucide-react";
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
import { useGoogleLoginMutation, useLoginMutation } from "@/hooks/auth";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";
import { Link } from "@tanstack/react-router";

export default function LoginPopup() {
	const emailId = useId();
	const passwordId = useId();

	const { closeLoginPopup, openSignupPopup } = useLoginPopupStore();
	const { setAuth } = useAuth();
	// const navigate = useNavigate();
	const loginMutation = useLoginMutation();
	const googleAuthMutation = useGoogleLoginMutation();
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const form = useForm<TLogin>({
		// TODO: Remove `as any` after fixing Zod/@hookform/resolvers version mismatch.
		resolver: zodResolver(ZLogin as any),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// ✅ Handle email/password login
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
					closeLoginPopup();
				},
				onError: (error) => {
					if (isAxiosError(error) && error.response?.data?.message) {
						setServerError(error.response.data.message);
					} else {
						setServerError("Login failed. Please try again.");
					}
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	// ✅ Handle Google login
	const googleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			setIsLoading(true);
			setServerError("");

			try {
				const response = await googleAuthMutation.mutateAsync(
					tokenResponse.access_token,
				);

				const { accessToken, refreshToken, user } = response.data;
				if (!accessToken || !refreshToken || !user) {
					setServerError("Invalid response from server");
					return;
				}

				setAuth(user, accessToken, refreshToken);
				closeLoginPopup();
			} catch (error) {
				if (isAxiosError(error) && error.response?.data?.message) {
					setServerError(error.response.data.message);
				} else {
					setServerError("Google login failed. Please try again.");
				}
			} finally {
				setIsLoading(false);
			}
		},
		onError: () => {
			setServerError("Google login popup closed or failed");
		},
	});

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="bg-white rounded-2xl shadow-xl max-w-[530px] w-full relative"
			>
				{/* Close */}
				<button
					type="button"
					onClick={closeLoginPopup}
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 cursor-pointer"
				>
					<X />
				</button>

				<div className="p-8">
					<h2 className="text-[12px] md:text-[20px] font-bold mb-2">
						Log In to Your Account
					</h2>

					<p className="text-sm text-muted-foreground mb-1">
						Step back into your learning space — where your goals and progress
						come together.
					</p>

					{serverError && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
							{serverError}
						</div>
					)}

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4 mt-2"
						>
							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor={emailId}>
											Student Email <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												id={emailId}
												type="email"
												placeholder="Enter email"
												className="rounded-full h-12 shadow-[0_0px_15px_rgba(0,0,0,0.1)]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor={passwordId}>
											Password <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													id={passwordId}
													type={showPassword ? "text" : "password"}
													placeholder="Enter password"
													className="rounded-full h-12 shadow-[0_0px_15px_rgba(0,0,0,0.1)]"
													{...field}
												/>
												<button
													type="button"
													onClick={() => setShowPassword((v) => !v)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
								<Link to="/password-reset">
									<span className="text-gray-700 hover:text-gray-900 font-medium transition-colors cursor-pointer">
										Forgot Password?
									</span>
								</Link>
							</div>

							{/* Submit */}
							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-primary-dark text-white py-3 rounded-full font-medium disabled:opacity-50 cursor-pointer hover:brightness-125 transition-all duration-300"
							>
								{isLoading ? "Logging in..." : "Log In"}
							</button>

							{/* Signup */}
							<p className="text-sm text-muted">
								Don't have an account?{" "}
								<button
									type="button"
									onClick={() => {
										closeLoginPopup();
										openSignupPopup();
									}}
									className="text-primary-dark underline"
								>
									Sign Up
								</button>
							</p>

							{/* Divider */}
							<div className="flex items-center justify-center gap-3 my-2">
								<span className="text-gray-500 text-sm font-medium text-center">
									Or continue with
								</span>
							</div>
						</form>
					</Form>

					{/* Social Login */}
					<div className="space-y-2 mt-4">
						<button
							type="button"
							disabled={isLoading}
							onClick={() => googleLogin()}
							className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
						>
							<img src="/icons/google-icon.png" alt="Google" />
							Google
						</button>

						<button
							type="button"
							className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-medium transition-colors"
						>
							<img src="/icons/apple-icon.png" alt="Apple" />
							Apple
						</button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
