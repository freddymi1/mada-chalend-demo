// contexts/PrivacyProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";

// Types pour les langues
export type Language = "FR" | "EN";

// Types pour les champs multilangues
export interface MultiLanguageText {
  FR?: string;
  EN?: string;
}

// Types
export interface PrivacyPolicy {
  id: string;
  content?: MultiLanguageText;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePrivacyPolicyInput {
  content?: MultiLanguageText;
}

export interface UpdatePrivacyPolicyInput {
  content?: MultiLanguageText;
}

// Form Data Interface
interface PrivacyFormData {
  content: MultiLanguageText;
}

// Context Type
interface PrivacyContextType {
  // Form data
  formData: PrivacyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PrivacyFormData>>;

  // Form handlers
  handleMultilingualChange: (
    field: "content",
    lang: Language,
    value: string
  ) => void;

  // Language management
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;

  // Data
  privacyPolicies: PrivacyPolicy[];
  currentPrivacyPolicy: PrivacyPolicy | null;
  loading: boolean;
  error: string | null;

  // Actions
  createPrivacyPolicy: () => Promise<void>;
  updatePrivacyPolicy: (id: string) => Promise<void>;
  deletePrivacyPolicy: (id: string) => Promise<void>;
  getPrivacyPolicy: (id: string) => Promise<PrivacyPolicy | null>;
  fetchPrivacyPolicies: () => Promise<void>;
  setCurrentPrivacyPolicy: (policy: PrivacyPolicy | null) => void;
  clearError: () => void;

  // Helper functions
  getText: (text: MultiLanguageText | undefined, language?: Language) => string;
  resetFormData: () => void;
}

// Create Context
const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

// Provider Props
interface PrivacyProviderProps {
  children: ReactNode;
}

// Provider Component
export const PrivacyProvider: React.FC<PrivacyProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [privacyPolicies, setPrivacyPolicies] = useState<PrivacyPolicy[]>([]);
  const [currentPrivacyPolicy, setCurrentPrivacyPolicy] = useState<PrivacyPolicy | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("FR");

  // Form Data State
  const [formData, setFormData] = useState<PrivacyFormData>({
    content: { FR: "", EN: "" },
  });

  // Get URL parameters
  const id = searchParams.get("id");
  const isUpdate = searchParams.get("edit");

  // Fetch privacy policy data if in update mode
  useEffect(() => {
    if (id && isUpdate) {
      getPrivacyPolicy(id);
    }
  }, [id, isUpdate]);

  // Helper function to get text in current language
  const getText = (
    text: MultiLanguageText | undefined,
    language: Language = currentLanguage
  ): string => {
    if (!text) return "";
    return text[language] || text.FR || text.EN || "";
  };

  // Clear error
  const clearError = () => setError(null);

  // Form Handlers
  const handleMultilingualChange = (
    field: "content",
    lang: Language,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  // Reset Form Data
  const resetFormData = () => {
    setFormData({
      content: { FR: "", EN: "" },
    });
  };

  // API Functions
  const fetchPrivacyPolicies = async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch("/api/privacy/get");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des politiques de confidentialité");
      }

