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
// The invitation copy now lives ON the share image; the card fields are kept
// to a single short title (WhatsApp always shows a title line) with no
// description, so the preview reads as a card, not a wall of text.
const OG_IMAGE = `${SITE_URL}/img/og-invito.jpg`;
const OG_TITLE = "Sei invitato! 🎓";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: OG_TITLE,
  openGraph: {
    title: OG_TITLE,
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Laurea di Daniel Leocata",
    locale: "it_IT",
    images: [
      {
        url: OG_IMAGE,
        width: 2400,
        height: 1260,
        type: "image/jpeg",
        alt: "Invito alla laurea di Daniel Leocata — Ingegneria Informatica, Politecnico di Torino",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    images: [OG_IMAGE],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
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
