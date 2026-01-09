"use client";
import { useEffect, useState } from "react";
import { usersClient, User } from "@/lib/usersClient";
import { StatCard } from "@/components/StatCard";

export default function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    usersClient.getAll()
      .then(setUsers)
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  // Stats
  const total = users.length;
  const active = users.filter(u => u.status === "ACTIVE").length;
  const pending = users.filter(u => u.status === "PENDING").length;
  const suspended = users.filter(u => u.status === "SUSPENDED").length;
  const blocked = users.filter(u => u.status === "BLOCKED").length;
  const admins = users.filter(u => u.role === "ADMIN").length;
  const regularUsers = users.filter(u => u.role === "USER").length;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={loading ? "-" : total} accent="blue" />
        <StatCard title="Active" value={loading ? "-" : active} accent="green" />
        <StatCard title="Pending" value={loading ? "-" : pending} accent="orange" />
        <StatCard title="Suspended" value={loading ? "-" : suspended} accent="yellow" />
        <StatCard title="Blocked" value={loading ? "-" : blocked} accent="pink" />
        <StatCard title="Admins" value={loading ? "-" : admins} accent="purple" />
        <StatCard title="Regular Users" value={loading ? "-" : regularUsers} accent="gray" />
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white/80 dark:bg-slate-900/60 shadow min-h-[200px]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-3 py-2 border">Name</th>
              <th className="px-3 py-2 border">Email</th>
              <th className="px-3 py-2 border">Phone</th>
              <th className="px-3 py-2 border">Role</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Trust Score</th>
              <th className="px-3 py-2 border">Category</th>
              <th className="px-3 py-2 border">National ID</th>
              <th className="px-3 py-2 border">Verified</th>
              <th className="px-3 py-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="even:bg-muted/50 animate-pulse">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <td key={j} className="px-3 py-2 border">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={10} className="text-center text-destructive py-12">{error}</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="even:bg-muted/50 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                  <td className="px-3 py-2 border font-medium">{user.firstName} {user.lastName}</td>
                  <td className="px-3 py-2 border">{user.email}</td>
                  <td className="px-3 py-2 border">{user.phone}</td>
                  <td className="px-3 py-2 border">{user.role}</td>
                  <td className="px-3 py-2 border">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold bg-opacity-20 ${
                      user.status === "ACTIVE" ? "bg-green-500 text-green-800" :
                      user.status === "PENDING" ? "bg-orange-400 text-orange-900" :
                      user.status === "SUSPENDED" ? "bg-yellow-400 text-yellow-900" :
                      user.status === "BLOCKED" ? "bg-pink-400 text-pink-900" :
                      "bg-gray-300 text-gray-800"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 border text-center">{user.trustScore}</td>
                  <td className="px-3 py-2 border">{user.category}</td>
                  <td className="px-3 py-2 border">{user.nationalId}</td>
                  <td className="px-3 py-2 border text-center">{user.nationalIdVerified ? "Yes" : "No"}</td>
                  <td className="px-3 py-2 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
