"use client";

import { useEffect, useState } from "react";

type UserScore = {
  id: string;
  username: string;
  score: number;
  correctPredictions: number;
  exactPredictions: number;
  wrongPredictions: number;
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<UserScore[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => setUsers(data));
  }, []);

  const maxScore = Math.max(...users.map((u) => u.score), 1);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">Classement</h1>
        <p className="mt-2 text-white">Les meilleurs pronostiqueurs de la LEC</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface/60 backdrop-blur-xl">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-white">#</th>
              <th className="px-6 py-4 text-sm font-semibold text-white">Joueur</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">Points</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">Bons</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">Exact</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">Faux</th>
              <th className="px-6 py-4 text-sm font-semibold text-white">Progression</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u, i) => (
              <tr
                key={u.id}
                className={`transition-colors hover:bg-white/5 ${i === 0 ? "bg-primary/5" : ""}`}
              >
                <td className="px-6 py-4">
                  {i === 0 ? (
                    <span className="text-2xl">👑</span>
                  ) : (
                    <span className="font-mono text-lg font-bold text-white">{i + 1}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-white">{u.username}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono font-bold text-primary">
                    {u.score}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-primary">{u.correctPredictions}</td>
                <td className="px-6 py-4 text-center text-warning">{u.exactPredictions}</td>
                <td className="px-6 py-4 text-center text-danger">{u.wrongPredictions}</td>
                <td className="px-6 py-4">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min((u.score / maxScore) * 100, 100)}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && <p className="mt-8 text-center text-white">Aucun joueur classé pour le moment.</p>}
    </div>
  );
}
