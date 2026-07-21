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
  points: number;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Votes
          </h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        {loading && <p className="text-center text-text-muted py-8">Chargement...</p>}

        {!loading && data && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <TeamLogo name={teamA} size={48} />
                <p className="mt-2 font-bold">{teamA}</p>
                <p className="text-2xl font-black text-primary">{data.teamAPct}%</p>
                <p className="text-xs text-text-muted">{Math.round((data.teamAPct / 100) * data.total)} votes</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <TeamLogo name={teamB} size={48} />
                <p className="mt-2 font-bold">{teamB}</p>
                <p className="text-2xl font-black text-primary">{data.teamBPct}%</p>
                <p className="text-xs text-text-muted">{Math.round((data.teamBPct / 100) * data.total)} votes</p>
              </div>
            </div>

            <div className="mb-6 h-4 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${data.teamAPct}%` }}
              />
            </div>

            {data.total === 0 ? (
              <p className="text-center text-text-muted py-4">Aucun vote pour le moment.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-text-muted">
                    <tr>
                      <th className="px-4 py-2">Votant</th>
                      <th className="px-4 py-2">Prono</th>
                      <th className="px-4 py-2 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.votes.map((v) => {
                      const winnerTeam = v.winner === "teamA" ? v.teamA : v.teamB;
                      const isBo1 = v.scoreA + v.scoreB === 1;
                      return (
                        <tr key={v.id} className="hover:bg-white/5">
                          <td className="px-4 py-2 font-semibold">{v.username}</td>
                          <td className="px-4 py-2">
                            <span className="font-bold text-primary">{winnerTeam}</span>
                            {!isBo1 && (
                              <span className="ml-2 text-text-muted">{v.scoreA}-{v.scoreB}</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {v.points > 0 ? (
                              <span className="font-bold text-primary">+{v.points}</span>
                            ) : (
                              <span className="text-text-muted">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
