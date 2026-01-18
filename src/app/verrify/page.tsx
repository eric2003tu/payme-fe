"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    setIsSubmitting(true);
    try {
      // TODO: Integrate with backend verification
      toast.success("OTP verified successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <section className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6 items-center">
        <h1 className="font-bold text-2xl text-gray-900">Verify Your Email</h1>
        <p className="text-gray-600 text-base text-center">Enter the 6-digit code sent to your email.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full items-center" aria-label="OTP verification form">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                aria-label={`OTP digit ${idx + 1}`}
                required
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-label="Loading" />
            ) : null}
            Verify
          </button>
        </form>
      </section>
    </main>
  );
}
