"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { KpiAreaChart } from "@/components/charts/KpiAreaChart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, HandCoins, Handshake, AlarmClock, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/authClient";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

type ChartPoint = { name: string; value: number };

export default function DashboardOverviewPage() {
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await authClient.profile();
        if (!mounted) return;
        setP(data);
      } catch (e) {
        // Global toast handled by appClient
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const trustHistory: ChartPoint[] = useMemo(() => {
    const hist = (p?.trustScoreHistory ?? []).map((h: any) => ({
      name: new Date(h.createdAt).toLocaleDateString(),
      value: Number(h.newScore ?? 0),
    }));
    if (hist.length === 0) return [];
    return [...hist].reverse();
  }, [p?.trustScoreHistory]);

  function getISOWeek(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }

  const fundingActivity: ChartPoint[] = useMemo(() => {
    const offers = p?.loanOffers ?? [];
    if (!offers.length) return [];
    const map = new Map<string, number>();
    for (const o of offers) {
      const k = getISOWeek(new Date(o.createdAt));
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    const keys = Array.from(map.keys()).sort();
    const last = keys.slice(-4);
    return last.map((k) => ({ name: k.split("-")[1] ?? k, value: map.get(k) ?? 0 }));
  }, [p?.loanOffers]);

  const walletBalance = Number(p?.walletBalance ?? 0);
  const trustScore = Number(p?.trustScore ?? (trustHistory[trustHistory.length - 1]?.value ?? 0));

  const offers = p?.loanOffers ?? [];
  const offersTotal = offers.length;
  const offersPending = offers.filter((o: any) => String(o.status).toUpperCase() === "PENDING").length;
  const offersAccepted = offers.filter((o: any) => String(o.status).toUpperCase() === "ACCEPTED").length;

  const requests = p?.loanRequests ?? [];
  const reqOpen = requests.filter((r: any) => String(r.status).toUpperCase() === "OPEN").length;
  const reqPartial = requests.filter((r: any) => String(r.status).toUpperCase() === "PARTIAL").length;

  const loansBorrower = p?.loansAsBorrower ?? [];
  const loansLender = p?.loansAsLender ?? [];
  const allLoans = [...loansBorrower, ...loansLender];
  const loansActive = allLoans.filter((l: any) => String(l.status).toUpperCase() === "ACTIVE").length;
  const loansOverdue = allLoans.filter((l: any) => String(l.status).toUpperCase() === "OVERDUE" || l.isLate === true).length;
  const loansRepaid = allLoans.filter((l: any) => String(l.status).toUpperCase() === "REPAID").length;

  const upcoming = useMemo(() => {
    const pending = allLoans
      .filter((l: any) => String(l.status).toUpperCase() !== "REPAID" && l.dueDate)
      .slice()
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4)
      .map((l: any) => {
        const overdue = String(l.status).toUpperCase() === "OVERDUE" || l.isLate === true || (l.dueDate && new Date(l.dueDate) < new Date());
        return {
          id: l.id,
          loanNumber: l.loanNumber,
          amount: Number(l.amount ?? 0),
          status: overdue ? "OVERDUE" : String(l.status).toUpperCase(),
          dueDate: l.dueDate,
        };
      });
    return pending;
  }, [allLoans]);

  return (
    <div>
      <PageHeader title="Overview" subtitle="Your lending activity at a glance" />

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard title="Wallet" value={money(walletBalance)} icon={<DollarSign size={18} />} accent="blue" />
        <StatCard title="Offers (Pending)" value={`${offersPending}/${offersTotal}`} icon={<Handshake size={18} />} accent="green" />
        <StatCard title="Accepted Offers" value={offersAccepted} icon={<CheckCircle2 size={18} />} accent="green" />

        <StatCard title="Open Requests" value={reqOpen} icon={<HandCoins size={18} />} accent="orange" />
        <StatCard title="Active Loans" value={loansActive} icon={<TrendingUp size={18} />} accent="green" />

      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trust Score</CardTitle>
            <CardDescription>Recent trend</CardDescription>
          </CardHeader>
          <CardContent>
            <KpiAreaChart data={trustHistory} color="#2563eb" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding Activity</CardTitle>
            <CardDescription>Offers created per week</CardDescription>
          </CardHeader>
          <CardContent>
            <KpiAreaChart data={fundingActivity} color="#16a34a" />
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
              {[...requests]
                .slice()
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((r: any) => (
                <div key={r.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.loanNumber}</div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{String(r.status)}</span>
                  </div>
                  <div className="mt-1 text-slate-700">Raised {money(Number(r.amountFunded ?? 0))} of {money(Number(r.amount ?? 0))}</div>
                  <div className="text-xs text-slate-500">Expires {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}</div>
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
              {[...offers]
                .slice()
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((o: any) => (
                <div key={o.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{o.loanRequest?.loanNumber ?? o.loanNumber ?? "—"}</div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{String(o.status)}</span>
                  </div>
                  <div className="mt-1 text-slate-700">{money(Number(o.amount ?? 0))} at {String(o.interestRate)}%/mo</div>
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
              {upcoming.map((l: any) => (
                <div key={l.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{l.loanNumber}</div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.status === "OVERDUE" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"}`}>{l.status}</span>
                  </div>
                  <div className="mt-1 text-slate-700">Amount {money(Number(l.amount ?? 0))}</div>
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
