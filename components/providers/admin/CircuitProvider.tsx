"use client";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";

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
  maxPeople?: string;
  difficulty: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
}

interface CircuitContextType {
  formData: CircuitFormData;
  setFormData: React.Dispatch<React.SetStateAction<CircuitFormData>>;
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleArrayInputChange: (
    index: number,
    value: string,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => void;
  addArrayItem: (arrayName: "highlights" | "included" | "notIncluded") => void;
  removeArrayItem: (
    index: number,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => void;
  handleItineraryChange: (
    index: number,
    field: keyof ItineraryDay,
    value: string
  ) => void;
  addItineraryDay: () => void;
  removeItineraryDay: (index: number) => void;
  handleImageUpload: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  addedCircuits: any[];
  handleDelete: (id: string) => void;
  fetchCircuits: () => void;
  getCircuitById: (id: string) => void;
  circuitDetail: any;
  isLoading: boolean;
}

const CircuitContext = createContext<CircuitContextType | undefined>(undefined);

export const CircuitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [addedCircuits, setAddedCircuits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [circuitDetail, setCircuitDetail] = useState<any>(null);
  const [formData, setFormData] = useState<CircuitFormData>({
    title: "",
    duration: "",
    price: "",
    maxPeople: "",
    difficulty: "Facile",
    description: "",
    highlights: [""],
    itinerary: [],
    included: [""],
    notIncluded: [""],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    index: number,
    value: string,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (
    arrayName: "highlights" | "included" | "notIncluded"
  ) => {
    setFormData((prev) => ({ ...prev, [arrayName]: [...prev[arrayName], ""] }));
  };

  const removeArrayItem = (
    index: number,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const handleItineraryChange = (
    index: number,
    field: keyof ItineraryDay,
    value: string
  ) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: formData.itinerary.length + 1,
      title: "",
      description: "",
      image: "",
      imageDescription: "",
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  const removeItineraryDay = (index: number) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    // Reassign days in order
    const reorderedItinerary = newItinerary.map((day, idx) => ({
      ...day,
      day: idx + 1,
    }));
    setFormData((prev) => ({ ...prev, itinerary: reorderedItinerary }));
  };

  const handleImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      // Appel API upload
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        // data.url = "/uploads/nomfichier.jpg"
        handleItineraryChange(index, "image", data.url);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de l'upload de l'image",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // Filtrer les tableaux pour enlever les éléments vides
    const filteredHighlights = formData.highlights.filter(
      (item) => item.trim() !== ""
    );
    const filteredIncluded = formData.included.filter(
      (item) => item.trim() !== ""
    );
    const filteredNotIncluded = formData.notIncluded.filter(
      (item) => item.trim() !== ""
    );
    const filteredItinerary = formData.itinerary.filter(
      (day) => day.title.trim() !== "" || day.description.trim() !== ""
    );

    const circuitData = {
      title: formData.title,
      duration: formData.duration,
      price: formData.price,
      maxPeople: parseInt(formData?.maxPeople!),
      difficulty: formData.difficulty,
      description: formData.description,
      highlights: filteredHighlights,
      included: filteredIncluded,
      notIncluded: filteredNotIncluded,
      itineraries: filteredItinerary,
    };

    try {
      const res = await fetch("/api/circuit/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(circuitData),
      });

      if (res.ok) {
        const newCircuit = await res.json();
        setAddedCircuits((prev) => [...prev, newCircuit]);
        toast({
          title: "Felicitation !",
          description: "Circuit ajouté avec succès !",
        });
        setIsLoading(false);
        router.push("/admin/circuits");
      } else {
        toast({
          title: "Error !",
          description: "Erreur serveur lors de l'ajout du circuit",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur serveur lors de l'ajout du circuit",
      });
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("IDDDDD", id);
    // setIsLoading(true)
    try {
      const res = await fetch(`/api/circuit/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddedCircuits((prev) => prev.filter((circuit) => circuit.id !== id));
        toast({
          title: "Success !",
          description: "Circuit supprimé !",
        });
        setIsLoading(false)
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de la suppression du circuit.",
        });
        setIsLoading(false)
      }
    } catch {
      toast({
        title: "Error !",
        description: "Erreur lors de la suppression du circuit.",
      });
      setIsLoading(false)
    }
  };

  const fetchCircuits = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/circuit/get", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAddedCircuits(data);
        setIsLoading(false)
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement des circuits.",
        });
        setIsLoading(false)
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement des circuits.",
      });
      setIsLoading(false)
    }
  };

  const getCircuitById = async (id: string) => {
    try {
      const res = await fetch(`/api/circuit/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCircuitDetail(data);
        return data;
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement des circuits.",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement des circuits.",
      });
      return null;
    }
  };

  return (
    <CircuitContext.Provider
      value={{
        formData,
        setFormData,
        handleInputChange,
        handleArrayInputChange,
        addArrayItem,
        removeArrayItem,
        handleItineraryChange,
        addItineraryDay,
        removeItineraryDay,
        handleImageUpload,
        handleSubmit,
        addedCircuits,
        handleDelete,
        fetchCircuits,
        getCircuitById,
        circuitDetail,
        isLoading,
      }}
    >
      {children}
    </CircuitContext.Provider>
  );
};

export const useCircuit = () => {
  const context = useContext(CircuitContext);
  if (!context) {
    throw new Error("useCircuit must be used within a CircuitProvider");
  }
  return context;
};
