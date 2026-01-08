"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/features/auth/login/schema";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";

type LoginFormProps = {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  showRemember?: boolean;
  showSecurityNote?: boolean;
  showForgotPassword?: boolean;
};

export default function LoginForm({ onSubmit, showRemember = true, showSecurityNote = true, showForgotPassword = true }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleForm = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
        return;
      }
      const session = await authClient.login({ email: values.email, password: values.password });
      const name = session.user.firstName || session.user.email;
      toast.success(`Welcome back, ${name}!`);
      router.push("/dashboard");
    } catch (e: any) {
      const msg = e?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleForm)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-600" />
          Email Address
        </label>
        <input
          type="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white placeholder-gray-400"
          {...register("email")}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-800 flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-600" />
            Password
          </label>
          {showForgotPassword && (
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
          )}
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white placeholder-gray-400 pr-12"
            {...register("password")}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            {errors.password.message}
          </p>
        )}
      </div>

      {showRemember && (
        <div className="flex items-center">
          <input type="checkbox" id="remember" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me for 30 days</label>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            Sign In to Your Account
          </>
        )}
      </button>

      {showSecurityNote && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-700 mb-1">Secure Login</div>
              <div className="text-sm text-gray-600">Your login is protected with bank-level encryption. We never share your credentials.</div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
