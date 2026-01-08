"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type RequestStatus = "OPEN" | "PARTIAL" | "CLOSED";

type MyRequest = {
  id: string;
  loanNumber: string;
  amount: number;
  minAmount?: number;
  funded: number;
  interestRate: number; // % per month
  durationDays: number;
  purpose?: string;
  status: RequestStatus;
  createdAt: string;
  expiresAt?: string;
};

const SEED: MyRequest[] = [
  { id: "RQ-101", loanNumber: "LR-2026-0101", amount: 5000, minAmount: 1200, funded: 3200, interestRate: 5.8, durationDays: 60, purpose: "Working capital", status: "OPEN", createdAt: "2026-01-03", expiresAt: "2026-01-20" },
  { id: "RQ-102", loanNumber: "LR-2026-0102", amount: 2800, funded: 2800, interestRate: 6.1, durationDays: 45, purpose: "Inventory", status: "CLOSED", createdAt: "2026-01-01", expiresAt: "2026-01-10" },
  { id: "RQ-103", loanNumber: "LR-2026-0103", amount: 4200, minAmount: 1000, funded: 1800, interestRate: 6.0, durationDays: 90, purpose: "Expansion", status: "PARTIAL", createdAt: "2026-01-05", expiresAt: "2026-01-25" },
  { id: "RQ-104", loanNumber: "LR-2026-0104", amount: 1500, funded: 0, interestRate: 5.9, durationDays: 30, purpose: "Bridge", status: "OPEN", createdAt: "2026-01-07", expiresAt: "2026-01-21" },
];

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function badgeClass(status: RequestStatus) {
  switch (status) {
    case "OPEN":
      return "text-blue bg-blue/10";
    case "PARTIAL":
      return "text-amber-700 bg-amber-100";
    case "CLOSED":
      return "text-emerald-600 bg-emerald-100";
  }
}

export default function MyRequestsPage() {
  const [items, setItems] = useState<MyRequest[]>(SEED);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<RequestStatus | "all">("all");
  const [showNew, setShowNew] = useState(false);

  const counts = useMemo(() => {
    const total = items.length;
    const open = items.filter((r) => r.status === "OPEN").length;
    const partial = items.filter((r) => r.status === "PARTIAL").length;
    const closed = items.filter((r) => r.status === "CLOSED").length;
    const raised = items.reduce((a, r) => a + r.funded, 0);
    return { total, open, partial, closed, raised };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const matchQ = !q || `${r.loanNumber} ${r.purpose ?? ""}`.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    });
  }, [items, q, status]);

  return (
    <div>
      <PageHeader
        title="My Requests"
        subtitle="Create and manage your loan requests"
        actions={
          <Button size="sm" onClick={() => setShowNew(true)}>Add New Request</Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard title="Total" value={counts.total} accent="blue" />
        <StatCard title="Open" value={counts.open} accent="pink" />
        <StatCard title="Partial" value={counts.partial} accent="orange" />
        <StatCard title="Closed" value={counts.closed} accent="green" />
        <StatCard title="Raised" value={money(counts.raised)} accent="blue" />
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by request # or purpose" className="w-64" />
              <select
                className="h-9 rounded-md border bg-white px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as RequestStatus | "all")}
              >
                <option value="all">All statuses</option>
                <option value="OPEN">Open</option>
                <option value="PARTIAL">Partial</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setQ(""); setStatus("all"); }}>Reset</Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-slate-500">No requests match your filters.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((r) => (
                <article key={r.id} className="glass-card rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{r.loanNumber}</div>
                      <div className="text-xs text-slate-500">Created {new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(r.status)}`}>{r.status}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Amount</div>
                      <div className="font-semibold">{money(r.amount)}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Funded</div>
                      <div className="font-semibold">{money(r.funded)}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Rate</div>
                      <div className="font-semibold">{r.interestRate}% / mo</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Duration</div>
                      <div className="font-semibold">{r.durationDays} days</div>
                    </div>
                  </div>

                  {r.purpose && (
                    <div className="mt-3 text-sm text-slate-700 line-clamp-2">{r.purpose}</div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-slate-500">{r.expiresAt ? `Expires ${new Date(r.expiresAt).toLocaleDateString()}` : "No deadline"}</div>
                    <Button asChild size="sm" variant="outline">
                      <a href={`/dashboard/my-requests/${encodeURIComponent(r.id)}`}>View</a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showNew && <NewRequestModal onClose={() => setShowNew(false)} onCreate={(req) => { setItems((prev) => [{...req, id: `RQ-${(prev.length+101).toString()}`, loanNumber: `LR-2026-${(prev.length+1101).toString().padStart(4, "0")}`, funded: 0, status: "OPEN", createdAt: new Date().toISOString()}, ...prev]); setShowNew(false); }} />}
    </div>
  );
}

function NewRequestModal({ onClose, onCreate }: { onClose: () => void; onCreate: (r: Omit<MyRequest, "id"|"loanNumber"|"funded"|"status"|"createdAt">) => void }) {
  const [amount, setAmount] = useState<number | "">(1000);
  const [minAmount, setMinAmount] = useState<number | "">(250);
  const [interestRate, setInterestRate] = useState<number | "">(6.0);
  const [durationDays, setDurationDays] = useState<number | "">(30);
  const [purpose, setPurpose] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>("");

  const submit = () => {
    if (amount === "" || durationDays === "" || interestRate === "") return;
    onCreate({ amount: Number(amount), minAmount: minAmount === "" ? undefined : Number(minAmount), interestRate: Number(interestRate), durationDays: Number(durationDays), purpose: purpose || undefined, createdAt: new Date().toISOString(), expiresAt: expiresAt || undefined } as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl border bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">New Loan Request</div>
          <button className="text-sm text-slate-500 hover:text-slate-700" onClick={onClose}>Close</button>
        </div>
        <div className="mt-4 grid gap-3">
          <div>
            <label className="text-sm">Amount</label>
            <Input type="number" className="mt-1" value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm">Minimum Amount</label>
            <Input type="number" className="mt-1" value={minAmount} onChange={(e) => setMinAmount(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Interest Rate (%)</label>
              <Input type="number" className="mt-1" value={interestRate} onChange={(e) => setInterestRate(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm">Duration (days)</label>
              <Input type="number" className="mt-1" value={durationDays} onChange={(e) => setDurationDays(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="text-sm">Purpose</label>
            <Textarea className="mt-1" rows={4} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Funding Deadline</label>
            <Input type="date" className="mt-1" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Create</Button>
        </div>
      </div>
    </div>
  );
}
