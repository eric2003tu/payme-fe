import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type LoanRequestResponseDto = {
  id: string;
  borrowerId: string;
  amount: number;
  minAmount?: number;
  interestRate: number;
  durationDays: number;
  purpose?: string;
  amountFunded: number;
  amountNeeded: number;
  status: string; // e.g., OPEN
  fundingDeadline?: string; // ISO
  isPublic: boolean;
  maxLenders: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
};

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function fmtDate(s?: string) {
  return s ? new Date(s).toLocaleString() : "—";
}

function badgeClass(status: string) {
  const s = status.toUpperCase();
  if (s === "OPEN") return "text-blue bg-blue/10";
  if (s === "FUNDED") return "text-emerald-600 bg-emerald-100";
  if (s === "REJECTED") return "text-rose-600 bg-rose-100";
  if (s === "PENDING") return "text-amber-600 bg-amber-100";
  return "text-slate-700 bg-slate-100";
}

function sampleById(id?: string): LoanRequestResponseDto {
  // Simple deterministic sample seeded by id length/digits
  const safe = (id ?? "").toString();
  const digits = Array.from(safe).filter((c) => /\d/.test(c)).map(Number);
  const base = digits.reduce((a, b) => a + b, 0) || 7;
  const amount = 1000 + base * 150;
  const interestRate = 4 + (base % 5) + 0.5;
  const durationDays = 30 * (6 + (base % 13));
  const funded = Math.round(amount * ((base % 6) / 10));
  const needed = Math.max(amount - funded, 0);
  const now = new Date();
  const created = new Date(now.getTime() - 1000 * 60 * 60 * 24 * (7 + (base % 20)));
  const updated = new Date(created.getTime() + 1000 * 60 * 60 * (12 + (base % 48)));
  const deadline = new Date(now.getTime() + 1000 * 60 * 60 * 24 * (5 + (base % 12)));
  const status = needed > 0 ? "OPEN" : "FUNDED";
  return {
    id: safe || "loan-request-unknown",
    borrowerId: `borrower-${base}`,
    amount,
    minAmount: Math.round(amount * 0.25),
    interestRate,
    durationDays,
    purpose: "Loan for business",
    amountFunded: funded,
    amountNeeded: needed,
    status,
    fundingDeadline: deadline.toISOString(),
    isPublic: true,
    maxLenders: 5 + (base % 5),
    createdAt: created.toISOString(),
    updatedAt: updated.toISOString(),
    expiresAt: deadline.toISOString(),
  };
}

export default function LoanRequestDetailPage({ params }: { params?: { id?: string } }) {
  const pid = typeof params?.id === "string" ? params!.id : "";
  const data = sampleById(pid);

  return (
    <div>
      <PageHeader
        title={`Loan Request ${data.id}`}
        subtitle={`Status: ${data.status}`}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/loan-requests">Back to list</Link>
            </Button>
            {data.status === "OPEN" && (
              <Button asChild size="sm">
                <Link href={`/dashboard/loan-requests/${encodeURIComponent(data.id)}/offer-loan`}>Offer Loan</Link>
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Amount</div>
                <div className="text-lg font-semibold">{money(data.amount)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Minimum Amount</div>
                <div className="text-lg font-semibold">{data.minAmount ? money(data.minAmount) : "—"}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Interest Rate</div>
                <div className="text-lg font-semibold">{data.interestRate}% / mo</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Duration</div>
                <div className="text-lg font-semibold">{data.durationDays} days</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Funded</div>
                <div className="text-lg font-semibold">{money(data.amountFunded)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Needed</div>
                <div className="text-lg font-semibold">{money(data.amountNeeded)}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass(data.status)}`}>
                {data.status}
              </div>
              {data.purpose && (
                <p className="mt-3 text-sm text-slate-700">
                  Purpose: <span className="font-medium">{data.purpose}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Borrower ID</dt>
                <dd className="font-medium">{data.borrowerId}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Public</dt>
                <dd className="font-medium">{data.isPublic ? "Yes" : "No"}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Max Lenders</dt>
                <dd className="font-medium">{data.maxLenders}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Funding Deadline</dt>
                <dd className="font-medium">{fmtDate(data.fundingDeadline)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Created</dt>
                <dd className="font-medium">{fmtDate(data.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Updated</dt>
                <dd className="font-medium">{fmtDate(data.updatedAt)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Expires</dt>
                <dd className="font-medium">{fmtDate(data.expiresAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
