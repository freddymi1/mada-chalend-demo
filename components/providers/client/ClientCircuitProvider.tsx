"use client";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  image: string;
  imageDescription: string;
}

interface CircuitFormData {
  title: string;
  duration: string;
  price: string;
  maxPeople: string;
  difficulty: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
}

interface CircuitContextType {
  addedCircuits: any[];
  fetchCircuits: () => void;
  getCircuitById: (id: string) => void;
  circuitDetail: any;
  isLoading: boolean
}

const ClientCircuitContext = createContext<CircuitContextType | undefined>(undefined);

export const ClientCircuitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [addedCircuits, setAddedCircuits] = useState<any[]>([]);
  const [circuitDetail, setCircuitDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false)

  const fetchCircuits = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/circuit/get");
      if (res.ok) {
        const data = await res.json();
        setAddedCircuits(data);
        setIsLoading(false)
      } else {
        toast.error("Erreur lors du chargement des circuits");
        setIsLoading(false)
      }
    } catch (error) {
      toast.error("Erreur serveur lors du chargement des circuits");
      setIsLoading(false)
    }
  };

  const getCircuitById = async (id: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/circuit/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCircuitDetail(data);
        setIsLoading(false)
        return data;
      } else {
        toast.error("Erreur lors du chargement du circuit");
        setIsLoading(false)
        return null;
      }
    } catch (error) {
      toast.error("Erreur serveur lors du chargement du circuit");
      setIsLoading(false)
      return null;
    }
  };

  return (
    <ClientCircuitContext.Provider
      value={{
        addedCircuits,
        fetchCircuits,
        getCircuitById,
        circuitDetail,
        isLoading
      }}
    >
      {children}
    </ClientCircuitContext.Provider>
  );
};

export const useClientCircuit = () => {
  const context = useContext(ClientCircuitContext);
  if (!context) {
    throw new Error("useClientCircuit must be used within a ClientCircuitProvider");
  }
  return context;
};
