import * as React from "react";
import { cn } from "@/lib/utils";

export function Dropdown({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  );
}

export function DropdownTrigger({ children, className, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={cn("cursor-pointer", className)} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenu({ open, children, className }: { open: boolean; children: React.ReactNode; className?: string }) {
  if (!open) return null;
  return (
    <div className={cn("absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50", className)}>
      {children}
    </div>
  );
}

export function DropdownItem({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      className={cn("w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", className)}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
