"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { TeamLogo } from "@/components/team-logo";
import { LEC_TEAMS } from "@/lib/teams";
import { Plus, Save, Trash2, Shield, Lock, Unlock } from "lucide-react";

type Match = {
  id: string;
  teamA: string;
  teamB: string;
  format: string;
  scheduledAt: string;
  winner: string | null;
  scoreA: number | null;
  scoreB: number | null;
  locked: boolean;
};

export default function AdminPage() {
  const { status, data: session } = useSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState({ teamA: "", teamB: "", format: "BO3", split: "LEC Summer 2026", scheduledAt: "" });
  const [result, setResult] = useState<Record<string, { winner: string; scoreA: string; scoreB: string }>>({});

  useEffect(() => {
    if (status === "unauthenticated") redirect("/");
  }, [status]);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    const r = await fetch("/api/matches");
    const data = await r.json();
    setMatches(data);
  }

  async function createMatch(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ teamA: "", teamB: "", format: "BO3", split: "LEC Summer 2026", scheduledAt: "" });
    fetchMatches();
  }

  async function setResultMatch(id: string, format: string) {
    const r = result[id] || { winner: "", scoreA: "", scoreB: "" };
    const body: Record<string, unknown> = { winner: r.winner, locked: true };
    if (format !== "BO1") {
      body.scoreA = Number(r.scoreA);
      body.scoreB = Number(r.scoreB);
    }
    await fetch(`/api/matches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchMatches();
  }

  async function toggleLock(id: string, locked: boolean) {
    await fetch(`/api/matches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: !locked }),
    });
    fetchMatches();
  }

  async function deleteMatch(id: string) {
    if (!confirm("Supprimer ce match ?")) return;
    await fetch(`/api/matches/${id}`, { method: "DELETE" });
    fetchMatches();
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface/60 p-12 text-center backdrop-blur-xl">
        <Shield className="mx-auto mb-4 h-12 w-12 text-text-muted" />
        <p className="text-lg text-text-muted">Cette page est réservée au compte admin.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Gestion des matchs</h1>
        <a href="/admin/users" className="rounded-xl border border-white/10 bg-surface-elevated px-4 py-2 text-sm font-bold text-text-muted transition-all hover:border-primary/30 hover:text-primary">
          Gérer les utilisateurs
        </a>
      </div>

      <form onSubmit={createMatch} className="mb-10 rounded-2xl border border-white/10 bg-surface/60 p-6 backdrop-blur-xl">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Plus className="h-5 w-5 text-primary" />
          Ajouter un match
        </h2>
        <div className="grid gap-4 md:grid-cols-5">
          <select
            value={form.teamA}
            onChange={(e) => setForm({ ...form, teamA: e.target.value })}
            className="rounded-xl border border-white/10 bg-white px-3 py-2.5 font-medium text-bg"
            required
          >
            <option value="">Équipe A</option>
            {LEC_TEAMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={form.teamB}
            onChange={(e) => setForm({ ...form, teamB: e.target.value })}
            className="rounded-xl border border-white/10 bg-white px-3 py-2.5 font-medium text-bg"
            required
          >
            <option value="">Équipe B</option>
            {LEC_TEAMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={form.format}
            onChange={(e) => setForm({ ...form, format: e.target.value })}
            className="rounded-xl border border-white/10 bg-white px-3 py-2.5 font-medium text-bg"
          >
            <option value="BO1">BO1</option>
            <option value="BO3">BO3</option>
            <option value="BO5">BO5</option>
          </select>
          <input
            type="text"
            placeholder="Split"
            value={form.split}
            onChange={(e) => setForm({ ...form, split: e.target.value })}
            className="rounded-xl border border-white/10 bg-white px-3 py-2.5 font-medium text-bg"
          />
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            className="rounded-xl border border-white/10 bg-white px-3 py-2.5 font-medium text-bg"
          />
        </div>
        <button type="submit" className="mt-4 rounded-xl bg-primary px-6 py-2.5 font-bold text-bg shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover">
          Ajouter le match
        </button>
      </form>

      <div className="space-y-4">
        {matches.map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-surface/60 p-5 transition-all hover:border-white/20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <TeamLogo name={m.teamA} size={40} />
                  <span className="font-bold">{m.teamA}</span>
                </div>
                <span className="text-sm text-text-muted">vs</span>
                <div className="flex items-center gap-3">
                  <TeamLogo name={m.teamB} size={40} />
                  <span className="font-bold">{m.teamB}</span>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold">{m.format}</span>
              </div>
              <p className="text-sm text-text-muted">
                {new Date(m.scheduledAt).toLocaleString("fr-FR")}
                {m.locked && " — verrouillé"}
                {m.winner && ` — ${m.winner === "teamA" ? m.teamA : m.teamB} ${m.scoreA}-${m.scoreB}`}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <select
                value={result[m.id]?.winner || ""}
                onChange={(e) =>
                  setResult((prev) => ({ ...prev, [m.id]: { ...(prev[m.id] || { scoreA: "", scoreB: "" }), winner: e.target.value } }))
                }
                className="rounded-xl border border-white/10 bg-white px-3 py-2 text-sm font-medium text-bg"
              >
                <option value="">Vainqueur</option>
                <option value="teamA">{m.teamA}</option>
                <option value="teamB">{m.teamB}</option>
              </select>
              {m.format !== "BO1" && (
                <>
                  <input
                    type="number"
                    placeholder="Score A"
                    value={result[m.id]?.scoreA || ""}
                    onChange={(e) =>
                      setResult((prev) => ({ ...prev, [m.id]: { ...(prev[m.id] || { winner: "", scoreB: "" }), scoreA: e.target.value } }))
                    }
                    className="w-24 rounded-xl border border-white/10 bg-white px-3 py-2 text-sm font-medium text-bg"
                  />
                  <input
                    type="number"
                    placeholder="Score B"
                    value={result[m.id]?.scoreB || ""}
                    onChange={(e) =>
                      setResult((prev) => ({ ...prev, [m.id]: { ...(prev[m.id] || { winner: "", scoreA: "" }), scoreB: e.target.value } }))
                    }
                    className="w-24 rounded-xl border border-white/10 bg-white px-3 py-2 text-sm font-medium text-bg"
                  />
                </>
              )}
              <button
                onClick={() => setResultMatch(m.id, m.format)}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-bg transition-all hover:bg-primary-hover"
              >
                <Save className="h-4 w-4" />
                Enregistrer
              </button>
              <button
                onClick={() => toggleLock(m.id, m.locked)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  m.locked
                    ? "border border-white/10 bg-white/5 text-text-muted hover:border-primary/30 hover:text-primary"
                    : "border border-white/10 bg-white/5 text-text-muted hover:border-danger/30 hover:text-danger"
                }`}
              >
                {m.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {m.locked ? "Déverrouiller" : "Verrouiller"}
              </button>
              <button
                onClick={() => deleteMatch(m.id)}
                className="flex items-center gap-1.5 rounded-xl bg-danger px-4 py-2 text-sm font-bold text-white transition-all hover:opacity-90"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
