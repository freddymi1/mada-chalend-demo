// Interface pour la catégorie

import { Category } from "./car";
import { Reservation } from "./reservation";




// Interface pour les périodes réservées
export interface BookedDate {
  startDate: string;
  endDate: string;
  reservationId: string;
  status: string;
  clientName: string;
}

// Interface pour la réservation future/prochaine
export interface NextReservation {
  startDate: string;
  endDate: string;
  reservationId: string;
  clientName: string;
  status: string;
}

// Interface principale du véhicule
export interface VehicleDTO {
  id: string;
  name: string;
  categoryId: string;
  type: string;
  passengers: number;
  pricePerDay: number;
  rating: number;
  mainImage: string;
  detailImages: string[];
  features: string[];
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  categoryRel: Category;
  reservations: Reservation[];
  isAvailable: boolean;
  activeReservationsCount: number;
  bookedDates: BookedDate[];
  currentReservation: Reservation | null;
  nextReservation: NextReservation | null;
}
