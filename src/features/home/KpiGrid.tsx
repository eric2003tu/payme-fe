"use client";
import { motion } from "framer-motion";
import { TrendingUp, HandCoins, BarChart3, Clock } from "lucide-react";

type Stat = { title: string; value: string; change: string; icon: any };

const DEFAULT_STATS: Stat[] = [
  { title: "Active Loan Requests", value: "1,247", change: "+12%", icon: TrendingUp },
  { title: "Total Loans Funded", value: "$4.8M", change: "+28%", icon: HandCoins },
  { title: "Average APR", value: "9.2%", change: "-1.4%", icon: BarChart3 },
  { title: "Avg Funding Time", value: "2.4 days", change: "-35%", icon: Clock },
];

export default function KpiGrid({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <div className="container-fluid pb-16">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">{s.title}</div>
              <div className={`flex items-center text-xs ${s.change.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                <s.icon className="h-3 w-3 mr-1" />
                {s.change}
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
