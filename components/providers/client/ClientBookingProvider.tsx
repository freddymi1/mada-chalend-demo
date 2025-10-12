"use client";

import { useToast } from "@/hooks/shared/use-toast";
import { Reservation } from "@/src/domain/entities/reservation";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookingContextType {
  loading: boolean;
  error: string | null;
  success: boolean;
  createReservation: (data: Reservation) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const ClientBookingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const createReservation = async (data: Reservation) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la réservation");
      }

      toast({
        title: "Demande envoyée !",
        description:
          "Nous vous contacterons dans les plus brefs délais pour finaliser votre réservation.",
      });

      setSuccess(true);
    } catch (err: any) {
      toast({
        title: "Error !",
        description: "Erreur lors de la réservation.",
      });
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{ loading, error, success, createReservation }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error(
      "useBooking doit être utilisé dans un ClientBookingProvider"
    );
  }
  return context;
};
