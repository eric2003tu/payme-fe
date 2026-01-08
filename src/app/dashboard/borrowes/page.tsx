import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default function BorrowesPage() {
  return (
    <div>
      <PageHeader title="Borrowes" subtitle="Requested by user spec" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Count" value={540} accent="blue" />
        <StatCard title="Verified" value={420} accent="green" />
        <StatCard title="Pending" value={18} accent="orange" />
      </div>
      <div className="mt-6 glass-card rounded-xl p-4">
        <div className="text-sm text-slate-600">Duplicate of borrowers to match route naming.</div>
      </div>
    </div>
  );
}
