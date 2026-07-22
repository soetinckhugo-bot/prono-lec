"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Trophy, LogOut, Users, Shield, BarChart3 } from "lucide-react";

export function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-white">
            Prono <span className="text-primary">LEC</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {status === "authenticated" ? (
            <>
              <Link href="/matches" className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-primary">
                <Users className="h-4 w-4" />
                Matchs
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-primary">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-primary">
                <Trophy className="h-4 w-4" />
                Classement
              </Link>
              {session.user?.role === "admin" && (
                <>
                  <Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-primary">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                </>
              )}
              <span className="hidden text-sm font-semibold text-white sm:inline">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="rounded-full bg-white/10 p-2 text-white transition-all hover:bg-danger/20 hover:text-danger"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <span className="text-sm text-white">Connecte-toi pour pronostiquer</span>
          )}
        </div>
      </div>
    </nav>
  );
}
