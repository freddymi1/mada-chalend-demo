// Types
export interface Vehicle {
  id: number;
  name: string;
  category: VehicleCategory;
  type: string;
  passengers: number;
  pricePerDay: number;
  rating: number;
  mainImage: string;
  detailImages: string[];
  features: string[];
  description: string;
}

export interface Category {
  id: VehicleCategory | 'all';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type VehicleCategory = '4x4' | 'pickup' | 'minibus' | 'bus' | 'compact4x4';

// Component Props
export interface CarSectionProps {
  className?: string;
}