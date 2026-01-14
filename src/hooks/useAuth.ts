
import { useMemo } from "react";
import useSWR from "swr";
import { authClient } from "@/lib/authClient";

export type Role = "guest" | "user" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  category?: string;
  trustScore?: number;
  profilePicture?: string | null;
  avatarUrl?: string | null;
}

function mapRole(apiRole?: string): Role {
  if (!apiRole) return "user";
  const r = apiRole.toUpperCase();
  if (r.includes("ADMIN")) return "admin";
  return "user";
}

export function useAuth() {
  // Get initial user from session for instant fallback
  const session = authClient.getSession();
  const fallbackUser = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        role: mapRole(session.user.role),
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        category: session.user.category,
        trustScore: session.user.trustScore,
        profilePicture: session.user.profilePicture,
        avatarUrl: session.user.avatarUrl,
      }
    : null;

  // Use SWR for profile fetching and caching
  const { data: user, mutate } = useSWR('auth/profile', authClient.profile, {
    fallbackData: fallbackUser,
    revalidateOnFocus: true,
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const logout = async () => {
    await authClient.logout();
    mutate(null, false); // Clear user from cache
  };

  return useMemo(() => ({ user, isAuthenticated, isAdmin, logout }), [user, isAuthenticated, isAdmin]);
}
