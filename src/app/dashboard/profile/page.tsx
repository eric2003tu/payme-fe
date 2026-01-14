"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KpiAreaChart } from "@/components/charts/KpiAreaChart";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaShieldAlt, 
  FaUser, 
  FaArrowUp, 
  FaArrowDown, 
  FaHistory, 
  FaMoneyBillWave, 
  FaHandHoldingUsd, 
  FaCreditCard, 
  FaWallet,
  FaMapMarkerAlt,
  FaHome,
  FaPhone,
  FaUserFriends,
  FaCalendarAlt,
  FaIdCard,
  FaLock,
  FaGlobe,
  FaBuilding,
  FaMapPin
} from "react-icons/fa";
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
    country?: {
      id: string;
      name: string;
      code: string;
    };
    province?: {
      id: string;
      name: string;
    };
    district?: {
      id: string;
      name: string;
    };
    sector?: {
      id: string;
      name: string;
    };
    cell?: {
      id: string;
      name: string;
    };
    village?: {
      id: string;
      name: string;
    };
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

// Category colors
const CATEGORY_COLORS: Record<UserCategory, string> = {
  [UserCategory.EXCELLENT]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [UserCategory.GOOD]: "bg-green-50 text-green-700 border-green-200",
  [UserCategory.TRUSTABLE]: "bg-blue-50 text-blue-700 border-blue-200",
  [UserCategory.MODERATE]: "bg-amber-50 text-amber-700 border-amber-200",
  [UserCategory.RISKY]: "bg-orange-50 text-orange-700 border-orange-200",
  [UserCategory.DEFAULT]: "bg-rose-50 text-rose-700 border-rose-200",
};

// Trust score colors
const getTrustScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-600";
  if (score >= 80) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 60) return "text-amber-600";
  if (score >= 50) return "text-orange-600";
  return "text-rose-600";
};

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function dateStr(d?: Date) {
  return d ? new Date(d).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : "—";
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${ok ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
      {ok ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs" />}
      <span>{label}</span>
    </span>
  );
}

// Loading Skeleton Components
const StatCardSkeleton = () => (
  <div className="h-24 animate-pulse rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <div className="h-3 w-20 rounded bg-slate-200 mb-3"></div>
    <div className="h-8 w-28 rounded bg-slate-300"></div>
    <div className="mt-2 h-2 w-32 rounded bg-slate-200"></div>
  </div>
);

const ProfileCardSkeleton = () => (
  <div className="animate-pulse space-y-6 rounded-xl border border-slate-200 bg-white p-6">
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-full bg-slate-200"></div>
      <div className="space-y-2">
        <div className="h-4 w-40 rounded bg-slate-300"></div>
        <div className="h-3 w-60 rounded bg-slate-200"></div>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-24 rounded-full bg-slate-200"></div>
      <div className="h-6 w-24 rounded-full bg-slate-200"></div>
      <div className="h-6 w-24 rounded-full bg-slate-200"></div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2 rounded-lg bg-slate-50 p-3">
          <div className="h-2 w-16 rounded bg-slate-200"></div>
          <div className="h-3 w-24 rounded bg-slate-300"></div>
        </div>
      ))}
    </div>
  </div>
);

const AddressCardSkeleton = () => (
  <div className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-6">
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded bg-slate-200"></div>
      <div className="h-4 w-32 rounded bg-slate-300"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-48 rounded bg-slate-200"></div>
      <div className="h-3 w-40 rounded bg-slate-200"></div>
      <div className="h-3 w-36 rounded bg-slate-200"></div>
    </div>
  </div>
);

