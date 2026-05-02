import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { LanguageRuntime } from "@/components/language-runtime";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MeetNote AI · Turn meeting audio into actionable notes",
    template: "%s · MeetNote AI",
  },
  description:
    "Upload meeting audio or paste a transcript. AI turns it into summaries, action items, and decisions in seconds.",
  applicationName: "MeetNote AI",
  authors: [{ name: "MeetNote AI" }],
  keywords: [
    "AI meeting notes",
    "meeting transcription",
    "meeting summary",
    "Whisper transcription",
    "AI action items",
    "Claude summarization",
    "AI 會議筆記",
    "會議逐字稿",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "MeetNote AI",
    title: "MeetNote AI · Turn meeting audio into actionable notes",
    description:
      "Upload meeting audio or paste a transcript. AI turns it into summaries, action items, and decisions in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetNote AI · Turn meeting audio into actionable notes",
    description:
      "Upload meeting audio or paste a transcript. AI turns it into summaries, action items, and decisions in seconds.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSansTC.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-zinc-900">
        {children}
        <LanguageRuntime />
      </body>
    </html>
  );
}
