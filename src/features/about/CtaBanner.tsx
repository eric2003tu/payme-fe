"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CtaBanner() {
  return (
    <div className="container-fluid py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="People collaborating in modern workspace"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue/80 to-pink/80" />
        </div>

        <div className="relative z-10 p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="mx-auto max-w-2xl text-white/90 mb-8">
            Whether you're looking to borrow for your dreams or invest for better returns, become part of a community
            that's changing finance for the better.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-lg bg-white px-8 py-3 text-slate-900 font-semibold hover:bg-slate-100">Start Borrowing</button>
            <button className="rounded-lg border-2 border-white px-8 py-3 font-semibold hover:bg-white/10">Start Lending</button>
            <button className="rounded-lg border-2 border-white px-8 py-3 font-semibold hover:bg-white/10">Careers at PayMeNow</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
