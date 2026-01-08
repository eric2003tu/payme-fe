"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { useParams } from "next/navigation";
import { loanOfferClient } from "../../../../lib/loanOfferClient";
import { toast } from "sonner";
import Link from "next/link";

type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN" | string;

const toNum = (x: any): number => {
  if (x == null) return 0;
  const n = typeof x === "string" ? Number(x) : x;
  return Number.isFinite(n) ? n : 0;
};

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function badgeClass(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "PENDING") return "text-amber-700 bg-amber-100";
  if (s === "ACCEPTED") return "text-emerald-600 bg-emerald-100";
  if (s === "REJECTED") return "text-rose-700 bg-rose-100";
  if (s === "WITHDRAWN") return "text-slate-700 bg-slate-100";
  return "text-slate-700 bg-slate-100";
}

function fmtDate(s?: string) {
  return s ? new Date(s).toLocaleString() : "—";
}

export default function LoanOfferDetailPage() {
  const params = useParams();
  const oid = typeof params?.id === "string" ? (params.id as string) : "";
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await loanOfferClient.get(oid);
        if (mounted) setData(res);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load offer");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [oid]);

  const computed = useMemo(() => {
    if (!data) return null;
    const amount = toNum(data.amount);
    const rate = toNum(data.interestRate);
    const req = data.loanRequest || {};
    const reqAmount = toNum(req.amount);
    const reqMinAmount = req.minAmount != null ? toNum(req.minAmount) : undefined;
    const reqFunded = toNum(req.amountFunded);
    const reqNeeded = req.amountNeeded != null ? toNum(req.amountNeeded) : Math.max(reqAmount - reqFunded, 0);
    return { amount, rate, reqAmount, reqMinAmount, reqFunded, reqNeeded };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !computed) {
    return (
      <div>
        <PageHeader title="Offer Not Found" subtitle="We couldn’t find this offer" actions={<Button asChild variant="outline" size="sm"><Link href="/dashboard/loans">Back to offers</Link></Button>} />
      </div>
    );
  }

  const req = data.loanRequest || {};
  const borrower = req.borrower || {};

  return (
    <div>
      <PageHeader
        title={`Loan Offer`}
        subtitle={`Status: ${data.status}`}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/loans">Back to offers</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/loan-requests/${encodeURIComponent(data.loanRequestId)}`}>View Request</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Offer Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Offer Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Amount</div>
                <div className="text-lg font-semibold">{money(computed.amount)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Interest Rate</div>
                <div className="text-lg font-semibold">{computed.rate}% / mo</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Status</div>
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass(data.status)}`}>{(data.status || "PENDING").toUpperCase()}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Counter Offer</div>
                <div className="text-lg font-semibold">{data.isCounterOffer ? "Yes" : "No"}</div>
              </div>
            </div>

            {data.message && (
              <div className="mt-4 rounded-lg border p-4">
                <div className="text-xs text-slate-500">Message</div>
                <div className="text-sm text-slate-700">{data.message}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meta */}
        <Card>
          <CardHeader>
            <CardTitle>Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Created</dt>
                <dd className="font-medium">{fmtDate(data.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Updated</dt>
                <dd className="font-medium">{fmtDate(data.updatedAt)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Offer ID</dt>
                <dd className="font-medium">{data.id}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Request ID</dt>
                <dd className="font-medium">{data.loanRequestId}</dd>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <dt className="text-slate-500">Lender ID</dt>
                <dd className="font-medium">{data.lenderId}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Request Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Linked Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Loan Number</div>
                <div className="text-lg font-semibold">{req.loanNumber ?? req.id ?? "—"}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Status</div>
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass(req.status ?? "OPEN")}`}>{(req.status ?? "OPEN").toUpperCase()}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Amount</div>
                <div className="text-lg font-semibold">{money(computed.reqAmount)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Minimum Amount</div>
                <div className="text-lg font-semibold">{computed.reqMinAmount != null ? money(computed.reqMinAmount) : "—"}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Funded</div>
                <div className="text-lg font-semibold">{money(computed.reqFunded)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Needed</div>
                <div className="text-lg font-semibold">{money(computed.reqNeeded)}</div>
              </div>
            </div>

            {req.purpose && (
              <div className="mt-4 rounded-lg border p-4">
                <div className="text-xs text-slate-500">Purpose</div>
                <div className="text-sm text-slate-700">{req.purpose}</div>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Funding Deadline</div>
                <div className="text-sm font-medium">{fmtDate(req.fundingDeadline)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Expires</div>
                <div className="text-sm font-medium">{fmtDate(req.expiresAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Borrower */}
        <Card>
          <CardHeader>
            <CardTitle>Borrower</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="rounded-md border p-3">
                <div className="text-xs text-slate-500">Name</div>
                <div className="text-sm font-medium">{borrower.firstName && borrower.lastName ? `${borrower.firstName} ${borrower.lastName}` : borrower.id || "—"}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-slate-500">Email</div>
                  <div className="text-sm font-medium">{borrower.email ?? "—"}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-slate-500">Phone</div>
                  <div className="text-sm font-medium">{borrower.phone ?? "—"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-slate-500">Category</div>
                  <div className="text-sm font-medium">{borrower.category ?? "—"}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-slate-500">Trust Score</div>
                  <div className="text-sm font-medium">{borrower.trustScore ?? "—"}</div>
                </div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-slate-500">National ID</div>
                <div className="text-sm font-medium">{borrower.nationalId ?? "—"}</div>
              </div>

              {/* Address */}
              {borrower.address && (
                <div className="rounded-md border p-3">
                  <div className="text-xs text-slate-500">Address</div>
                  <div className="text-sm font-medium">
                    {borrower.address.street ?? ""}
                    {borrower.address.village?.name ? `, ${borrower.address.village.name}` : ""}
                    {borrower.address.cell?.name ? `, ${borrower.address.cell.name}` : ""}
                    {borrower.address.sector?.name ? `, ${borrower.address.sector.name}` : ""}
                    {borrower.address.district?.name ? `, ${borrower.address.district.name}` : ""}
                    {borrower.address.province?.name ? `, ${borrower.address.province.name}` : ""}
                    {borrower.address.country?.name ? `, ${borrower.address.country.name}` : ""}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
