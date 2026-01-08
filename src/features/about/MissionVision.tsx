"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Target, Globe } from "lucide-react";

export default function MissionVision() {
  return (
    <div className="container-fluid py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue/10 p-3">
            <Target className="h-6 w-6 text-blue" />
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-lg text-slate-700">
            To democratize access to financial services by eliminating traditional banking barriers. We believe everyone
            deserves fair access to capital, regardless of background or location.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue" />
              <span>Provide affordable credit to underserved communities</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue" />
              <span>Create meaningful returns for individual lenders</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue" />
              <span>Build trust through transparency and technology</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg bg-pink/10 p-3">
            <Globe className="h-6 w-6 text-pink" />
            <h2 className="text-2xl font-bold">Our Vision</h2>
          </div>
          <p className="text-lg text-slate-700">
            To become the world's most trusted peer-to-peer financial ecosystem, connecting millions of people globally
            in a transparent, secure, and mutually beneficial financial network.
          </p>
          <div className="relative h-64 rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Global financial network visualization"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
