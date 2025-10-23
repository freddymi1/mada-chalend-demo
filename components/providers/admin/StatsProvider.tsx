// providers/StatsProvider.tsx
'use client';

import { FilterOptions, StatsResponse } from '@/src/domain/entities/stats';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StatsContextType {
  stats: StatsResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  updateFilters: (newFilters: FilterOptions) => void;
  refreshStats: () => Promise<void>;
  availableMonths: string[];
  availableYears: string[];
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

interface StatsProviderProps {
  children: ReactNode;
  initialFilters?: FilterOptions;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ 
  children, 
  initialFilters = { filterType: 'month' } 
}) => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const fetchStats = async (currentFilters: FilterOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      // Ajouter les paramètres de filtre
      params.append('filterType', currentFilters.filterType);
      
      if (currentFilters.filterType === 'month' && currentFilters.month) {
        params.append('month', currentFilters.month);
      }
      
      if (currentFilters.filterType === 'year' && currentFilters.year) {
        params.append('year', currentFilters.year);
      }

      const response = await fetch(`/api/stats/get?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data: StatsResponse = await response.json();
      setStats(data);
      
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    fetchStats(newFilters);
  };

  const refreshStats = async () => {
    await fetchStats(filters);
  };

  // Formater les mois disponibles pour l'affichage
  const availableMonths = stats?.filtre.moisDisponibles.map(month => {
    const date = new Date(`${month}-01`);
    return {
      value: month,
      label: date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    };
  }).map(item => item.value) || [];

  const availableYears = stats?.filtre.anneesDisponibles || [];

  // Chargement initial
  useEffect(() => {
    fetchStats(filters);
  }, []);

  const value: StatsContextType = {
    stats,
    isLoading,
    error,
    filters,
    updateFilters,
    refreshStats,
    availableMonths,
    availableYears
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};