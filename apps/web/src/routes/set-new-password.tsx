import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FEATURES } from "./login";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/hooks/auth";

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/\d/, "Password must contain at least 1 number")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least 1 symbol",
  );

const ZSetNewPassword = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type TSetNewPassword = z.infer<typeof ZSetNewPassword>;

export const Route = createFileRoute("/set-new-password")({
  component: SetNewPasswordPage,
});

export default function SetNewPasswordPage() {
  const passwordId = useId();
  const confirmPasswordId = useId();

  const resetPassword = useResetPasswordMutation();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<TSetNewPassword>({
    resolver: zodResolver(ZSetNewPassword),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const newPassword = form.watch("newPassword");

  // Password strength validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

  const onSubmit = async (data: TSetNewPassword) => {
    setServerError("");

    try {
      // Get email from URL search params
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get("email");

      if (!email) {
        throw new Error("Email not found in request");
      }

      // Replace with your actual API call
      resetPassword.mutate(
        {
          email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          onError: (error) => {
            toast.error(
              error.message || "Failed to set password. Please try again.",
            );
          },
          onSuccess: (response) => {
            if (!response.success) {
              toast.error(response.message || "Failed to set password");
              return;
            }
            toast.success(response.message || "Password reset successfully");
            // Navigate to login page
            navigate({ to: "/login" });
          },
        },
      );
    } catch (error) {
      setServerError(
        (error as Error).message || "Failed to set password. Please try again.",
      );
      console.error("Set password failed:", error);
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
                Set New Password
              </h1>
              <p className="text-[#6C7179] text-sm mb-8">
                Enter new password for your account.
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* New Password Field */}
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={passwordId}
                          className="text-sm font-medium text-gray-900"
                        >
                          New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id={passwordId}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your new password"
                              className="h-12 rounded-lg mb-2 border border-gray-200 bg-gray-50 placeholder:text-gray-400 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-0 transition-colors pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>

                        {/* Password Strength Indicator */}
                        {newPassword && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2 mb-4 mt-2"
                          >
                            {/* Strength bars */}
                            <div className="flex gap-2 h-1">
                              <motion.div
                                animate={{
                                  backgroundColor: hasMinLength
                                    ? "#2563eb"
                                    : "#e5e7eb",
                                }}
                                className="flex-1 rounded-full transition-colors"
                              />
                              <motion.div
                                animate={{
                                  backgroundColor: hasNumber
                                    ? "#2563eb"
                                    : "#e5e7eb",
                                }}
                                className="flex-1 rounded-full transition-colors"
                              />
                              <motion.div
                                animate={{
                                  backgroundColor: hasSymbol
                                    ? "#2563eb"
                                    : "#e5e7eb",
                                }}
                                className="flex-1 rounded-full transition-colors"
                              />
                            </div>

                            {/* Requirements text */}
                            <p className="text-xs text-gray-600 font-medium">
                              At least 1 number, 8 characters, 1 symbol
                            </p>
                          </motion.div>
                        )}

                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={confirmPasswordId}
                          className="text-sm font-medium text-gray-900"
                        >
                          Confirm New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id={confirmPasswordId}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your new password"
                              className="h-12 rounded-lg mb-2 border border-gray-200 bg-gray-50 placeholder:text-gray-400 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-0 transition-colors pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      resetPassword.isPending || !form.formState.isValid
                    }
                    className="w-full gradient active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-8"
                  >
                    {resetPassword.isPending ? "Saving..." : "Save Password"}
                  </button>
                </form>
              </Form>

              {/* Login Link */}
              <p className="text-sm text-gray-600 mt-6 text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/login" })}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Log In
                </button>
              </p>
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
