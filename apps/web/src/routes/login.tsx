import { zodResolver } from "@hookform/resolvers/zod";
import { type TLogin, ZLogin } from "@prepexcellence/shared-validators";
import { useGoogleLogin } from "@react-oauth/google";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { useGoogleLoginMutation, useLoginMutation } from "@/hooks/auth";
import { useAuth } from "@/store/useAuth";

export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const FEATURES: FeatureCard[] = [
  {
    id: "structured",
    icon: "/icons/asterisk.png",
    title: "Structured system",
    description: "Clear weekly goals keep students on track from day one.",
  },
  {
    id: "group",
    icon: "/icons/users-icon.png",
    title: "Group instruction",
    description:
      "Focused attention in every session so no student is left behind.",
  },
  {
    id: "experts",
    icon: "/icons/expert-icon.png",
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

  const setAuth = useAuth((state) => state.setAuth);
  const navigate = useNavigate();

  const loginMutation = useLoginMutation();
  const googleAuthMutation = useGoogleLoginMutation();

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

  // ✅ Handle email/password login
  const onSubmit = async (data: TLogin) => {
    setIsLoading(true);
    setServerError("");

    try {
      await loginMutation.mutateAsync(data, {
        onSuccess: (response) => {
          const { accessToken, refreshToken, user } = response.data;
          if (!accessToken || !refreshToken || !user) {
            setServerError("Invalid response from server");
            return;
          }

          setAuth(user, accessToken, refreshToken);
          toast.success(response.message);

          if (user.role === "SuperAdmin") {
            navigate({ to: "/dashboard" });
          } else if (user.role === "Teacher") {
            navigate({ to: "/teacher-dashboard" });
          } else if (user.role === "Student") {
            navigate({ to: "/student-dashboard" });
          } else if (user.role === "Parent") {
            navigate({ to: "/parent-dashboard" });
          } else {
            // Default fallback
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
        toast.success(response.message);
        if (user.role === "SuperAdmin") {
          navigate({ to: "/dashboard" });
        } else if (user.role === "Teacher") {
          navigate({ to: "/teacher-dashboard" });
        } else if (user.role === "Student") {
          navigate({ to: "/student-dashboard" });
        } else {
          // Default fallback
          navigate({ to: "/" });
        }
      } catch (error) {
        setServerError("Google login failed. Please try again.");
        console.error("Google login error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setServerError("Google login popup closed or failed");
    },
  });

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-1 px-6 sm:px-10 md:px-12 py-4 sm:py-12 flex-col justify-center items-center mx-auto lg:mx-0"
      >
        <div className="max-w-2xl mx-auto">
          {/* Logo & Back */}
          <div className="mb-6 lg:mb-12 mt-5 lg:mt-10">
            <div className="flex items-center gap-2 mb-4 lg:mb-8">
              <img
                src="/logo.png"
                alt="PrepExcellence Logo"
                className="w-full max-w-40 h-auto"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-2 border-[#EBEBEB] text-[#141B34] hover:text-gray-900 text-[14px] leading-[20px] -tracking-[0.64px] w-32 py-6 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome Back!
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
                <Link
                  to="/password-reset"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1 md:mt-6"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-gray-700 p mb-0! lg:mb-6!">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create Account
                </a>
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 my-2">
                {/* <div className="flex-1 h-px bg-gray-200" /> */}
                <span className="text-gray-500 p mb-0! lg:mb-6! font-medium text-center">
                  Or continue with
                </span>
                {/* <div className="flex-1 h-px bg-gray-200" /> */}
              </div>
            </form>
          </Form>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <img src="/icons/google-icon.png" alt="" />
              Google
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-medium transition-colors"
            >
              <img src="/icons/apple-icon.png" alt="" className="" />
              Apple
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-[#6C7179] py-4 lg:py-8 text-center leading-relaxed">
            By joining you agree to the{" "}
            <a
              href="/"
              className="text-[#141B34] underline hover:text-gray-900"
            >
              Terms of Service
            </a>{" "}
            and to occasionally receive emails from us. Please read{" "}
            <a
              href="/"
              className="text-[#141B34] underline hover:text-gray-900"
            >
              Privacy Policy
            </a>{" "}
            to learn how we use your personal data.
          </p>
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
