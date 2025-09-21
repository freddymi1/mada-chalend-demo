import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type LucideIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  slug?: string; // Devenu optionnel
  vehicles?: Vehicle[];
}
export interface Vehicle {
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
  createdAt: Date;
  updatedAt: Date;
  categoryRel?: Category; // Relation optionnelle
}