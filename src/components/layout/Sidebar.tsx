"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Bell, Users, Landmark, FileCheck, FileText, User2, UserCircle2, Settings, CheckCircle2, Handshake } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const baseLinks = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/loans", label: "Offers", icon: Handshake },
  { href: "/dashboard/my-loans", label: "My Loans", icon: FileText },
  { href: "/dashboard/loan-requests", label: "Loan Requests", icon: FileCheck },
  { href: "/dashboard/my-requests", label: "My Requests", icon: FileCheck },
  { href: "/dashboard/offer-received", label: "Offers Received", icon: Handshake },
  { href: "/dashboard/my-transactions", label: "My Transactions", icon: Landmark },
  { href: "/dashboard/lenders", label: "Lenders", icon: Users },
  { href: "/dashboard/borrowers", label: "Borrowers", icon: Users },
  { href: "/dashboard/borrowes", label: "Borrowes", icon: Users },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
];

const adminLinks = [
  { href: "/dashboard/users", label: "Users", icon: User2 },
  { href: "/dashboard/aprovals", label: "Approvals", icon: CheckCircle2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const links = isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;
  return (
    <aside className="glass-card sticky top-0 h-[100dvh] w-64 shrink-0 overflow-y-auto border-r px-3 py-4">
      <Link href="/" className="flex items-center gap-2 mb-6">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-md" style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-pink))" }}></div>
        <span className="text-sm font-semibold">PayMeNow</span>
      </div>
      </Link>
      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link href={href} key={href} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}>
              <Icon size={18} className="text-slate-600" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t pt-4">
        <Link href="/settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900">
          <Settings size={18} className="text-slate-600" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
