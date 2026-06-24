import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FilmGrain } from "@/components/ui/film-grain";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Il Grande Giorno — Salvatore Daniel Leocata",
  description: "Da Adrano a Torino. Tre anni, 1.400 km, una laurea. Sei invitato.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <FilmGrain />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
