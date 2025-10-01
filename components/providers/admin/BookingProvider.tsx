"use client";

import { useToast } from "@/hooks/shared/use-toast";
import { BookingResponse, Reservation } from "@/src/domain/entities/reservation";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookingContextType {
  loading: boolean;
  getAllBokkingData: () => Promise<void>;
  bookingData:BookingResponse | null
  updateReservation:(id: string, data: Reservation) => void
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

  const updateReservation = async(id:string, data: Reservation)=>{
    try {
      const res = await fetch(`/api/book/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {       
        toast({
          title: "Succès !",
          description: "Reservation mis à jour !",
        });
        await getAllBokkingData()
        setLoading(false);
      } else {
        toast({
          title: "Erreur !",
          description: "Erreur lors de la validation de reservation.",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch {
      toast({
        title: "Erreur !",
        description: "Erreur lors de la mise à jour du véhicule.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <AdminBookingContext.Provider
      value={{ loading, getAllBokkingData, bookingData, updateReservation }}
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
