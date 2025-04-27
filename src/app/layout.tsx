import NavBar from "@/components/NavBar";
import "./globals.css";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
import { SceneWrapper } from "@/components/SceneWrapper";

export const metadata: Metadata = {
  title: "Kevin | Portfolio",
  description: "./kev.fbx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="preconnect" href="https://va.vercel-scripts.com" />
      <body>
        <Analytics />
        <SpeedInsights />
        <SceneWrapper />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
