// contexts/ContactProvider.tsx
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
export interface Service {
  id: string;
  title?: MultiLanguageText;
  content?: MultiLanguageText;
  contactId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  aboutTitle?: MultiLanguageText;
  aboutContent?: MultiLanguageText;
  subContent?: MultiLanguageText;
  whatsapp?: string;
  phone?: string;
  email?: string;
  fbLink?: string;
  instaLink?: string;
  address?: string;
  services: Service[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceInput {
  title?: MultiLanguageText;
  content?: MultiLanguageText;
}

export interface CreateContactWithServicesInput {
  aboutTitle?: MultiLanguageText;
  aboutContent?: MultiLanguageText;
  subContent?: MultiLanguageText;
  whatsapp?: string;
  phone?: string;
  email?: string;
  fbLink?: string;
  instaLink: string;
  services?: CreateServiceInput[];
}

export interface UpdateContactInput {
  aboutTitle?: MultiLanguageText;
  aboutContent?: MultiLanguageText;
  subContent?: MultiLanguageText;
  whatsapp?: string;
  phone?: string;
  email?: string;
  fbLink?: string;
  instaLink?: string;
}

// Form Data Interface
interface ContactFormData {
  aboutTitle: MultiLanguageText;
  aboutContent: MultiLanguageText;
  subContent: MultiLanguageText;
  whatsapp: string;
  phone: string;
  email: string;
  fbLink: string;
  instaLink: string;
  address: string;
  services: Array<CreateServiceInput & { id: string }>;
}

// Context Type
interface ContactContextType {
  // Form data
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;

  // Form handlers
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleMultilingualChange: (
    field: "aboutTitle" | "aboutContent" | "subContent",
    lang: Language,
    value: string
  ) => void;
  handleServiceMultilingualChange: (
    serviceId: string,
    field: "title" | "content",
    lang: Language,
    value: string
  ) => void;

  // Services management
  addService: () => void;
  removeService: (id: string) => void;

  // Language management
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;

  // Data
  contacts: Contact[];
  currentContact: Contact | null;
  loading: boolean;
  error: string | null;

  // Actions
  createContact: () => Promise<void>;
  updateContact: (id: string) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  getContact: (id: string) => Promise<Contact | null>;
  fetchContacts: () => Promise<void>;
  setCurrentContact: (contact: Contact | null) => void;
  clearError: () => void;

  // Helper functions
  getText: (text: MultiLanguageText | undefined, language?: Language) => string;
  resetFormData: () => void;
}

// Create Context
const ContactContext = createContext<ContactContextType | undefined>(undefined);

// Provider Props
interface ContactProviderProps {
  children: ReactNode;
}

// Provider Component
export const ContactProvider: React.FC<ContactProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("FR");

  // Form Data State
  const [formData, setFormData] = useState<ContactFormData>({
    aboutTitle: { FR: "", EN: "" },
    aboutContent: { FR: "", EN: "" },
    subContent: { FR: "", EN: "" },
    whatsapp: "",
    phone: "",
    email: "",
    fbLink: "",
    instaLink: "",
    address: "",
    services: [],
  });

  // Get URL parameters
  const id = searchParams.get("id");
  const isUpdate = searchParams.get("edit");

  // Fetch contact data if in update mode
  useEffect(() => {
    if (id && isUpdate) {
      getContact(id);
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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultilingualChange = (
    field: "aboutTitle" | "aboutContent" | "subContent",
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

  const handleServiceMultilingualChange = (
    serviceId: string,
    field: "title" | "content",
    lang: Language,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              [field]: {
                ...service[field],
                [lang]: value,
              },
            }
          : service
      ),
    }));
  };

