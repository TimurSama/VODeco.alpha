import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import Header from "@/components/layout/Header";
import TelegramProvider from "@/components/shared/TelegramProvider";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import OnboardingWrapper from "@/components/onboarding/OnboardingWrapper";

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
  themeColor: '#020617', // Ocean Deep
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

// Viewport для мобильных устройств (Next.js 14+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover' as const, // Для Telegram Mini App
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
              <OnboardingWrapper>
                <Header />
                <main className="pt-16 min-h-screen">
                  {children}
                </main>
              </OnboardingWrapper>
            </TelegramProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
