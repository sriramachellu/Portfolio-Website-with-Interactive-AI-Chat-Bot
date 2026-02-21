import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TintProvider } from "@/lib/TintContext";
import Dock from "@/components/Dock";
import TintSwitcher from "@/components/TintSwitcher";
import AmbientGlow from "@/components/AmbientGlow";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Srirama Murthy Chellu — AI/ML Engineer",
  description: "Portfolio of an AI/ML engineer building systems that think.",
  openGraph: {
    title: "Srirama Murthy Chellu — AI/ML Engineer",
    description: "Production-focused AI/ML engineering portfolio. Systems, models, and ideas.",
    type: "website",
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
        <TintProvider>
          <AmbientGlow />
          <main style={{ position: "relative", zIndex: 1 }}>
            {children}
          </main>
          <TintSwitcher />
          <Dock />
        </TintProvider>
      </body>
    </html>
  );
}
