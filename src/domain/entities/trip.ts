import { Reservation } from "./reservation";

export interface TripTravel {
  id: string;
  title: string;
  duration: string;
  startDate: Date;
  endDate: Date;
  price: string;
  maxPeople?: number;
  description: string;
  highlights: string[];
  program: Array<{
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
