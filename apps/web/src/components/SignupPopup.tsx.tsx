import { zodResolver } from "@hookform/resolvers/zod";
import { type TRegister, ZRegister } from "@prepexcellence/shared-validators";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, X } from "lucide-react";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignupMutation } from "@/hooks/auth";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";

export default function SignupPopup() {
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();

	const { closeSignupPopup, openLoginPopup } = useLoginPopupStore();
	const { setAuth } = useAuth();
	const navigate = useNavigate();
	const signUpMutation = useSignupMutation();
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<TRegister>({
		resolver: zodResolver(ZRegister),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "Student",
		},
	});

	const onSubmit = async (data: TRegister) => {
		setIsLoading(true);
		setServerError("");

		try {
			signUpMutation.mutate(data, {
				onSuccess: (response) => {
					const { accessToken, refreshToken, user } = response.data ?? {};

					if (!accessToken || !refreshToken || !user) {
						setServerError("Invalid response from server");
						return;
					}

					setAuth(user, accessToken, refreshToken);
					toast.success(response.message);
					closeSignupPopup();
					if (user.role === "Super Admin") {
						navigate({ to: "/dashboard" });
					}
				},
				onError: (error) => {
					toast.error("Registration failed", {
						description: error.message,
					});
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ duration: 0.3 }}
				className="bg-white rounded-2xl shadow-xl max-w-[530px] w-full relative"
			>
				{/* Close */}
				<button
					type="button"
					onClick={closeSignupPopup}
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
				>
					<X />
				</button>

				<div className="p-8">
					<h2 className="text-[12px] md:text-[20px] font-bold mb-2">
						Sign Up to PrepExcellence
					</h2>

					<p className="text-sm text-muted-foreground mb-6">
						Join PrepExcellence and take the first step toward smarter prep.
					</p>

					{serverError && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
							{serverError}
						</div>
					)}

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-7 mt-10"
						>
							{/* Name */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor={nameId}>
											Full Name <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												id={nameId}
												placeholder="Enter your full name"
												className="rounded-full h-12 shadow-[0_0px_15px_rgba(0,0,0,0.1)]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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

							{/* Submit */}
							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-primary-dark text-white py-3 rounded-full font-medium disabled:opacity-50"
							>
								{isLoading ? "Signing up..." : "Sign Up"}
							</button>

							{/* Login */}
							<p className="text-sm text-muted">
								Already have an account?{" "}
								<button
									type="button"
									onClick={() => {
										closeSignupPopup();
										openLoginPopup();
									}}
									className="text-primary-dark underline"
								>
									Login
								</button>
							</p>
						</form>
					</Form>
				</div>
			</motion.div>
		</motion.div>
	);
}
