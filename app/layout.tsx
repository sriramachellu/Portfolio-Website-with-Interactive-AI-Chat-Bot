import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TintProvider } from "@/lib/TintContext";
import { LightboxProvider } from "@/lib/LightboxContext";
import Dock from "@/components/Dock";
import TintSwitcher from "@/components/TintSwitcher";
import AmbientGlow from "@/components/AmbientGlow";
import { PageTransition } from "@/components/PageTransition";
import { PortfolioAssistant } from "@/components/PortfolioAssistant";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sriramachellu.com"),
  title: "Srirama Murthy Chellu — AI/ML Engineer",
  description: "Portfolio of an AI/ML engineer building systems that think.",
  openGraph: {
    title: "Srirama Murthy Chellu — AI/ML Engineer",
    description: "Production-focused AI/ML engineering portfolio. Systems, models, and ideas.",
    url: "https://sriramamurthychellu.dev",
    images: [{ url: "/Sri.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Srirama Murthy Chellu — AI/ML Engineer",
    description: "Production-focused AI/ML engineering portfolio. Systems, models, and ideas.",
    images: ["/Sri.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-tint="deep-blue">
      <body className={inter.variable} style={{ fontFamily: "'Inter', sans-serif" }} suppressHydrationWarning>
        <LightboxProvider>
          <TintProvider>
            <AmbientGlow />
            <main style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
              <PageTransition>{children}</PageTransition>
            </main>
            <TintSwitcher />
            <Dock />
            <PortfolioAssistant />
            <Footer />
            <Analytics />
          </TintProvider>
        </LightboxProvider>
      </body>
    </html>
  );
}
