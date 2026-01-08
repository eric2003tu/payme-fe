"use client";
import Image from "next/image";
import Link from "next/link";
import { Landmark, HandCoins } from "lucide-react";
import { motion } from "framer-motion";

function GuideCard({
  title,
  bullets,
  cta,
  icon: Icon,
}: {
  title: string;
  bullets: string[];
  cta: { href: string; label: string };
  icon: any;
}) {
  return (
    <motion.div whileHover={{ y: -5 }} className="glass-card absolute bottom-0 left-0 right-0 -mb-8 mx-8 rounded-2xl p-6 shadow-2xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <ul className="space-y-2 text-sm text-slate-700">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link href={cta.href} className="rounded-lg bg-slate-900 px-5 py-2.5 text-white hover:bg-slate-800 inline-flex items-center gap-2">
          {cta.label}
          <span>→</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Guides() {
  return (
    <div className="container-fluid py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-bold">Get Started Guide</h2>
        <p className="mt-4 text-slate-600">Whether you're borrowing or lending, we've got you covered with expert guidance</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative">
          <Image src="https://images.unsplash.com/photo-1589666564459-93cdd3c84de8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Person receiving money and smiling" width={600} height={400} className="rounded-2xl" />
          <GuideCard
            title="For Borrowers"
            bullets={[
              "Set a fair maximum APR based on current market rates",
              "Describe your purpose clearly - education loans get 22% more offers",
              "Use our APR calculator to estimate monthly payments",
              "Track repayments with automated reminders and flexible schedules",
              "Build your credit score with on-time repayments",
            ]}
            cta={{ href: "/auth/signup", label: "Start Borrowing" }}
            icon={Landmark}
          />
        </div>
        <div className="relative">
          <Image src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Person investing money on laptop" width={600} height={400} className="rounded-2xl" />
          <GuideCard
            title="For Lenders"
            bullets={[
              "Filter requests by amount (from $100 to $50,000), tenure, and credit score",
              "Offer transparent terms—our platform prohibits hidden fees",
              "Diversify across multiple loans with our portfolio tool",
              "Monitor performance with real-time analytics dashboard",
              "Set auto-invest rules based on your risk tolerance",
            ]}
            cta={{ href: "/auth/signup", label: "Start Lending" }}
            icon={HandCoins}
          />
        </div>
      </div>
    </div>
  );
}
