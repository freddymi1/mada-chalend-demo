export enum Status {
  Valide = "valide",
  Annule = "annule",
  EnAttente = "en_attente",
  EnCours = "en_cours"
}

export interface Reservation {
  circuit: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  address: string;
  personnes: string;
  startDate: string; // format YYYY-MM-DD
  endDate: string;   // format YYYY-MM-DD
  duration: string;  // nombre de jours
  preferences: string;
  status?: Status;   // facultatif
}
