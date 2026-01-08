"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaClock, FaBolt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

type LoanResponseDto = {
  id: string;
  loanNumber: string;
  borrowerId: string;
  lenderId: string;
  amount: number;
  interestRate: number; // percent per month
  durationDays: number;
  purpose?: string;
  disbursedAt?: string;
  dueDate?: string;
  repaidAt?: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: string; // e.g., PENDING | ACTIVE | REPAID | LATE
  isLate: boolean;
  lateDays: number;
  penaltyAmount: number;
  agreementUrl?: string;
  signedByBorrower: boolean;
  signedByLender: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

const SAMPLE: LoanResponseDto[] = [
  {
    id: "loan-id-1001",
    loanNumber: "LN-2026-0001",
    borrowerId: "borrower-id-123",
    lenderId: "lender-id-789",
    amount: 1000,
    interestRate: 6.0,
    durationDays: 30,
    purpose: "Personal loan for school fees",
    disbursedAt: "2026-01-06T12:00:00.000Z",
    dueDate: "2026-02-06T12:00:00.000Z",
    repaidAt: undefined,
    totalAmount: 1060,
    amountPaid: 200,
    amountDue: 860,
    status: "ACTIVE",
    isLate: false,
    lateDays: 0,
    penaltyAmount: 0,
    agreementUrl: "https://example.com/agreement-1001.pdf",
    signedByBorrower: true,
    signedByLender: true,
    isDeleted: false,
    createdAt: "2026-01-06T12:00:00.000Z",
    updatedAt: "2026-01-10T08:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "loan-id-1002",
    loanNumber: "LN-2026-0002",
    borrowerId: "borrower-id-555",
    lenderId: "lender-id-123",
    amount: 2500,
    interestRate: 5.5,
    durationDays: 60,
    purpose: "SME working capital",
    disbursedAt: "2026-01-02T10:00:00.000Z",
    dueDate: "2026-03-02T10:00:00.000Z",
    repaidAt: undefined,
    totalAmount: 2587,
    amountPaid: 2587,
    amountDue: 0,
    status: "REPAID",
    isLate: false,
    lateDays: 0,
    penaltyAmount: 0,
    agreementUrl: "https://example.com/agreement-1002.pdf",
    signedByBorrower: true,
    signedByLender: true,
    isDeleted: false,
    createdAt: "2025-12-28T14:00:00.000Z",
    updatedAt: "2026-02-28T11:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "loan-id-1003",
    loanNumber: "LN-2026-0003",
    borrowerId: "borrower-id-999",
    lenderId: "lender-id-124",
    amount: 4200,
    interestRate: 6.3,
    durationDays: 90,
    purpose: "Business expansion",
    disbursedAt: "2026-01-01T09:00:00.000Z",
    dueDate: "2026-04-01T09:00:00.000Z",
    repaidAt: undefined,
    totalAmount: 4446,
    amountPaid: 1000,
    amountDue: 3446,
    status: "PENDING",
    isLate: false,
    lateDays: 0,
    penaltyAmount: 0,
    agreementUrl: "https://example.com/agreement-1003.pdf",
    signedByBorrower: false,
    signedByLender: true,
    isDeleted: false,
    createdAt: "2025-12-26T12:00:00.000Z",
    updatedAt: "2026-01-03T12:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "loan-id-1004",
    loanNumber: "LN-2026-0004",
    borrowerId: "borrower-id-321",
    lenderId: "lender-id-999",
    amount: 1600,
    interestRate: 6.0,
    durationDays: 30,
    purpose: "Bridge cash flow",
    disbursedAt: "2025-12-20T12:00:00.000Z",
    dueDate: "2026-01-20T12:00:00.000Z",
    repaidAt: undefined,
    totalAmount: 1696,
    amountPaid: 300,
    amountDue: 1396,
    status: "LATE",
    isLate: true,
    lateDays: 5,
    penaltyAmount: 45,
    agreementUrl: "https://example.com/agreement-1004.pdf",
    signedByBorrower: true,
    signedByLender: true,
    isDeleted: false,
    createdAt: "2025-12-18T12:00:00.000Z",
    updatedAt: "2026-01-25T08:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "loan-id-1005",
    loanNumber: "LN-2026-0005",
    borrowerId: "borrower-id-888",
    lenderId: "lender-id-777",
    amount: 900,
    interestRate: 4.9,
    durationDays: 30,
    purpose: "Medical bill",
    disbursedAt: "2026-01-05T12:00:00.000Z",
    dueDate: "2026-02-05T12:00:00.000Z",
    repaidAt: undefined,
    totalAmount: 944,
    amountPaid: 0,
    amountDue: 944,
    status: "ACTIVE",
    isLate: false,
    lateDays: 0,
    penaltyAmount: 0,
    agreementUrl: "https://example.com/agreement-1005.pdf",
    signedByBorrower: true,
    signedByLender: false,
    isDeleted: false,
    createdAt: "2026-01-05T12:00:00.000Z",
    updatedAt: "2026-01-06T12:00:00.000Z",
    deletedAt: null,
  },
];

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function dateStr(s?: string) {
  return s ? new Date(s).toLocaleDateString() : "—";
}

type MyLoanStatus = "PENDING" | "ACTIVE" | "REPAID" | "LATE";

function statusIcon(status: MyLoanStatus) {
  switch (status) {
    case "PENDING":
      return <FaClock className="h-4 w-4 text-amber-700" />;
    case "ACTIVE":
      return <FaBolt className="h-4 w-4 text-blue" />;
    case "REPAID":
      return <FaCheckCircle className="h-4 w-4 text-emerald-600" />;
    case "LATE":
      return <FaExclamationTriangle className="h-4 w-4 text-rose-600" />;
  }
}

function StatusBadge({ status }: { status: MyLoanStatus }) {
  const map: Record<MyLoanStatus, string> = {
    PENDING: "text-amber-700 bg-amber-100",
    ACTIVE: "text-blue bg-blue/10",
    REPAID: "text-emerald-600 bg-emerald-100",
    LATE: "text-rose-600 bg-rose-100",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${map[status]}`}>
      {statusIcon(status)}
      <span>{status}</span>
    </span>
  );
}

export default function MyLoansPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<MyLoanStatus | "all">("all");

  const counts = useMemo(() => {
    const total = SAMPLE.length;
    const active = SAMPLE.filter((l) => l.status === "ACTIVE").length;
    const late = SAMPLE.filter((l) => l.status === "LATE").length;
    const repaid = SAMPLE.filter((l) => l.status === "REPAID").length;
    const dueSum = SAMPLE.filter((l) => l.status !== "REPAID").reduce((acc, l) => acc + l.amountDue, 0);
    return { total, active, late, repaid, dueSum };
  }, []);

  const filtered = useMemo(() => {
    return SAMPLE.filter((l) => {
      const matchQ = !q || `${l.loanNumber} ${l.purpose ?? ""}`.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || l.status === status;
      return matchQ && matchS;
    });
  }, [q, status]);

  return (
    <div>
      <PageHeader title="My Loans" subtitle="Loans you borrowed or lent" />

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard title="Total" value={counts.total} accent="blue" />
        <StatCard title="Active" value={counts.active} accent="pink" />
        <StatCard title="Late" value={counts.late} accent="orange" />
        <StatCard title="Repaid" value={counts.repaid} accent="green" />
        <StatCard title="Amount Due" value={money(counts.dueSum)} accent="orange" />
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by loan # or purpose" className="w-64" />
              <select
                className="h-9 rounded-md border bg-white px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as MyLoanStatus | "all")}
              >
                <option value="all">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="LATE">Late</option>
                <option value="REPAID">Repaid</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setQ(""); setStatus("all"); }}>Reset</Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-slate-500">No loans match your filters.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((l) => (
                <article key={l.id} className="glass-card rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner">
                        {statusIcon(l.status as MyLoanStatus)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{l.loanNumber}</div>
                        <div className="text-xs text-slate-500">Lender: {l.lenderId}</div>
                      </div>
                    </div>
                    <StatusBadge status={l.status as MyLoanStatus} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Amount</div>
                      <div className="font-semibold">{money(l.amount)}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Rate</div>
                      <div className="font-semibold">{l.interestRate}% / mo</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Duration</div>
                      <div className="font-semibold">{l.durationDays} days</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Due</div>
                      <div className="font-semibold">{money(l.amountDue)}</div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-slate-700">
                    <span className="font-medium">{l.loanNumber}</span> is {l.status.toLowerCase()} — due {dateStr(l.dueDate)}.
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
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
