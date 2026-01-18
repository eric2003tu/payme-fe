
"use client";
import LeftPanel from "@/features/auth/login/LeftPanel";
import { LogIn } from "lucide-react";
import { useState, useCallback } from "react";
import { forgotSchema, type forgot } from "@/features/auth/login/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


type ForgotFormProps = {
  onSubmit?: (values: forgot) => Promise<void> | void;
};


export default function ForgotPage({ onSubmit }: ForgotFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<forgot>({
    resolver: zodResolver(forgotSchema),
    mode: "onTouched",
  });

  const handleForm = useCallback(
    async (values: forgot) => {
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(values);
          return;
        }
        toast.success("Enter the code we sent to your email");
        router.push("/verrify");
        reset();
      } catch (e: any) {
        const msg = e?.message || "Failed to send the verification code.";
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, router, reset]
  );

  return (
    <main className="grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 to-slate-200">
      <LeftPanel />
      <section className="flex flex-col gap-6 justify-center items-center p-8 my-5 lg:mt-[15%] h-fit rounded-xl border-l border-r bg-white shadow-xl w-full max-w-md mx-auto">
        <h1 className="font-bold text-2xl text-gray-900">Forgot Password</h1>
        <p className="text-gray-600 text-base text-center">Enter your email to receive a verification code.</p>
        <form
          onSubmit={handleSubmit(handleForm)}
          className="flex flex-col gap-4 w-full"
          aria-label="Forgot password form"
        >
          <label htmlFor="email" className="font-medium text-gray-800">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className="p-3 w-full border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-2 text-sm text-rose-600 flex items-center gap-1"
              role="alert"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.email.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-label="Loading" />
                Sending ...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" aria-hidden="true" />
                Send Code
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}