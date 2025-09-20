import { Reservation } from "./reservation";

export interface Circuit {
  id: number;
  title: string;
  duration: string;
  price: string;
  maxPeople: number;
  difficulty: string;
  description: string;
  highlights: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    image: string;
    imageDescription: string;
  }>;
  included: string[];
  notIncluded: string[];
  reservations?: Reservation[];
  reservationCount?: number;
  totalPersonnesReservees?: number;
  placesDisponibles?: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  image: string;
  imageDescription: string;
}