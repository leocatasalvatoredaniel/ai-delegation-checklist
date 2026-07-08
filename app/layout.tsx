import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// GitHub Pages origin + basePath. Absolute URLs are required for social
// crawlers (WhatsApp/Telegram/etc.) — they don't resolve relative paths.
const SITE_URL = "https://leocatasalvatoredaniel.github.io/ai-delegation-checklist";
const OG_IMAGE = `${SITE_URL}/img/og-globe.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sei invitato! · Laurea di Salvatore Daniel Leocata",
  description:
    "Siamo lieti di invitarti a celebrare la laurea in Ingegneria Informatica di Salvatore Daniel Leocata al Politecnico di Torino.",
  openGraph: {
    title: "Sei invitato! · Laurea di Salvatore Daniel Leocata",
    description:
      "Siamo lieti di invitarti — Proclamazione 16 settembre · Festeggiamenti 3 ottobre 2026 a Biancavilla",
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Laurea di Salvatore Daniel Leocata",
    locale: "it_IT",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "La Terra dallo spazio con la rotta Torino → Sicilia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sei invitato! · Laurea di Salvatore Daniel Leocata",
    description:
      "Siamo lieti di invitarti — Proclamazione 16 settembre · Festeggiamenti 3 ottobre 2026 a Biancavilla",
    images: [OG_IMAGE],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍕</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
