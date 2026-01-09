
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import AdminUsersTable from "./AdminUsersTable";

export default function UsersAdminPage() {
  return (
    <div>
      <PageHeader title="Users" subtitle="Admin: manage users" />
      {/* StatCards removed as requested */}
      <div className="mt-6 glass-card rounded-xl p-4">
        <AdminUsersTable />
      </div>
    </div>
  );
}
