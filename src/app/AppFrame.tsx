"use client";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { Navbar } from "@/components/layout/Navbar";

export function AppFrame({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <div className="min-h-[100dvh]">
      {!isDashboard && <Navbar />}
      {children}
    </div>
  );
}
