'use client';

import { CreateReviewInput, Review, ReviewStatus } from '@/src/domain/entities/review';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

type ReviewAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'UPDATE_REVIEW'; payload: Review }
  | { type: 'DELETE_REVIEW'; payload: string }
  | { type: 'UPDATE_REVIEW_STATUS'; payload: { id: string; status: ReviewStatus } };

interface ReviewContextType {
  state: ReviewState;
  actions: {
    createReview: (reviewData: CreateReviewInput) => Promise<void>;
    updateReview: (id: string, reviewData: Partial<Review>) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
    updateReviewStatus: (id: string, status: ReviewStatus) => Promise<void>;
    fetchReviews: () => Promise<void>;
    fetchUserReviews: (userId: string) => Promise<void>;
  };
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

// Reducer pour gérer l'état
const reviewReducer = (state: ReviewState, action: ReviewAction): ReviewState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload, error: null };
    case 'ADD_REVIEW':
      return { ...state, reviews: [action.payload, ...state.reviews], error: null };
    case 'UPDATE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        ),
        error: null
      };
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.payload),
        error: null
      };
    case 'UPDATE_REVIEW_STATUS':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id
            ? { ...review, status: action.payload.status }
            : review
        ),
        error: null
      };
    default:
      return state;
  }
};

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

interface ReviewProviderProps {
  children: React.ReactNode;
}

export const AdminReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  // Actions
  const createReview = async (reviewData: CreateReviewInput): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch('/api/review/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la review');
      }

      const { review } = await response.json();
      dispatch({ type: 'ADD_REVIEW', payload: review });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateReview = async (id: string, reviewData: Partial<Review>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/review/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la review');
      }

      const { review } = await response.json();
      dispatch({ type: 'UPDATE_REVIEW', payload: review });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteReview = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/review/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de la review');
      }

      dispatch({ type: 'DELETE_REVIEW', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateReviewStatus = async (id: string, status: ReviewStatus): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`/api/review/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du statut');
      }

      dispatch({ type: 'UPDATE_REVIEW_STATUS', payload: { id, status } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchReviews = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await fetch('/api/review/get');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des reviews');
      }

      const { reviews } = await response.json();
      dispatch({ type: 'SET_REVIEWS', payload: reviews });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchUserReviews = async (userId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await fetch(`/api/review/user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des reviews utilisateur');
      }

      const { reviews } = await response.json();
      dispatch({ type: 'SET_REVIEWS', payload: reviews });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Charger les reviews au montage du composant
  useEffect(() => {
    fetchReviews();
  }, []);

  const contextValue: ReviewContextType = {
    state,
    actions: {
      createReview,
      updateReview,
      deleteReview,
      updateReviewStatus,
      fetchReviews,
      fetchUserReviews,
    },
  };

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAdminReview = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useAdminReview must be used within a AdminReviewProvider');
  }
  return context;
};