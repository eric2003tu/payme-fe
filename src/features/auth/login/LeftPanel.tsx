"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Shield, Zap, CheckCircle2 } from "lucide-react";

type Stat = { number: string; label: string; icon: any };

type LeftPanelProps = {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  stats?: Stat[];
  benefits?: string[];
};

export default function LeftPanel({
  imageSrc = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  title = "Access Your Financial Dashboard",
  subtitle = "Log in to manage your loans, track repayments, and explore new opportunities.",
  stats = [
    { number: "50K+", label: "Active Users", icon: TrendingUp },
    { number: "98.7%", label: "Satisfaction", icon: Shield },
    { number: "24/7", label: "Support", icon: Zap },
  ],
  benefits = [
    "Real-time loan tracking & analytics",
    "Instant payment notifications",
    "Personalized loan recommendations",
    "Secure 256-bit encryption",
    "Mobile app synchronization",
  ],
}: LeftPanelProps) {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-8">
        <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
          <Image src={imageSrc} alt="Person accessing financial dashboard on laptop" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">Welcome Back!</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
              <p className="text-gray-200">{subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3"
                >
                  <stat.icon className="h-5 w-5 text-amber-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{stat.number}</div>
                  <div className="text-xs text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Why You'll Love It
              </h3>
              <ul className="space-y-2">
                {benefits.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-200 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
