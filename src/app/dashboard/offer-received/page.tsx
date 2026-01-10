"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loanOfferClient, LoanOfferDto } from "@/lib/loanOfferClient";
import { Activity, CheckCircle2, Handshake, AlertTriangle, CircleDollarSign, Banknote, Clock4, MessageSquare, UserCircle2 } from "lucide-react";
import Link from "next/link";

function toNumber(n: number | string | undefined | null): number {
  if (n === undefined || n === null) return 0;
  if (typeof n === "number") return n;
  const parsed = parseFloat(n);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default function OffersReceivedPage() {
  const [offers, setOffers] = useState<LoanOfferDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | "all">("all");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loanOfferClient
      .myRequests()
      .then((data) => {
        if (!mounted) return;
        setOffers(data || []);
      })
      .catch(() => void 0)
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = offers.length;
    const accepted = offers.filter((o) => (o.status || "").toUpperCase() === "ACCEPTED").length;
    const pending = offers.filter((o) => (o.status || "").toUpperCase() === "PENDING").length;
    const rejected = offers.filter((o) => (o.status || "").toUpperCase() === "REJECTED").length;
    const counter = offers.filter((o) => !!o.isCounterOffer).length;
    const totalAmount = offers.reduce((acc, o) => acc + toNumber(o.amount), 0);
    const avgRate = offers.length ? offers.reduce((acc, o) => acc + toNumber(o.interestRate), 0) / offers.length : 0;
    return { total, accepted, pending, rejected, counter, totalAmount, avgRate };
  }, [offers]);

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      const lr = o.loanRequest || {};
      const matchQ = !q || `${lr.loanNumber || ""} ${lr.purpose || ""}`.toLowerCase().includes(q.toLowerCase());
      const s = (o.status || "").toUpperCase();
      const matchS = status === "all" || s === status;
      return matchQ && matchS;
    });
  }, [offers, q, status]);

  return (
    <div>
      <PageHeader title="Offers Received" subtitle="All offers for your loan requests" />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total" value={stats.total} accent="blue" icon={<Handshake size={18} />} />
        <StatCard title="Accepted" value={stats.accepted} accent="green" icon={<CheckCircle2 size={18} />} />
        <StatCard title="Pending" value={stats.pending} accent="pink" icon={<Clock4 size={18} />} />
        <StatCard title="Rejected" value={stats.rejected} accent="orange" icon={<AlertTriangle size={18} />} />
        <StatCard title="Counter Offers" value={stats.counter} accent="blue" icon={<Activity size={18} />} />
        <StatCard title="Total Amount" value={money(stats.totalAmount)} accent="blue" icon={<Banknote size={18} />} />
      </div>

      <Card className="mt-6">
        <CardHeader className="border-b">
          <CardTitle>Offers</CardTitle>
          <CardDescription>Filter and review your received offers</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by request # or purpose" className="w-64" />
              <select
                className="h-9 rounded-md border bg-white px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="all">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setQ(""); setStatus("all"); }}>Reset</Button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border p-4">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="h-16 rounded bg-slate-100" />
                    <div className="h-16 rounded bg-slate-100" />
                    <div className="h-16 rounded bg-slate-100" />
                    <div className="h-16 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-slate-500">No offers match your filters.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((o) => {
                const lr = o.loanRequest || {};
                const lender = o.lender || {};
                return (
                  <Card key={o.id} className="flex flex-col h-full border shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base font-semibold">Request #{lr.loanNumber || "—"}</CardTitle>
                          <CardDescription className="text-xs text-slate-600">{lr.purpose || "—"}</CardDescription>
                        </div>
                        <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${o.status === "ACCEPTED" ? "bg-green-100 text-green-700" : o.status === "PENDING" ? "bg-pink-100 text-pink-700" : o.status === "REJECTED" ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-700"}`}>{o.status}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Offered Amount</span>
                        <span className="font-semibold">{money(toNumber(o.amount))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Interest Rate</span>
                        <span>{toNumber(o.interestRate)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Type</span>
                        <span>{o.isCounterOffer ? "Counter" : "Standard"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Lender</span>
                        <span>{lender.firstName || ""} {lender.lastName || ""}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Message</span>
                        <span className="truncate max-w-[120px] text-xs text-slate-700">{o.message || "—"}</span>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-4 mt-auto flex flex-col gap-2">
                      {lr.id && (
                        <Button asChild size="sm" variant="outline" className="w-full">
                          <Link href={`/dashboard/loan-requests/${lr.id}`}>View Request</Link>
                        </Button>
                      )}
                      {o.status === "PENDING" && (
                        <Button asChild size="sm" variant="default" className="w-full">
                          <Link href={`/dashboard/offer-received/${o.id}/accept-offer`}>Accept Offer</Link>
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
