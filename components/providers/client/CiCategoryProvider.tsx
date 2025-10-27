'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    vehicles: number;
  };
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getCategory: (id: string) => Promise<Category>;
}

const CiCategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCiCategory = () => {
  const context = useContext(CiCategoryContext);
  if (!context) {
    throw new Error('useCiCategory must be used within a CiCategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CiCategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/category/get');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async (id: string): Promise<Category> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/category/get/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    fetchCategories,
    getCategory,
  };

  return (
    <CiCategoryContext.Provider value={value}>
      {children}
    </CiCategoryContext.Provider>
  );
};