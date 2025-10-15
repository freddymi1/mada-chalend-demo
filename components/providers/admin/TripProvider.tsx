"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";
import { TravelDates, TripTravel } from "@/src/domain/entities/trip";

export interface Program {
  day: number;
  title: string;
  description: string;
  image: string;
  imageDescription: string;
}

interface TripFormData {
  title: string;
  price: string;
  travelDates: TravelDates[];
  description: string;
  highlights: string[];
  program: Program[];
  included: string[];
  notIncluded: string[];
}

interface TripContextType {
  formData: TripFormData;
  setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
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
  handleProgramChange: (
    index: number,
    field: keyof Program,
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
}

const TripContext = createContext<TripContextType | undefined>(undefined);

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
    title: "",
    price: "",
    travelDates: [],
    description: "",
    highlights: [""],
    program: [],
    included: [""],
    notIncluded: [""],
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

  const handleProgramChange = (
    index: number,
    field: keyof Program,
    value: string
  ) => {
    const newProgram = [...formData.program];
    newProgram[index] = { ...newProgram[index], [field]: value };
    setFormData((prev) => ({ ...prev, program: newProgram }));
  };

  const addProgramDay = () => {
    const newDay: Program = {
      day: formData.program.length + 1,
      title: "",
      description: "",
      image: "",
      imageDescription: "",
    };
    setFormData((prev) => ({
      ...prev,
      program: [...prev.program, newDay],
    }));
  };

  const removeProgramDay = (index: number) => {
    const newProgram = formData.program.filter((_, i) => i !== index);
    // Reassign days in order
    const reorderedProgram = newProgram.map((day, idx) => ({
      ...day,
      day: idx + 1,
    }));
    setFormData((prev) => ({ ...prev, program: reorderedProgram }));
  };

  const handleTravelDatesChange = (
    index: number,
    field: keyof TravelDates,
    value: string | Date
  ) => {
    const newTravelDates = [...formData.travelDates];
    
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
          return; // Ne pas mettre à jour si les dates sont invalides
        }
        
        const days = calculateDuration(start, end);
        newTravelDates[index].duration = days;
      }
    }
    
    setFormData((prev) => ({ ...prev, travelDates: newTravelDates }));
  };

  const addTravelDate = () => {
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
    
    setFormData((prev) => ({
      ...prev,
      travelDates: [...prev.travelDates, newDate],
    }));
  };

  const removeTravelDate = (index: number) => {
    const newTravelDates = formData.travelDates.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, travelDates: newTravelDates }));
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
        handleProgramChange(index, "image", data.url);
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
    const filteredProgram = formData.program.filter(
      (day) => day.title.trim() !== "" || day.description.trim() !== ""
    );

    const circuitData = {
      title: formData.title,
      price: formData.price,
      travelDates: formData.travelDates,
      description: formData.description,
      highlights: filteredHighlights,
      included: filteredIncluded,
      notIncluded: filteredNotIncluded,
      program: filteredProgram,
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
          title: "",
          price: "",
          travelDates: [],
          description: "",
          highlights: [""],
          program: [],
          included: [""],
          notIncluded: [""],
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
    try {
      const res = await fetch(`/api/trip/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          title: "",
          price: "",
          travelDates: [],
          description: "",
          highlights: [""],
          program: [],
          included: [""],
          notIncluded: [""],
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
    console.log("IDDDDD", id);
    // setIsLoading(true)
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

  const getTripById = async (id: string) => {
    try {
      const res = await fetch(`/api/trip/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log("RESS", data);
        setTripDetail(data);
        setFormData({
          title: data.title || "",
          price: data.price || "",
          travelDates: data.travelDates || [],
          description: data.description || "",
          highlights:
            data.highlights && data.highlights.length > 0
              ? data.highlights.map((item: any) => item.text)
              : [],
          program:
            data.program && data.program.length > 0
              ? data.program
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
        formatDuration
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