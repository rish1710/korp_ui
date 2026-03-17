import type { Metadata } from "next";
import { DM_Sans, Raleway } from "next/font/google";
import "./globals.css";
import SmoothWavyCanvas from "@/components/ui/SmoothWavyCanvas";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "KORP — Knowledge Operating Platform",
  description: "AI-powered study and research workspace. Upload PDFs, PPTs, YouTube videos and interact with your knowledge using AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${raleway.variable} font-sans antialiased min-h-screen relative bg-background`}
      >
        {/* Dynamic Premium Background */}
        <SmoothWavyCanvas />
        
        {/* Universal background glows */}
        <div className="bg-glow-top-right" />
        <div className="bg-glow-bottom-left" />

        {children}
      </body>
    </html>
  );
}
