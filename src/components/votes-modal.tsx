"use client";

import { useEffect, useState } from "react";
import { TeamLogo } from "./team-logo";
import { X, Users } from "lucide-react";

type Vote = {
  id: string;
  username: string;
  winner: string;
  scoreA: number;
  scoreB: number;
  teamA: string;
  teamB: string;
};

type VotesData = {
  total: number;
  teamA: string;
  teamB: string;
  teamAPct: number;
  teamBPct: number;
  votes: Vote[];
};

interface VotesModalProps {
  matchId: string;
  teamA: string;
  teamB: string;
  onClose: () => void;
}

export function VotesModal({ matchId, teamA, teamB, onClose }: VotesModalProps) {
  const [data, setData] = useState<VotesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/matches/${matchId}/predictions`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [matchId]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-md flex-col rounded-t-2xl sm:rounded-2xl border border-white/10 bg-surface shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h3 className="flex items-center gap-2 text-xl font-black tracking-tight">
            <Users className="h-5 w-5 text-primary" />
            Votes
          </h3>
          <button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-white/10">
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading && <p className="py-8 text-center text-text-muted">Chargement...</p>}

          {!loading && data && (
            <>
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <TeamLogo name={teamA} size={40} />
                  <p className="mt-2 truncate text-sm font-bold">{teamA}</p>
                  <p className="text-2xl font-black text-primary">{data.teamAPct}%</p>
                  <p className="text-xs text-text-muted">{Math.round((data.teamAPct / 100) * data.total)} votes</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <TeamLogo name={teamB} size={40} />
                  <p className="mt-2 truncate text-sm font-bold">{teamB}</p>
                  <p className="text-2xl font-black text-primary">{data.teamBPct}%</p>
                  <p className="text-xs text-text-muted">{Math.round((data.teamBPct / 100) * data.total)} votes</p>
                </div>
              </div>

              <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-primary transition-all" style={{ width: `${data.teamAPct}%` }} />
              </div>

              {data.total === 0 ? (
                <p className="py-4 text-center text-text-muted">Aucun vote pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  {data.votes.map((v) => {
                    const winnerTeam = v.winner === "teamA" ? v.teamA : v.teamB;
                    const isBo1 = v.scoreA + v.scoreB === 1;
                    return (
                      <div
                        key={v.id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="truncate font-semibold">{v.username}</span>
                        <span className="shrink-0 text-sm">
                          <span className="font-bold text-primary">{winnerTeam}</span>
                          {!isBo1 && (
                            <span className="ml-1 text-text-muted">{v.scoreA}-{v.scoreB}</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
