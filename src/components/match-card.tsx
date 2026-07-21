"use client";

import { useState } from "react";
import { PredictionForm } from "./prediction-form";
import { TeamLogo } from "./team-logo";
import { Lock, Trophy } from "lucide-react";

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
  const myPrediction = match.predictions.find((p) => p.userId === userId);
  const isFinished = !!match.winner && match.scoreA !== null && match.scoreB !== null;
  const winnerName = match.winner === "teamA" ? match.teamA : match.teamB;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition-all hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-primary/10">
      <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-muted">
        <span className="rounded-full bg-white/10 px-2.5 py-1">{match.format}</span>
        <span>{new Date(match.scheduledAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <TeamLogo name={match.teamA} size={64} />
          <span className="text-lg font-bold">{match.teamA}</span>
          {isFinished && match.winner === "teamA" && (
            <Trophy className="h-5 w-5 text-warning" />
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          {isFinished ? (
            <span className="text-3xl font-black tracking-tight">
              {match.scoreA} - {match.scoreB}
            </span>
          ) : (
            <span className="text-3xl font-black text-text-muted">VS</span>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <TeamLogo name={match.teamB} size={64} />
          <span className="text-lg font-bold">{match.teamB}</span>
          {isFinished && match.winner === "teamB" && (
            <Trophy className="h-5 w-5 text-warning" />
          )}
        </div>
      </div>

      {myPrediction && (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Ton prono</span>
            {isFinished && (
              <span className={`font-bold ${myPrediction.points > 0 ? "text-success" : "text-danger"}`}>
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
              className="w-full rounded-xl bg-primary py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30"
            >
              {myPrediction ? "Modifier mon prono" : "Faire un prono"}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-text-muted">
          <Lock className="h-4 w-4" />
          {isFinished ? "Match terminé" : "Pronos verrouillés"}
        </div>
      )}
    </div>
  );
}
