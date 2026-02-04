import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import Header from "@/components/layout/Header";
import TelegramProvider from "@/components/shared/TelegramProvider";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VODeco - Water Resource Management Platform",
  description: "Decentralized platform for water resource management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <LanguageProvider>
            <TelegramProvider>
              <Header />
              <main className="pt-16 min-h-screen">
                {children}
              </main>
            </TelegramProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
