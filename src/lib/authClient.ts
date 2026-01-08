"use client";
import { appClient, saveSession, loadSession } from "./appClient";
import type { AuthSession, LoginRequest, LoginResponse, UserDto } from "./types";

export const authClient = {
  async login(credentials: LoginRequest): Promise<AuthSession> {
    const data = await appClient.post<LoginResponse>("/auth/login", credentials, { showErrorToast: false });
    const accessTokenExpiresAt = Date.now() + (data.expiresIn ?? 900) * 1000;
    const session: AuthSession = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiresAt,
      user: data.user as UserDto,
    };
    saveSession(session);
    return session;
  },
  async register(payload: any): Promise<any> {
    // Let caller handle specific success/error toasts
    return appClient.post<any>("/auth/register", payload, { showErrorToast: false });
  },

  logout() {
    saveSession(null);
    // Toast after logout
    if (typeof window !== "undefined") {
      import("sonner").then(({ toast }) => toast.success("You have been signed out"));
    }
  },

  getSession(): AuthSession | null {
    return loadSession();
  },
};
