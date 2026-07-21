"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Trophy, LogOut, Users } from "lucide-react";

export function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Prono LEC
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {status === "authenticated" ? (
            <>
              <Link href="/matches" className="flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-white">
                <Users className="h-4 w-4" />
                Matchs
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-white">
                <Trophy className="h-4 w-4" />
                Classement
              </Link>
              {session.user?.role === "admin" && (
                <>
                  <Link href="/admin" className="text-sm font-medium text-text-muted transition-colors hover:text-white">
                    Matchs
                  </Link>
                  <Link href="/admin/users" className="text-sm font-medium text-text-muted transition-colors hover:text-white">
                    Utilisateurs
                  </Link>
                </>
              )}
              <span className="hidden text-sm font-semibold text-white sm:inline">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="rounded-full bg-white/10 p-2 text-text-muted transition-all hover:bg-danger/20 hover:text-danger"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <span className="text-sm text-text-muted">Connecte-toi pour pronostiquer</span>
          )}
        </div>
      </div>
    </nav>
  );
}
