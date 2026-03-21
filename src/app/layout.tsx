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
  title: "VitaTrack - Food Nutrition Scanner & Health Tracker",
  description: "Scan makanan untuk analisis nutrisi, target berat badan dengan AI, dan tips pola hidup sehat. Your personal health companion.",
  keywords: ["VitaTrack", "nutrition scanner", "health tracker", "diet", "weight loss", "BMI", "calories", "healthy lifestyle", "AI health"],
  authors: [{ name: "SamuDev" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "VitaTrack - Food Nutrition Scanner",
    description: "Scan makanan untuk analisis nutrisi dengan AI. Track kesehatan Anda dengan mudah.",
    url: "https://vitatrack.app",
    siteName: "VitaTrack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VitaTrack - Food Nutrition Scanner",
    description: "Scan makanan untuk analisis nutrisi dengan AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
