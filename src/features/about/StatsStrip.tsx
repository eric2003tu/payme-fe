"use client";
import { motion } from "framer-motion";
import { Users, DollarSign, Clock, Lock } from "lucide-react";

const STATS = [
  { icon: Users, value: "50,000+", label: "Active Users", description: "Across 50+ countries" },
  { icon: DollarSign, value: "$48M", label: "Total Loans", description: "Facilitated to date" },
  { icon: Clock, value: "98.7%", label: "On-time Repayment", description: "Industry-leading rate" },
  { icon: Lock, value: "100%", label: "Secure", description: "Zero security breaches" },
];

export default function StatsStrip() {
  return (
    <div className="container-fluid py-16 bg-gradient-to-r from-blue/5 to-pink/5 rounded-3xl">
      <div className="grid gap-8 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg mb-4">
              <stat.icon className="h-8 w-8 text-blue" />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="font-medium text-slate-800">{stat.label}</div>
            <div className="text-sm text-slate-600">{stat.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
