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
];

const adminLinks = [
  { href: "/dashboard/users", label: "Users", icon: User2 },
  { href: "/dashboard/aprovals", label: "Approvals", icon: CheckCircle2 },
];

import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const links = isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;
  return (
    <>
      {/* Mobile sidebar overlay */}
      <button
        className="fixed top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        style={{ display: open ? 'none' : undefined }}
      >
        <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Sidebar */}
      <aside className={`glass-card fixed top-0 left-0 z-50 h-full w-64 shrink-0 overflow-y-auto border-r px-3 py-4 bg-white transition-transform duration-300 lg:sticky lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:block`}> 
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="relative">
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg lg:text-xl">PM</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 lg:h-4 lg:w-4 rounded-full bg-emerald-500 border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              PayMeNow
            </span>
            <span className="text-xs text-slate-500 hidden lg:block">
              Smart Lending Platform
            </span>
          </div>
        </Link>
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link href={href} key={href} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`} onClick={() => setOpen(false)}>
                <Icon size={18} className="text-slate-600" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 border-t pt-4">
          <Link href="/settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" onClick={() => setOpen(false)}>
            <Settings size={18} className="text-slate-600" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)}></div>}
    </>
  );
}
