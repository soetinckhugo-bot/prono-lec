"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { MatchCard } from "@/components/match-card";
import { CalendarDays } from "lucide-react";

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
  predictions: {
    id: string;
    userId: string;
    winner: string;
    scoreA: number;
    scoreB: number;
    points: number;
  }[];
};

export default function MatchesPage() {
  const { status, data: session } = useSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/");
  }, [status]);

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => r.json())
      .then((data) => {
        setMatches(data);
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
  if (!session) return null;

  const userId = (session.user as { id: string }).id;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Matchs à pronostiquer LEC</h1>
          <p className="mt-2 flex items-center gap-2 text-text-muted">
            <CalendarDays className="h-4 w-4" />
            Programme LEC
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Les pronos se verrouillent 15 minutes avant le premier match de la journée. Demande à un admin pour changer après verrouillage.
          </p>
        </div>
      </header>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface/60 p-12 text-center backdrop-blur-xl">
          <p className="text-lg text-text-muted">Aucun match programmé pour le moment.</p>
          <p className="mt-2 text-sm text-text-muted">Reviens plus tard ou demande à l'admin d'en ajouter.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} userId={userId} onUpdate={() => window.location.reload()} />
          ))}
        </div>
      )}
    </div>
  );
}
