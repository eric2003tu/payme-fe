"use client";
import { motion } from "framer-motion";
import { Shield, HeartHandshake, Users, Zap, Award, Globe } from "lucide-react";

const VALUES = [
  {
    icon: Shield,
    title: "Security First",
    description: "Bank-level encryption, SOC 2 compliance, and continuous security audits protect every transaction.",
    color: "bg-blue/10 text-blue",
  },
  {
    icon: HeartHandshake,
    title: "Trust & Transparency",
    description: "No hidden fees, clear terms, and complete visibility into every loan process.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Users,
    title: "Community Focus",
    description: "Building a network where borrowers and lenders support each other's financial goals.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Leveraging AI and blockchain to create smarter, faster financial solutions.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Commitment to exceptional user experience and continuous improvement.",
    color: "bg-pink/10 text-pink",
  },
  {
    icon: Globe,
    title: "Global Inclusion",
    description: "Breaking down geographical barriers to provide financial access worldwide.",
    color: "bg-sky-100 text-sky-600",
  },
];

export default function CoreValues() {
  return (
    <div className="container-fluid py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Our Core Values</h2>
        <p className="mt-4 text-slate-600 mx-auto max-w-2xl">These principles guide every decision we make at PayMeNow</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {VALUES.map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all"
          >
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${value.color.split(' ')[0]} mb-4`}>
              <value.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
            <p className="text-slate-600">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
