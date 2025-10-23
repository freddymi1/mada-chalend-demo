"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";
import { TravelDates, TripTravel } from "@/src/domain/entities/trip";

// Interfaces pour les données multilingues
interface LocalizedText {
  fr: string;
  en: string;
}

export interface Program {
  day: number;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  imageDescription: LocalizedText;
}

interface TripFormData {
  title: LocalizedText;
  price: string;
  duration: string;
  travelDates: TravelDates[];
  description: LocalizedText;
  highlights: LocalizedText[];
  program: Program[];
  included: LocalizedText[];
  notIncluded: LocalizedText[];
}

interface TripContextType {
  formData: TripFormData;
  setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleLocalizedInputChange: (
    field: keyof TripFormData,
    language: 'fr' | 'en',
    value: string
  ) => void;
  handleArrayInputChange: (
    index: number,
    language: 'fr' | 'en',
    value: string,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => void;
  addArrayItem: (arrayName: "highlights" | "included" | "notIncluded") => void;
  removeArrayItem: (
    index: number,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => void;
  handleProgramChange: (
    index: number,
    field: keyof Program,
    language: 'fr' | 'en',
    value: string
  ) => void;
  addProgramDay: () => void;
  removeProgramDay: (index: number) => void;
  handleImageUpload: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  addedTrips: any[];
  handleDelete: (id: string) => void;
  fetchTrips: () => void;
  getTripById: (id: string) => void;
  tripDetail: TripTravel | null;
  isLoading: boolean;
  handleUpdate: (id: string) => void;
  isUpdate: string | null;
  handleTravelDatesChange: (
    index: number,
    field: keyof TravelDates,
    value: string | Date
  ) => void;
  addTravelDate: () => void;
  removeTravelDate: (index: number) => void;
  formatDateForInput: (date: Date | string) => string;
  formatDuration: (days: number) => string;
  createLocalizedText: (fr?: string, en?: string) => LocalizedText;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

// Fonction utilitaire pour créer un objet LocalizedText
const createLocalizedText = (fr: string = "", en: string = ""): LocalizedText => ({
  fr,
  en
});

// Fonction utilitaire pour convertir un string en LocalizedText
const stringToLocalizedText = (text: string): LocalizedText => ({
  fr: text,
  en: ""
});

export const TripProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [addedTrips, setAddedTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tripDetail, setTripDetail] = useState<any>(null);
  const [formData, setFormData] = useState<TripFormData>({
    title: createLocalizedText(),
    price: "",
    duration: "",
    travelDates: [],
    description: createLocalizedText(),
    highlights: [createLocalizedText()],
    program: [],
    included: [createLocalizedText()],
    notIncluded: [createLocalizedText()],
  });

  const params = useSearchParams();
  const id = params.get("id");
  const isUpdate = params.get("update");

  useEffect(() => {
    if (id) {
      getTripById(id.toString());
    }
  }, [id]);

  // Fonction pour formater la date pour l'input date
  const formatDateForInput = (date: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Fonction pour calculer la durée en jours
  const calculateDuration = (startDate: Date, endDate: Date): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff > 0 ? dayDiff : 0;
  };

  // Fonction pour formater la durée en texte
  const formatDuration = (days: number): string => {
    if (days <= 0) return "0 jour";
    const nights = days - 1;
    return `${days} jour${days > 1 ? 's' : ''} / ${nights} nuit${nights > 1 ? 's' : ''}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion des champs localisés (title, description) - CORRIGÉ
  const handleLocalizedInputChange = (
    field: keyof TripFormData,
    language: 'fr' | 'en',
    value: string
  ) => {
    setFormData((prev) => {
      const currentField = prev[field];
      // Vérifier que c'est bien un LocalizedText
      if (typeof currentField === 'object' && 'fr' in currentField && 'en' in currentField) {
        return {
          ...prev,
          [field]: {
            ...currentField,
            [language]: value
          }
        };
      }
      return prev;
    });
  };

  // Gestion des tableaux localisés (highlights, included, notIncluded)
  const handleArrayInputChange = (
    index: number,
    language: 'fr' | 'en',
    value: string,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      if (index < newArray.length) {
        newArray[index] = {
          ...newArray[index],
          [language]: value
        };
      }
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const addArrayItem = (
    arrayName: "highlights" | "included" | "notIncluded"
  ) => {
    setFormData((prev) => ({ 
      ...prev, 
      [arrayName]: [...prev[arrayName], createLocalizedText()] 
    }));
  };

  const removeArrayItem = (
    index: number,
    arrayName: "highlights" | "included" | "notIncluded"
  ) => {
    setFormData((prev) => {
      const newArray = prev[arrayName].filter((_, i) => i !== index);
      return { ...prev, [arrayName]: newArray };
    });
  };

  // Gestion du programme localisé - CORRIGÉ
  const handleProgramChange = (
    index: number,
    field: keyof Program,
    language: 'fr' | 'en',
    value: string
  ) => {
    setFormData((prev) => {
      const newProgram = [...prev.program];
      
      if (index >= newProgram.length) return prev;

      const currentDay = newProgram[index];
      
      if (field === 'image') {
        // Pour l'image, c'est un string simple
        newProgram[index] = { ...currentDay, [field]: value };
      } else {
        // Pour les champs localisés (title, description, imageDescription)
        const currentField = currentDay[field];
        if (typeof currentField === 'object' && 'fr' in currentField && 'en' in currentField) {
          newProgram[index] = {
            ...currentDay,
            [field]: {
              ...currentField,
              [language]: value
            }
          };
        }
      }
      
      return { ...prev, program: newProgram };
    });
  };

  const addProgramDay = () => {
    setFormData((prev) => {
      const newDay: Program = {
        day: prev.program.length + 1,
        title: createLocalizedText(),
        description: createLocalizedText(),
        image: "",
        imageDescription: createLocalizedText(),
      };
      return {
        ...prev,
        program: [...prev.program, newDay],
      };
    });
  };

  const removeProgramDay = (index: number) => {
    setFormData((prev) => {
      const newProgram = prev.program.filter((_, i) => i !== index);
      // Reassign days in order
      const reorderedProgram = newProgram.map((day, idx) => ({
        ...day,
        day: idx + 1,
      }));
      return { ...prev, program: reorderedProgram };
    });
  };

  const handleTravelDatesChange = (
    index: number,
    field: keyof TravelDates,
    value: string | Date
  ) => {
    setFormData((prev) => {
      const newTravelDates = [...prev.travelDates];
      
      if (index >= newTravelDates.length) return prev;

      // Mettre à jour la valeur du champ
      newTravelDates[index] = { ...newTravelDates[index], [field]: value };
      
      // Si startDate ou endDate change, recalculer la durée automatiquement
      if (field === 'startDate' || field === 'endDate') {
        const startDate = field === 'startDate' ? value : newTravelDates[index].startDate;
        const endDate = field === 'endDate' ? value : newTravelDates[index].endDate;
        
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          
          // Validation : endDate ne peut pas être avant startDate
          if (end < start) {
            toast({
              title: "Erreur de date",
              description: "La date de fin ne peut pas être avant la date de début",
              variant: "destructive"
            });
            return prev; // Ne pas mettre à jour si les dates sont invalides
          }
          
          const days = calculateDuration(start, end);
          newTravelDates[index].duration = days;
        }
      }
      
      return { ...prev, travelDates: newTravelDates };
    });
  };

  const addTravelDate = () => {
    setFormData((prev) => {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 7); // 7 jours par défaut
      
      const newDate: TravelDates = {
        id: "",
        tripTravelId: "",
        startDate: today,
        endDate: endDate,
        maxPeople: "",
        price: "",
        duration: calculateDuration(today, endDate)
      };
      
      return {
        ...prev,
        travelDates: [...prev.travelDates, newDate],
      };
    });
  };

  const removeTravelDate = (index: number) => {
    setFormData((prev) => {
      const newTravelDates = prev.travelDates.filter((_, i) => i !== index);
      return { ...prev, travelDates: newTravelDates };
    });
  };

  const handleImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      try {
        // Appel API upload
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          // data.url = "/uploads/nomfichier.jpg"
          handleProgramChange(index, "image", 'fr', data.url);
        } else {
          toast({
            title: "Error !",
            description: "Erreur lors de l'upload de l'image",
          });
        }
      } catch (error) {
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
      (item) => item.fr.trim() !== "" || item.en.trim() !== ""
    );
    const filteredIncluded = formData.included.filter(
      (item) => item.fr.trim() !== "" || item.en.trim() !== ""
    );
    const filteredNotIncluded = formData.notIncluded.filter(
      (item) => item.fr.trim() !== "" || item.en.trim() !== ""
    );
    const filteredProgram = formData.program.filter(
      (day) => day.title.fr.trim() !== "" || day.title.en.trim() !== "" || 
               day.description.fr.trim() !== "" || day.description.en.trim() !== ""
    );

    // Stringifier les données localisées
    const circuitData = {
      title: JSON.stringify(formData.title),
      price: formData.price,
      duration: formData.duration,
      travelDates: formData.travelDates,
      description: JSON.stringify(formData.description),
      highlights: filteredHighlights.map(item => JSON.stringify(item)),
      included: filteredIncluded.map(item => JSON.stringify(item)),
      notIncluded: filteredNotIncluded.map(item => JSON.stringify(item)),
      program: filteredProgram.map(day => ({
        ...day,
        title: JSON.stringify(day.title),
        description: JSON.stringify(day.description),
        imageDescription: JSON.stringify(day.imageDescription)
      })),
    };

    try {
      const res = await fetch("/api/trip/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(circuitData),
      });

      if (res.ok) {
        const newTrip = await res.json();
        setAddedTrips((prev) => [...prev, newTrip]);
        toast({
          title: "Felicitation !",
          description: "Voyage ajouté avec succès !",
        });
        setFormData({
          title: createLocalizedText(),
          price: "",
          duration: "",
          travelDates: [],
          description: createLocalizedText(),
          highlights: [createLocalizedText()],
          program: [],
          included: [createLocalizedText()],
          notIncluded: [createLocalizedText()],
        });
        setIsLoading(false);
        router.push("/admin/trip");

      } else {
        toast({
          title: "Error !",
          description: "Erreur serveur lors de l'ajout du voyage",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur serveur lors de l'ajout du voyage",
      });
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setIsLoading(true);
    
    // Préparer les données pour l'update (identique au submit)
    const filteredHighlights = formData.highlights.filter(
      (item) => item.fr.trim() !== "" || item.en.trim() !== ""
    );
    const filteredIncluded = formData.included.filter(
      (item) => item.fr.trim() !== "" || item.en.trim() !== ""
    );
    const filteredNotIncluded = formData.notIncluded.filter(
      (item) => item.fr.trim() !== "" || item.en.trim() !== ""
    );
    const filteredProgram = formData.program.filter(
      (day) => day.title.fr.trim() !== "" || day.title.en.trim() !== "" || 
               day.description.fr.trim() !== "" || day.description.en.trim() !== ""
    );

    const circuitData = {
      title: JSON.stringify(formData.title),
      price: formData.price,
      duration: formData.duration,
      travelDates: formData.travelDates,
      description: JSON.stringify(formData.description),
      highlights: filteredHighlights.map(item => JSON.stringify(item)),
      included: filteredIncluded.map(item => JSON.stringify(item)),
      notIncluded: filteredNotIncluded.map(item => JSON.stringify(item)),
      program: filteredProgram.map(day => ({
        ...day,
        title: JSON.stringify(day.title),
        description: JSON.stringify(day.description),
        imageDescription: JSON.stringify(day.imageDescription)
      })),
    };

    try {
      const res = await fetch(`/api/trip/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(circuitData),
      });
      if (res.ok) {
        const updatedTrip = await res.json();
        setAddedTrips((prev) =>
          prev.map((trip) => (trip.id === id ? updatedTrip : trip))
        );
        toast({
          title: "Success !",
          description: "Trip mis à jour !",
        });
        setIsLoading(false);
        router.push("/admin/trip");
        await getTripById(id);
        await fetchTrips();
        setFormData({
          title: createLocalizedText(),
          price: "",
          duration: "",
          travelDates: [],
          description: createLocalizedText(),
          highlights: [createLocalizedText()],
          program: [],
          included: [createLocalizedText()],
          notIncluded: [createLocalizedText()],
        });
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de la mise à jour du voyage.",
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Error !",
        description: "Erreur lors de la mise à jour du voyage.",
      });
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/trip/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddedTrips((prev) => prev.filter((trip) => trip.id !== id));
        toast({
          title: "Success !",
          description: "Voyage supprimé !",
        });
        setIsLoading(false);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de la suppression du voyage.",
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Error !",
        description: "Erreur lors de la suppression du voyage.",
      });
      setIsLoading(false);
    }
  };

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

  // Fonction pour parser les données localisées depuis l'API
  const parseLocalizedData = (data: any): LocalizedText => {
    if (!data) return createLocalizedText();
    
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return stringToLocalizedText(data);
      }
    }
    
    if (typeof data === 'object') {
      return {
        fr: data.fr || "",
        en: data.en || ""
      };
    }
    
    return createLocalizedText();
  };

  const getTripById = async (id: string) => {
    try {
      const res = await fetch(`/api/trip/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTripDetail(data);
        
        // Convertir les données de l'API en format formulaire
        setFormData({
          title: parseLocalizedData(data.title),
          price: data.price || "",
          duration: data.duration || "",
          travelDates: data.travelDates || [],
          description: parseLocalizedData(data.description),
          highlights: data.highlights && data.highlights.length > 0
            ? data.highlights.map((item: any) => parseLocalizedData(item.text || item))
            : [createLocalizedText()],
          program: data.program && data.program.length > 0
            ? data.program.map((item: any) => ({
                day: item.day || 0,
                title: parseLocalizedData(item.title),
                description: parseLocalizedData(item.description),
                image: item.image || "",
                imageDescription: parseLocalizedData(item.imageDescription)
              }))
            : [],
          included: data.included?.length
            ? data.included.map((item: any) => parseLocalizedData(item.text || item))
            : [createLocalizedText()],
          notIncluded: data.notIncluded?.length
            ? data.notIncluded.map((item: any) => parseLocalizedData(item.text || item))
            : [createLocalizedText()],
        });
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
        formData,
        setFormData,
        handleInputChange,
        handleLocalizedInputChange,
        handleArrayInputChange,
        addArrayItem,
        removeArrayItem,
        handleProgramChange,
        addProgramDay,
        removeProgramDay,
        handleImageUpload,
        handleSubmit,
        addedTrips,
        handleDelete,
        fetchTrips,
        getTripById,
        tripDetail,
        isLoading,
        handleUpdate,
        isUpdate,
        handleTravelDatesChange,
        addTravelDate,
        removeTravelDate,
        formatDateForInput,
        formatDuration,
        createLocalizedText
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};