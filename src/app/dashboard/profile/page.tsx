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
  FaMapPin,
  FaStreetView,
  FaCity,
  FaFlag,
  FaLocationArrow
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
    countryName?: string;
    provinceName?: string;
    districtName?: string;
    sectorName?: string;
    cellName?: string;
    villageName?: string;
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
  <div className="h-24 animate-pulse shadow-lg rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <div className="h-3 w-20 rounded bg-slate-200 mb-3"></div>
    <div className="h-8 w-28 rounded bg-slate-300"></div>
    <div className="mt-2 h-2 w-32 rounded bg-slate-200"></div>
  </div>
);

const ProfileCardSkeleton = () => (
  <div className="animate-pulse space-y-6 rounded-xl  shadow-lg bg-white p-6">
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

// Address hierarchy component with icons and names
const AddressHierarchy = ({ address }: { address: NonNullable<UserProfileResponseDto['address']> }) => {
  const levels = [
    { name: address.countryName, icon: FaGlobe, label: "Country" },
    { name: address.provinceName, icon: FaFlag, label: "Province" },
    { name: address.districtName, icon: FaCity, label: "District" },
    { name: address.sectorName, icon: FaMapPin, label: "Sector" },
    { name: address.cellName, icon: FaStreetView, label: "Cell" },
    { name: address.villageName, icon: FaHome, label: "Village" },
  ].filter(level => level.name);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {levels.map((level, index) => (
          <div 
            key={level.label} 
            className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <level.icon className="text-sm text-slate-400" />
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{level.label}</div>
            </div>
            <div className="text-sm font-semibold text-slate-900">{level.name}</div>
          </div>
        ))}
      </div>
      
      {/* Full Address Path */}
      {levels.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaLocationArrow className="text-sm text-blue-500" />
            <div className="text-xs font-medium text-slate-700 uppercase tracking-wide">Full Address Path</div>
          </div>
          <div className="text-sm text-slate-700">
            {levels.map((level, index) => (
              <span key={level.label}>
                {level.name}
                {index < levels.length - 1 && <span className="text-slate-400 mx-2">›</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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

  const loanPerformance = useMemo(() => {
    if (!profile?.totalLoansTaken) return { onTime: 0, late: 0, defaulted: 0 };
    return {
      onTime: Math.round((profile.loansPaidOnTime / profile.totalLoansTaken) * 100),
      late: Math.round((profile.loansPaidLate / profile.totalLoansTaken) * 100),
      defaulted: Math.round((profile.loansDefaulted / profile.totalLoansTaken) * 100),
    };
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

            {/* Loan Performance Summary */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Loan Performance Summary</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
                  <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-1">On Time</div>
                  <div className="text-lg font-bold text-emerald-700">{loanPerformance.onTime}%</div>
                  <div className="text-xs text-emerald-600 mt-1">{profile?.loansPaidOnTime || 0} loans</div>
                </div>
                <div className="rounded-lg border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4">
                  <div className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Late</div>
                  <div className="text-lg font-bold text-amber-700">{loanPerformance.late}%</div>
                  <div className="text-xs text-amber-600 mt-1">{profile?.loansPaidLate || 0} loans</div>
                </div>
                <div className="rounded-lg border border-rose-200 bg-gradient-to-b from-rose-50 to-white p-4">
                  <div className="text-xs font-medium text-rose-700 uppercase tracking-wide mb-1">Defaulted</div>
                  <div className="text-lg font-bold text-rose-700">{loanPerformance.defaulted}%</div>
                  <div className="text-xs text-rose-600 mt-1">{profile?.loansDefaulted || 0} loans</div>
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
                      <div className="font-medium text-sm text-slate-900">
                        {h.reason === 'LOAN_REPAID_ON_TIME' ? 'Loan Repaid on Time' :
                         h.reason === 'LOAN_DEFAULTED' ? 'Loan Defaulted' :
                         h.reason === 'LATE_REPAYMENT' ? 'Late Repayment' :
                         h.reason.replace(/_/g, ' ')}
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${h.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {h.change >= 0 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                        {h.change >= 0 ? "+" : ""}{h.change}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {dateStr(h.createdAt as any)} · {h.oldScore} → {h.newScore}
                      {h.loan && (
                        <span className="block mt-0.5">Loan: {h.loan.loanNumber} ({money(h.loan.amount)})</span>
                      )}
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

            {/* Financial Summary */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Financial Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Borrowed</span>
                  <span className="font-semibold text-slate-900">{money(profile?.totalBorrowed ?? 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Repaid</span>
                  <span className="font-semibold text-emerald-600">{money(profile?.totalRepaid ?? 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Avg. Repayment Time</span>
                  <span className="font-semibold text-slate-900">{profile?.avgRepaymentTime || 0} days</span>
                </div>
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
                <FaMapMarkerAlt className="text-emerald-600" />
              </div>
              <div>
                <div>Address Information</div>
                <CardDescription>Your registered residential address with complete hierarchy</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.address ? (
              <div className="space-y-6">
                {/* Street Address */}
                <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FaStreetView className="text-sm text-slate-400" />
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Street Address</div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{profile.address.street}</div>
                </div>

                {/* Address Hierarchy */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Address Hierarchy</h3>
                  <AddressHierarchy address={profile.address} />
                </div>

                {/* Coordinates */}
                {(profile.address.latitude && profile.address.longitude) && (
                  <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaLocationArrow className="text-sm text-slate-400" />
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Geographic Coordinates</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Latitude</div>
                        <div className="text-sm font-semibold text-slate-900">{profile.address.latitude.toFixed(6)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Longitude</div>
                        <div className="text-sm font-semibold text-slate-900">{profile.address.longitude.toFixed(6)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address IDs */}
                <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Address Identifiers</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {profile.address.countryId && (
                      <div>
                        <div className="text-slate-500">Country ID</div>
                        <div className="font-mono text-slate-700 truncate">{profile.address.countryId.slice(-8)}</div>
                      </div>
                    )}
                    {profile.address.provinceId && (
                      <div>
                        <div className="text-slate-500">Province ID</div>
                        <div className="font-mono text-slate-700 truncate">{profile.address.provinceId.slice(-8)}</div>
                      </div>
                    )}
                    {profile.address.districtId && (
                      <div>
                        <div className="text-slate-500">District ID</div>
                        <div className="font-mono text-slate-700 truncate">{profile.address.districtId.slice(-8)}</div>
                      </div>
                    )}
                    {profile.address.sectorId && (
                      <div>
                        <div className="text-slate-500">Sector ID</div>
                        <div className="font-mono text-slate-700 truncate">{profile.address.sectorId.slice(-8)}</div>
                      </div>
                    )}
                    {profile.address.cellId && (
                      <div>
                        <div className="text-slate-500">Cell ID</div>
                        <div className="font-mono text-slate-700 truncate">{profile.address.cellId.slice(-8)}</div>
                      </div>
                    )}
                    {profile.address.villageId && (
                      <div>
                        <div className="text-slate-500">Village ID</div>
                        <div className="font-mono text-slate-700 truncate">{profile.address.villageId.slice(-8)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <FaMapMarkerAlt className="text-5xl text-slate-300 mb-4" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500"></div>
                </div>
                <div className="text-lg font-medium text-slate-500 mb-2">No Address Information</div>
                <div className="text-sm text-slate-400 text-center max-w-md">
                  Complete your address details to enhance your profile and enable location-based services
                </div>
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
              <div className="space-y-6">
                {/* Emergency Contact - Highlighted */}
                <div className="rounded-lg border border-rose-200 bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-sm text-rose-500" />
                      <div className="text-xs font-medium text-rose-700 uppercase tracking-wide">Emergency Contact</div>
                    </div>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                      Priority
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900">{profile.familyDetails.emergencyContactName || "—"}</div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-xs text-slate-400" />
                      <span className="text-sm text-slate-600">{profile.familyDetails.emergencyContactPhone || "—"}</span>
                    </div>
                    {profile.familyDetails.emergencyContactRelation && (
                      <div className="flex items-center gap-2">
                        <FaUserFriends className="text-xs text-slate-400" />
                        <span className="text-xs text-slate-500">Relation: {profile.familyDetails.emergencyContactRelation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parents Section */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Parents Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaUserFriends className="text-sm text-blue-400" />
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Father</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-slate-900">{profile.familyDetails.fatherName || "—"}</div>
                        {/* Father phone removed: not in type */}
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaUserFriends className="text-sm text-pink-400" />
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mother</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-slate-900">{profile.familyDetails.motherName || "—"}</div>
                        {/* Mother phone removed: not in type */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spouse Information */}
                {profile.familyDetails.spouseName && (
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserFriends className="text-sm text-blue-500" />
                      <div className="text-xs font-medium text-blue-700 uppercase tracking-wide">Spouse Information</div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{profile.familyDetails.spouseName}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {profile.familyDetails.spousePhone && (
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Phone</div>
                            <div className="text-sm text-slate-700">{profile.familyDetails.spousePhone}</div>
                          </div>
                        )}
                        {profile.familyDetails.spouseNationalId && (
                          <div>
                            <div className="text-xs text-slate-500 mb-1">National ID</div>
                            <div className="text-sm text-slate-700">{profile.familyDetails.spouseNationalId}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Family Details */}
                <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Additional Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Family ID</div>
                      <div className="font-mono text-slate-700 truncate">{profile.familyDetails.id?.slice(-8)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Last Updated</div>
                      {/* updatedAt removed: not in type */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <FaUserFriends className="text-5xl text-slate-300 mb-4" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500"></div>
                </div>
                <div className="text-lg font-medium text-slate-500 mb-2">No Family Information</div>
                <div className="text-sm text-slate-400 text-center max-w-md">
                  Add family and emergency contact details for important notifications and emergency situations
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Timeline */}
      <Card className="transform transition-all duration-500 animate-in fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-50 p-1.5">
              <FaHistory className="text-purple-600" />
            </div>
            <div>
              <div>Account Timeline</div>
              <CardDescription>Key milestones in your account history</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Created At */}
              <div className="relative pl-12">
                <div className="absolute left-2 top-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white shadow"></div>
                <div className="text-sm font-semibold text-slate-900">Account Created</div>
                <div className="text-sm text-slate-600 mt-1">{dateStr(profile?.createdAt)}</div>
                <div className="text-xs text-slate-500 mt-1">Your journey with us began</div>
              </div>

              {/* Last Updated */}
              <div className="relative pl-12">
                <div className="absolute left-2 top-1 h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                <div className="text-sm font-semibold text-slate-900">Last Profile Update</div>
                <div className="text-sm text-slate-600 mt-1">{dateStr(profile?.updatedAt)}</div>
                <div className="text-xs text-slate-500 mt-1">Most recent profile update</div>
              </div>

              {/* Last Login */}
              {profile?.lastLoginAt && (
                <div className="relative pl-12">
                  <div className="absolute left-2 top-1 h-5 w-5 rounded-full bg-purple-500 border-2 border-white shadow"></div>
                  <div className="text-sm font-semibold text-slate-900">Last Login</div>
                  <div className="text-sm text-slate-600 mt-1">{dateStr(profile.lastLoginAt)}</div>
                  <div className="text-xs text-slate-500 mt-1">Most recent account access</div>
                </div>
              )}

              {/* Trust Score Milestone */}
              <div className="relative pl-12">
                <div className="absolute left-2 top-1 h-5 w-5 rounded-full bg-amber-500 border-2 border-white shadow"></div>
                <div className="text-sm font-semibold text-slate-900">Trust Score Achievement</div>
                <div className="text-sm text-slate-600 mt-1">Current: {profile?.trustScore || 0}/100</div>
                <div className="text-xs text-slate-500 mt-1">
                  {profile?.trustScore && profile.trustScore >= 90 ? "Excellent - Top tier reputation" :
                   profile?.trustScore && profile.trustScore >= 70 ? "Great - Strong financial standing" :
                   "Building - Continue positive behavior"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}