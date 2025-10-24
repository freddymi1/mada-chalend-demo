"use client";

import type React from "react";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/client/ui/card";
import { useLocale, useTranslations } from "use-intl";
import { useSearchParams } from "next/navigation";
import { useClientCircuit } from "../providers/client/ClientCircuitProvider";

import { useBooking } from "../providers/client/ClientBookingProvider";
import { extraireJours } from "../helpers/extract-text";
import { useClVehicle } from "../providers/client/ClVehicleProvider";
import CircuitBooking from "./circuit-booking";
import BookingOk from "./booking-ok";
import CarBooking from "./car-booking";
import CarDisponibility from "./car-dispo";

// Interface pour les dates réservées
interface BookedDate {
  startDate: string;
  endDate: string;
  reservationId: string;
  status: string;
}

// Interface pour les données de disponibilité
interface VehicleAvailability {
  isAvailable: boolean;
  activeReservationsCount: number;
  bookedDates: BookedDate[];
}

export function CarBookingSection() {
  const t = useTranslations("lng");
  const params = useSearchParams();
  const car = params.get("car");
  const locale = useLocale();

  const { createReservation, loading, success } = useBooking();

  // État pour le popup de confirmation
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  const { vehicles, fetchVehicles, getVehicleById, vehicleDetail } =
    useClVehicle();

  // État pour la disponibilité
  const [vehicleAvailability, setVehicleAvailability] = useState<VehicleAvailability | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string>("");

  useEffect(() => {
    if (vehicleDetail) {
      setFormData((prev) => ({
        ...prev,
        vehicle: vehicleDetail.id,
      }));
    }
  }, [vehicleDetail]);

  useEffect(() => {
    const loadVehicles = async () => {
      await fetchVehicles();
    };
    loadVehicles();
  }, []);

  useEffect(() => {
    if (car) {
      getVehicleById(car);
    }
  }, [car]);

  const [formData, setFormData] = useState({
    vehicle: car ? car : "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    address: "",
    personnes: "",
    nbrChild: "",
    nbrAdult: "",
    startDate: "",
    endDate: "",
    duration: "",
    preferences: "",
  });

  // Fonction pour vérifier si une date est disponible
  const isDateAvailable = useCallback((date: string): boolean => {
    if (!vehicleAvailability || !vehicleAvailability.bookedDates.length) {
      return true;
    }

    const selectedDate = new Date(date);
    
    for (const bookedDate of vehicleAvailability.bookedDates) {
      const startDate = new Date(bookedDate.startDate);
      const endDate = new Date(bookedDate.endDate);
      
      if (selectedDate >= startDate && selectedDate <= endDate) {
        return false;
      }
    }
    
    return true;
  }, [vehicleAvailability]);

  // Fonction pour vérifier si une période est disponible
  const isPeriodAvailable = useCallback((startDate: string, endDate: string): boolean => {
    if (!vehicleAvailability || !vehicleAvailability.bookedDates.length) {
      return true;
    }

    const selectedStart = new Date(startDate);
    const selectedEnd = new Date(endDate);
    
    for (const bookedDate of vehicleAvailability.bookedDates) {
      const bookedStart = new Date(bookedDate.startDate);
      const bookedEnd = new Date(bookedDate.endDate);
      
      // Vérifier s'il y a un chevauchement
      if (
        (selectedStart >= bookedStart && selectedStart <= bookedEnd) ||
        (selectedEnd >= bookedStart && selectedEnd <= bookedEnd) ||
        (selectedStart <= bookedStart && selectedEnd >= bookedEnd)
      ) {
        return false;
      }
    }
    
    return true;
  }, [vehicleAvailability]);

  // Fonction pour obtenir les dates indisponibles
  const getUnavailableDates = useCallback((): Date[] => {
    if (!vehicleAvailability || !vehicleAvailability.bookedDates.length) {
      return [];
    }

    const unavailableDates: Date[] = [];
    
    vehicleAvailability.bookedDates.forEach(bookedDate => {
      const start = new Date(bookedDate.startDate);
      const end = new Date(bookedDate.endDate);
      
      // Ajouter toutes les dates entre start et end
      const currentDate = new Date(start);
      while (currentDate <= end) {
        unavailableDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return unavailableDates;
  }, [vehicleAvailability]);

  // Charger la disponibilité quand le véhicule change
  useEffect(() => {
    const loadVehicleAvailability = async () => {
      if (vehicleDetail?.id) {
        try {
          setAvailabilityError("");
          // Simuler l'appel API pour récupérer la disponibilité
          // Remplacez cette partie par votre appel API réel
          const availabilityData = await fetchVehicleAvailability(vehicleDetail.id);
          setVehicleAvailability(availabilityData);
        } catch (error) {
          console.error("Erreur lors du chargement de la disponibilité:", error);
          setAvailabilityError("Impossible de charger la disponibilité du véhicule");
        }
      }
    };
    
    loadVehicleAvailability();
  }, [vehicleDetail]);

  // Fonction simulée pour récupérer la disponibilité (à remplacer par votre API)
  const fetchVehicleAvailability = async (vehicleId: string): Promise<VehicleAvailability> => {
  try {
    // Supposons que vous ayez un tableau data avec les véhicules et leurs disponibilités
    const vehicleData = vehicles.find(vehicle => vehicle.id === vehicleId);
    
    if (!vehicleData) {
      throw new Error("Véhicule non trouvé");
    }
    
    // Adaptez selon la structure de vos données
    return {
      isAvailable: vehicleData.isAvailable ?? true,
      activeReservationsCount: vehicleData.activeReservationsCount || 0,
      bookedDates: vehicleData.bookedDates || []
    };
    
  } catch (error) {
    console.error("Erreur lors de la récupération de la disponibilité:", error);
    
    return {
      isAvailable: true,
      activeReservationsCount: 0,
      bookedDates: []
    };
  }
};

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier la disponibilité avant de soumettre
    if (formData.startDate && formData.endDate) {
      const isAvailable = isPeriodAvailable(formData.startDate, formData.endDate);
      
      if (!isAvailable) {
        alert("Désolé, le véhicule n'est pas disponible pour les dates sélectionnées. Veuillez choisir d'autres dates.");
        return;
      }
    }

    const data = {
      resType: "car",
      vehicle: formData.vehicle,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      address: formData.address,
      personnes: formData.personnes,
      nbrChild: formData.nbrChild,
      nbrAdult: formData.nbrAdult,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: formData.duration,
      preferences: formData.preferences,
    };

    // Stocker les données et afficher le popup de confirmation
    setPendingFormData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmReservation = async () => {
    if (!pendingFormData) return;

    const res = await createReservation(pendingFormData);

    // if (success) {
    setFormData({
      vehicle: car ? car : "",
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      address: "",
      personnes: "",
      nbrChild: "",
      nbrAdult: "",
      startDate: "",
      endDate: "",
      duration: "",
      preferences: "",
    });
    // }

    // Fermer le popup
    setShowConfirmDialog(false);
    setPendingFormData(null);
  };

  const handleCancelReservation = () => {
    setShowConfirmDialog(false);
    setPendingFormData(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Vérifier la disponibilité quand les dates changent
    if ((name === 'startDate' || name === 'endDate') && formData.startDate && formData.endDate) {
      const isAvailable = isPeriodAvailable(
        name === 'startDate' ? value : formData.startDate,
        name === 'endDate' ? value : formData.endDate
      );
      
      if (!isAvailable) {
        setAvailabilityError("Le véhicule n'est pas disponible pour les dates sélectionnées");
      } else {
        setAvailabilityError("");
      }
    }
  };

  // Gestion spécifique du changement du nombre de personnes
  const handlePersonnesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPersonnes = e.target.value;
    const personnesNum = parseInt(newPersonnes) || 0;

    setFormData((prev) => ({
      ...prev,
      personnes: newPersonnes,
      nbrAdult: personnesNum > 0 ? personnesNum.toString() : "",
      nbrChild: "0",
    }));
  };

  // Gestion du changement du nombre d'adultes
  const handleNbrAdultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNbrAdult = e.target.value;
    const adultsNum = parseInt(newNbrAdult) || 0;
    const personnesNum = parseInt(formData.personnes) || 0;

    // Limiter le nombre d'adultes au nombre total de personnes
    const maxAdults = Math.min(adultsNum, personnesNum);
    const remainingChildren = personnesNum - maxAdults;

    setFormData((prev) => ({
      ...prev,
      nbrAdult: maxAdults.toString(),
      nbrChild: remainingChildren.toString(),
    }));
  };

  // Gestion du changement du nombre d'enfants
  const handleNbrChildChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNbrChild = e.target.value;
    const childrenNum = parseInt(newNbrChild) || 0;
    const personnesNum = parseInt(formData.personnes) || 0;
    const adultsNum = parseInt(formData.nbrAdult) || 0;

    // Limiter le nombre d'enfants pour que le total ne dépasse pas le nombre de personnes
    const maxChildren = Math.min(childrenNum, personnesNum - adultsNum);

    setFormData((prev) => ({
      ...prev,
      nbrChild: Math.max(0, maxChildren).toString(),
    }));
  };

  const handleCarChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      vehicle: value,
    }));
    // Charger les détails du véhicule sélectionné
    getVehicleById(value);
    // Réinitialiser l'état de disponibilité
    setVehicleAvailability(null);
    setAvailabilityError("");
  };

  // Fonction pour calculer la date de fin
  const calculateEndDate = (
    startDate: string,
    durationInDays: number
  ): string => {
    if (!startDate || !durationInDays) return "";

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + durationInDays - 1); // -1 car si c'est 3 jours, ça finit le 3ème jour

    const year = end.getFullYear();
    const month = String(end.getMonth() + 1).padStart(2, "0");
    const day = String(end.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Calcul duration for reservation vehicle, à partir de startDate et endDate
  useEffect(() => {
    if (formData?.startDate && formData?.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const durationInDays =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
      setFormData((prev) => ({
        ...prev,
        duration: durationInDays.toString(),
      }));
    }
  }, [formData?.startDate, formData?.endDate]);

  // Calculer automatiquement la date de fin quand startDate ou duration change
  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const durationInDays = parseInt(formData.duration);
      if (!isNaN(durationInDays)) {
        const calculatedEndDate = calculateEndDate(
          formData.startDate,
          durationInDays
        );
        setFormData((prev) => ({
          ...prev,
          endDate: calculatedEndDate,
        }));
      }
    }
  }, [formData.startDate, formData.duration]);

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fonction pour formater les dates pour l'affichage
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const selectedVehicle = vehicles?.find((v) => v.id === vehicleId);
    const vehicleName = selectedVehicle?.name ? JSON.parse(selectedVehicle.name) : { fr: "", en: "" };
    if (locale === "fr") {
      return vehicleName.fr;
    } else {
      return vehicleName.en;
    }
  };

  return (
    <section id="reservation" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
              {t("book.titleCar")}
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              {t("book.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1">
            
            <Card
              className="animate-scale-in hover-lift"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              <CardHeader>
                <CardTitle>{t("book.form.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CarBooking
                  vehicle={car}
                  vehicles={vehicles}
                  vehicleDetail={vehicleDetail}
                  isLoading={loading}
                  formData={formData}
                  handleChange={handleChange}
                  handleCarChange={handleCarChange}
                  handlePersonnesChange={handlePersonnesChange}
                  handleNbrAdultChange={handleNbrAdultChange}
                  handleNbrChildChange={handleNbrChildChange}
                  handleSubmit={handleSubmit}
                  loading={loading}
                  getTodayString={getTodayString}
                  // Props pour la disponibilité
                  vehicleAvailability={vehicleAvailability}
                  availabilityError={availabilityError}
                  isDateAvailable={isDateAvailable}
                  isPeriodAvailable={isPeriodAvailable}
                  getUnavailableDates={getUnavailableDates}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Popup de confirmation */}
      <BookingOk
        restType={"car"}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        pendingFormData={pendingFormData}
        loading={loading}
        handleCancelReservation={handleCancelReservation}
        handleConfirmReservation={handleConfirmReservation}
        getVehicleName={getVehicleName}
        formatDate={formatDate}
      />
    </section>
  );
}