      const data = await response.json();
      console.log("DATA", data);
      
      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        setPrivacyPolicies(data);
      } else if (data && typeof data === 'object') {
        // Si c'est un objet unique, le convertir en tableau
        setPrivacyPolicies([data]);
      } else {
        setPrivacyPolicies([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching privacy policies:", err);
      setPrivacyPolicies([]); // S'assurer qu'on a un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const createPrivacyPolicy = async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      // Préparer les données pour l'API
      const privacyData = {
        content: JSON.stringify(formData.content),
      };

      console.log(
        "Sending privacy policy data:",
        JSON.stringify(privacyData, null, 2)
      );

      const response = await fetch("/api/privacy/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(privacyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création de la politique de confidentialité"
        );
      }

      const newPrivacyPolicy = await response.json();

      // Update local state - S'assurer que prev est un tableau
      setPrivacyPolicies((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [newPrivacyPolicy, ...prevArray];
      });
      setCurrentPrivacyPolicy(newPrivacyPolicy);

      // Reset form and show success
      resetFormData();
      toast({
        title: "Succès !",
        description: "Politique de confidentialité créée avec succès",
      });

      // Redirect if needed
      router.push("/admin/privacy");
      await fetchPrivacyPolicies();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error creating privacy policy:", err);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacyPolicy = async (id: string): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const updateData = {
        content: JSON.stringify(formData.content),
      };

      const response = await fetch(`/api/privacy/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour de la politique de confidentialité"
        );
      }

      const updatedPrivacyPolicy = await response.json();

      // Update local state - S'assurer que prev est un tableau
      setPrivacyPolicies((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map((policy) => 
          policy.id === id ? updatedPrivacyPolicy : policy
        );
      });

      if (currentPrivacyPolicy?.id === id) {
        setCurrentPrivacyPolicy(updatedPrivacyPolicy);
      }

      toast({
        title: "Succès !",
        description: "Politique de confidentialité mise à jour avec succès",
      });

      router.push("/admin/privacy");
      await fetchPrivacyPolicies();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error updating privacy policy:", err);
    } finally {
      setLoading(false);
    }
  };

  const deletePrivacyPolicy = async (id: string): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/privacy/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la suppression de la politique de confidentialité"
        );
      }

      // Update local state - S'assurer que prev est un tableau
      setPrivacyPolicies((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter((policy) => policy.id !== id);
      });

      if (currentPrivacyPolicy?.id === id) {
        setCurrentPrivacyPolicy(null);
      }

      toast({
        title: "Succès !",
        description: "Politique de confidentialité supprimée avec succès",
      });
      await fetchPrivacyPolicies();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error deleting privacy policy:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPrivacyPolicy = async (id: string): Promise<PrivacyPolicy | null> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/privacy/get/${id}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la politique de confidentialité");
      }

      const privacyPolicy = await response.json();

      // Fonction helper pour parser les champs multilangues
      const parseMultilingualField = (
        field: string | null | undefined
      ): MultiLanguageText => {
        if (!field) return { FR: "", EN: "" };

        try {
          return JSON.parse(field);
        } catch (error) {
          console.error("Erreur de parsing JSON:", error);
          return { FR: field, EN: "" };
        }
      };

      setCurrentPrivacyPolicy(privacyPolicy);

      // Populate form data avec les données PARSÉES
      setFormData({
        content: parseMultilingualField(privacyPolicy.content as string),
      });

      console.log("PRIVACY POLICY FORM DATA AFTER PARSING:", {
        content: parseMultilingualField(privacyPolicy.content),
      });

      return privacyPolicy;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching privacy policy:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch privacy policies on component mount
  useEffect(() => {
    fetchPrivacyPolicies();
  }, []);

  // Context value
  const contextValue: PrivacyContextType = {
    // Form data
    formData,
    setFormData,

    // Form handlers
    handleMultilingualChange,

    // Language management
    currentLanguage,
    setCurrentLanguage,

    // Data
    privacyPolicies,
    currentPrivacyPolicy,
    loading,
    error,

    // Actions
    createPrivacyPolicy,
    updatePrivacyPolicy,
    deletePrivacyPolicy,
    getPrivacyPolicy,
    fetchPrivacyPolicies,
    setCurrentPrivacyPolicy,
    clearError,

    // Helper functions
    getText,
    resetFormData,
  };

  return (
    <PrivacyContext.Provider value={contextValue}>
      {children}
    </PrivacyContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const usePrivacy = (): PrivacyContextType => {
  const context = useContext(PrivacyContext);

  if (context === undefined) {
    throw new Error("usePrivacy must be used within a PrivacyProvider");
  }

  return context;
};