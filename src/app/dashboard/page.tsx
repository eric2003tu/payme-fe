import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { KpiAreaChart } from "@/components/charts/KpiAreaChart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, HandCoins, Handshake, AlarmClock, CheckCircle2 } from "lucide-react";

type LoanStatus = "ACTIVE" | "OVERDUE" | "REPAID";
type RequestStatus = "OPEN" | "PARTIAL" | "CLOSED";
type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED";

const REQUESTS: Array<{ id: string; loanNumber: string; amount: number; funded: number; status: RequestStatus; createdAt: string; expiresAt: string }> = [
  { id: "RQ-101", loanNumber: "LR-2026-0101", amount: 5000, funded: 3200, status: "OPEN", createdAt: "2026-01-03", expiresAt: "2026-01-20" },
  { id: "RQ-102", loanNumber: "LR-2026-0102", amount: 2800, funded: 2800, status: "CLOSED", createdAt: "2026-01-01", expiresAt: "2026-01-10" },
  { id: "RQ-103", loanNumber: "LR-2026-0103", amount: 4200, funded: 1800, status: "PARTIAL", createdAt: "2026-01-05", expiresAt: "2026-01-25" },
  { id: "RQ-104", loanNumber: "LR-2026-0104", amount: 1500, funded: 0, status: "OPEN", createdAt: "2026-01-07", expiresAt: "2026-01-21" },
];

const OFFERS: Array<{ id: string; amount: number; interestRate: number; status: OfferStatus; createdAt: string; loanNumber: string }> = [
  { id: "OF-501", amount: 1000, interestRate: 6.0, status: "ACCEPTED", createdAt: "2026-01-06", loanNumber: "LR-2026-0099" },
  { id: "OF-502", amount: 800, interestRate: 5.8, status: "PENDING", createdAt: "2026-01-07", loanNumber: "LR-2026-0103" },
  { id: "OF-503", amount: 1200, interestRate: 6.2, status: "PENDING", createdAt: "2026-01-07", loanNumber: "LR-2026-0101" },
  { id: "OF-504", amount: 600, interestRate: 5.9, status: "REJECTED", createdAt: "2026-01-02", loanNumber: "LR-2026-0081" },
];

const LOANS: Array<{ id: string; loanNumber: string; amount: number; status: LoanStatus; dueDate?: string }> = [
  { id: "LN-001", loanNumber: "LN-2026-0001", amount: 1000, status: "ACTIVE", dueDate: "2026-02-06" },
  { id: "LN-002", loanNumber: "LN-2026-0002", amount: 2500, status: "REPAID" },
  { id: "LN-003", loanNumber: "LN-2026-0004", amount: 1600, status: "OVERDUE", dueDate: "2026-01-20" },
  { id: "LN-004", loanNumber: "LN-2026-0005", amount: 900, status: "ACTIVE", dueDate: "2026-02-05" },
];

const TRUST_HISTORY = [
  { name: "Nov", value: 80 },
  { name: "Dec", value: 84 },
  { name: "Jan", value: 86 },
];

const FUNDING_ACTIVITY = [
  { name: "W1", value: 2 },
  { name: "W2", value: 3 },
  { name: "W3", value: 1 },
  { name: "W4", value: 4 },
];

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function DashboardOverviewPage() {
  const walletBalance = 12450;
  const trustScore = TRUST_HISTORY[TRUST_HISTORY.length - 1]?.value ?? 0;

  const offersTotal = OFFERS.length;
  const offersPending = OFFERS.filter((o) => o.status === "PENDING").length;
  const offersAccepted = OFFERS.filter((o) => o.status === "ACCEPTED").length;

  const reqOpen = REQUESTS.filter((r) => r.status === "OPEN").length;
  const reqPartial = REQUESTS.filter((r) => r.status === "PARTIAL").length;

  const loansActive = LOANS.filter((l) => l.status === "ACTIVE").length;
  const loansOverdue = LOANS.filter((l) => l.status === "OVERDUE").length;
  const loansRepaid = LOANS.filter((l) => l.status === "REPAID").length;

  const upcoming = LOANS.filter((l) => l.status !== "REPAID" && l.dueDate).slice(0, 4);

  return (
    <div>
      <PageHeader title="Overview" subtitle="Your lending activity at a glance" />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Wallet" value={money(walletBalance)} icon={<DollarSign size={18} />} accent="blue" />
        <StatCard title="Trust Score" value={trustScore} icon={<Users size={18} />} accent="pink" />
        <StatCard title="Offers (Pending)" value={`${offersPending}/${offersTotal}`} icon={<Handshake size={18} />} accent="green" />
        <StatCard title="Accepted Offers" value={offersAccepted} icon={<CheckCircle2 size={18} />} accent="green" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <StatCard title="Open Requests" value={reqOpen} icon={<HandCoins size={18} />} accent="orange" />
        <StatCard title="Partially Funded" value={reqPartial} icon={<TrendingUp size={18} />} accent="blue" />
        <StatCard title="Active Loans" value={loansActive} icon={<TrendingUp size={18} />} accent="green" />
        <StatCard title="Overdue Loans" value={loansOverdue} icon={<AlarmClock size={18} />} accent="orange" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trust Score</CardTitle>
            <CardDescription>Recent trend</CardDescription>
          </CardHeader>
          <CardContent>
            <KpiAreaChart data={TRUST_HISTORY} color="#2563eb" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding Activity</CardTitle>
            <CardDescription>Offers created per week</CardDescription>
          </CardHeader>
          <CardContent>
            <KpiAreaChart data={FUNDING_ACTIVITY} color="#16a34a" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Latest loan requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {REQUESTS.slice(0, 5).map((r) => (
                <div key={r.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.loanNumber}</div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{r.status}</span>
                  </div>
                  <div className="mt-1 text-slate-700">Raised {money(r.funded)} of {money(r.amount)}</div>
                  <div className="text-xs text-slate-500">Expires {new Date(r.expiresAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Offers</CardTitle>
            <CardDescription>Your latest loan offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {OFFERS.slice(0, 5).map((o) => (
                <div key={o.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{o.loanNumber}</div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{o.status}</span>
                  </div>
                  <div className="mt-1 text-slate-700">{money(o.amount)} at {o.interestRate}%/mo</div>
                  <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Next due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {upcoming.map((l) => (
                <div key={l.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{l.loanNumber}</div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.status === "OVERDUE" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"}`}>{l.status}</span>
                  </div>
                  <div className="mt-1 text-slate-700">Amount {money(l.amount)}</div>
                  <div className="text-xs text-slate-500">Due {l.dueDate ? new Date(l.dueDate).toLocaleDateString() : "—"}</div>
                </div>
              ))}
              {upcoming.length === 0 && <div className="text-slate-500">No upcoming dues.</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sr-only">Repaid Loans: {loansRepaid}</div>
    </div>
  );
}
