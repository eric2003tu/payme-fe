"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Shield, HandCoins, FileSearch, CheckCircle2 } from "lucide-react";

type Step = { icon: any; title: string; text: string; image: string };

const STEPS: Step[] = [
  { icon: Users, title: "Create Profile", text: "Sign up in 2 minutes. We use bank-level 256-bit encryption to protect your data.", image: "https://images.unsplash.com/photo-1551836026-d5c2e0c49b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { icon: Shield, title: "Verify Identity", text: "Complete our AI-powered KYC process. 98% of users are verified in under 5 minutes.", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { icon: HandCoins, title: "Set Terms", text: "Borrowers set loan amount and max APR. Lenders browse requests with smart filters.", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { icon: FileSearch, title: "Match & Review", text: "Our algorithm matches the best offers. Compare terms side-by-side with full transparency.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { icon: CheckCircle2, title: "Fund & Track", text: "Funds released to escrow. Track repayments with automated reminders and dashboard.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

export default function HowItWorks() {
  return (
    <div className="container-fluid py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">How PayMeNow Works</h2>
        <p className="mt-4 mx-auto max-w-2xl text-slate-600">Our streamlined process makes borrowing and lending simpler than traditional banking</p>
      </div>
      <div className="grid gap-8 md:grid-cols-5">
        {STEPS.map(({ icon: Icon, title, text, image }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.05 * i }}
            className="group"
          >
            <div className="glass-card rounded-xl p-5 h-full hover:shadow-xl transition-all duration-300">
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                <Image src={image} alt={`Step ${i + 1}: ${title}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white flex items-center justify-center font-bold">{i + 1}</div>
              </div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Icon size={20} />
              </div>
              <div className="font-bold text-lg">{title}</div>
              <div className="mt-2 text-sm text-slate-600">{text}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
