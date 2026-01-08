"use client";
import Link from "next/link";

export default function FinalCta() {
  return (
    <div className="container-fluid py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue/10 via-purple/10 to-pink/10 p-8 md:p-12">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold md:text-3xl">Ready to Transform Your Financial Future?</h3>
          <p className="mt-4 max-w-2xl text-slate-600">
            Join 50,000+ users who have facilitated over $48M in loans. Your first loan application is free.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup" className="rounded-lg bg-slate-900 px-8 py-3 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all">
              Create Free Account
            </Link>
            <Link href="/contact" className="rounded-lg border border-slate-900 px-8 py-3 hover:bg-slate-50 dark:hover:bg-slate-900">
              Schedule a Demo
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span>✓ No hidden fees</span>
            <span>✓ 256-bit encryption</span>
            <span>✓ 24/7 support</span>
            <span>✓ 30-day guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
