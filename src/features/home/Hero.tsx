"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Globe, ShieldCheck, TrendingUp } from "lucide-react";
import AnimatedWord from "@/features/home/AnimatedWord";

export default function Hero() {
  const words = useMemo(() => ["securely", "fairly", "instantly", "globally"], []);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % words.length), 2000);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <>
      <div className="container-fluid py-24">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
        >
          The Future of
          <span className="mx-2 inline-block bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
            <AnimatedWord word={words[idx]} />
          </span>
          Peer-to-Peer Finance
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-slate-600"
        >
          PayMeNow is a revolutionary platform connecting verified borrowers and lenders worldwide with AI-powered
          matching, blockchain-backed transparency, and institutional-grade security for personal and business loans.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Bank-level encryption</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Globe className="h-4 w-4 text-blue-500" />
            <span>Available in 50+ countries</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span>Up to 15% better rates</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/auth/signup" className="rounded-lg bg-slate-900 px-6 py-3 text-white shadow-lg hover:bg-slate-800 transition-all duration-200 hover:shadow-xl">
            Start Free Trial
          </Link>
          <Link href="/demo" className="rounded-lg border px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            Watch Demo Video
          </Link>
          <span className="text-sm text-slate-500">No fees to join • 30-day money-back guarantee</span>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="container-fluid mb-16">
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue/20 to-pink/20" />
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2100&q=80"
            alt="Modern digital payment interface showing money transfer"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <p className="text-white text-sm">
              Photo by <a href="https://unsplash.com/@campaign_creators" className="underline" target="_blank">Campaign Creators</a> on Unsplash
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
