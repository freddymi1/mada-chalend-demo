"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";
import { TripTravel } from "@/src/domain/entities/trip";

interface TripContextType {
  addedTrips: TripTravel[];
  fetchTrips: () => void;
  getTripById: (id: string) => void;
  tripDetail: TripTravel | null;
  isLoading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripCltProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [addedTrips, setAddedTrips] = useState<TripTravel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripTravel | null>(null);

  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    if (id) {
      getTripById(id.toString());
    }
  }, [id]);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/trip/get", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAddedTrips(data);
        setIsLoading(false);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement des trips.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement des trips.",
      });
      setIsLoading(false);
    }
  };

  const getTripById = async (id: string) => {
    try {
      const res = await fetch(`/api/trip/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log("RESS", data);
        setTripDetail(data);

        return data;
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement des voyages.",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement des voyages.",
      });
      return null;
    }
  };

  return (
    <TripContext.Provider
      value={{
        addedTrips,
        fetchTrips,
        getTripById,
        tripDetail,
        isLoading,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useCltTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useCltTrip must be used within a TripCltProvider");
  }
  return context;
};
