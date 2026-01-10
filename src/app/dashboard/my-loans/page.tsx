"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { loanClient, LoanDto } from "@/lib/loanClient";
import { LoanStatus } from "@/lib/types";
import { FaUserTie, FaUser, FaClock, FaBolt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { BarChart3, Activity, AlertTriangle, CheckCircle2, CircleDollarSign, Banknote } from "lucide-react";
import Link from "next/link";

type ViewMode = "borrower" | "lender";

function toNumber(n: number | string | undefined | null): number {
  if (n === undefined || n === null) return 0;
  if (typeof n === "number") return n;
  const parsed = parseFloat(n);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function dateStr(s?: string | null) {
  return s ? new Date(s).toLocaleDateString() : "—";
}

function statusIcon(status: string) {
  const s = status.toUpperCase();
  switch (s) {
    case "PENDING":
      return <FaClock className="h-4 w-4 text-amber-700" />;
    case "ACTIVE":
      return <FaBolt className="h-4 w-4 text-blue" />;
    case "REPAID":
      return <FaCheckCircle className="h-4 w-4 text-emerald-600" />;
    case "OVERDUE":
    case "DEFAULTED":
      return <FaExclamationTriangle className="h-4 w-4 text-rose-600" />;
    case "PAYMENT_INITIATED":
      return <FaClock className="h-4 w-4 text-indigo-600" />;
    default:
      return <FaClock className="h-4 w-4 text-slate-500" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const map: Record<string, string> = {
    PENDING: "text-amber-700 bg-amber-100",
    ACTIVE: "text-blue bg-blue/10",
    REPAID: "text-emerald-600 bg-emerald-100",
    OVERDUE: "text-rose-600 bg-rose-100",
    DEFAULTED: "text-rose-700 bg-rose-100",
    CANCELLED: "text-slate-600 bg-slate-100",
    PAYMENT_INITIATED: "text-indigo-600 bg-indigo-100",
  };
  const cl = map[s] || "text-slate-600 bg-slate-100";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cl}`}>
      {statusIcon(s)}
      <span>{s}</span>
    </span>
  );
}

export default function MyTransactionsPage() {
  const [view, setView] = useState<ViewMode>("borrower");
  const [borrowed, setBorrowed] = useState<LoanDto[]>([]);
  const [lent, setLent] = useState<LoanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<LoanStatus | "all">("all");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([loanClient.meBorrowed(), loanClient.meLent()])
      .then(([b, l]) => {
        if (!mounted) return;
        setBorrowed(b || []);
        setLent(l || []);
      })
      .catch(() => void 0)
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const current = view === "borrower" ? borrowed : lent;

  const stats = useMemo(() => {
    const total = current.length;
    const active = current.filter((l) => (l.status || "").toUpperCase() === "ACTIVE").length;
    const overdue = current.filter((l) => (l.status || "").toUpperCase() === "OVERDUE").length;
    const repaid = current.filter((l) => (l.status || "").toUpperCase() === "REPAID").length;
    const amountDue = current.reduce((acc, l) => acc + toNumber(l.amountDue), 0);
    const totalVol = current.reduce((acc, l) => acc + toNumber(l.totalAmount), 0);
    return { total, active, overdue, repaid, amountDue, totalVol };
  }, [current]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingLoanId, setSigningLoanId] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return current.filter((l) => {
      const matchQ = !q || `${l.loanNumber} ${l.purpose ?? ""}`.toLowerCase().includes(q.toLowerCase());
      const s = (l.status || "").toUpperCase();
      const matchS = status === "all" || s === status;
      return matchQ && matchS;
    });
  }, [current, q, status]);

  return (
    <div>
      <PageHeader
        title="My Transactions"
        subtitle="View loans you borrowed and loans you lent"
        actions={(
          <div className="flex gap-2">
            <Button
              variant={view === "borrower" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("borrower")}
            >
              <FaUser className="mr-1" /> View as Borrower
            </Button>
            <Button
              variant={view === "lender" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("lender")}
            >
              <FaUserTie className="mr-1" /> View as Lender
            </Button>
          </div>
        )}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total" value={stats.total} accent="blue" icon={<BarChart3 size={18} />} />
        <StatCard title="Active" value={stats.active} accent="pink" icon={<Activity size={18} />} />
        <StatCard title="Overdue" value={stats.overdue} accent="orange" icon={<AlertTriangle size={18} />} />
        <StatCard title="Repaid" value={stats.repaid} accent="green" icon={<CheckCircle2 size={18} />} />
        <StatCard title="Amount Due" value={money(stats.amountDue)} accent="orange" icon={<CircleDollarSign size={18} />} />
        <StatCard title="Total Volume" value={money(stats.totalVol)} accent="blue" icon={<Banknote size={18} />} />
      </div>

      <Card className="mt-6">
        <CardHeader className="border-b">
          <CardTitle>Transactions — {view === "borrower" ? "Borrowed" : "Lent"}</CardTitle>
          <CardDescription>Filter and inspect your loan transactions.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by loan # or purpose" className="w-64" />
              <select
                className="h-9 rounded-md border bg-white px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as LoanStatus | "all")}
              >
                <option value="all">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="PAYMENT_INITIATED">Payment Initiated</option>
                <option value="OVERDUE">Overdue</option>
                <option value="REPAID">Repaid</option>
                <option value="DEFAULTED">Defaulted</option>
                <option value="CANCELLED">Cancelled</option>
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
            <div className="px-3 py-6 text-center text-slate-500">No transactions match your filters.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((l) => (
                <article key={l.id} className="glass-card rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner">
                        {statusIcon(String(l.status || ""))}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{l.loanNumber}</div>
                        {view === "borrower" ? (
                          <div className="text-xs text-slate-500">Lender: {l.lender?.firstName} {l.lender?.lastName || l.lenderId}</div>
                        ) : (
                          <div className="text-xs text-slate-500">Borrower: {l.borrower?.firstName} {l.borrower?.lastName || l.borrowerId}</div>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={String(l.status || "")} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Amount</div>
                      <div className="font-semibold">{money(toNumber(l.amount))}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Rate</div>
                      <div className="font-semibold">{toNumber(l.interestRate)}% / mo</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Duration</div>
                      <div className="font-semibold">{l.durationDays} days</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Due</div>
                      <div className="font-semibold">{money(toNumber(l.amountDue))}</div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-slate-700">
                    <span className="font-medium">{l.loanNumber}</span> is {(l.status || "").toString().toLowerCase()} — due {dateStr(l.dueDate)}.
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-500">Disbursed {dateStr(l.disbursedAt)}</div>
                    {l.agreementUrl ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={l.agreementUrl} target="_blank" rel="noreferrer">Agreement</a>
                      </Button>
                    ) : (
                      <div className="text-xs text-slate-400">No agreement</div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/my-transactions/${l.id}`}>View</Link>
                    </Button>
                    {/* Borrower pay button for non-pending loans */}
                    {view === "borrower" && String(l.status).toUpperCase() !== "PENDING" && String(l.status).toUpperCase() !== "REPAID" && !l.repaidAt && (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={signing && signingLoanId === l.id}
                        onClick={() => { setSigningLoanId(l.id); setConfirmOpen(true); }}
                      >
                        Mark as Paid
                      </Button>
                    )}
                    {/* Lender sign button for pending loans */}
                    {view === "lender" && String(l.status).toUpperCase() === "PENDING" && !l.signedByLender && (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={signing && signingLoanId === l.id}
                        onClick={() => { setSigningLoanId(l.id); setConfirmOpen(true); }}
                      >
                        Sign & Offer Loan
                      </Button>
                    )}
                    {/* Lender confirm payment button only for PAYMENT_INITIATED status */}
                    {view === "lender" && String(l.status).toUpperCase() === "PAYMENT_INITIATED" && !l.repaidAt && (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={signing && signingLoanId === l.id}
                        onClick={() => { setSigningLoanId(l.id); setConfirmOpen(true); }}
                      >
                        Confirm Payment Received
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Confirmation dialog for lender sign or borrower pay */}
      <ConfirmDialog
        open={confirmOpen}
        title={
          view === "lender"
            ? (signingLoanId && current.find(l => l.id === signingLoanId && String(l.status).toUpperCase() !== "PENDING" && String(l.status).toUpperCase() !== "REPAID" && !l.repaidAt)
                ? "Confirm Payment Received" : "Sign & Offer Loan")
            : "Mark Loan as Paid"
        }
        description={
          view === "lender"
            ? (signingLoanId && current.find(l => l.id === signingLoanId && String(l.status).toUpperCase() !== "PENDING" && String(l.status).toUpperCase() !== "REPAID" && !l.repaidAt)
                ? "Are you sure you want to confirm you have received payment for this loan? This will mark the loan as repaid."
                : "Are you sure you want to sign and offer this loan? This action cannot be undone.")
            : "Are you sure you have paid this loan? This will notify the lender for confirmation."
        }
        confirmText={
          signing
            ? (view === "lender"
                ? (signingLoanId && current.find(l => l.id === signingLoanId && String(l.status).toUpperCase() !== "PENDING" && String(l.status).toUpperCase() !== "REPAID" && !l.repaidAt)
                    ? "Confirming..." : "Signing...")
                : "Marking...")
            : (view === "lender"
                ? (signingLoanId && current.find(l => l.id === signingLoanId && String(l.status).toUpperCase() !== "PENDING" && String(l.status).toUpperCase() !== "REPAID" && !l.repaidAt)
                    ? "Yes, Confirm Payment" : "Yes, Sign & Offer")
                : "Yes, I Have Paid")
        }
        cancelText="Cancel"
        onCancel={() => { setConfirmOpen(false); setSigningLoanId(null); setError(null); }}
        onConfirm={async () => {
          if (!signingLoanId) return;
          setSigning(true);
          setError(null);
          try {
            if (view === "lender") {
              const loan = current.find(l => l.id === signingLoanId);
              if (loan && String(loan.status).toUpperCase() === "PAYMENT_INITIATED" && !loan.repaidAt) {
                await loanClient.confirmPaymentByLender(signingLoanId);
              } else if (loan && String(loan.status).toUpperCase() === "PENDING" && !loan.signedByLender) {
                await loanClient.signByLender(signingLoanId);
              } else {
                throw new Error("Action not allowed for this loan status.");
              }
            } else {
              await loanClient.markPaidByBorrower(signingLoanId);
            }
            setConfirmOpen(false);
            setSigningLoanId(null);
            // Optionally, refresh the list
            setLoading(true);
            const [b, l] = await Promise.all([loanClient.meBorrowed(), loanClient.meLent()]);
            setBorrowed(b || []);
            setLent(l || []);
          } catch (e: any) {
            setError(e?.message || (view === "lender" ? "Failed to sign/confirm loan" : "Failed to mark as paid"));
          } finally {
            setSigning(false);
          }
        }}
      />
      {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
    </div>
  );
}
