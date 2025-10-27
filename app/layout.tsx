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
import { ClientBookingProvider } from "@/components/providers/client/ClientBookingProvider";
import { ClVehicleProvider } from "@/components/providers/client/ClVehicleProvider";
import { CiBlogProvider } from "@/components/providers/client/ClBlogProvider";
import { TripCltProvider } from "@/components/providers/client/TripCltProvider";
import { ReviewProvider } from "@/components/providers/client/ReviewProvider";
import { ProtectionProvider } from "@/components/providers/client/ProtectionProvider";
import { CiContactProvider } from "@/components/providers/client/ClContactProvider";
import { CiCguProvider } from "@/components/providers/client/ClCguProvider";
import { CiPrivacyProvider } from "@/components/providers/client/CiPrivacyProvider";
import { CiCategoryProvider } from "@/components/providers/client/CiCategoryProvider";

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
            {/* <ProtectionProvider> */}
            <PageTransition>
              <ClientCircuitProvider>
                <ClientBookingProvider>
                  <ClVehicleProvider>
                    <CiBlogProvider>
                      <TripCltProvider>
                        <ReviewProvider>
                          <CiContactProvider>
                            <CiCguProvider>
                              <CiPrivacyProvider>
                                <CiCategoryProvider>
                                  <Suspense fallback={null}>{children}</Suspense>
                                </CiCategoryProvider>
                              </CiPrivacyProvider>
                            </CiCguProvider>
                          </CiContactProvider>
                        </ReviewProvider>
                      </TripCltProvider>
                    </CiBlogProvider>
                  </ClVehicleProvider>
                </ClientBookingProvider>
              </ClientCircuitProvider>
            </PageTransition>
            {/* </ProtectionProvider> */}
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
