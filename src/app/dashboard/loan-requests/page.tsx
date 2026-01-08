"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { loanRequestClient } from "@/lib/loanRequestClient";
import type { LoanRequestResponseDto } from "@/lib/loanRequestClient";
import { toast } from "sonner";

type RequestStatus = "OPEN" | "FUNDED" | "PARTIAL" | "CANCELLED" | "EXPIRED";

const toNum = (x: any): number => {
  if (x == null) return 0;
  const n = typeof x === "string" ? Number(x) : x;
  return Number.isFinite(n) ? n : 0;
};

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function StatusBadge({ s }: { s: RequestStatus }) {
  const map: Record<RequestStatus, string> = {
    OPEN: "text-blue bg-blue/10",
    FUNDED: "text-emerald-600 bg-emerald-100",
    PARTIAL: "text-amber-700 bg-amber-100",
    CANCELLED: "text-rose-600 bg-rose-100",
    EXPIRED: "text-slate-700 bg-slate-100",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[s]}`}>{s}</span>;
}

export default function LoanRequestsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<RequestStatus | "all">("all");
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<LoanRequestResponseDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await loanRequestClient.list();
        if (mounted) setItems(data || []);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load loan requests");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const effectiveStatus = isAdmin ? status : "OPEN";
    return items.filter((x) => {
      const matchQ = !q || `${x.id} ${x.loanNumber ?? ""} ${x.borrowerId} ${x.purpose ?? ""}`.toLowerCase().includes(q.toLowerCase());
      const matchS = effectiveStatus === "all" || (x.status?.toUpperCase() as RequestStatus) === effectiveStatus;
      return matchQ && matchS;
    });
  }, [items, q, status, isAdmin]);

  return (
    <div>
      <PageHeader title="Loan Requests" subtitle="Browse all requests currently in the system" />

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, borrower, purpose" className="w-64" />
              {isAdmin ? (
                <select
                  className="h-9 rounded-md border bg-white px-3 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="funded">Funded</option>
                  <option value="rejected">Rejected</option>
                </select>
              ) : (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Open only</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/request-loan">New Request</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setQ(""); setStatus("all"); }}>Reset</Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              <div className="px-3 py-6 text-center text-slate-500">Loading loan requests…</div>
            ) : filtered.map((r) => (
              <article key={r.id} className="glass-card rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue to-pink text-white text-sm font-semibold">
                      {(r.loanNumber ?? r.id).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{r.loanNumber ?? r.id}</div>
                      <div className="text-xs text-slate-500">Borrower: {r.borrowerId}</div>
                    </div>
                  </div>
                  <StatusBadge s={(r.status?.toUpperCase() as RequestStatus) ?? "OPEN"} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Amount</div>
                    <div className="font-semibold">{formatMoney(toNum(r.amount))}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Rate</div>
                    <div className="font-semibold">{toNum(r.interestRate)}% / mo</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Term</div>
                    <div className="font-semibold">{toNum(r.durationDays)} days</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Created</div>
                    <div className="font-semibold">{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-700">
                  Request <span className="font-medium">{r.loanNumber ?? r.id}</span> for <span className="font-semibold">{formatMoney(toNum(r.amount))}</span>{r.purpose ? ` — ${r.purpose}` : ""}.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/loan-requests/${encodeURIComponent(r.id)}`}>View</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/loan-requests/${encodeURIComponent(r.id)}/offer-loan`}>Offer Loan</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
