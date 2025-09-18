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
  handleDelete: (id: number) => void;
  fetchCircuits:()=> void
}

const CircuitContext = createContext<CircuitContextType | undefined>(undefined);

export const CircuitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [addedCircuits, setAddedCircuits] = useState<any[]>([]);
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
        toast.error("Erreur lors de l'upload de l'image");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      maxPeople: parseInt(formData.maxPeople),
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
        toast.success("Circuit ajouté avec succès !");
        router.push("/admin/circuits");
      } else {
        toast.error("Erreur lors de l'ajout du circuit");
      }
    } catch (error) {
      toast.error("Erreur serveur lors de l'ajout du circuit");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce circuit ?")) {
      setAddedCircuits(addedCircuits.filter((circuit) => circuit.id !== id));
    }
  };

  const fetchCircuits = async () => {
    try {
      const res = await fetch("/api/circuit/get");
      if (res.ok) {
        const data = await res.json();
        setAddedCircuits(data);
      } else {
        toast.error("Erreur lors du chargement des circuits");
      }
    } catch (error) {
      toast.error("Erreur serveur lors du chargement des circuits");
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
        fetchCircuits
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
