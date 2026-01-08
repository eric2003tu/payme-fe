"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { PropsWithChildren } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export function DashboardShell({ children }: PropsWithChildren) {
  const { user } = useAuth();
  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar />
      <main className="container-fluid flex-1 py-6">
        <DashboardHeader />
        {children}
      </main>
    </div>
  );
}
