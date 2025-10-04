// providers/CommentProvider.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { IComment } from "@/src/domain/entities/comment";
import { toast } from "sonner";

interface CommentContextType {
  comments: IComment[];
  comment: IComment | null;
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    pending: number;
    approved: number;
  } | null;
  getAllComments: (
    status?: "all" | "pending" | "approved" | "rejected"
  ) => Promise<void>;
  getCommentById: (id: string) => Promise<void>;
  approveComment: (id: string) => Promise<void>;
  rejectComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  clearComment: () => void;
  clearComments: () => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [comment, setComment] = useState<IComment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    approved: number;
  } | null>(null);

  // Récupérer le token d'authentification
  const getAuthToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    let token = localStorage.getItem("authToken");
    if (token) return token;
    token = sessionStorage.getItem("authToken");
    return token;
  }, []);

  // Récupérer tous les commentaires (Admin)
  const getAllComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch(`/api/comment/get/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur lors de la récupération des commentaires"
        );
      }

      setComments(data.comments || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken]);

  // Récupérer un commentaire par ID (Admin)
  const getCommentById = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }

        const response = await fetch(`/api/comment/get/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Erreur lors de la récupération du commentaire"
          );
        }

        setComment(data.comment);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthToken]
  );

  // Approuver un commentaire (Admin)
  const approveComment = useCallback(
    async (id: string) => {
      try {
        const token = getAuthToken();
        console.log("TOK", token);
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }

        const response = await fetch(`/api/comment/validate/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: true }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Erreur lors de l'approbation du commentaire"
          );
        }

        toast.success(data.message);
        await getAllComments()

        // Mettre à jour la liste locale
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isApproved: true } : c))
        );

        // Mettre à jour le commentaire actuel si c'est celui-ci
        if (comment?.id === id) {
          setComment({ ...comment, isApproved: true });
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
        throw err;
      }
    },
    [getAuthToken, comment]
  );

  // Rejeter un commentaire (Admin)
  const rejectComment = useCallback(
    async (id: string) => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }

        const response = await fetch(`/api/comment/validate/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: false }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors du rejet du commentaire");
        }

        toast.success(data.message);
        await getAllComments()

        // Mettre à jour la liste locale
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isApproved: false } : c))
        );

        // Mettre à jour le commentaire actuel si c'est celui-ci
        if (comment?.id === id) {
          setComment({ ...comment, isApproved: false });
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
        throw err;
      }
    },
    [getAuthToken, comment]
  );

  // Supprimer un commentaire (Admin)
  const deleteComment = useCallback(
    async (id: string) => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }

        const response = await fetch(`/api/comment/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Erreur lors de la suppression du commentaire"
          );
        }

        toast.success(data.message);

        // Retirer de la liste locale
        setComments((prev) => prev.filter((c) => c.id !== id));
        await getAllComments();
        // Réinitialiser le commentaire actuel si c'est celui-ci
        if (comment?.id === id) {
          setComment(null);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
        throw err;
      }
    },
    [getAuthToken, comment]
  );

  // Réinitialiser le commentaire actuel
  const clearComment = useCallback(() => {
    setComment(null);
    setError(null);
  }, []);

  // Réinitialiser la liste des commentaires
  const clearComments = useCallback(() => {
    setComments([]);
    setStats(null);
    setError(null);
  }, []);

  const value: CommentContextType = {
    comments,
    comment,
    isLoading,
    error,
    stats,
    getAllComments,
    getCommentById,
    approveComment,
    rejectComment,
    deleteComment,
    clearComment,
    clearComments,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export const useComment = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useComment must be used within a CommentProvider");
  }
  return context;
};
