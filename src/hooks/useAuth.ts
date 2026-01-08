import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/authClient";

export type Role = "guest" | "user" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
}

function mapRole(apiRole?: string): Role {
  if (!apiRole) return "user";
  const r = apiRole.toUpperCase();
  if (r.includes("ADMIN")) return "admin";
  return "user";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = authClient.getSession();
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        role: mapRole(session.user.role),
        firstName: session.user.firstName,
        lastName: session.user.lastName,
      });
    } else {
      setUser(null);
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return useMemo(() => ({ user, isAuthenticated, isAdmin }), [user, isAuthenticated, isAdmin]);
}
