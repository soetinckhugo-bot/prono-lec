"use client";

import { useState } from "react";
import { TeamLogo } from "./team-logo";

type PredictionFormProps = {
  match: {
    id: string;
    teamA: string;
    teamB: string;
  };
  existing?: {
    winner: string;
    scoreA: number;
    scoreB: number;
  };
  onClose: () => void;
  onUpdate: () => void;
};

export function PredictionForm({ match, existing, onClose, onUpdate }: PredictionFormProps) {
  const [winner, setWinner] = useState(existing?.winner || "teamA");
  const [scoreA, setScoreA] = useState(existing?.scoreA ?? 0);
  const [scoreB, setScoreB] = useState(existing?.scoreB ?? 0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: match.id, winner, scoreA, scoreB }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }

    onUpdate();
    onClose();
  }

  const selectedTeam = winner === "teamA" ? match.teamA : match.teamB;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-bg p-5">
      {error && <p className="mb-4 rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}

      <div className="mb-4 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setWinner("teamA")}
          className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
            winner === "teamA"
              ? "border-primary bg-primary/10"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
        >
          <TeamLogo name={match.teamA} size={40} />
          <span className="font-semibold">{match.teamA}</span>
        </button>
        <button
          type="button"
          onClick={() => setWinner("teamB")}
          className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
            winner === "teamB"
              ? "border-primary bg-primary/10"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
        >
          <TeamLogo name={match.teamB} size={40} />
          <span className="font-semibold">{match.teamB}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-muted">Score {match.teamA}</label>
          <input
            type="number"
            min={0}
            value={scoreA}
            onChange={(e) => setScoreA(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-center font-bold text-bg"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm text-text-muted">Vainqueur</span>
          <span className="font-bold text-primary">{selectedTeam}</span>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-muted">Score {match.teamB}</label>
          <input
            type="number"
            min={0}
            value={scoreB}
            onChange={(e) => setScoreB(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-center font-bold text-bg"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-primary py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-white/10 px-6 py-3 font-semibold transition-all hover:bg-white/10"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
