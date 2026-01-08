"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KpiAreaChart } from "@/components/charts/KpiAreaChart";
import { FaCheckCircle, FaTimesCircle, FaShieldAlt, FaUser } from "react-icons/fa";
import { authClient } from "@/lib/authClient";
import { UserCategory } from "@/lib/types";

type UserProfileResponseDto = {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  maritalStatus: string;
  nationalId: string;
  nationalIdVerified: boolean;
  profilePicture?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  role: string;
  status: string;
  category: string;
  trustScore: number;
  totalBorrowed: number;
  totalLent: number;
  totalRepaid: number;
  currentDebt: number;
  walletBalance: number;
  totalLoansTaken: number;
  totalLoansGiven: number;
  loansPaidOnTime: number;
  loansPaidLate: number;
  loansDefaulted: number;
  avgRepaymentTime?: number;
  trustScoreHistory?: Array<{
    id: string;
    oldScore: number;
    newScore: number;
    change: number;
    reason: string;
    metadata?: any;
    createdAt: Date;
    loan?: { id: string; loanNumber: string; amount: number; status: string };
  }>;
  loansAsBorrower?: Array<{
    id: string;
    loanNumber: string;
    amount: number;
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
    status: string;
    isLate: boolean;
    lateDays: number;
    dueDate?: Date;
    createdAt: Date;
    lender: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: Date;
      maritalStatus: string;
      nationalId: string;
      profilePicture?: string;
      trustScore: number;
      category: string;
      address?: any;
      familyDetails?: any;
    };
  }>;
  loansAsLender?: Array<{
    id: string;
    loanNumber: string;
    amount: number;
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
    status: string;
    isLate: boolean;
    lateDays: number;
    dueDate?: Date;
    createdAt: Date;
    borrower: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: Date;
      maritalStatus: string;
      nationalId: string;
      profilePicture?: string;
      trustScore: number;
      category: string;
      address?: any;
      familyDetails?: any;
    };
  }>;
  loanRequests?: Array<{
    id: string;
    loanNumber: string;
    amount: number;
    amountFunded: number;
    amountNeeded: number;
    status: string;
    expiresAt?: Date;
    createdAt: Date;
    loanOffers?: Array<{
      id: string;
      amount: number;
      interestRate: number;
      status: string;
      createdAt: Date;
      lender: any;
    }>;
  }>;
  loanOffers?: Array<{
    id: string;
    amount: number;
    interestRate: number;
    status: string;
    createdAt: Date;
    loanRequest: any;
  }>;
  address?: {
    id: string;
    street: string;
    countryId: string;
    provinceId?: string;
    districtId?: string;
    sectorId?: string;
    cellId?: string;
    villageId?: string;
    latitude?: number;
    longitude?: number;
  };
  familyDetails?: {
    id: string;
    spouseName?: string;
    spousePhone?: string;
    spouseNationalId?: string;
    fatherName?: string;
    motherName?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
};

// Category descriptions per business rules
const CATEGORY_DESCRIPTIONS: Record<UserCategory, string> = {
  [UserCategory.EXCELLENT]: "All loans paid on time, >20 loans",
  [UserCategory.GOOD]: "All loans paid on time, 10-20 loans",
  [UserCategory.TRUSTABLE]: "All loans paid on time, 5-9 loans",
  [UserCategory.MODERATE]: "Few delays (<3 days), 1-4 loans",
  [UserCategory.RISKY]: "Multiple delays (>3 days) or 1 default",
  [UserCategory.DEFAULT]: "Multiple defaults or severe delays",
};

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function dateStr(d?: Date) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
      {ok ? <FaCheckCircle /> : <FaTimesCircle />}
      <span>{label}</span>
    </span>
  );
}

