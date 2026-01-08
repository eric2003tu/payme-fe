import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { FiUsers } from "react-icons/fi";

export default function LendersPage() {
  return (
    <div>
      <PageHeader title="Lenders" subtitle="Discover and manage lenders" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Lenders" value={312} accent="blue" icon={<FiUsers />} />
        <StatCard title="Top Rated" value={24} accent="green" />
        <StatCard title="New This Week" value={8} accent="pink" />
      </div>
      <div className="mt-6 glass-card rounded-xl p-4">
        <div className="text-sm text-slate-600">Lender directory and filters coming soon.</div>
      </div>
    </div>
  );
}
