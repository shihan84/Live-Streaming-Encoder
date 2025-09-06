import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaLive Encoder - Professional Live Streaming",
  description: "Enterprise-grade live streaming encoder with SCTE-35 support, inspired by AWS Elemental MediaLive",
  keywords: ["MediaLive", "Live Streaming", "SCTE-35", "Encoder", "AWS", "Elemental", "Video", "Broadcast"],
  authors: [{ name: "MediaLive Team" }],
  openGraph: {
    title: "MediaLive Encoder",
    description: "Enterprise-grade live streaming encoder with SCTE-35 support",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaLive Encoder",
    description: "Enterprise-grade live streaming encoder with SCTE-35 support",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-50`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
