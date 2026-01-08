"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaClock, FaCheckCircle, FaBan, FaTimesCircle } from "react-icons/fa";
import { loanOfferClient } from "@/lib/loanOfferClient";
import type { LoanOfferDto } from "@/lib/loanOfferClient";
import { toast } from "sonner";

type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

const toNum = (x: any): number => {
  if (x == null) return 0;
  const n = typeof x === "string" ? Number(x) : x;
  return Number.isFinite(n) ? n : 0;
};

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function statusIcon(status: OfferStatus) {
  switch (status) {
    case "PENDING":
      return <FaClock className="h-5 w-5 text-amber-600" />;
    case "ACCEPTED":
      return <FaCheckCircle className="h-5 w-5 text-emerald-600" />;
    case "REJECTED":
      return <FaTimesCircle className="h-5 w-5 text-rose-600" />;
    case "WITHDRAWN":
      return <FaBan className="h-5 w-5 text-slate-500" />;
  }
}

function badgeClass(status: OfferStatus) {
  switch (status) {
    case "PENDING":
      return "text-amber-700 bg-amber-100";
    case "ACCEPTED":
      return "text-emerald-600 bg-emerald-100";
    case "REJECTED":
      return "text-rose-700 bg-rose-100";
    case "WITHDRAWN":
      return "text-slate-700 bg-slate-100";
  }
}

export default function OffersListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OfferStatus | "all">("all");
  const [items, setItems] = useState<LoanOfferDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await loanOfferClient.mine();
        if (mounted) setItems(data || []);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load your offers");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const counts = useMemo(() => {
    const total = items.length;
    const pending = items.filter((o) => (o.status?.toUpperCase() as OfferStatus) === "PENDING").length;
    const accepted = items.filter((o) => (o.status?.toUpperCase() as OfferStatus) === "ACCEPTED").length;
    const rejected = items.filter((o) => (o.status?.toUpperCase() as OfferStatus) === "REJECTED").length;
    const withdrawn = items.filter((o) => (o.status?.toUpperCase() as OfferStatus) === "WITHDRAWN").length;
    return { total, pending, accepted, rejected, withdrawn };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((o) => {
      const matchQ = !q || `${o.loanRequestId} ${o.id}`.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || (o.status?.toUpperCase() as OfferStatus) === status;
      return matchQ && matchS;
    });
  }, [items, q, status]);

  return (
    <div>
      <PageHeader title="Offers" subtitle="Your loan offers across requests" />

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard title="Total" value={counts.total} accent="blue" />
        <StatCard title="Pending" value={counts.pending} accent="orange" />
        <StatCard title="Accepted" value={counts.accepted} accent="green" />
        <StatCard title="Rejected" value={counts.rejected} accent="pink" />
        <StatCard title="Withdrawn" value={counts.withdrawn} accent="blue" />
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by request # or offer id" className="w-64" />
              <select
                className="h-9 rounded-md border bg-white px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as OfferStatus | "all")}
              >
                <option value="all">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setQ(""); setStatus("all"); }}>Reset</Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              <div className="px-3 py-6 text-center text-slate-500">Loading your offers…</div>
            ) : filtered.map((o) => (
              <article key={o.id} className="glass-card rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner">
                      {statusIcon((o.status?.toUpperCase() as OfferStatus) || "PENDING")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Loan Offer</div>
                      <div className="text-xs text-slate-500">Created {new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass((o.status?.toUpperCase() as OfferStatus) || "PENDING")}`}>{(o.status?.toUpperCase() as OfferStatus) || "PENDING"}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Amount</div>
                    <div className="font-semibold">{money(toNum(o.amount))}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Rate</div>
                    <div className="font-semibold">{toNum(o.interestRate)}% / mo</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Created</div>
                    <div className="font-semibold">{new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  
                </div>

                <div className="mt-4 text-sm text-slate-700">
                  Your offer for this request: <span className="font-semibold">{money(toNum(o.amount))}</span> at {toNum(o.interestRate)}%/mo.
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/loans/${encodeURIComponent(o.id)}`}>View Details</Link>
                  </Button>
                  {(o.status?.toUpperCase() as OfferStatus) === "PENDING" ? (
                    <Button size="sm" variant="default">Withdraw</Button>
                  ) : (
                    <div className="text-xs text-slate-500">—</div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
