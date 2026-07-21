import { Navigation } from "@/components/navigation";
import { Providers } from "@/components/providers";
import { BackgroundEffects } from "@/components/background-effects";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Prono LEC",
  description: "Pronostics sur les matchs LEC",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="relative">
        <BackgroundEffects />
        <Providers>
          <Navigation />
          <main className="relative mx-auto max-w-6xl px-4 py-10 md:px-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
