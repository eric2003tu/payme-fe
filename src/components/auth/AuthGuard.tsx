"use client";
import { useEffect, useState, PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

export function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = authClient.getSession();
    if (session) {
      setAllowed(true);
      setChecked(true);
    } else {
      setAllowed(false);
      setChecked(true);
      import("sonner").then(({ toast }) => {
        toast.error("Please sign in to continue");
      });
      router.replace("/auth/login");
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-[100dvh] grid place-items-center">
        <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
