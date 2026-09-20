import type { Metadata } from "next";
import { Inter, Noto_Sans_Gurmukhi } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/layout/AppProviders";
import { BottomNav, TopNav } from "@/components/layout/Nav";
import { ThemeScript } from "@/components/layout/ThemeScript";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const gurmukhi = Noto_Sans_Gurmukhi({
  variable: "--font-gurmukhi",
  subsets: ["gurmukhi", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute URLs for social cards and canonical links, once deployed.
  metadataBase: new URL("https://punjabi.mohijitsingh.com"),
  title: "Learn Punjabi — Gurmukhi and spoken Punjabi",
  description:
    "Learn to read Gurmukhi and speak Punjabi from zero, one short lesson at a time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${gurmukhi.variable} h-full`}>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <AppProviders>
          <TopNav />
          <main className="flex-1">{children}</main>
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