const FamilyCardSkeleton = () => (
  <div className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-6">
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded bg-slate-200"></div>
      <div className="h-4 w-32 rounded bg-slate-300"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2 rounded-lg bg-slate-50 p-3">
          <div className="h-2 w-20 rounded bg-slate-200"></div>
          <div className="h-3 w-28 rounded bg-slate-300"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = await authClient.profile();
        if (!mounted) return;
        
        // Add stagger animation timing
        await new Promise(resolve => setTimeout(resolve, 100));
        setProfile(data as UserProfileResponseDto);
      } catch (e) {
        // toast is handled globally in appClient
        console.error("Failed to load profile:", e);
      } finally {
        if (mounted) {
          setTimeout(() => setLoading(false), 200);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const trustChart = useMemo(() => {
    const hist = (profile?.trustScoreHistory ?? []).map((h: any) => ({
      ...h,
      createdAt: new Date(h.createdAt),
    }));
    return [...hist].reverse().map((h) => ({ 
      name: h.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      value: h.newScore 
    }));
  }, [profile?.trustScoreHistory]);

  const repaymentRate = useMemo(() => {
    if (!profile?.totalLoansTaken) return 100;
    return Math.round((profile.loansPaidOnTime / profile.totalLoansTaken) * 100);
  }, [profile]);

  if (loading && !profile) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200"></div>
          <div className="h-4 w-96 rounded bg-slate-100"></div>
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Main Profile Card Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProfileCardSkeleton />
          </div>
          <div className="space-y-4">
            <div className="h-64 animate-pulse rounded-xl bg-slate-50"></div>
          </div>
        </div>

        {/* Address & Family Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AddressCardSkeleton />
          <FamilyCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title="Profile" 
        subtitle="Your personal information and account details" 
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <StatCard 
            title="Trust Score" 
            value={profile?.trustScore ?? 0} 
            accent="blue"
            icon={<FaHistory className="text-blue-500" />}
          />
        </div>
        <div className="transform transition-all duration-300 hover:scale-[1.02] delay-75">
          <StatCard 
            title="Wallet Balance" 
            value={money(profile?.walletBalance ?? 0)} 
            accent="blue"
            icon={<FaWallet className="text-blue-500" />}
          />
        </div>
        <div className="transform transition-all duration-300 hover:scale-[1.02] delay-100">
          <StatCard 
            title="Repayment Rate" 
            value={`${repaymentRate}%`} 
            accent="green"
            icon={<FaCheckCircle className="text-green-500" />}
          />
        </div>
        <div className="transform transition-all duration-300 hover:scale-[1.02] delay-150">
          <StatCard 
            title="Total Loans" 
            value={profile?.totalLoansTaken ?? 0} 
            accent="pink"
            icon={<FaMoneyBillWave className="text-pink-500" />}
          />
        </div>
        <div className="transform transition-all duration-300 hover:scale-[1.02] delay-200">
          <StatCard 
            title="Current Debt" 
            value={money(profile?.currentDebt ?? 0)} 
            accent="orange"
            icon={<FaCreditCard className="text-orange-500" />}
          />
        </div>
      </div>

      {/* Main Profile Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Information Card */}
        <Card className="lg:col-span-2 transform transition-all duration-500 animate-in slide-in-from-left-10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-slate-100 p-1.5">
                  <FaUser className="text-slate-600" />
                </div>
                <div>
                  <div>Personal Information</div>
                  <CardDescription>Your account details and verification status</CardDescription>
                </div>
              </CardTitle>
              <div className={`rounded-full px-3 py-1 text-xs font-medium ${profile?.category ? CATEGORY_COLORS[profile.category as UserCategory] : "bg-slate-100 text-slate-700"}`}>
                {profile?.category || "—"}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Profile Header with Avatar */}
            <div className="mb-6 flex items-start gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-slate-100 to-slate-200 ring-3 ring-white shadow-lg">
                {profile?.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={profile.profilePicture} 
                    alt="avatar" 
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <FaUser className="text-2xl" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white bg-emerald-500"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">{profile?.firstName} {profile?.lastName}</h2>
                  <span className="text-sm font-medium text-slate-600">ID: {profile?.id?.slice(-8)}</span>
                </div>
                <div className="mt-2 flex flex-col gap-1 text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaIdCard className="text-sm" />
                    <span>National ID: {profile?.nationalId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-sm" />
                    <span>Member since {dateStr(profile?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Badges */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Verification Status</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  ok={!!profile?.emailVerified} 
                  label={profile?.emailVerified ? "Email verified" : "Email unverified"} 
                />
                <Badge 
                  ok={!!profile?.phoneVerified} 
                  label={profile?.phoneVerified ? "Phone verified" : "Phone unverified"} 
                />
                <Badge 
                  ok={!!profile?.nationalIdVerified} 
                  label={profile?.nationalIdVerified ? "National ID verified" : "National ID unverified"} 
                />
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${profile?.twoFactorEnabled ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                  <FaShieldAlt className="text-xs" /> 
                  2FA {profile?.twoFactorEnabled ? "enabled" : "disabled"}
                </span>
              </div>
            </div>

            {/* Personal Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <FaUser className="text-sm text-slate-400" />
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Role</div>
                </div>
                <div className="text-sm font-semibold text-slate-900">{profile?.role}</div>
              </div>
              
              <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <FaLock className="text-sm text-slate-400" />
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</div>
                </div>
                <div className={`text-sm font-semibold ${profile?.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {profile?.status}
                </div>
              </div>
              
              <div className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-sm ${profile?.category ? CATEGORY_COLORS[profile.category as UserCategory] : "border-slate-200 bg-gradient-to-b from-white to-slate-50"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <FaShieldAlt className="text-sm text-slate-400" />
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Category</div>
                </div>
                <div className="mt-1">
                  <div className="text-sm font-semibold">{profile?.category}</div>
                  {profile?.category && CATEGORY_DESCRIPTIONS[profile.category as UserCategory] && (
                    <div className="mt-1 text-xs text-slate-600">{CATEGORY_DESCRIPTIONS[profile.category as UserCategory]}</div>
                  )}
                </div>
              </div>
              
              <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <FaCalendarAlt className="text-sm text-slate-400" />
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date of Birth</div>
                </div>
                <div className="text-sm font-semibold text-slate-900">{dateStr(profile?.dateOfBirth as any)}</div>
              </div>
              
              <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <FaUserFriends className="text-sm text-slate-400" />
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Marital Status</div>
                </div>
                <div className="text-sm font-semibold text-slate-900">{profile?.maritalStatus}</div>
              </div>
              
              <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <FaHistory className="text-sm text-slate-400" />
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Last Login</div>
                </div>
                <div className="text-sm font-semibold text-slate-900">{dateStr(profile?.lastLoginAt as any)}</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaIdCard className="text-sm text-slate-400" />
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Address</div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{profile?.email}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaPhone className="text-sm text-slate-400" />
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone Number</div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{profile?.phone}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Score Card */}
        <Card className="transform transition-all duration-500 animate-in slide-in-from-right-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-1.5">
                <FaHistory className="text-blue-600" />
              </div>
              <div>
                <div>Trust Score History</div>
                <CardDescription>Your financial reputation over time</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              {trustChart.length > 0 ? (
                <div className="transform transition-all duration-300">
                  <KpiAreaChart data={trustChart} color="#3b82f6" />
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300">
                  <div className="text-sm text-slate-500">No trust history available</div>
                </div>
              )}
            </div>
            
            {/* Current Trust Score */}
            <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="text-sm font-medium text-slate-600 mb-1">Current Trust Score</div>
              <div className="flex items-baseline gap-2">
                <div className={`text-3xl font-bold ${getTrustScoreColor(profile?.trustScore ?? 0)}`}>
                  {profile?.trustScore ?? 0}
                </div>
                <div className="text-xs text-slate-500">/100</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {profile?.trustScore && profile.trustScore >= 80 ? "Excellent reputation" :
                 profile?.trustScore && profile.trustScore >= 60 ? "Good standing" :
                 "Needs improvement"}
              </div>
            </div>

            {/* Recent Changes */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Recent Changes</h3>
              <div className="space-y-3">
                {(profile?.trustScoreHistory ?? []).slice(0, 3).map((h: any, index) => (
                  <div 
                    key={h.id} 
                    className="transform rounded-lg border border-slate-200 bg-white p-3 transition-all duration-200 hover:border-slate-300 hover:shadow-sm animate-in slide-in-from-right-10"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm text-slate-900">{h.reason.replace(/_/g, ' ')}</div>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${h.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {h.change >= 0 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                        {h.change >= 0 ? "+" : ""}{h.change}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {dateStr(h.createdAt as any)} · {h.oldScore} → {h.newScore}
                    </div>
                  </div>
                ))}
                {(profile?.trustScoreHistory ?? []).length === 0 && (
                  <div className="text-sm text-slate-500 text-center py-4">
                    No trust score changes yet
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address & Family Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Address Card */}
        <Card className="transform transition-all duration-500 animate-in slide-in-from-left-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-50 p-1.5">
                <FaHome className="text-emerald-600" />
              </div>
              <div>
                <div>Address Information</div>
                <CardDescription>Your registered residential address</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.address ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaMapMarkerAlt className="text-sm text-slate-400" />
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Street Address</div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{profile.address.street}</div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {profile.address.country && (
                    <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaGlobe className="text-sm text-slate-400" />
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Country</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{profile.address.country.name}</div>
                    </div>
                  )}
                  
                  {profile.address.province && (
                    <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaBuilding className="text-sm text-slate-400" />
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Province</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{profile.address.province.name}</div>
                    </div>
                  )}
                  
                  {profile.address.district && (
                    <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapPin className="text-sm text-slate-400" />
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">District</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{profile.address.district.name}</div>
                    </div>
                  )}
                  
                  {profile.address.sector && (
                    <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapPin className="text-sm text-slate-400" />
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sector</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{profile.address.sector.name}</div>
                    </div>
                  )}
                </div>
                
                {profile.address.latitude && profile.address.longitude && (
                  <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaMapMarkerAlt className="text-sm text-slate-400" />
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Coordinates</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {profile.address.latitude.toFixed(4)}, {profile.address.longitude.toFixed(4)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <FaHome className="text-4xl text-slate-300 mb-3" />
                <div className="text-slate-500">No address information available</div>
                <div className="text-sm text-slate-400 mt-1">Please update your profile to add address details</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Details Card */}
        <Card className="transform transition-all duration-500 animate-in slide-in-from-right-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-rose-50 p-1.5">
                <FaUserFriends className="text-rose-600" />
              </div>
              <div>
                <div>Family & Emergency Contacts</div>
                <CardDescription>Your family information for emergency purposes</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.familyDetails ? (
              <div className="space-y-4">
                {/* Emergency Contact */}
                <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaPhone className="text-sm text-slate-400" />
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Emergency Contact</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">{profile.familyDetails.emergencyContactName || "—"}</div>
                    <div className="text-sm text-slate-600">{profile.familyDetails.emergencyContactPhone || "—"}</div>
                    {profile.familyDetails.emergencyContactRelation && (
                      <div className="text-xs text-slate-500">Relation: {profile.familyDetails.emergencyContactRelation}</div>
                    )}
                  </div>
                </div>

                {/* Parents */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserFriends className="text-sm text-slate-400" />
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Father</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{profile.familyDetails.fatherName || "—"}</div>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserFriends className="text-sm text-slate-400" />
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mother</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{profile.familyDetails.motherName || "—"}</div>
                  </div>
                </div>

                {/* Spouse */}
                {profile.familyDetails.spouseName && (
                  <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserFriends className="text-sm text-slate-400" />
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Spouse</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-slate-900">{profile.familyDetails.spouseName}</div>
                      {profile.familyDetails.spousePhone && (
                        <div className="text-sm text-slate-600">{profile.familyDetails.spousePhone}</div>
                      )}
                      {profile.familyDetails.spouseNationalId && (
                        <div className="text-xs text-slate-500">ID: {profile.familyDetails.spouseNationalId}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <FaUserFriends className="text-4xl text-slate-300 mb-3" />
                <div className="text-slate-500">No family information available</div>
                <div className="text-sm text-slate-400 mt-1">Add family details for emergency contact purposes</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}