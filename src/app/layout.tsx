import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppProvider from "@/components/common/AppProvider";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

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
    <html lang="en" className="h-full">
      <body
        className={`flex min-h-full flex-col ${pretendard.className} ${pretendard.variable}`}
      >
        <AppProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
