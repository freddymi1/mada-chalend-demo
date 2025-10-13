"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  itinereryImage: string;
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
  handleUpdate: (id: string) => void;
  isUpdate: string | null;
  handleItineraryImageChange: (imageUrl: string) => void;
  handleItineraryImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoadingUpload: boolean;
  handleItineraryImageRemove: () => void;
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
    itinereryImage: "",
    highlights: [""],
    itinerary: [],
    included: [""],
    notIncluded: [""],
  });

  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  const params = useSearchParams();
  const id = params.get("id");
  const isUpdate = params.get("update");

  useEffect(() => {
    if (id) {
      getCircuitById(id.toString());
    }
  }, [id]);

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

  const handleItineraryImageChange = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, itinereryImage: imageUrl }));
  };

  const handleItineraryImageRemove = () => {
    setFormData((prev) => ({ ...prev, itinereryImage: "" }));
  };

  // Upload one image for itinerary
  const handleItineraryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target?.files;
    setIsLoadingUpload(true);

    if (files && files[0]) {
      const file = files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          console.log("URL:", data.url);
          handleItineraryImageChange(data.url);
          toast({
            title: "Success !",
            description: "Image téléchargée avec succès !",
          });
          setIsLoadingUpload(false);
        } else {
          toast({
            title: "Error !",
            description: "Erreur lors de l'upload de l'image",
          });
          setIsLoadingUpload(false);
        }
      } catch (error) {
        toast({
          title: "Error !",
          description: "Erreur lors de l'upload de l'image",
        });
        setIsLoadingUpload(false);
      }
    }
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
      itinereryImage: formData.itinereryImage,
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
        setFormData({
          title: "",
          duration: "",
          price: "",
          maxPeople: "",
          difficulty: "Facile",
          description: "",
          itinereryImage: "",
          highlights: [""],
          itinerary: [],
          included: [""],
          notIncluded: [""],
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

  const handleUpdate = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/circuit/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updatedCircuit = await res.json();
        setAddedCircuits((prev) =>
          prev.map((circuit) => (circuit.id === id ? updatedCircuit : circuit))
        );
        toast({
          title: "Success !",
          description: "Circuit mis à jour !",
        });
        setIsLoading(false);
        router.push("/admin/circuits");
        await getCircuitById(id);
        await fetchCircuits();
        setFormData({
          title: "",
          duration: "",
          price: "",
          maxPeople: "",
          difficulty: "Facile",
          description: "",
          itinereryImage: "",
          highlights: [""],
          itinerary: [],
          included: [""],
          notIncluded: [""],
        });
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de la mise à jour du circuit.",
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Error !",
        description: "Erreur lors de la mise à jour du circuit.",
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
        setIsLoading(false);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de la suppression du circuit.",
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Error !",
        description: "Erreur lors de la suppression du circuit.",
      });
      setIsLoading(false);
    }
  };

  const fetchCircuits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/circuit/get", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAddedCircuits(data);
        setIsLoading(false);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement des circuits.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement des circuits.",
      });
      setIsLoading(false);
    }
  };

  const getCircuitById = async (id: string) => {
    try {
      const res = await fetch(`/api/circuit/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log("RESS", data);
        setCircuitDetail(data);
        setFormData({
          title: data.title || "",
          duration: data.duration || "",
          price: data.price || "",
          maxPeople: data.maxPeople ? String(data.maxPeople) : "",
          difficulty: data.difficulty || "Facile",
          description: data.description || "",
          itinereryImage: data.itinereryImage || "",
          highlights:
            data.highlights && data.highlights.length > 0
              ? data.highlights.map((item: any) => item.text)
              : [],
          itinerary:
            data.itineraries && data.itineraries.length > 0
              ? data.itineraries
              : [],

          included: data.included?.length
            ? data.included.map((item: any) => item.text)
            : [],
          notIncluded: data.notIncluded?.length
            ? data.notIncluded.map((item: any) => item.text)
            : [],
        });
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
        handleUpdate,
        isUpdate,
        handleItineraryImageChange,
        handleItineraryImageUpload,
        isLoadingUpload,
        handleItineraryImageRemove
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
