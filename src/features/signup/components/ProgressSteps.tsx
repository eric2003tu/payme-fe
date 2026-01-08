"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type Step = { number: number; title: string; color: string; icon: LucideIcon };

export function ProgressSteps({ step, steps }: { step: number; steps: Step[] }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((s) => (
          <div key={s.number} className="flex flex-col items-center relative">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                step >= s.number ? `bg-gradient-to-r ${s.color} text-white shadow-lg` : "bg-gray-200 text-gray-500"
              }`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <span className={`text-xs font-medium ${step >= s.number ? "text-gray-900" : "text-gray-500"}`}>{s.title}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 via-teal-500 via-rose-500 to-blue-600"
          initial={{ width: "0%" }}
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
