import { Navigation } from "@/components/navigation";
import { Providers } from "@/components/providers";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Prono LEC",
  description: "Pronostics sur les matchs LEC",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Navigation />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
