"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";

export interface Lng {
  en: string;
  fr: string;
}

export interface ItineraryDistanceRel {
  id?: string;
  departPoint: string;
  distance: number;
  arrivalPoint: string;
  itineraryId?: string;
}

export interface ItineraryDay {
  day: number;
  title: Lng;
  description: Lng;
  image: string;
  imageDescription: Lng;
  distance: number;
  itineraryDistanceRel?: ItineraryDistanceRel[]; // 🔥 AJOUT
}

interface CircuitFormData {
  title: Lng;
  duration: string;
  price: string;
  maxPeople?: string;
  difficulty: string;
  description: Lng;
  itinereryImage: string;
  highlights: Lng[];
  itinerary: ItineraryDay[];
  included: Lng[];
  notIncluded: Lng[];
}

interface CircuitContextType {
  formData: CircuitFormData;
  setFormData: React.Dispatch<React.SetStateAction<CircuitFormData>>;
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleMultilingualChange: (
    field: "title" | "description",
    lang: "en" | "fr",
    value: string
  ) => void;
  handleArrayMultilingualChange: (
    index: number,
    lang: "en" | "fr",
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
  handleItineraryMultilingualChange: (
    index: number,
    field: "title" | "description" | "imageDescription",
    lang: "en" | "fr",
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
    title: { en: "", fr: "" },
    duration: "",
    price: "",
    maxPeople: "",
    difficulty: "Facile",
    description: { en: "", fr: "" },
    itinereryImage: "",
    highlights: [{ en: "", fr: "" }],
    itinerary: [],
    included: [{ en: "", fr: "" }],
    notIncluded: [{ en: "", fr: "" }],
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

  const handleMultilingualChange = (
    field: "title" | "description",
    lang: "en" | "fr",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleArrayMultilingualChange = (
    index: number,
    lang: "en" | "fr",
    value: string,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = {
      ...newArray[index],
      [lang]: value,
    };
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (
    arrayName: "highlights" | "included" | "notIncluded"
  ) => {
    setFormData((prev) => ({ 
      ...prev, 
      [arrayName]: [...prev[arrayName], { en: "", fr: "" }] 
    }));
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

  const handleItineraryMultilingualChange = (
    index: number,
    field: "title" | "description" | "imageDescription",
    lang: "en" | "fr",
    value: string
  ) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: {
        ...newItinerary[index][field],
        [lang]: value,
      },
    };
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: formData.itinerary.length + 1,
      title: { en: "", fr: "" },
      description: { en: "", fr: "" },
      image: "",
      imageDescription: { en: "", fr: "" },
      distance: 0,
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  const removeItineraryDay = (index: number) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
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

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
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

    // Filtrer et stringify les données multilingues
    const filteredHighlights = formData.highlights
      .filter((item) => item.en.trim() !== "" || item.fr.trim() !== "")
      .map((item) => JSON.stringify(item));

    const filteredIncluded = formData.included
      .filter((item) => item.en.trim() !== "" || item.fr.trim() !== "")
      .map((item) => JSON.stringify(item));

    const filteredNotIncluded = formData.notIncluded
      .filter((item) => item.en.trim() !== "" || item.fr.trim() !== "")
      .map((item) => JSON.stringify(item));

    const filteredItinerary = formData.itinerary
      .filter(
        (day) => 
          (day.title.en.trim() !== "" || day.title.fr.trim() !== "") ||
          (day.description.en.trim() !== "" || day.description.fr.trim() !== "")
      )
      .map((day) => ({
        ...day,
        title: JSON.stringify(day.title),
        description: JSON.stringify(day.description),
        imageDescription: JSON.stringify(day.imageDescription),
      }));

    const circuitData = {
      title: JSON.stringify(formData.title),
      duration: formData.duration,
      price: formData.price,
      maxPeople: parseInt(formData?.maxPeople!),
      difficulty: formData.difficulty,
      description: JSON.stringify(formData.description),
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

      if (res) {
        const newCircuit = await res.json();
        setAddedCircuits((prev) => [...prev, newCircuit]);
        toast({
          title: "Felicitation !",
          description: "Circuit ajouté avec succès !",
        });
        setFormData({
          title: { en: "", fr: "" },
          duration: "",
          price: "",
          maxPeople: "",
          difficulty: "Facile",
          description: { en: "", fr: "" },
          itinereryImage: "",
          highlights: [{ en: "", fr: "" }],
          itinerary: [],
          included: [{ en: "", fr: "" }],
          notIncluded: [{ en: "", fr: "" }],
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

  // Préparer les données pour la mise à jour
  const processedItinerary = formData.itinerary.map((day) => ({
    ...day,
    title: JSON.stringify(day.title),
    description: JSON.stringify(day.description),
    imageDescription: JSON.stringify(day.imageDescription),
    // 🔥 CORRECTION : Préserver les itineraryDistanceRel
    itineraryDistanceRel: day.itineraryDistanceRel || [],
  }));

  const updateData = {
    ...formData,
    title: JSON.stringify(formData.title),
    description: JSON.stringify(formData.description),
    highlights: formData.highlights.map((item) => JSON.stringify(item)),
    included: formData.included.map((item) => JSON.stringify(item)),
    notIncluded: formData.notIncluded.map((item) => JSON.stringify(item)),
    itinerary: processedItinerary,
  };

  try {
    const res = await fetch(`/api/circuit/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
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
        title: { en: "", fr: "" },
        duration: "",
        price: "",
        maxPeople: "",
        difficulty: "Facile",
        description: { en: "", fr: "" },
        itinereryImage: "",
        highlights: [{ en: "", fr: "" }],
        itinerary: [],
        included: [{ en: "", fr: "" }],
        notIncluded: [{ en: "", fr: "" }],
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

  const parseMultilingualField = (field: any): Lng => {
    if (!field) return { en: "", fr: "" };
    
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        return { en: field, fr: "" };
      }
    }
    
    return field;
  };

  const getCircuitById = async (id: string) => {
  try {
    const res = await fetch(`/api/circuit/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setCircuitDetail(data);
      
      const parsedTitle = parseMultilingualField(data.title);
      const parsedDescription = parseMultilingualField(data.description);
      
      const parsedItinerary = data.itineraries && data.itineraries.length > 0
        ? data.itineraries.map((item: any) => ({
            ...item,
            title: parseMultilingualField(item.title),
            description: parseMultilingualField(item.description),
            imageDescription: parseMultilingualField(item.imageDescription),
            // 🔥 CORRECTION : Préserver les itineraryDistanceRel
            itineraryDistanceRel: item.itineraryDistanceRel || [],
          }))
        : [];

      const parsedHighlights = data.highlights && data.highlights.length > 0
        ? data.highlights.map((item: any) => 
            parseMultilingualField(item.text || item)
          )
        : [{ en: "", fr: "" }];

      const parsedIncluded = data.included && data.included.length > 0
        ? data.included.map((item: any) => 
            parseMultilingualField(item.text || item)
          )
        : [{ en: "", fr: "" }];

      const parsedNotIncluded = data.notIncluded && data.notIncluded.length > 0
        ? data.notIncluded.map((item: any) => 
            parseMultilingualField(item.text || item)
          )
        : [{ en: "", fr: "" }];
      
      setFormData({
        title: parsedTitle,
        duration: data.duration || "",
        price: data.price || "",
        maxPeople: data.maxPeople ? String(data.maxPeople) : "",
        difficulty: data.difficulty || "Facile",
        description: parsedDescription,
        itinereryImage: data.itinereryImage || "",
        highlights: parsedHighlights,
        itinerary: parsedItinerary,
        included: parsedIncluded,
        notIncluded: parsedNotIncluded,
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
        handleMultilingualChange,
        handleArrayMultilingualChange,
        addArrayItem,
        removeArrayItem,
        handleItineraryChange,
        handleItineraryMultilingualChange,
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