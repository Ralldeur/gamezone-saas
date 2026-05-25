import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GameZone - Gestion de Salle de Jeux",
  description:
    "SaaS moderne de gestion de salles de jeux vidéo et cyber cafés pour l'Afrique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-gray-950 text-white font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
