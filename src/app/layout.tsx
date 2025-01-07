import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/common/Header";

const pretendard = localFont({
  src: "../assets/fonts/pretendard-variable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Drone Vision",
  description:
    "Monitoring system for drone flight paths, battery levels and GPS locations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.className} ${pretendard.variable}`}>
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
