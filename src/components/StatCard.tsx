"use client";
import { motion } from "framer-motion";
import { theme } from "@/lib/colors";
import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  delta?: string;
  icon?: ReactNode;
  accent?: "blue" | "green" | "orange" | "pink";
};

export function StatCard({ title, value, delta, icon, accent = "blue" }: StatCardProps) {
  const accentColor = theme[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-xl p-4 shadow-sm"
      style={{ borderColor: accentColor }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</div>
        {icon && <div className="text-slate-500">{icon}</div>}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {delta && <div className="mt-1 text-xs text-slate-500">{delta}</div>}
    </motion.div>
  );
}
