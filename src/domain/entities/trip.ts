import { Reservation } from "./reservation";

export interface Program {
  day: number;
  title: string;
  description: string;
  image: string;
  imageDescription: string;
}

export interface TravelDates {
  id: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  maxPeople: string;
  price: string;
  tripTravelId: string;
  placesDisponibles?: number;
}

export interface TripTravel {
  id: string;
  title: string;
  travelDates: TravelDates[];
  price: string;
  duration: string;
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
