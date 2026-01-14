"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { notificationsClient } from "@/lib/notificationsClient";

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
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    let timer: any;
    const fetchUnread = async () => {
      try {
        const list = await notificationsClient.unread();
        if (mounted) setUnreadCount(list?.length || 0);
      } catch {
        // ignore
      }
    };
    fetchUnread();
    timer = setInterval(fetchUnread, 60000);
    return () => { mounted = false; if (timer) clearInterval(timer); };
  }, []);

  const parts = (pathname || "/dashboard")
    .split("/")
    .filter(Boolean);

  const crumbParts = parts[0] === "dashboard" ? parts : ["dashboard", ...parts];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleDropdown = () => setDropdownOpen((v) => !v);
  const handleLogout = () => {
    // TODO: Add logout logic here
    window.location.href = "/auth/login";
  };
  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropdownOpen]);

  // Dropdown UI
  const { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } = require("@/components/ui/dropdown");
  const { User, Settings, LogOut } = require("lucide-react");

  return (
    <header className="sticky top-0 z-30 mb-6">
      <div className="glass-card flex items-center justify-between gap-4 rounded-xl border px-2 py-2 md:px-4 md:py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">

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
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/dashboard/notifications" aria-label="Notifications">
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          </Button>
          <Dropdown className="user-dropdown ml-1">
            <DropdownTrigger onClick={handleDropdown} className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue to-pink text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-medium text-slate-900">{user?.firstName} {user?.lastName}</div>
                <div className="text-[10px] text-slate-500">{user?.role}</div>
              </div>
            </DropdownTrigger>
            <DropdownMenu open={dropdownOpen}>
              <DropdownItem onClick={() => window.location.href = "/dashboard/profile"}>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Profile
                </span>
              </DropdownItem>
              <DropdownItem onClick={() => window.location.href = "/dashboard/settings"}>
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  Settings
                </span>
              </DropdownItem>
              <DropdownItem onClick={handleLogout} className="text-red-600">
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4 text-red-600" />
                  Logout
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
