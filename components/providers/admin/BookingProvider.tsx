"use client";

import { useToast } from "@/hooks/shared/use-toast";
import { BookingResponse, Reservation } from "@/src/domain/entities/reservation";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookingContextType {
  loading: boolean;
  getAllBokkingData: () => Promise<void>;
  bookingData:BookingResponse | null
}

const AdminBookingContext = createContext<BookingContextType | undefined>(undefined);

export const AdminBookingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null)

  const getAllBokkingData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/book/get", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBookingData(data)
        setLoading(false);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement des circuits.",
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement des circuits.",
      });
      setLoading(false);
    }
  };

  return (
    <AdminBookingContext.Provider
      value={{ loading, getAllBokkingData, bookingData }}
    >
      {children}
    </AdminBookingContext.Provider>
  );
};

export const useAdminBooking = () => {
  const context = useContext(AdminBookingContext);
  if (!context) {
    throw new Error(
      "useBooking doit être utilisé dans un ClientBookingProvider"
    );
  }
  return context;
};
