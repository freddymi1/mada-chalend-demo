import { Reservation } from "./reservation";

export interface Program {
  day: number;
  title: string;
  description: string;
  image: string;
  imageDescription: string;
}
export interface TripTravel {
  id: string;
  title: string;
  duration: string;
  startDate: Date;
  endDate: Date;
  price: string;
  maxPeople?: number;
  nbrChild?: number;
  nbrAdult?: number;
  description: string;
  highlights: string[];
  program: Program[];
  included: string[];
  notIncluded: string[];
  reservations?: Reservation[];
  reservationCount?: number;
  totalPersonnesReservees?: number;
  placesDisponibles?: number;
}
