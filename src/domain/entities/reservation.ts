import { Vehicle } from "./car";
import { Circuit } from "./circuit";

export enum Status {
  Valide = "valide",
  Annule = "annule",
  EnAttente = "en_attente",
  EnCours = "en_cours",
}

export interface Reservation {
  id?: string;
  resType?: string;
  circuit?: string;
  vehicle?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  address: string;
  personnes: string;
  nbrChild: string;
  nbrAdult: string;
  startDate: string; // format YYYY-MM-DD
  endDate: string; // format YYYY-MM-DD
  duration: string; // nombre de jours
  preferences: string;
  circuitRel?: Circuit;
  vehicleRel?: Vehicle;
  status?: Status; // facultatif
  createdAt?: any;
}

export interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface BookingResponse {
  reservations: Reservation[] | any;
  pagination: Pagination;
}
