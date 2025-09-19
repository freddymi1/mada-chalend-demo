import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/client/theme-provider";
import { PageTransition } from "@/components/client/page-transition";
import "./globals.css";
import { ClientCircuitProvider } from "@/components/providers/client/ClientCircuitProvider";

export const metadata: Metadata = {
  title: "Mada Chaland - Agence de voyage à Madagascar",
  description:
    "Explorez Madagascar autrement avec des circuits sur mesure, des expériences uniques et un accompagnement personnalisé.",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <PageTransition>
              <ClientCircuitProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </ClientCircuitProvider>
            </PageTransition>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
