import { appClient } from "./appClient";

export type NotificationType =
  | "LOAN_REQUEST"
  | "LOAN_OFFER"
  | "LOAN_APPROVED"
  | "LOAN_DISBURSED"
  | "REPAYMENT_REMINDER"
  | "REPAYMENT_RECEIVED"
  | "LOAN_OVERDUE"
  | "CATEGORY_UPDATED"
  | "VERIFICATION_STATUS"
  | "SYSTEM_ANNOUNCEMENT"
  | "GUARANTOR_REQUEST";

export type NotificationDto = {
  id: string;
  userId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  data?: Record<string, any> | null;
  isRead: boolean;
  isDeleted?: boolean;
  createdAt: string;
  readAt?: string | null;
};

export const notificationsClient = {
  async list(params?: {
    limit?: number;
    isRead?: boolean;
    type?: string;
    from?: string; // ISO date string
    to?: string; // ISO date string
  }): Promise<NotificationDto[]> {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (typeof params?.isRead === "boolean") q.set("isRead", String(params.isRead));
    if (params?.type) q.set("type", String(params.type));
    if (params?.from) q.set("from", params.from);
    if (params?.to) q.set("to", params.to);
    const qs = q.toString();
    const path = `/notifications/me${qs ? `?${qs}` : ""}`;
    return appClient.get<NotificationDto[]>(path);
  },
  async unread(): Promise<NotificationDto[]> {
    return appClient.get<NotificationDto[]>("/notifications/me/unread");
  },
  async markRead(id: string): Promise<{ success?: boolean } | NotificationDto> {
    return appClient.request(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" });
  },
  async readAll(): Promise<{ success?: boolean } | { count?: number }> {
    return appClient.request(`/notifications/me/read-all`, { method: "PATCH" });
  },
  async delete(id: string): Promise<{ success?: boolean } | NotificationDto> {
    return appClient.request(`/notifications/${encodeURIComponent(id)}/delete`, { method: "PATCH" });
  },
};
