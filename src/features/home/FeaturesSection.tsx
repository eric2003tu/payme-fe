"use client";
import { motion } from "framer-motion";
import { Bell, Lock, Scale, ShieldCheck } from "lucide-react";

function FeatureItem({ icon: Icon, title, text, badge }: { icon: any; title: string; text: string; badge?: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="rounded-xl border p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Icon size={20} />
        </div>
        {badge && (
          <span className="rounded-full bg-blue/10 px-3 py-1 text-xs font-medium text-blue">{badge}</span>
        )}
      </div>
      <div className="font-bold text-lg">{title}</div>
      <div className="mt-2 text-slate-600">{text}</div>
    </motion.div>
  );
}

function VisualMock() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-6 -z-10 rounded-3xl opacity-30 blur-2xl"
        style={{
          background:
            "radial-gradient(500px circle at 30% 40%, var(--brand-blue), transparent), radial-gradient(420px circle at 80% 60%, var(--brand-pink), transparent)",
        }}
      />
      <div className="glass-card rounded-2xl p-6 shadow-2xl">
        <div className="rounded-xl border border-slate-200 p-6 bg-white/50 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Loan Request #PMN-8942</div>
              <div className="text-xs text-slate-500">Education Funding • Verified Student</div>
            </div>
            <span className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">Highly Rated</span>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {[
              { label: "Loan Amount", value: "$8,500", icon: "$" },
              { label: "Term", value: "24 months", icon: "📅" },
              { label: "Max APR", value: "7.8%", icon: "📊" },
              { label: "Trust Score", value: "734/850", icon: "⭐" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">{item.label}</div>
                  <div className="text-lg">{item.icon}</div>
                </div>
                <div className="mt-1 text-xl font-bold">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="mb-3 text-sm font-medium text-slate-700">Funding Progress</div>
            <div className="h-2 rounded-full bg-slate-200">
              <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-blue to-purple"></div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-slate-600">
              <span>$7,225 funded</span>
              <span>85% of goal</span>
            </div>
          </div>

          <div className="rounded-xl border p-4 bg-gradient-to-br from-white to-blue/5">
            <div className="mb-3 text-sm font-medium text-slate-700">Competitive Offers Received</div>
            <div className="space-y-3">
              {[
                { name: "Heritage Capital", amount: "$8,500", apr: "6.9%", badge: "Best Rate" },
                { name: "Urban Investors", amount: "$8,500", apr: "7.2%", badge: "Fast Funding" },
                { name: "Community Trust", amount: "$4,250", apr: "7.5%", badge: "Partial Match" },
              ].map((offer, i) => (
                <div key={offer.name} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                  <div>
                    <div className="font-medium">{offer.name}</div>
                    <div className="text-sm text-slate-500">{offer.amount}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">{offer.apr} APR</div>
                    <span className={`text-xs ${i === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'} rounded-full px-2 py-1`}>
                      {offer.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-6 -right-6 hidden rotate-3 md:block">
        <div className="glass-card rounded-xl p-4 shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <div className="text-xs font-medium text-slate-700">Active Repayment</div>
          </div>
          <div className="text-sm">
            <span className="font-bold">$342.50</span> due in 5 days
          </div>
          <div className="mt-1 text-xs text-slate-500">Auto-pay scheduled</div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <div className="container-fluid py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-bold">Advanced Security & Transparency</h2>
        <p className="mt-4 text-slate-600">Institutional-grade features built for complete peace of mind</p>
      </div>
      <div className="grid items-start gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <FeatureItem icon={ShieldCheck} title="AI-Powered Trust Scoring" text="Our proprietary algorithm analyzes 127 data points including repayment history, income verification, and behavioral patterns to generate a comprehensive trust score (300-850)." badge="Patented Technology" />
          <FeatureItem icon={Lock} title="Bank-Grade Escrow System" text="Funds are held in FDIC-insured partner banks until both parties confirm terms. All transactions are recorded on an immutable private blockchain ledger." badge="SOC 2 Certified" />
          <FeatureItem icon={Bell} title="Intelligent Notification System" text="Smart reminders for due dates, rate changes, and market opportunities. Customize alerts by email, SMS, or push notification—no spam, just what matters." badge="97% User Satisfaction" />
          <FeatureItem icon={Scale} title="Full Cost Transparency" text="Every loan shows comparable APR, all fees, and total repayment amount upfront. Our 'No Surprises' guarantee means what you see is what you pay." badge="Regulatory Compliant" />
        </div>
        <VisualMock />
      </div>
    </div>
  );
}
