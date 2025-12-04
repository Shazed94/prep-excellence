import { BACKEND_URL } from "@/lib/GlobalVariable";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";
import { type TLogin, ZLogin } from "@prepexcellence/shared-validators";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPopup() {
	const emailId = useId();
	const passwordId = useId();
	const { closeLoginPopup } = useLoginPopupStore();
	const { setAuth } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: TLogin) => {
		setIsLoading(true);
		setError("");

		try {
			// Validate with Zod
			const validatedData = ZLogin.parse(data);

			const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: validatedData.email,
					password: validatedData.password,
				}),
			});

			const responseData = await res.json();

			if (!res.ok) {
				setError(responseData.message || "Login failed");
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
				closeLoginPopup();
				navigate({ to: "/admin" });
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
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative">
				{/* Close button */}
				<button
					type="button"
					onClick={closeLoginPopup}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light w-8 h-8 flex items-center justify-center"
				>
					×
				</button>

				{/* Content */}
				<div className="p-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						Log In to Your Account
					</h2>
					<p className="text-gray-600 text-sm mb-6">
						Step back into your learning space — where your goals, progress, and
						personalized resources come together.
					</p>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
							{error}
						</div>
					)}

					<div>
						{/* Student Email */}
						<div className="mb-5">
							<label
								htmlFor={emailId}
								className="block text-gray-800 text-sm font-medium mb-2"
							>
								Student Email
								<span className="text-red-500">*</span>
							</label>
							<input
								id={emailId}
								type="email"
								placeholder="Enter email"
								{...register("email")}
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.email ? "border-red-300" : "border-gray-200"
									}`}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div className="mb-6">
							<label
								htmlFor={passwordId}
								className="block text-gray-800 text-sm font-medium mb-2"
							>
								Password<span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<input
									id={passwordId}
									type={showPassword ? "text" : "password"}
									placeholder="Enter password"
									{...register("password")}
									className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.password ? "border-red-300" : "border-gray-200"
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

						{/* Log In Button */}
						<button
							type="button"
							onClick={handleSubmit(onSubmit)}
							disabled={isLoading}
							className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Logging in..." : "Log In"}
						</button>

						{/* Sign Up Link */}
						<p className="text-center text-sm text-gray-600">
							Don't have account?{" "}
							<button type="button" className="text-blue-600 hover:underline">
								Sign Up
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
			</div>
		</div>
	);
}
