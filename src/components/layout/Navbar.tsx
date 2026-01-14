"use client";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="container-fluid flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="PayMeNow Logo" className="h-20 w-20" />
          <span className="text-sm font-semibold">PayMeNow</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/auth/login" className="hover:underline">Login</Link>
          <Link
            href="/auth/signup"
            className="rounded-md bg-blue px-3 py-1.5 text-white hover:opacity-90"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
