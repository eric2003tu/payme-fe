"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notificationsClient, type NotificationDto } from "@/lib/notificationsClient";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

function badgeClass(t: string) {
  const s = t.toUpperCase();
  if (s === "VERIFICATION_STATUS") return "bg-emerald-100 text-emerald-700";
  if (s === "LOAN_OFFER") return "bg-indigo-100 text-indigo-700";
  if (s === "LOAN_APPROVED") return "bg-blue-100 text-blue-700";
  if (s === "LOAN_DISBURSED") return "bg-green-100 text-green-700";
  if (s === "REPAYMENT_RECEIVED") return "bg-teal-100 text-teal-700";
  if (s === "REPAYMENT_REMINDER" || s === "LOAN_OVERDUE") return "bg-amber-100 text-amber-700";
  if (s === "CATEGORY_UPDATED") return "bg-sky-100 text-sky-700";
  if (s === "SYSTEM_ANNOUNCEMENT") return "bg-slate-100 text-slate-700";
  if (s === "GUARANTOR_REQUEST") return "bg-pink-100 text-pink-700";
  return "bg-slate-100 text-slate-700";
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [unread, setUnread] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [type, setType] = useState<string>("ALL");
  const [range, setRange] = useState<"ALL" | "7" | "30" | "90">("ALL");

  const byNewFirst = (a: NotificationDto, b: NotificationDto) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  const load = async () => {
    setLoading(true);
    try {
      const [all, ur] = await Promise.all([
        notificationsClient.list({ limit: 50 }),
        notificationsClient.unread(),
      ]);
      setItems((all || []).slice().sort(byNewFirst));
      setUnread((ur || []).slice().sort(byNewFirst));
    } catch (err: any) {
      toast.error(err?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    return {
      unread: unread.length,
      recent: items.length,
      muted: 0,
    };
  }, [items, unread]);

  const sortedItems = useMemo(() => items.slice().sort(byNewFirst), [items]);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    items.forEach((n) => set.add(String(n.type).toUpperCase()));
    return Array.from(set).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const now = new Date();
    const cutoff = ((): Date | null => {
      if (range === "7") {
        const d = new Date(now);
        d.setDate(d.getDate() - 7);
        return d;
      }
      if (range === "30") {
        const d = new Date(now);
        d.setDate(d.getDate() - 30);
        return d;
      }
      if (range === "90") {
        const d = new Date(now);
        d.setDate(d.getDate() - 90);
        return d;
      }
      return null;
    })();

    const q = query.trim().toLowerCase();
    return sortedItems.filter((n) => {
      if (status === "UNREAD" && n.isRead) return false;
      if (status === "READ" && !n.isRead) return false;
      if (type !== "ALL" && String(n.type).toUpperCase() !== type) return false;
      if (cutoff && new Date(n.createdAt) < cutoff) return false;
      if (!q) return true;
      const title = n.title?.toLowerCase() || "";
      const msg = n.message?.toLowerCase() || "";
      return title.includes(q) || msg.includes(q);
    });
  }, [sortedItems, status, type, range, query]);

  const markOneRead = async (id: string) => {
    setBusy(id);
    try {
      await notificationsClient.markRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)));
      setUnread((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      toast.error(err?.message || "Failed to mark as read");
    } finally {
      setBusy(null);
    }
  };

  const markAllRead = async () => {
    setBusy("*all*");
    try {
      await notificationsClient.readAll();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt || new Date().toISOString() })));
      setUnread([]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to mark all as read");
    } finally {
      setBusy(null);
    }
  };

  const deleteOne = async (id: string) => {
    setBusy(`del:${id}`);
    try {
      await notificationsClient.delete(id);
      setItems((prev) => prev.filter((n) => n.id !== id));
      setUnread((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete notification");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Stay up to date"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>Refresh</Button>
            <Button size="sm" onClick={markAllRead} disabled={loading || unread.length === 0 || busy === "*all*"}>
              Mark all read
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Unread" value={counts.unread} accent="orange" />
        <StatCard title="Recent" value={counts.recent} accent="blue" />
        <StatCard title="Muted" value={counts.muted} accent="green" />
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-2">
              <Input
                placeholder="Search notifications…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Status</label>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="ALL">All</option>
                <option value="UNREAD">Unread</option>
                <option value="READ">Read</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Type</label>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="ALL">All types</option>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Date</label>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={range}
                onChange={(e) => setRange(e.target.value as any)}
              >
                <option value="ALL">All time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="py-8 text-center text-slate-500">Loading notifications…</div>
          ) : items.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No notifications yet</div>
          ) : (
            <ul className="space-y-3">
              {filteredItems.map((n) => (
                <li key={n.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeClass(String(n.type))}`}>
                          {String(n.type).replace(/_/g, " ")}
                        </span>
                        {!n.isRead && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">{n.title}</div>
                      <div className="mt-0.5 text-sm text-slate-700">{n.message}</div>
                      <div className="mt-1 text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {!n.isRead && (
                        <Button size="sm" variant="outline" onClick={() => markOneRead(n.id)} disabled={busy === n.id}>Mark read</Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteOne(n.id)} disabled={busy === `del:${n.id}`}>Delete</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
