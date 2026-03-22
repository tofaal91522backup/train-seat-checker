import AppProviders from "@/providers/app-providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ra-Physics - Train Seat Tracker",
  description:
    "A train seat booking application built with Next.js, TypeScript, and Tailwind CSS. It allows users to view available seats, book them, and manage their reservations efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <AppProviders> */}
          {children}
          {/* </AppProviders> */}
      </body>
    </html>
  );
}
