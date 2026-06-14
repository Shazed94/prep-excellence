import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useOtpVerificationMutation } from "@/hooks/auth";
import axiosInstance from "@/lib/axios";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";
import { FEATURES } from "./login";

export const Route = createFileRoute("/otp-verification")({
	component: OTPVerificationPage,
});

export default function OTPVerificationPage() {
	const navigate = useNavigate();
	const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
	const [serverError, setServerError] = useState("");
	const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const isTimeExpired = timeLeft === 0;
	const canResend = isTimeExpired;

	const otpVerification = useOtpVerificationMutation();

	// Timer countdown effect
	useEffect(() => {
		if (timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	// Format time as MM:SS
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	// Handle OTP input change
	const handleOtpChange = (index: number, value: string) => {
		// Only allow digits
		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value.slice(-1); // Only keep last digit
		setOtp(newOtp);

		// Auto-focus to next input
		if (value && index < 5) {
			otpInputRefs.current[index + 1]?.focus();
		}
	};

	// Handle backspace
	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			otpInputRefs.current[index - 1]?.focus();
		}
	};

	// Handle paste
	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);

		if (!/^\d+$/.test(pastedData)) return;

		const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
		setOtp(newOtp as string[]);

		// Focus last filled input or next empty one
		const lastFilledIndex = newOtp.findIndex((val) => !val);
		const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
		otpInputRefs.current[focusIndex]?.focus();
	};

	// Handle submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const otpCode = otp.join("");

		if (otpCode.length !== 6) {
			setServerError("Please enter all 6 digits");
			return;
		}
		setServerError("");

		try {
			// Get email from URL search params
			const urlParams = new URLSearchParams(window.location.search);
			const email = urlParams.get("email");

			if (!email) {
				throw new Error("Email not found in request");
			}

			// Replace with your actual OTP verification API call
			otpVerification.mutate(
				{ email, otp: otpCode },
				{
					onError: (error) => {
						toast.error(error.message || "Invalid OTP. Please try again.");
					},
					onSuccess: (response) => {
						if (!response.success) {
							toast.error(response.message || "Invalid OTP");
							return;
						}
						toast.success(response.message || "OTP verified successfully");
						// Navigate to set new password page
						navigate({ to: "/set-new-password", search: { email } });
					},
				},
			);
		} catch (error: unknown) {
			toast.error(
				(error as Error).message ||
					"OTP verification failed. Please try again.",
			);
		}
	};

	// Handle resend OTP
	const handleResendOtp = async () => {
		// Get email from URL search params
		const urlParams = new URLSearchParams(window.location.search);
		const email = urlParams.get("email");
		try {
			setServerError("");

			const res = await axiosInstance.post(
				`${BACKEND_URL_V1}/auth/resend-otp`,
				{ email },
			);
			if (!res.data.success) {
				throw new Error(res.data.message || "Failed to resend OTP");
			}

			// Reset timer
			setTimeLeft(120);
			toast.success(res.data.message || "OTP resent successfully");
			setOtp(["", "", "", "", "", ""]);
			otpInputRefs.current[0]?.focus();
		} catch (error) {
			setServerError("Failed to resend OTP. Please try again.");
			console.error("Resend OTP failed:", error);
		}
	};

	return (
		<div className="h-screen bg-white flex overflow-hidden">
			{/* Left Column - Form */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="flex flex-1 px-6 sm:px-10 md:px-12 py-8 sm:py-12 flex-col justify-between mx-auto lg:mx-0"
			>
				<div className="max-w-2xl mx-auto h-full flex flex-col justify-between">
					<div>
						{/* Logo & Back */}
						<div className="mb-14">
							<div className="flex items-center gap-2 mb-8">
								<img
									src="/logo.png"
									alt="PrepExcellence Logo"
									className="w-full max-w-40 h-auto"
								/>
							</div>

							<Button
								type="button"
								variant="outline"
								onClick={() => navigate({ to: "/login" })}
								className="flex items-center gap-2 border-[#EBEBEB] text-[#141B34] hover:text-gray-900 text-[14px] leading-[20px] -tracking-[0.64px] w-32 py-6 font-medium transition-colors"
							>
								<ArrowLeft className="w-4 h-4" />
								Go Back
							</Button>
						</div>

						{/* Heading */}
						<div className="mb-8">
							<h1 className="text-4xl font-bold text-gray-900 mb-3">
								Enter OTP
							</h1>
							<p className="text-[#6C7179] text-sm mb-8">
								We have sent a verification code to your email address.
							</p>

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
							<form onSubmit={handleSubmit}>
								{/* OTP Input Fields */}
								<div className="mb-6">
									<label
										htmlFor="otp"
										className="block text-sm font-medium text-gray-900 mb-4"
									>
										Enter OTP
									</label>
									<div className="flex gap-1 md:gap-1.5 justify-between mb-6">
										{otp.map((digit, index) => (
											<motion.input
												key={index}
												ref={(el) => {
													otpInputRefs.current[index] = el;
												}}
												type="text"
												inputMode="numeric"
												maxLength={1}
												value={digit}
												onChange={(e) => handleOtpChange(index, e.target.value)}
												onKeyDown={(e) => handleKeyDown(index, e)}
												onPaste={handlePaste}
												disabled={otpVerification.isPending}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: index * 0.05 }}
												className="w-[52px] h-[52px] sm:w-24 sm:h-[85px] border-2 border-[#EBEBEB] rounded-[6px] text-center text-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 bg-[#F8F8F9] hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
												placeholder="0"
											/>
										))}
									</div>
								</div>

								{/* Timer and Resend */}
								<div className="flex items-center justify-between mb-6 text-sm">
									<span className="text-gray-600 font-medium">
										{formatTime(timeLeft)}
									</span>
									<button
										type="button"
										onClick={handleResendOtp}
										disabled={!canResend || otpVerification.isPending}
										className={`font-semibold transition-colors ${
											canResend && !otpVerification.isPending
												? "text-blue-600 hover:text-blue-700 cursor-pointer"
												: "text-gray-400 cursor-not-allowed"
										}`}
									>
										Resend OTP
									</button>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={
										otpVerification.isPending || otp.some((digit) => !digit)
									}
									className="w-full gradient active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
								>
									{otpVerification.isPending
										? "Verifying..."
										: "Reset Password"}
								</button>
							</form>
						</div>
					</div>

					{/* Footer */}
					<div className="text-[#7B7B7B] text-sm mt-8 pt-8 border-t border-[#EBEBEB] text-center leading-relaxed">
						<p className="">
							© Prepexcellence.com 2021-{new Date().getFullYear()}. All Rights
							Reserved
						</p>
						<p className="">
							SAT® is a registered trademark of the College Board. The College
							Board does not endorse or is not affiliated in any way with the
							owner or any content of this web site.
						</p>
					</div>
				</div>
			</motion.div>

			{/* Right Column - Background with Features */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
				className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
				style={{
					backgroundImage: `url('leader1.png')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
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
								<img src={feature.icon} alt="" />
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
