import { zodResolver } from "@hookform/resolvers/zod";
import { type TLogin, ZLogin } from "@prepexcellence/shared-validators";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
import { Button } from "@/components/ui/button";

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

export const Route = createFileRoute("/password-reset")({
  component: PasswordResetPage,
});

export default function PasswordResetPage() {
  const emailId = useId();
  const passwordId = useId();

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

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
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-1 px-6 sm:px-10 md:px-12 py-8 sm:py-12 flex-col justify-between mx-auto lg:mx-0"
      >
        <div className="max-w-2xl mx-auto h-full flex flex-col justify-between ">
          <div className="">
            {/* Logo & Back */}
            <div className="mb-14 ">
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
            <div className="mb-8 ">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Forgot Password
              </h1>
              <p className="text-[#6C7179]! f14 mb-8">
                Enter your email address and we’ll send you a reset link.
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={emailId} className="f14 ">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id={emailId}
                            type="email"
                            placeholder="Ex: nayerjumon@gmail.com"
                            className="h-12 rounded-lg mb-6 border border-gray-200 bg-gray-50 placeholder:text-gray-400 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-0 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
                  >
                    {isLoading ? "Submitting..." : "Send Password Reset Link"}
                  </button>
                </form>
              </Form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-[#7B7B7B] body-lg mt-8 pt-8 border-t border-[#EBEBEB] text-center leading-relaxed">
            {" "}
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
