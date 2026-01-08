"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Rocket, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <div className="container-fluid py-20">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue/10 px-4 py-2 text-sm text-blue mb-6">
            <Rocket className="h-4 w-4" />
            Revolutionizing Finance Since 2020
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Building the Future of
            <span className="block bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">Inclusive Finance</span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-lg text-slate-600">
            PayMeNow is a peer-to-peer lending platform that connects verified borrowers and lenders globally. We're
            democratizing access to capital through technology, transparency, and trust.
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="rounded-lg bg-slate-900 px-6 py-3 text-white">
              Our Mission
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="rounded-lg border border-slate-900 px-6 py-3">
              Core Values
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Team collaboration in modern office"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="text-white text-sm">Our team at PayMeNow headquarters</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-6 -right-6 glass-card rounded-xl p-4 shadow-xl w-64"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">$48M+</div>
                <div className="text-sm text-slate-600">Total Loans Facilitated</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
