"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Vehicle } from "@/src/domain/entities/car";
import { useToast } from "@/hooks/shared/use-toast";
import { VehicleDTO } from "@/src/domain/entities/vehicle";

interface VehicleContextType {
  // Data management
  vehicles: VehicleDTO[];
  fetchVehicles: () => void;
  getVehicleById: (id: string) => void;
  vehicleDetail: VehicleDTO | null;

  // States
  isLoading: boolean;
  isUpdate: string | null;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const ClVehicleProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState<VehicleDTO | null>(null);

  const params = useSearchParams();
  const id = params.get("id");
  const isUpdate = params.get("update");

  useEffect(() => {
    if (id) {
      getVehicleById(id.toString());
    }
  }, [id]);

  // Data management
  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/car/get", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
        setIsLoading(false);
      } 
    } catch (error) {
      toast({
        title: "Erreur !",
        description: "Erreur lors du chargement des véhicules.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getVehicleById = async (id: string) => {
    try {
      const res = await fetch(`/api/car/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setVehicleDetail(data);

        return data;
      
      }
    } catch (error) {
      toast({
        title: "Erreur !",
        description: `Erreur lors du chargement du véhicule === ${id}.`,
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        fetchVehicles,
        getVehicleById,
        vehicleDetail,

        // States
        isLoading,
        isUpdate,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useClVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useClVehicle must be used within a ClVehicleProvider");
  }
  return context;
};
