"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trophy, Sparkles } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        setLoading(false);
        return;
      }
    }

    const res = await signIn("credentials", {
      username,
      password,
      rememberMe: String(rememberMe),
      redirect: false,
    });

    if (res?.error) {
      setError("Pseudo ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/matches");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-16 md:flex-row">
      <div className="flex-1 text-center md:text-left">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          Saison LEC 2026
        </div>
        <h1 className="text-5xl font-black leading-[1.1] tracking-tight md:text-6xl">
          Pronostique les matchs{" "}
          <span className="text-primary">LEC</span>
        </h1>
        <p className="mt-6 text-lg text-text-muted">
          Crée un compte, fais tes pronos sur les matchs League of Legends EMEA Championship, et grimpe dans le classement.
        </p>
      </div>

      <div className="w-full flex-1 rounded-3xl border border-white/10 bg-surface/80 p-8 shadow-2xl backdrop-blur-2xl glow-hover">
        <div className="mb-6 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{isLogin ? "Connexion" : "Inscription"}</h2>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-muted">Pseudo</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 font-medium text-bg transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-muted">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 font-medium text-bg transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
              required
            />
            {!isLogin && (
              <p className="mt-1 text-xs text-text-muted">Minimum 4 caractères</p>
            )}
          </div>

          {isLogin && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
              />
              Se souvenir de moi
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3.5 font-bold text-bg shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 disabled:opacity-50"
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer un compte"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-5 w-full text-center text-sm text-text-muted transition-colors hover:text-white"
        >
          {isLogin ? "Pas encore de compte ? Inscris-toi" : "Déjà un compte ? Connecte-toi"}
        </button>
      </div>
    </div>
  );
}