export default function ProfilePage() {
  const [p, setP] = useState<UserProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await authClient.profile();
        if (!mounted) return;
        setP(data as UserProfileResponseDto);
      } catch (e) {
        // toast is handled globally in appClient
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const trustChart = useMemo(() => {
    const hist = (p?.trustScoreHistory ?? []).map((h: any) => ({
      ...h,
      createdAt: new Date(h.createdAt),
    }));
    // latest first → reverse for chart left-to-right
    return [...hist].reverse().map((h) => ({ name: h.createdAt.toLocaleDateString(), value: h.newScore }));
  }, [p?.trustScoreHistory]);

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your identity, verifications, and loan footprint" />

      {loading && (
        <div className="mt-6 rounded-md border p-4 text-sm text-slate-500">Loading profile…</div>
      )}

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard title="Trust Score" value={p?.trustScore ?? 0} accent="blue" />
        <StatCard title="Total Borrowed" value={money(p?.totalBorrowed ?? 0)} accent="pink" />
        <StatCard title="Total Lent" value={money(p?.totalLent ?? 0)} accent="green" />
        <StatCard title="Current Debt" value={money(p?.currentDebt ?? 0)} accent="orange" />
        <StatCard title="Wallet" value={money(p?.walletBalance ?? 0)} accent="blue" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                {p?.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.profilePicture} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <FaUser />
                  </div>
                )}
              </div>
              <div>
                <div className="text-lg font-semibold">{p?.firstName} {p?.lastName}</div>
                <CardDescription>{p?.email} · {p?.phone}</CardDescription>
              </div>
            </CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge ok={!!p?.emailVerified} label={p?.emailVerified ? "Email verified" : "Email unverified"} />
              <Badge ok={!!p?.phoneVerified} label={p?.phoneVerified ? "Phone verified" : "Phone unverified"} />
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${p?.twoFactorEnabled ? "bg-blue/10 text-blue" : "bg-slate-100 text-slate-700"}`}>
                <FaShieldAlt /> 2FA {p?.twoFactorEnabled ? "enabled" : "disabled"}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">National ID: {p?.nationalIdVerified ? "Verified" : "Unverified"}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="text-slate-500">Role</div>
                <div className="font-medium">{p?.role}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="text-slate-500">Status</div>
                <div className="font-medium">{p?.status}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="text-slate-500">Category</div>
                <div className="font-medium">
                  {p?.category}
                  {p?.category && CATEGORY_DESCRIPTIONS[p.category as UserCategory] && (
                    <span className="ml-2 text-xs text-slate-500">{CATEGORY_DESCRIPTIONS[p.category as UserCategory]}</span>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="text-slate-500">DOB</div>
                <div className="font-medium">{dateStr(p?.dateOfBirth as any)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="text-slate-500">Marital Status</div>
                <div className="font-medium">{p?.maritalStatus}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="text-slate-500">Last Login</div>
                <div className="font-medium">{dateStr(p?.lastLoginAt as any)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trust Score</CardTitle>
            <CardDescription>Recent changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            {trustChart.length > 0 ? (
              <KpiAreaChart data={trustChart} color="#2563eb" />
            ) : (
              <div className="text-sm text-slate-500">No trust history available.</div>
            )}
            <div className="mt-3 space-y-2">
              {(p?.trustScoreHistory ?? []).slice(0, 4).map((h: any) => (
                <div key={h.id} className="rounded-md border p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{h.reason}</div>
                    <div className={`text-xs font-semibold ${h.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{h.change >= 0 ? "+" : ""}{h.change}</div>
                  </div>
                  <div className="text-xs text-slate-500">{dateStr(h.createdAt as any)} · {h.oldScore} → {h.newScore}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loans as Borrower</CardTitle>
            <CardDescription>Latest 5 loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-3 py-2">Loan #</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Due</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(p?.loansAsBorrower ?? []).slice(0, 5).map((l: any) => (
                    <tr key={l.id} className="border-b">
                      <td className="px-3 py-2 font-medium">{l.loanNumber}</td>
                      <td className="px-3 py-2">{money(l.amount)}</td>
                      <td className="px-3 py-2">{money(l.amountDue)}</td>
                      <td className="px-3 py-2">{l.status}</td>
                      <td className="px-3 py-2">{dateStr(l.dueDate as any)}</td>
                    </tr>
                  ))}
                  {(p?.loansAsBorrower ?? []).length === 0 && (
                    <tr><td colSpan={5} className="px-3 py-4 text-center text-slate-500">No borrower loans.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loans as Lender</CardTitle>
            <CardDescription>Latest 5 loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-3 py-2">Loan #</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Paid</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(p?.loansAsLender ?? []).slice(0, 5).map((l: any) => (
                    <tr key={l.id} className="border-b">
                      <td className="px-3 py-2 font-medium">{l.loanNumber}</td>
                      <td className="px-3 py-2">{money(l.amount)}</td>
                      <td className="px-3 py-2">{money(l.amountPaid)}</td>
                      <td className="px-3 py-2">{l.status}</td>
                      <td className="px-3 py-2">{dateStr(l.dueDate as any)}</td>
                    </tr>
                  ))}
                  {(p?.loansAsLender ?? []).length === 0 && (
                    <tr><td colSpan={5} className="px-3 py-4 text-center text-slate-500">No lender loans.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Requests</CardTitle>
            <CardDescription>Recent requests and funding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {(p?.loanRequests ?? []).slice(0, 5).map((r: any) => (
                <div key={r.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.loanNumber}</div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{r.status}</span>
                  </div>
                  <div className="mt-1 text-slate-700">Raised {money(r.amountFunded)} of {money(r.amount)} • Need {money(r.amountNeeded)}</div>
                  <div className="text-xs text-slate-500">Created {dateStr(r.createdAt as any)} • Expires {dateStr(r.expiresAt as any)}</div>
                </div>
              ))}
              {(p?.loanRequests ?? []).length === 0 && <div className="text-slate-500">No loan requests.</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Offers</CardTitle>
            <CardDescription>Your recent offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {(p?.loanOffers ?? []).slice(0, 5).map((o: any) => (
                <div key={o.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Offer {o.id}</div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{o.status}</span>
                  </div>
                  <div className="mt-1 text-slate-700">{money(o.amount)} at {String(o.interestRate)}%/mo on {o.loanRequest?.loanNumber ?? "—"}</div>
                  <div className="text-xs text-slate-500">{dateStr(o.createdAt as any)}</div>
                </div>
              ))}
              {(p?.loanOffers ?? []).length === 0 && <div className="text-slate-500">No offers.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
