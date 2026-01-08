import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default function UsersAdminPage() {
  return (
    <div>
      <PageHeader title="Users" subtitle="Admin: manage users" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Users" value={1024} accent="blue" />
        <StatCard title="Active" value={880} accent="green" />
        <StatCard title="Soft Deleted" value={12} accent="orange" />
      </div>
      <div className="mt-6 glass-card rounded-xl p-4">
        <div className="text-sm text-slate-600">Admin user list table goes here.</div>
      </div>
    </div>
  );
}
