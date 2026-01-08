import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" subtitle="Stay up to date" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Unread" value={3} accent="orange" />
        <StatCard title="Recent" value={12} accent="blue" />
        <StatCard title="Muted" value={0} accent="green" />
      </div>
      <div className="mt-6 space-y-3">
        {["Loan PMN-001 due in 3 days", "Offer accepted on Request #42", "KYC document approved"].map((n) => (
          <div key={n} className="glass-card rounded-xl p-4 text-sm">{n}</div>
        ))}
      </div>
    </div>
  );
}
