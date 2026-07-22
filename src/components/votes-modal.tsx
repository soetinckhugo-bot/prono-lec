"use client";

import { useEffect, useState } from "react";
import { TeamLogo } from "./team-logo";
import { X, Users, ChevronLeft, ChevronRight } from "lucide-react";

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

const PER_PAGE = 8;

export function VotesModal({ matchId, teamA, teamB, onClose }: VotesModalProps) {
  const [data, setData] = useState<VotesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch(`/api/matches/${matchId}/predictions`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [matchId]);

  const totalPages = data ? Math.ceil(data.votes.length / PER_PAGE) : 0;
  const pageVotes = data ? data.votes.slice(page * PER_PAGE, (page + 1) * PER_PAGE) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-5 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-black tracking-tight">
            <Users className="h-5 w-5 text-primary" />
            Votes
          </h3>
          <button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-white/10">
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        {loading && <p className="py-8 text-center text-text-muted">Chargement...</p>}

        {!loading && data && (
          <>
            <div className="mb-5 grid grid-cols-2 gap-3">
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

            <div className="mb-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-primary transition-all" style={{ width: `${data.teamAPct}%` }} />
            </div>

            {data.total === 0 ? (
              <p className="py-4 text-center text-text-muted">Aucun vote pour le moment.</p>
            ) : (
              <>
                <div className="space-y-2">
                  {pageVotes.map((v) => {
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

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="rounded-full bg-white/10 p-2 text-text-muted transition-colors hover:bg-white/20 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-text-muted">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      className="rounded-full bg-white/10 p-2 text-text-muted transition-colors hover:bg-white/20 disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
