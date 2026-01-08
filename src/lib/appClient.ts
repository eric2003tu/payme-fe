import { AuthSession, ApiError } from "./types";

// Base API client with JSON helpers and auth header injection
type RequestOptions = RequestInit & { showErrorToast?: boolean };

export class AppClient {
  private baseUrl: string;
  private getSession: () => AuthSession | null;

  constructor(opts: { baseUrl: string; getSession: () => AuthSession | null }) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, "");
    this.getSession = opts.getSession;
  }

  async request<T>(path: string, init: RequestOptions = {}): Promise<T> {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

    const headers = new Headers(init.headers || {});
    headers.set("Accept", "application/json");
    if (!(init.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const session = this.getSession();
    let token = session?.accessToken;
    if (!token && typeof window !== "undefined") {
      // Fallback to localStorage token keys if session is unavailable
      token = localStorage.getItem("pnm.accessToken") || localStorage.getItem("pmn.accessToken") || undefined;
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, { ...init, headers, credentials: "include" });
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;

    if (!res.ok) {
      const err: ApiError = {
        status: res.status,
        message: (data && (data.message || data.error)) || res.statusText,
        details: data,
      };
      // Fire a global toast on the client unless explicitly suppressed
      if (typeof window !== "undefined" && init.showErrorToast !== false) {
        // Dynamic import avoids SSR issues
        import("sonner").then(({ toast }) => {
          const label = err.status >= 500 ? "Server error" : "Request failed";
          toast.error(`${label}: ${err.message || "Unexpected error"}`);
        }).catch(() => void 0);
      }
      throw err;
    }
    return data as T;
  }

  get<T>(path: string, init?: RequestOptions) {
    return this.request<T>(path, { ...init, method: "GET" });
  }

  post<T>(path: string, body?: any, init?: RequestOptions) {
    return this.request<T>(path, { ...init, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) });
  }
}

// Simple localStorage-backed session store
const SESSION_KEY = "pmn.session";
const ACCESS_TOKEN_KEY = "pmn.accessToken";
const REFRESH_TOKEN_KEY = "pmn.refreshToken";
const USER_KEY = "pmn.user";

export function loadSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed || null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }
}

export const appClient = new AppClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  getSession: () => loadSession(),
});
