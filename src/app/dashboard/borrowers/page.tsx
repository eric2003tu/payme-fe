import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default function BorrowersPage() {
  return (
    <div>
      <PageHeader title="Borrowers" subtitle="Discover and manage borrowers" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Borrowers" value={540} accent="blue" />
        <StatCard title="Verified" value={420} accent="green" />
        <StatCard title="Pending KYC" value={18} accent="orange" />
      </div>
      <div className="mt-6 glass-card rounded-xl p-4">
        <div className="text-sm text-slate-600">Borrower directory and filters coming soon.</div>
      </div>
    </div>
  );
}
