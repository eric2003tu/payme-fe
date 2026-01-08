"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type LoanRequest = {
  id: string;
  borrower: string;
  amount: number;
  rate: number; // monthly %
  term: string; // e.g., "12 mo"
  purpose: string;
  createdAt: string; // ISO date
  status: "open" | "funded" | "rejected" | "pending";
};

const SAMPLE: LoanRequest[] = [
  { id: "REQ-0001", borrower: "Amara Okoye", amount: 2500, rate: 5.5, term: "12 mo", purpose: "Working capital", createdAt: "2025-12-10", status: "open" },
  { id: "REQ-0002", borrower: "John Mensah", amount: 8000, rate: 6.2, term: "18 mo", purpose: "Inventory", createdAt: "2025-12-18", status: "funded" },
  { id: "REQ-0003", borrower: "Lydia Mwangi", amount: 1200, rate: 4.8, term: "6 mo", purpose: "Tuition", createdAt: "2025-12-22", status: "pending" },
  { id: "REQ-0004", borrower: "Peter Njoroge", amount: 4200, rate: 5.9, term: "12 mo", purpose: "Equipment", createdAt: "2025-12-29", status: "open" },
  { id: "REQ-0005", borrower: "Sofia Ahmed", amount: 15000, rate: 7.1, term: "24 mo", purpose: "Expansion", createdAt: "2026-01-02", status: "rejected" },
  { id: "REQ-0006", borrower: "Brian Kim", amount: 5000, rate: 5.2, term: "12 mo", purpose: "Vehicle", createdAt: "2026-01-03", status: "open" },
  { id: "REQ-0007", borrower: "Zara Bello", amount: 3400, rate: 5.0, term: "10 mo", purpose: "Marketing", createdAt: "2026-01-04", status: "pending" },
  { id: "REQ-0008", borrower: "Ayo Balogun", amount: 9200, rate: 6.4, term: "18 mo", purpose: "Renovation", createdAt: "2026-01-04", status: "funded" },
  { id: "REQ-0009", borrower: "Grace Tendo", amount: 2700, rate: 5.3, term: "12 mo", purpose: "Medical", createdAt: "2026-01-05", status: "open" },
  { id: "REQ-0010", borrower: "Carlos M.", amount: 3000, rate: 5.7, term: "9 mo", purpose: "Bridge", createdAt: "2026-01-05", status: "open" },
  { id: "REQ-0011", borrower: "Fatima S.", amount: 11000, rate: 6.8, term: "20 mo", purpose: "New branch", createdAt: "2026-01-06", status: "funded" },
  { id: "REQ-0012", borrower: "David Park", amount: 1800, rate: 4.9, term: "6 mo", purpose: "Supplies", createdAt: "2026-01-06", status: "rejected" },
];

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function StatusBadge({ s }: { s: LoanRequest["status"] }) {
  const map: Record<LoanRequest["status"], string> = {
    open: "text-blue bg-blue/10",
    funded: "text-emerald-600 bg-emerald-100",
    rejected: "text-rose-600 bg-rose-100",
    pending: "text-amber-600 bg-amber-100",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[s]}`}>{s}</span>;
}

export default function LoanRequestsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const { isAdmin } = useAuth();

  const filtered = useMemo(() => {
    const effectiveStatus = isAdmin ? status : "open";
    return SAMPLE.filter((x) => {
      const matchQ = !q || `${x.id} ${x.borrower} ${x.purpose}`.toLowerCase().includes(q.toLowerCase());
      const matchS = effectiveStatus === "all" || x.status === effectiveStatus;
      return matchQ && matchS;
    });
  }, [q, status, isAdmin]);

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
            {filtered.map((r) => (
              <article key={r.id} className="glass-card rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue to-pink text-white text-sm font-semibold">
                      {r.borrower.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{r.borrower}</div>
                      <div className="text-xs text-slate-500">{r.id}</div>
                    </div>
                  </div>
                  <StatusBadge s={r.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Amount</div>
                    <div className="font-semibold">{formatMoney(r.amount)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Rate</div>
                    <div className="font-semibold">{r.rate}% / mo</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Term</div>
                    <div className="font-semibold">{r.term}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Created</div>
                    <div className="font-semibold">{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-700">
                  <span className="font-medium">{r.borrower}</span> wants a loan of <span className="font-semibold">{formatMoney(r.amount)}</span> to use for {r.purpose.toLowerCase()}.
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
