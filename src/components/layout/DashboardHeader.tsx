"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function segmentLabel(segment: string) {
  const map: Record<string, string> = {
    dashboard: "Dashboard",
    loans: "Offers",
    offers: "Offers",
    "my-loans": "My Loans",
    "my-requests": "My Requests",
    "request-loan": "Request Loan",
    "offer-loan": "Offer Loan",
    lenders: "Lenders",
    borrowers: "Borrowers",
    borrowes: "Borrowes",
    notifications: "Notifications",
    profile: "Profile",
    users: "Users",
    aprovals: "Approvals",
  };
  return map[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  const parts = (pathname || "/dashboard")
    .split("/")
    .filter(Boolean);

  const crumbParts = parts[0] === "dashboard" ? parts : ["dashboard", ...parts];

  return (
    <header className="sticky top-0 z-30 mb-6">
      <div className="glass-card flex items-center justify-between gap-4 rounded-xl border px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center text-sm text-slate-600">
          {crumbParts.map((seg, idx) => {
            const href = "/" + crumbParts.slice(0, idx + 1).join("/");
            const isLast = idx === crumbParts.length - 1;
            return (
              <div key={href} className="flex items-center">
                {idx > 0 && <ChevronRight className="mx-2 h-4 w-4 text-slate-400" />}
                {isLast ? (
                  <span className="font-medium text-slate-900">{segmentLabel(seg)}</span>
                ) : (
                  <Link href={href} className="hover:text-slate-900">
                    {segmentLabel(seg)}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search loans, users, activities..." className="pl-9" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/notifications" aria-label="Notifications">
              <Bell className="h-5 w-5 text-slate-600" />
            </Link>
          </Button>
          <div className="ml-1 flex items-center gap-2 rounded-full border bg-white px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue to-pink text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="text-xs font-medium text-slate-900">{user?.firstName} {user?.lastName}</div>
              <div className="text-[10px] text-slate-500">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
