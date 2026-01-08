"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { loanRequestClient } from "@/lib/loanRequestClient";
import { toast } from "sonner";

type RequestStatus = "OPEN" | "FUNDED" | "PARTIAL" | "CANCELLED" | "EXPIRED";

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

// Remote data will be fetched from /loan-request/me
const SEED: MyRequest[] = [];

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function badgeClass(status: RequestStatus) {
  switch (status) {
    case "OPEN":
      return "text-blue bg-blue/10";
    case "FUNDED":
      return "text-emerald-600 bg-emerald-100";
    case "PARTIAL":
      return "text-amber-700 bg-amber-100";
    case "CANCELLED":
      return "text-rose-600 bg-rose-100";
    case "EXPIRED":
      return "text-slate-700 bg-slate-100";
  }
}

export default function MyRequestsPage() {
  const [items, setItems] = useState<MyRequest[]>(SEED);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<RequestStatus | "all">("all");
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  // Map backend statuses to local UI statuses
  const mapStatus = (s: string): RequestStatus => {
    const v = (s || "OPEN").toUpperCase();
    if (v === "OPEN" || v === "FUNDED" || v === "PARTIAL" || v === "CANCELLED" || v === "EXPIRED") {
      return v as RequestStatus;
    }
    return "OPEN";
  };

  const num = (x: any): number => {
    if (x == null) return 0;
    const n = typeof x === "string" ? Number(x) : x;
    return Number.isFinite(n) ? n : 0;
  };

  // Fetch my loan requests
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await loanRequestClient.mine();
        const mapped: MyRequest[] = (data || []).map((d: any) => ({
          id: d.id,
          loanNumber: d.loanNumber || d.id,
          amount: num(d.amount),
          minAmount: d.minAmount != null ? num(d.minAmount) : undefined,
          funded: num(d.amountFunded),
          interestRate: num(d.interestRate),
          durationDays: num(d.durationDays),
          purpose: d.purpose || undefined,
          status: mapStatus(d.status),
          createdAt: d.createdAt || new Date().toISOString(),
          expiresAt: d.expiresAt || d.fundingDeadline || undefined,
        }));
        setItems(mapped);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load your requests");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    const total = items.length;
    const open = items.filter((r) => r.status === "OPEN").length;
    const funded = items.filter((r) => r.status === "FUNDED").length;
    const partial = items.filter((r) => r.status === "PARTIAL").length;
    const cancelled = items.filter((r) => r.status === "CANCELLED").length;
    const expired = items.filter((r) => r.status === "EXPIRED").length;
    const raised = items.reduce((a, r) => a + r.funded, 0);
    return { total, open, funded, partial, cancelled, expired, raised };
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

      <div className="grid gap-4 md:grid-cols-7">
        <StatCard title="Total" value={counts.total} accent="blue" />
        <StatCard title="Open" value={counts.open} accent="pink" />
        <StatCard title="Funded" value={counts.funded} accent="green" />
        <StatCard title="Partial" value={counts.partial} accent="orange" />
        <StatCard title="Cancelled" value={counts.cancelled} accent="pink" />
        <StatCard title="Expired" value={counts.expired} accent="blue" />
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
                <option value="FUNDED">Funded</option>
                <option value="PARTIAL">Partial</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setQ(""); setStatus("all"); }}>Reset</Button>
            </div>
          </div>

          {loading ? (
            <div className="px-3 py-6 text-center text-slate-500">Loading your requests…</div>
          ) : filtered.length === 0 ? (
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

      {showNew && <NewRequestModal onClose={() => setShowNew(false)} onCreated={(created) => {
        // Optimistically add the created request to local list
        setItems((prev) => [{
          id: created.id,
          loanNumber: created.loanNumber ?? created.id,
          amount: created.amount,
          minAmount: created.minAmount,
          funded: created.amountFunded ?? 0,
          interestRate: created.interestRate,
          durationDays: created.durationDays,
          purpose: created.purpose,
          status: mapStatus(created.status as any),
          createdAt: created.createdAt,
          expiresAt: created.expiresAt,
        }, ...prev]);
        setShowNew(false);
      }} />}
    </div>
  );
}

function NewRequestModal({ onClose, onCreated }: { onClose: () => void; onCreated: (created: any) => void }) {
  const [amount, setAmount] = useState<number | "">(1000);
  const [minAmount, setMinAmount] = useState<number | "">(250);
  const [interestRate, setInterestRate] = useState<number | "">(6.0);
  const [durationDays, setDurationDays] = useState<number | "">(30);
  const [purpose, setPurpose] = useState("");
  const [fundingDeadline, setFundingDeadline] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [maxLenders, setMaxLenders] = useState<number | "">(1);
  const [submitting, setSubmitting] = useState(false);

  const toIsoMidday = (d?: string): string | undefined => {
    if (!d) return undefined;
    return `${d}T12:00:00.000Z`;
  };

  const submit = async () => {
    if (amount === "" || durationDays === "" || interestRate === "") return;
    setSubmitting(true);
    try {
      const payload = {
        amount: Number(amount),
        minAmount: minAmount === "" ? undefined : Number(minAmount),
        interestRate: Number(interestRate),
        durationDays: Number(durationDays),
        purpose: purpose || undefined,
        isPublic,
        maxLenders: maxLenders === "" ? undefined : Number(maxLenders),
        fundingDeadline: toIsoMidday(fundingDeadline),
        // Some backends use expiresAt; send both when present
        expiresAt: toIsoMidday(fundingDeadline),
      };
      const created = await loanRequestClient.create(payload);
      toast.success("Loan request created");
      onCreated(created);
    } catch (err: any) {
      const msg = err?.message || "Failed to create request";
      // Specific case: documents not verified
      if (typeof err?.details === "object" && err?.status === 400) {
        toast.error("User documents not verified");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Funding Deadline</label>
              <Input type="date" className="mt-1" value={fundingDeadline} onChange={(e) => setFundingDeadline(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Max Lenders</label>
              <Input type="number" className="mt-1" value={maxLenders} onChange={(e) => setMaxLenders(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <label htmlFor="isPublic" className="text-sm">Public request</label>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={submitting}>{submitting ? "Creating..." : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}
