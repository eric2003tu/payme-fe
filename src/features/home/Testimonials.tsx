"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Aisha B.",
    role: "Small Business Owner",
    quote:
      "Secured a $15,000 business expansion loan at 3.2% lower APR than traditional banks. The verification was seamless and repayments are automated.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Jonas K.",
    role: "Investment Portfolio Manager",
    quote:
      "Diversified 15% of my portfolio into P2P lending. The analytics dashboard and auto-invest feature saved me 10+ hours per month.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Priya S.",
    role: "Medical Student",
    quote:
      "Financed my final year tuition through PayMeNow. The transparent terms and flexible repayment options made it stress-free.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
];

export default function Testimonials() {
  return (
    <div className="container-fluid py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-bold">Trusted by Thousands Worldwide</h2>
        <p className="mt-4 text-slate-600">Join our community of satisfied borrowers and lenders</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image src={t.image} alt={t.name} fill className="object-cover" />
              </div>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-slate-500">{t.role}</div>
              </div>
              <div className="ml-auto flex items-center text-yellow-500">
                {Array.from({ length: 5 }).map((_, i2) => (
                  <Star key={i2} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-slate-700">{t.quote}</p>
            <div className="mt-4 pt-4 border-t text-xs text-slate-500">Verified User • 3 loans completed</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
