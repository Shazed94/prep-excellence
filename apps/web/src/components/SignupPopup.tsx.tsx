import { zodResolver } from "@hookform/resolvers/zod";
import { type TRegister, ZRegister } from "@prepexcellence/shared-validators";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, X } from "lucide-react";
import { motion } from "motion/react"; // Add this import
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";
import { Input } from "./ui/input";

export default function SignupPopup() {
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const { closeSignupPopup, openLoginPopup } = useLoginPopupStore();
	const { setAuth } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TRegister>({
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
		setError("");

		try {
			// Validate with Zod
			const validatedData = ZRegister.parse(data);

			const res = await fetch(`${BACKEND_URL_V1}/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: validatedData.name,
					email: validatedData.email,
					password: validatedData.password,
					role: validatedData.role,
				}),
			});

			const responseData = await res.json();

			if (!res.ok) {
				setError(responseData.message || "Registration failed");
				return;
			}

			// Store tokens and user using Zustand store
			if (
				responseData.data?.accessToken &&
				responseData.data?.refreshToken &&
				responseData.data?.user
			) {
				setAuth(
					responseData.data.user,
					responseData.data.accessToken,
					responseData.data.refreshToken,
				);

				// Success - close popup and redirect to admin
				closeSignupPopup();
				toast.success(responseData?.message);
				navigate({ to: "/dashboard" });
			} else {
				setError("Invalid response from server");
			}
		} catch (_err) {
			//   setError(err?.message! || "An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

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
				{/* Close button */}
				<button
					type="button"
					onClick={closeSignupPopup}
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-light w-8 h-8 flex items-center justify-center cursor-pointer"
				>
					<X />
				</button>

				{/* Content */}
				<div className="p-8">
					<h2 className="text-[12px] md:text-[20px] font-bold text-primary-dark mb-2">
						Sign Up to PrepExcellence
					</h2>
					<p className="text-[#000000]/80 font-light text-sm mb-6">
						Join PrepExcellence and take the first step toward smarter prep and
						better results.
					</p>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
							{error}
						</div>
					)}

					<div className="mt-12">
						{/* Student Name */}
						<div className="mb-7">
							<label
								htmlFor={nameId}
								className="block text-[10px] md:text-[16px] font-medium mb-2"
							>
								Full Name <span className="text-red-500">*</span>
							</label>
							<Input
								id={nameId}
								type="text"
								placeholder="Enter your full name"
								{...register("name")}
								className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
									errors.name ? "border-red-300" : "border-gray-200"
								}`}
							/>

							{errors.name && (
								<p className="mt-1 text-sm text-red-600">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Student Email */}
						<div className="mb-7">
							<label
								htmlFor={emailId}
								className="block  text-[10px] md:text-[16px] font-medium mb-2"
							>
								Student Email <span className="text-red-500">*</span>
							</label>
							<Input
								id={emailId}
								type="email"
								placeholder="Enter email"
								{...register("email")}
								className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
									errors.email ? "border-red-300" : "border-gray-200"
								}`}
							/>

							{errors.email && (
								<p className="mt-1 text-sm text-red-600">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div className="mb-7">
							<label
								htmlFor={passwordId}
								className="block text-gray-800 text-sm font-medium mb-2"
							>
								Password<span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<Input
									id={passwordId}
									type={showPassword ? "text" : "password"}
									placeholder="Enter password"
									{...register("password")}
									className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
										errors.password ? "border-red-300" : "border-gray-200"
									}`}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">
									{errors.password.message}
								</p>
							)}
						</div>

						{/* Sign Up Button */}
						<button
							type="button"
							onClick={handleSubmit(onSubmit)}
							disabled={isLoading}
							className="w-full bg-primary-dark text-white py-3 rounded-full font-medium transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Signing up..." : "Sign Up"}
						</button>

						{/* Sign Up Link */}
						<p className="text-[13px] text-muted">
							Already have an account?{" "}
							<button
								onClick={() => {
									closeSignupPopup();
									openLoginPopup();
								}}
								type="button"
								className="text-primary-dark underline"
							>
								Login
							</button>
						</p>
					</div>
				</div>

				{/* Help Icon */}
				<div className="absolute bottom-4 right-4">
					<button
						type="button"
						className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm"
					>
						?
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
}
