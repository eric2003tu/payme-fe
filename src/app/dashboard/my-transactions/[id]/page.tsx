"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loanClient, LoanDto } from "@/lib/loanClient";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaClock, FaBolt, FaCheckCircle, FaExclamationTriangle, FaUser, FaUserTie } from "react-icons/fa";
import {
  BadgeDollarSign,
  Percent,
  Timer,
  CalendarDays,
  AlarmClock,
  AlertTriangle,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone,
  IdCard,
  UserCircle2,
  Gauge,
  MapPin,
} from "lucide-react";

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
  return s ? new Date(s).toLocaleString() : "—";
}

function safe<T = any>(v: T | null | undefined, fallback: string = "—"): T | string {
  if (v === null || v === undefined || v === "") return fallback;
  return v as T;
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
    default:
      return <FaClock className="h-4 w-4 text-slate-500" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase?.() || "";
  const map: Record<string, string> = {
    PENDING: "text-amber-700 bg-amber-100",
    ACTIVE: "text-blue bg-blue/10",
    REPAID: "text-emerald-600 bg-emerald-100",
    OVERDUE: "text-rose-600 bg-rose-100",
    DEFAULTED: "text-rose-700 bg-rose-100",
    CANCELLED: "text-slate-600 bg-slate-100",
  };
  const cl = map[s] || "text-slate-600 bg-slate-100";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cl}`}>
      {statusIcon(s)}
      <span>{s}</span>
    </span>
  );
}

export default function LoanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");
  const [loan, setLoan] = useState<LoanDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    loanClient
      .get(id)
      .then((data) => {
        if (!mounted) return;
        setLoan(data);
      })
      .catch(() => void 0)
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const stats = useMemo(() => {
    if (!loan) return null;
    return {
      amount: toNumber(loan.amount),
      total: toNumber(loan.totalAmount),
      due: toNumber(loan.amountDue),
      rate: toNumber(loan.interestRate),
    };
  }, [loan]);

  return (
    <div>
      <PageHeader
        title={loan ? `Loan ${loan.loanNumber}` : "Loan Details"}
        subtitle={loan ? `ID: ${loan.id}` : undefined}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-1" size={16} /> Back
            </Button>
            {loan?.agreementUrl ? (
              <Button asChild size="sm" variant="outline">
                <a href={loan.agreementUrl} target="_blank" rel="noreferrer">
                  <FileText className="mr-1" size={16} /> Agreement
                </a>
              </Button>
            ) : null}
          </div>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border p-4 h-24" />
          ))}
        </div>
      ) : !loan ? (
        <div className="text-slate-500">Loan not found.</div>
      ) : (
        <>
          <div className="mb-2">
            <StatusBadge status={String(loan.status || "")} />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <StatCard title="Amount" value={money(stats!.amount)} accent="blue" icon={<BadgeDollarSign size={18} />} />
            <StatCard title="Total Amount" value={money(stats!.total)} accent="green" icon={<BadgeDollarSign size={18} />} />
            <StatCard title="Amount Due" value={money(stats!.due)} accent="orange" icon={<BadgeDollarSign size={18} />} />
            <StatCard title="Interest Rate" value={`${stats!.rate}% / mo`} accent="pink" icon={<Percent size={18} />} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="border-b">
                <CardTitle>Overview</CardTitle>
                <CardDescription>Key dates and repayment information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500 flex items-center gap-2"><Timer size={14} /> Duration</div>
                    <div className="font-semibold">{loan.durationDays} days</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500 flex items-center gap-2"><CalendarDays size={14} /> Disbursed At</div>
                    <div className="font-semibold">{dateStr(loan.disbursedAt)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500 flex items-center gap-2"><AlarmClock size={14} /> Due Date</div>
                    <div className="font-semibold">{dateStr(loan.dueDate)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500 flex items-center gap-2"><CheckCircle2 size={14} /> Repaid At</div>
                    <div className="font-semibold">{dateStr(loan.repaidAt)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500 flex items-center gap-2"><AlertTriangle size={14} /> Late</div>
                    <div className="font-semibold">{loan.isLate ? `Yes (${loan.lateDays || 0} days)` : "No"}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500 flex items-center gap-2"><AlertTriangle size={14} /> Penalty</div>
                    <div className="font-semibold">{money(toNumber(loan.penaltyAmount))}</div>
                  </div>
                </div>

                {loan.purpose ? (
                  <div className="mt-6">
                    <div className="text-xs text-slate-500 mb-1">Purpose</div>
                    <div className="rounded-lg border p-3 bg-white text-slate-700">{loan.purpose}</div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2"><FaUser className="text-slate-600" /> Borrower</CardTitle>
                  <CardDescription>Full borrower details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 text-sm">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2"><UserCircle2 size={16} /> <span className="font-semibold">{safe(`${loan.borrower?.firstName || ""} ${loan.borrower?.lastName || ""}`.trim())}</span></div>
                    <div className="flex items-center gap-2 text-slate-600"><Mail size={16} /> {safe(loan.borrower?.email)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><Phone size={16} /> {safe(loan.borrower?.phone)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><CalendarDays size={16} /> {dateStr(loan.borrower?.dateOfBirth)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><IdCard size={16} /> NID: {safe(loan.borrower?.nationalId)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><Gauge size={16} /> Trust Score: {safe(loan.borrower?.trustScore)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><CheckCircle2 size={16} /> Category: {safe(loan.borrower?.category)}</div>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs text-slate-500 mb-2">Address</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500 flex items-center gap-2"><MapPin size={14} /> Street</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.street)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Latitude</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.latitude)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Longitude</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.longitude)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Country</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.country?.name)} ({safe(loan.borrower?.address?.country?.code)})</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.borrower?.address?.country?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Province</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.province?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.borrower?.address?.province?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">District</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.district?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.borrower?.address?.district?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Sector</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.sector?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.borrower?.address?.sector?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Cell</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.cell?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.borrower?.address?.cell?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Village</div>
                        <div className="font-semibold">{safe(loan.borrower?.address?.village?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.borrower?.address?.village?.id)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs text-slate-500 mb-2">Family Details</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Spouse Name</div>
                        <div className="font-semibold">{safe(loan.borrower?.familyDetails?.spouseName)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Spouse National ID</div>
                        <div className="font-semibold">{safe(loan.borrower?.familyDetails?.spouseNationalId)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Spouse Phone</div>
                        <div className="font-semibold">{safe(loan.borrower?.familyDetails?.spousePhone)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Father Name</div>
                        <div className="font-semibold">{safe(loan.borrower?.familyDetails?.fatherName)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Mother Name</div>
                        <div className="font-semibold">{safe(loan.borrower?.familyDetails?.motherName)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Emergency Contact</div>
                        <div className="font-semibold">{safe(loan.borrower?.familyDetails?.emergencyContactName)}</div>
                        <div className="text-xs text-slate-500">{safe(loan.borrower?.familyDetails?.emergencyContactPhone)}</div>
                        <div className="text-xs text-slate-400">Relation: {safe(loan.borrower?.familyDetails?.emergencyContactRelation)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2"><FaUserTie className="text-slate-600" /> Lender</CardTitle>
                  <CardDescription>Full lender details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 text-sm">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2"><UserCircle2 size={16} /> <span className="font-semibold">{safe(`${loan.lender?.firstName || ""} ${loan.lender?.lastName || ""}`.trim())}</span></div>
                    <div className="flex items-center gap-2 text-slate-600"><Mail size={16} /> {safe(loan.lender?.email)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><Phone size={16} /> {safe(loan.lender?.phone)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><CalendarDays size={16} /> {dateStr(loan.lender?.dateOfBirth)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><IdCard size={16} /> NID: {safe(loan.lender?.nationalId)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><Gauge size={16} /> Trust Score: {safe(loan.lender?.trustScore)}</div>
                    <div className="flex items-center gap-2 text-slate-600"><CheckCircle2 size={16} /> Category: {safe(loan.lender?.category)}</div>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs text-slate-500 mb-2">Address</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500 flex items-center gap-2"><MapPin size={14} /> Street</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.street)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Latitude</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.latitude)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Longitude</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.longitude)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Country</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.country?.name)} ({safe(loan.lender?.address?.country?.code)})</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.lender?.address?.country?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Province</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.province?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.lender?.address?.province?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">District</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.district?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.lender?.address?.district?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Sector</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.sector?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.lender?.address?.sector?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Cell</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.cell?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.lender?.address?.cell?.id)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Village</div>
                        <div className="font-semibold">{safe(loan.lender?.address?.village?.name)}</div>
                        <div className="text-xs text-slate-400">ID: {safe(loan.lender?.address?.village?.id)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs text-slate-500 mb-2">Family Details</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Spouse Name</div>
                        <div className="font-semibold">{safe(loan.lender?.familyDetails?.spouseName)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Spouse National ID</div>
                        <div className="font-semibold">{safe(loan.lender?.familyDetails?.spouseNationalId)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Spouse Phone</div>
                        <div className="font-semibold">{safe(loan.lender?.familyDetails?.spousePhone)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Father Name</div>
                        <div className="font-semibold">{safe(loan.lender?.familyDetails?.fatherName)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Mother Name</div>
                        <div className="font-semibold">{safe(loan.lender?.familyDetails?.motherName)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">Emergency Contact</div>
                        <div className="font-semibold">{safe(loan.lender?.familyDetails?.emergencyContactName)}</div>
                        <div className="text-xs text-slate-500">{safe(loan.lender?.familyDetails?.emergencyContactPhone)}</div>
                        <div className="text-xs text-slate-400">Relation: {safe(loan.lender?.familyDetails?.emergencyContactRelation)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Agreement</CardTitle>
                <CardDescription>Loan agreement document</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 text-sm">
                {loan.agreementUrl ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={loan.agreementUrl} target="_blank" rel="noreferrer">
                      <FileText className="mr-1" size={16} /> Open Agreement
                    </a>
                  </Button>
                ) : (
                  <div className="text-slate-500">No agreement uploaded.</div>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Signed by Borrower</div>
                    <div className="font-semibold">{loan.signedByBorrower ? "Yes" : "No"}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Signed by Lender</div>
                    <div className="font-semibold">{loan.signedByLender ? "Yes" : "No"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Meta</CardTitle>
                <CardDescription>Technical metadata</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Created At</div>
                    <div className="font-semibold">{dateStr(loan.createdAt)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Updated At</div>
                    <div className="font-semibold">{dateStr(loan.updatedAt)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Deleted At</div>
                    <div className="font-semibold">{dateStr(loan.deletedAt)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Status</div>
                    <div className="font-semibold">{String(loan.status || "")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
