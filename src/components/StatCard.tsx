"use client";
import { motion } from "framer-motion";
import { theme } from "@/lib/colors";
import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  delta?: string;
  icon?: ReactNode;
  accent?: "blue" | "green" | "orange" | "pink" | "yellow" | "purple" | "gray";
};

export function StatCard({ title, value, delta, icon, accent = "green" }: StatCardProps) {
  const accentColor = theme[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl transition-shadow duration-300 group"
      style={{}}
    >
      <div
        className="absolute left-0 top-0 h-full w-2 rounded-bl-2xl rounded-tl-2xl"
        style={{ 
          background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}99 60%, transparent 100%)`,
          boxShadow: `0 0 16px 2px ${accentColor}55, 0 0 32px 4px ${accentColor}22`,
          filter: 'blur(0.5px)',
        }}
      />
      <div className="relative z-10 p-5 flex flex-col gap-2 min-h-[120px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 group-hover:text-slate-700 transition-colors">{title}</span>
          {icon && (
            <span className="flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xl" style={{ color: accentColor }}>
              {icon}
            </span>
          )}
        </div>
        <div className="flex items-end gap-2 mt-2">
          <span
            className="text-2xl font-bold leading-tight"
            style={{ color: accentColor, textShadow: `0 1px 8px ${accentColor}22` }}
          >
            {value}
          </span>
          {delta && (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ml-1">
              {delta}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
