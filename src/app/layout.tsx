import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "dinikahin.com — AI Wedding Consultant",
    template: "%s | dinikahin.com",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  description:
    "Konsultasi pernikahan berbasis AI untuk calon pengantin di Indonesia. Chat dengan Dini, AI Wedding Consultant kami, dan wujudkan pernikahan impianmu dengan rekomendasi yang terpersonalisasi.",
  keywords: [
    "wedding consultant",
    "konsultasi pernikahan",
    "AI wedding",
    "rekomendasi pernikahan",
    "wedding planner",
    "Jakarta",
    "Indonesia",
    "dinikahin",
  ],
  authors: [{ name: "dinikahin.com" }],
  openGraph: {
    title: "dinikahin.com — AI Wedding Consultant",
    description:
      "Wujudkan pernikahan impianmu dengan bantuan AI. Chat dengan Dini sekarang!",
    type: "website",
    locale: "id_ID",
    siteName: "dinikahin.com",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