  // Services Management
  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      title: { FR: "", EN: "" },
      content: { FR: "", EN: "" },
    };
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  const removeService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== id),
    }));
  };

  // Reset Form Data
  const resetFormData = () => {
    setFormData({
      aboutTitle: { FR: "", EN: "" },
      aboutContent: { FR: "", EN: "" },
      subContent: { FR: "", EN: "" },
      whatsapp: "",
      phone: "",
      email: "",
      fbLink: "",
      instaLink: "",
      address: "",
      services: [],
    });
  };

  // API Functions
  const fetchContacts = async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch("/api/profile/get");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des contacts");
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      // Préparer les données pour l'API avec stringify de TOUS les champs multilangues
      const contactData = {
        aboutTitle: JSON.stringify(formData.aboutTitle),
        aboutContent: JSON.stringify(formData.aboutContent),
        subContent: JSON.stringify(formData.subContent),
        whatsapp: formData.whatsapp,
        phone: formData.phone,
        email: formData.email,
        fbLink: formData.fbLink,
        instaLink: formData.instaLink,
        address: formData.address,
        services: formData.services
          .filter(
            (service) =>
              getText(service.title, "FR") ||
              getText(service.title, "EN") ||
              getText(service.content, "FR") ||
              getText(service.content, "EN")
          )
          .map((service) => ({
            // IMPORTANT: Stringify title et content pour les services aussi
            title: JSON.stringify(service.title),
            content: JSON.stringify(service.content),
          })),
      };

      console.log(
        "Sending contact data:",
        JSON.stringify(contactData, null, 2)
      );

      const response = await fetch("/api/profile/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création du contact"
        );
      }

      const newContact = await response.json();

      // Update local state
      setContacts((prev) => [newContact, ...prev]);
      setCurrentContact(newContact);

      // Reset form and show success
      resetFormData();
      toast({
        title: "Succès !",
        description: "Contact créé avec succès",
      });

      // Redirect if needed
      router.push("/admin/profile");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error creating contact:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id: string): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const updateData = {
        aboutTitle: JSON.stringify(formData.aboutTitle),
        aboutContent: JSON.stringify(formData.aboutContent),
        subContent: JSON.stringify(formData.subContent),
        whatsapp: formData.whatsapp,
        phone: formData.phone,
        email: formData.email,
        fbLink: formData.fbLink,
        instaLink: formData.instaLink,
        address: formData.address,
        // Ajouter les services pour la mise à jour
        services: formData.services
          .filter(
            (service) =>
              service.title?.FR ||
              service.title?.EN ||
              service.content?.FR ||
              service.content?.EN
          )
          .map((service) => ({
            title: JSON.stringify(service.title),
            content: JSON.stringify(service.content),
          })),
      };

      const response = await fetch(`/api/profile/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour du contact"
        );
      }

      const updatedContact = await response.json();

      // Update local state
      setContacts((prev) =>
        prev.map((contact) => (contact.id === id ? updatedContact : contact))
      );

      if (currentContact?.id === id) {
        setCurrentContact(updatedContact);
      }

      toast({
        title: "Succès !",
        description: "Contact mis à jour avec succès",
      });

      router.push("/admin/profile");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error updating contact:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/profile/delete?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la suppression du contact"
        );
      }

      // Update local state
      setContacts((prev) => prev.filter((contact) => contact.id !== id));

      if (currentContact?.id === id) {
        setCurrentContact(null);
      }

      toast({
        title: "Succès !",
        description: "Contact supprimé avec succès",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        title: "Erreur !",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error deleting contact:", err);
    } finally {
      setLoading(false);
    }
  };

  const getContact = async (id: string): Promise<Contact | null> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/profile/get/${id}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du contact");
      }

      const contact = await response.json();
      console.log("CONTACT", contact);

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

      setCurrentContact(contact);

      // Populate form data avec les données PARSÉES
      setFormData({
        aboutTitle: parseMultilingualField(contact.aboutTitle as string),
        aboutContent: parseMultilingualField(contact.aboutContent as string),
        subContent: parseMultilingualField(contact.subContent as string),
        whatsapp: contact.whatsapp || "",
        phone: contact.phone || "",
        email: contact.email || "",
        fbLink: contact.fbLink || "",
        instaLink: contact.instaLink,
        address: contact.address,
        services:
          contact.services?.map((service: Service) => ({
            id: service.id,
            title: parseMultilingualField(service.title as string),
            content: parseMultilingualField(service.content as string),
          })) || [],
      });

      console.log("FORM DATA AFTER PARSING:", {
        aboutTitle: parseMultilingualField(contact.aboutTitle),
        aboutContent: parseMultilingualField(contact.aboutContent),
        subContent: parseMultilingualField(contact.subContent),
        services: contact.services?.map((service: Service) => ({
          title: parseMultilingualField(service.title as string),
          content: parseMultilingualField(service.content as string),
        })),
      });

      return contact;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Error fetching contact:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Context value
  const contextValue: ContactContextType = {
    // Form data
    formData,
    setFormData,

    // Form handlers
    handleInputChange,
    handleMultilingualChange,
    handleServiceMultilingualChange,

    // Services management
    addService,
    removeService,

    // Language management
    currentLanguage,
    setCurrentLanguage,

    // Data
    contacts,
    currentContact,
    loading,
    error,

    // Actions
    createContact,
    updateContact,
    deleteContact,
    getContact,
    fetchContacts,
    setCurrentContact,
    clearError,

    // Helper functions
    getText,
    resetFormData,
  };

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useContact = (): ContactContextType => {
  const context = useContext(ContactContext);

  if (context === undefined) {
    throw new Error("useContact must be used within a ContactProvider");
  }

  return context;
};
