import { Reservation } from "./reservation";

export interface Circuit {
  id: number;
  title: string;
  duration: string;
  price: string;
  maxPeople: number;
  mainImage: string | null;
  difficulty: string;
  description: string;
  itinereryImage: string;
  highlights: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    image: string;
    imageDescription: string;
    distance: number;
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