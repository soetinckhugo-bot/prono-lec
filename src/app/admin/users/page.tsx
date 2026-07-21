"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, Ban, CheckCircle, Users } from "lucide-react";

type UserAdmin = {
  id: string;
  username: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  score: number;
};

export default function AdminUsersPage() {
  const { status, data: session } = useSession();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/");
  }, [status]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const r = await fetch("/api/admin/users");
    const data = await r.json();
    setUsers(data);
    setLoading(false);
  }

  async function toggleBan(userId: string, isBanned: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isBanned }),
    });
    fetchUsers();
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface/60 p-12 text-center backdrop-blur-xl">
        <Shield className="mx-auto mb-4 h-12 w-12 text-text-muted" />
        <p className="text-lg text-text-muted">Cette page est réservée au compte admin.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 flex items-center gap-3 text-3xl font-black tracking-tight md:text-4xl">
        <Users className="h-8 w-8 text-primary" />
        Gestion des utilisateurs
      </h1>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-xl">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-text-muted">Pseudo</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-text-muted">Rôle</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-text-muted">Points</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-text-muted">Inscrit le</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-text-muted">Statut</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-text-muted">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-white/5">
                <td className="px-6 py-4 font-semibold text-white">{u.username}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${u.role === "admin" ? "border border-primary/30 bg-primary/10 text-primary" : "border border-white/10 bg-white/5 text-text-muted"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-mono">{u.score}</td>
                <td className="px-6 py-4 text-center text-sm text-text-muted">
                  {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 text-center">
                  {u.isBanned ? (
                    <span className="flex items-center justify-center gap-1 text-sm font-bold text-danger">
                      <Ban className="h-4 w-4" /> Banni
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1 text-sm font-bold text-primary">
                      <CheckCircle className="h-4 w-4" /> Actif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => toggleBan(u.id, !u.isBanned)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                        u.isBanned
                          ? "bg-primary text-bg hover:bg-primary-hover"
                          : "bg-danger text-white hover:opacity-90"
                      }`}
                    >
                      {u.isBanned ? "Débannir" : "Bannir"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && <p className="mt-8 text-center text-text-muted">Aucun utilisateur.</p>}
    </div>
  );
}
