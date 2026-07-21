"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { TeamLogo } from "@/components/team-logo";
import { Trophy, Target, XCircle, CheckCircle2, CalendarDays } from "lucide-react";

type HistoryItem = {
  id: string;
  matchId: string;
  teamA: string;
  teamB: string;
  format: string;
  split: string | null;
  winner: string | null;
  scoreA: number | null;
  scoreB: number | null;
  predictionWinner: string;
  predictionScoreA: number;
  predictionScoreB: number;
  points: number;
  scheduledAt: string;
};

type TeamStat = {
  team: string;
  played: number;
  correct: number;
  pct: number;
};

type SplitStats = {
  total: number;
  correct: number;
  exact: number;
  wrong: number;
  correctPct: number;
  exactPct: number;
  wrongPct: number;
};

type DashboardData = {
  split: string;
  splitStats: SplitStats;
  teamStats: TeamStat[];
  history: HistoryItem[];
};

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/");
  }, [status]);

  useEffect(() => {
    fetch("/api/users/me/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!session || !data) return null;

  const user = session.user as { name?: string };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Dashboard</h1>
        <p className="mt-2 flex items-center gap-2 text-text-muted">
          <Trophy className="h-4 w-4" />
          {user.name} — {data.split}
        </p>
      </header>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-surface/60 p-5 backdrop-blur-xl">
          <p className="text-sm text-text-muted">Total pronos</p>
          <p className="mt-1 text-3xl font-black text-white">{data.splitStats.total}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface/60 p-5 backdrop-blur-xl">
          <p className="text-sm text-text-muted flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Bons</p>
          <p className="mt-1 text-3xl font-black text-primary">{data.splitStats.correctPct}%</p>
          <p className="text-xs text-text-muted">{data.splitStats.correct} / {data.splitStats.total}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface/60 p-5 backdrop-blur-xl">
          <p className="text-sm text-text-muted flex items-center gap-1"><Target className="h-4 w-4 text-warning" /> Exact</p>
          <p className="mt-1 text-3xl font-black text-warning">{data.splitStats.exactPct}%</p>
          <p className="text-xs text-text-muted">{data.splitStats.exact} / {data.splitStats.total}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface/60 p-5 backdrop-blur-xl">
          <p className="text-sm text-text-muted flex items-center gap-1"><XCircle className="h-4 w-4 text-danger" /> Faux</p>
          <p className="mt-1 text-3xl font-black text-danger">{data.splitStats.wrongPct}%</p>
          <p className="text-xs text-text-muted">{data.splitStats.wrong} / {data.splitStats.total}</p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Stats par équipe</h2>
        {data.teamStats.length === 0 ? (
          <p className="text-text-muted">Aucune donnée.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.teamStats.map((t) => (
              <div key={t.team} className="rounded-2xl border border-white/10 bg-surface/60 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TeamLogo name={t.team} size={32} />
                    <span className="font-bold">{t.team}</span>
                  </div>
                  <span className="text-xl font-black text-primary">{t.pct}%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-primary transition-all" style={{ width: `${t.pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-text-muted">{t.correct} bons sur {t.played} matchs</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Historique</h2>
        {data.history.length === 0 ? (
          <p className="text-text-muted">Aucun prono enregistré.</p>
        ) : (
          <div className="space-y-3">
            {data.history.map((h) => {
              const isFinished = !!h.winner && h.scoreA !== null && h.scoreB !== null;
              const predictedTeam = h.predictionWinner === "teamA" ? h.teamA : h.teamB;
              const isBo1 = h.predictionScoreA + h.predictionScoreB === 1;
              return (
                <div key={h.id} className="rounded-2xl border border-white/10 bg-surface/60 p-4 backdrop-blur-xl">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="flex items-center gap-2 text-sm text-text-muted">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(h.scheduledAt).toLocaleDateString("fr-FR")}
                        {h.split && ` • ${h.split}`}
                      </p>
                      <p className="mt-1 font-bold">
                        {h.teamA} vs {h.teamB}
                        <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">{h.format}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-muted">Prono</p>
                      <p className="font-bold">
                        {predictedTeam}
                        {!isBo1 && <span className="ml-2 text-text-muted">{h.predictionScoreA}-{h.predictionScoreB}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      {isFinished ? (
                        <span className={`text-lg font-black ${h.points > 0 ? "text-primary" : "text-danger"}`}>
                          {h.points > 0 ? `+${h.points}` : "0"} pts
                        </span>
                      ) : (
                        <span className="text-sm text-text-muted">En attente</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
