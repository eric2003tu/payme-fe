import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default function ApprovalsAdminPage() {
  return (
    <div>
      <PageHeader title="Approvals" subtitle="Admin: document verification queue" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Pending" value={14} accent="orange" />
        <StatCard title="Approved" value={220} accent="green" />
        <StatCard title="Rejected" value={6} accent="pink" />
      </div>
      <div className="mt-6 glass-card rounded-xl p-4">
        <div className="text-sm text-slate-600">Verification documents list with approve/reject actions.</div>
      </div>
    </div>
  );
}
