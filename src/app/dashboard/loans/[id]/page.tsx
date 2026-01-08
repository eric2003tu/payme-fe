import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default function LoanDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
      <PageHeader title={`Loan ${id}`} subtitle="Agreement, status, and repayment activity" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Amount" value="$1,200" accent="blue" />
        <StatCard title="Amount Due" value="$320" accent="orange" />
        <StatCard title="Status" value="Active" accent="green" />
      </div>
      <div className="mt-6 glass-card rounded-xl p-4">
        <div className="text-sm text-slate-600">Agreement URL: https://example.com/agreement.pdf</div>
      </div>
    </div>
  );
}
