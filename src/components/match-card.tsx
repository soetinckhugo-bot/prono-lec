"use client";

import { useState } from "react";
import { PredictionForm } from "./prediction-form";
import { VotesModal } from "./votes-modal";
import { TeamLogo } from "./team-logo";
import { Lock, Users } from "lucide-react";

type MatchCardProps = {
  match: {
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
  userId: string;
  onUpdate: () => void;
};

export function MatchCard({ match, userId, onUpdate }: MatchCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [showVotes, setShowVotes] = useState(false);
  const myPrediction = match.predictions.find((p) => p.userId === userId);
  const isFinished = !!match.winner && match.scoreA !== null && match.scoreB !== null;

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-surface/60 p-5 backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-surface-elevated/80 hover:shadow-2xl hover:shadow-primary/5">
      {showVotes && (
        <VotesModal
          matchId={match.id}
          teamA={match.teamA}
          teamB={match.teamB}
          onClose={() => setShowVotes(false)}
        />
      )}

      <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-muted">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{match.format}</span>
        <span>{new Date(match.scheduledAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <TeamLogo name={match.teamA} size={64} />
          <span className="text-lg font-bold">{match.teamA}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          {isFinished ? (
            <span className="text-3xl font-black tracking-tight text-primary">
              {match.scoreA} - {match.scoreB}
            </span>
          ) : (
            <span className="text-3xl font-black text-text-muted">VS</span>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <TeamLogo name={match.teamB} size={64} />
          <span className="text-lg font-bold">{match.teamB}</span>
        </div>
      </div>

      {myPrediction && (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Ton prono</span>
            {isFinished && (
              <span className={`font-bold ${myPrediction.points > 0 ? "text-primary" : "text-danger"}`}>
                {myPrediction.points} pts
              </span>
            )}
          </div>
          <p className="mt-1 font-semibold">
            {myPrediction.winner === "teamA" ? match.teamA : match.teamB} {myPrediction.scoreA}-{myPrediction.scoreB}
          </p>
        </div>
      )}

      {!match.locked && !isFinished ? (
        <div className="mt-5">
          {showForm ? (
            <PredictionForm
              match={match}
              existing={myPrediction}
              onClose={() => setShowForm(false)}
              onUpdate={onUpdate}
            />
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-xl border border-primary/30 bg-primary/10 py-3 font-bold text-primary shadow-lg shadow-primary/10 transition-all hover:bg-primary hover:text-bg hover:shadow-primary/20"
            >
              {myPrediction ? "Modifier mon prono" : "Faire un prono"}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-text-muted">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {isFinished ? "Match terminé" : "Pronos verrouillés"}
          </div>
          {!isFinished && (
            <p className="text-xs text-text-muted">Contacte un admin si tu veux modifier.</p>
          )}
        </div>
      )}

      <button
        onClick={() => setShowVotes(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-text-muted transition-all hover:border-primary/30 hover:text-primary"
      >
        <Users className="h-4 w-4" />
        Voir les votes ({match.predictions.length})
      </button>
    </div>
  );
}
