// types/stats.types.ts

export interface FiltrePeriode {
  debut: string; // ISO date string
  fin: string; // ISO date string
}

export interface Filtre {
  type: 'month' | 'year';
  periode: FiltrePeriode;
  moisDisponibles: string[]; // Format: 'YYYY-MM'
  anneesDisponibles: string[]; // Format: 'YYYY'
}

export interface CircuitPlusReserve {
  id: string;
  title: string; // JSON string avec les traductions
  nombreReservations: number;
}

export interface TripPlusReserve {
  id: string;
  title: string; // JSON string avec les traductions
  nombreReservations: number;
}

export interface TravelDates {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface ReservationDeLaPeriode {
  id: string;
  nom: string;
  prenom: string;
  type: 'circuit' | 'trip' | 'vehicle';
  circuit?: string; // JSON string avec les traductions
  trip?: string; // JSON string avec les traductions
  vehicle?: string;
  date: string; // ISO date string (createdAt)
  personnes: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  travelDates: TravelDates | null;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CircuitPopulaire {
  id: string;
  title: string; // JSON string avec les traductions
  nombreReservations: number;
  nombreParticipants: number;
}

export interface TripPopulaire {
  id: string;
  title: string; // JSON string avec les traductions
  nombreReservations: number;
  nombreParticipants: number;
}

export interface StatsMensuelles {
  mois: string; // Format: 'YYYY-MM'
  reservations: number;
  participants: number;
}

export interface DetailParticipants {
  total: number;
  adultes: number;
  enfants: number;
}

export interface StatsResponse {
  filtre: Filtre;
  totalCircuitsActif: number;
  totalVehiclesActif: number;
  totalParticipants: number;
  totalReservations: number;
  circuitsPlusReserve: CircuitPlusReserve[];
  tripsPlusReserve: TripPlusReserve[];
  reservationsDeLaPeriode: ReservationDeLaPeriode[];
  circuitsPopulaires: CircuitPopulaire[];
  tripsPopulaires: TripPopulaire[];
  statsMensuelles: StatsMensuelles[];
  totalRevenus: number;
  detailParticipants: DetailParticipants;
}

// Interfaces utilitaires pour parser les titres JSON
export interface TitleTranslations {
  fr: string;
  en: string;
}

// Fonctions utilitaires pour parser les titres
export const parseTitle = (titleJson: string): TitleTranslations => {
  try {
    return JSON.parse(titleJson);
  } catch (error) {
    console.error('Erreur lors du parsing du titre:', error);
    return { fr: titleJson, en: titleJson };
  }
};

export const getTitleByLanguage = (titleJson: string, language: 'fr' | 'en' = 'fr'): string => {
  const translations = parseTitle(titleJson);
  return translations[language] || translations.fr || titleJson;
};

// Interface pour les props de composants
export interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface FilterOptions {
  filterType: 'month' | 'year';
  month?: string;
  year?: string;
}

// Interface pour les données formatées pour les graphiques
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Exemple d'utilisation dans un composant React
export interface StatsDashboardProps {
  stats: StatsResponse;
  onFilterChange: (filters: FilterOptions) => void;
  isLoading?: boolean;
}