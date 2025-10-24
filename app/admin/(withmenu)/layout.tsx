import type React from "react";
import { Metadata } from "next";
import WithMenuLayoutClient from "@/components/admin/WithMenuLayoutClient";
import { CircuitProvider } from "@/components/providers/admin/CircuitProvider";
import { AdminBookingProvider } from "@/components/providers/admin/BookingProvider";
import { Toaster } from "@/components/client/ui/toaster";
import { VehicleProvider } from "@/components/providers/admin/VehicleProvider";
import { BlogProvider } from "@/components/providers/admin/BlogProvider";
import { CommentProvider } from "@/components/providers/admin/CommentProvider";
import { TripProvider } from "@/components/providers/admin/TripProvider";
import { AdminReviewProvider } from "@/components/providers/admin/AdminReviewProvider";
import { StatsProvider } from "@/components/providers/admin/StatsProvider";
import { ContactProvider } from "@/components/providers/admin/ContactProvider";

export const metadata: Metadata = {
  title: "Mada Chaland - Dashboard Admin",
  description: "Tableau de bord d'administration de Mada Chaland",
};

export default function WithMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithMenuLayoutClient>
      <CircuitProvider>
        <AdminBookingProvider>
          <VehicleProvider>
            <BlogProvider>
              <TripProvider>
                <AdminReviewProvider>
                  <StatsProvider>
                    <ContactProvider>
                      <CommentProvider>{children}</CommentProvider>
                    </ContactProvider>
                  </StatsProvider>
                </AdminReviewProvider>
              </TripProvider>
            </BlogProvider>
          </VehicleProvider>
        </AdminBookingProvider>
      </CircuitProvider>
    </WithMenuLayoutClient>
  );
}
