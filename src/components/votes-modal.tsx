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

const PER_PAGE = 5;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h3 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <Users className="h-4 w-4 text-primary" />
            Votes
          </h3>
          <button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-white/10">
            <X className="h-4 w-4 text-text-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && <p className="py-6 text-center text-sm text-text-muted">Chargement...</p>}

          {!loading && data && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TeamLogo name={teamA} size={28} />
                  <div>
                    <p className="text-xs font-bold">{teamA}</p>
                    <p className="text-lg font-black leading-none text-primary">{data.teamAPct}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <p className="text-xs font-bold">{teamB}</p>
                    <p className="text-lg font-black leading-none text-primary">{data.teamBPct}%</p>
                  </div>
                  <TeamLogo name={teamB} size={28} />
                </div>
              </div>

              <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-primary transition-all" style={{ width: `${data.teamAPct}%` }} />
              </div>

              {data.total === 0 ? (
                <p className="py-4 text-center text-sm text-text-muted">Aucun vote pour le moment.</p>
              ) : (
                <div className="space-y-1.5">
                  {pageVotes.map((v) => {
                    const winnerTeam = v.winner === "teamA" ? v.teamA : v.teamB;
                    const isBo1 = v.scoreA + v.scoreB === 1;
                    return (
                      <div
                        key={v.id}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"
                      >
                        <span className="truncate text-sm font-semibold">{v.username}</span>
                        <span className="shrink-0 text-xs">
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-white/10 p-3">
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
      </div>
    </div>
  );
}
