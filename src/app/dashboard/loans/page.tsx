"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaClock, FaCheckCircle, FaBan, FaTimesCircle } from "react-icons/fa";

type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

type OfferItem = {
  id: string; // offer id
  loanRequestId: string;
  loanNumber: string; // of the request
  amount: number;
  interestRate: number; // % per month
  createdAt: string;
  status: OfferStatus;
};

const OFFERS: OfferItem[] = [
  { id: "OF-0001", loanRequestId: "RQ-101", loanNumber: "LR-2026-0101", amount: 1000, interestRate: 6.0, createdAt: "2026-01-06", status: "ACCEPTED" },
  { id: "OF-0002", loanRequestId: "RQ-103", loanNumber: "LR-2026-0103", amount: 800, interestRate: 5.8, createdAt: "2026-01-07", status: "PENDING" },
  { id: "OF-0003", loanRequestId: "RQ-101", loanNumber: "LR-2026-0101", amount: 1200, interestRate: 6.2, createdAt: "2026-01-07", status: "PENDING" },
  { id: "OF-0004", loanRequestId: "RQ-081", loanNumber: "LR-2026-0081", amount: 600, interestRate: 5.9, createdAt: "2026-01-02", status: "REJECTED" },
  { id: "OF-0005", loanRequestId: "RQ-104", loanNumber: "LR-2026-0104", amount: 500, interestRate: 6.1, createdAt: "2026-01-07", status: "CANCELLED" },
];

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
    case "CANCELLED":
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
    case "CANCELLED":
      return "text-slate-700 bg-slate-100";
  }
}

export default function OffersListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OfferStatus | "all">("all");

  const counts = useMemo(() => {
    const total = OFFERS.length;
    const pending = OFFERS.filter((o) => o.status === "PENDING").length;
    const accepted = OFFERS.filter((o) => o.status === "ACCEPTED").length;
    const rejected = OFFERS.filter((o) => o.status === "REJECTED").length;
    return { total, pending, accepted, rejected };
  }, []);

  const filtered = useMemo(() => {
    return OFFERS.filter((o) => {
      const matchQ = !q || `${o.loanNumber} ${o.id}`.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || o.status === status;
      return matchQ && matchS;
    });
  }, [q, status]);

  return (
    <div>
      <PageHeader title="Offers" subtitle="Your loan offers across requests" />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total" value={counts.total} accent="blue" />
        <StatCard title="Pending" value={counts.pending} accent="orange" />
        <StatCard title="Accepted" value={counts.accepted} accent="green" />
        <StatCard title="Rejected" value={counts.rejected} accent="pink" />
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
            {filtered.map((o) => (
              <article key={o.id} className="glass-card rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner">
                      {statusIcon(o.status)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{o.loanNumber}</div>
                      <div className="text-xs text-slate-500">Offer {o.id}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(o.status)}`}>{o.status}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Amount</div>
                    <div className="font-semibold">{money(o.amount)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Rate</div>
                    <div className="font-semibold">{o.interestRate}% / mo</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Created</div>
                    <div className="font-semibold">{new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Request</div>
                    <div className="font-semibold">{o.loanRequestId}</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-700">
                  <span className="font-medium">Offer {o.id}</span> on <span className="font-medium">{o.loanNumber}</span> for <span className="font-semibold">{money(o.amount)}</span> at {o.interestRate}%/mo.
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/offers/${encodeURIComponent(o.loanRequestId)}`}>View Request</Link>
                  </Button>
                  {o.status === "PENDING" ? (
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
