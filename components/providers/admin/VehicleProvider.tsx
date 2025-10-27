"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Vehicle } from '@/src/domain/entities/car';
import { useToast } from '@/hooks/shared/use-toast';

export interface Lng {
  en: string;
  fr: string;
}

interface VehicleFormData {
  name: Lng;
  categoryId: string;
  type: string;
  passengers: number;
  pricePerDay: number;
  rating: number;
  mainImage: string;
  detailImages: string[];
  features: Lng[];
  description: Lng;
}

interface VehicleContextType {
  // Form data
  formData: VehicleFormData;
  setFormData: React.Dispatch<React.SetStateAction<VehicleFormData>>;
  
  // Form handlers
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleMultilingualChange: (
    field: "name" | "description",
    lang: "en" | "fr",
    value: string
  ) => void;
  handleArrayMultilingualChange: (
    index: number,
    lang: "en" | "fr",
    value: string,
    arrayName: "features"
  ) => void;
  addArrayItem: (arrayName: "features") => void;
  removeArrayItem: (index: number, arrayName: "features") => void;
  handleImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // CRUD operations
  handleSubmit: (e: React.FormEvent) => void;
  handleUpdate: (id: string) => void;
  handleDelete: (id: string) => void;
  
  // Data management
  vehicles: Vehicle[];
  fetchVehicles: () => void;
  getVehicleById: (id: string) => void;
  vehicleDetail: Vehicle | null;
  
  // States
  isLoading: boolean;
  isUpdate: string | null;
  id: string | null
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState<Vehicle | null>(null);
  
  const [formData, setFormData] = useState<VehicleFormData>({
    name: { en: '', fr: '' },
    categoryId: '4x4',
    type: '',
    passengers: 5,
    pricePerDay: 0,
    rating: 4.0,
    mainImage: '',
    detailImages: ['', '', '', ''],
    features: [{ en: '', fr: '' }],
    description: { en: '', fr: '' }
  });

  const params = useSearchParams();
  const id = params.get("id");
  const isUpdate = params.get("edit");

  useEffect(() => {
    if (id) {
      getVehicleById(id.toString());
    }
  }, [id]);

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'passengers') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === 'pricePerDay' || name === 'rating') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultilingualChange = (
    field: "name" | "description",
    lang: "en" | "fr",
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

  const handleArrayMultilingualChange = (
    index: number,
    lang: "en" | "fr",
    value: string,
    arrayName: "features"
  ) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = {
      ...newArray[index],
      [lang]: value,
    };
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (arrayName: "features") => {
    setFormData((prev) => ({ 
      ...prev, 
      [arrayName]: [...prev[arrayName], { en: '', fr: '' }] 
    }));
  };

  const removeArrayItem = (index: number, arrayName: "features") => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const handleImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log('handleImageUpload called with index:', index, 'files:', files.length);

    try {
      if (index === -1) {
        // Main image (single file)
        const file = files[0];
        console.log('Uploading main image:', file.name);
        
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        console.log('Upload response status:', res.status);

        if (res.ok) {
          const data = await res.json();
          console.log('Upload success, data:', data);
          setFormData((prev) => ({ ...prev, mainImage: data.url }));
          toast({
            title: "Succès !",
            description: "Image principale téléchargée avec succès",
          });
        } else {
          const errorData = await res.text();
          console.error('Upload failed:', errorData);
          toast({
            title: "Erreur !",
            description: "Erreur lors de l'upload de l'image principale",
            variant: "destructive",
          });
        }
      } else {
        // Multiple detail images
        const newDetailImages = [...formData.detailImages];
        let successCount = 0;
        
        // Upload chaque fichier séquentiellement
        for (let i = 0; i < Math.min(files.length, 4); i++) {
          const file = files[i];
          console.log(`Uploading detail image ${i}:`, file.name);
          
          const formDataUpload = new FormData();
          formDataUpload.append("file", file);

          try {
            const res = await fetch("/api/upload", {
              method: "POST",
              body: formDataUpload,
            });

            if (res.ok) {
              const data = await res.json();
              console.log(`Detail image ${i} upload success:`, data);
              
              // Trouve le premier slot vide
              const emptyIndex = newDetailImages.findIndex(img => !img);
              if (emptyIndex !== -1) {
                newDetailImages[emptyIndex] = data.url;
                successCount++;
              }
            } else {
              const errorData = await res.text();
              console.error(`Detail image ${i} upload failed:`, errorData);
            }
          } catch (error) {
            console.error(`Detail image ${i} upload error:`, error);
          }
        }

        // Mise à jour des images après tous les uploads
        setFormData((prev) => ({ ...prev, detailImages: newDetailImages }));
        console.log('Updated detail images:', newDetailImages);
        
        if (successCount > 0) {
          toast({
            title: "Succès !",
            description: `${successCount} image(s) téléchargée(s) avec succès`,
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur !",
        description: "Erreur lors de l'upload des images",
        variant: "destructive",
      });
    }
  };

  // CRUD operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // Filtrer et stringify les features multilingues
    const filteredFeatures = formData.features
      .filter((item) => item.en.trim() !== "" || item.fr.trim() !== "")
      .map((item) => JSON.stringify(item));

    const vehicleData = {
      name: JSON.stringify(formData.name),
      categoryId: formData.categoryId,
      type: formData.type,
      passengers: formData.passengers,
      pricePerDay: formData.pricePerDay,
      rating: formData.rating,
      mainImage: formData.mainImage,
      detailImages: formData.detailImages.filter(img => img.trim() !== ""),
      features: filteredFeatures,
      description: JSON.stringify(formData.description),
    };

    try {
      const res = await fetch("/api/car/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });

      if (res.ok) {
        const newVehicle = await res.json();
        setVehicles((prev) => [...prev, newVehicle]);
        toast({
          title: "Félicitations !",
          description: "Véhicule ajouté avec succès !",
        });
        setIsLoading(false);
        router.push("/admin/vehicles");
        resetFormData();
      } else {
        toast({
          title: "Erreur !",
          description: "Erreur serveur lors de l'ajout du véhicule",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Erreur !",
        description: "Erreur serveur lors de l'ajout du véhicule",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setIsLoading(true);
    
    // Préparer les données pour la mise à jour
    const filteredFeatures = formData.features
      .filter((item) => item.en.trim() !== "" || item.fr.trim() !== "")
      .map((item) => JSON.stringify(item));

    const vehicleData = {
      ...formData,
      name: JSON.stringify(formData.name),
      description: JSON.stringify(formData.description),
      features: filteredFeatures,
      detailImages: formData.detailImages.filter(img => img.trim() !== ""),
    };

    try {
      const res = await fetch(`/api/car/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });
      
      if (res.ok) {
        const updatedVehicle = await res.json();
        setVehicles((prev) =>
          prev.map((vehicle) => (vehicle.id === id ? updatedVehicle : vehicle))
        );
        toast({
          title: "Succès !",
          description: "Véhicule mis à jour !",
        });
        setIsLoading(false);
        router.push("/admin/vehicles");
        await getVehicleById(id);
        await fetchVehicles();
        resetFormData();
      } else {
        toast({
          title: "Erreur !",
          description: "Erreur lors de la mise à jour du véhicule.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Erreur !",
        description: "Erreur lors de la mise à jour du véhicule.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting vehicle ID:", id);
    
    try {

      const vehicleData = {
        status: "indispo"
      };
      const res = await fetch(`/api/car/delete/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });
      
      if (res.ok) {
        setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
        toast({
          title: "Succès !",
          description: "Véhicule supprimé !",
        });
        setIsLoading(false);
      } else {
        toast({
          title: "Erreur !",
          description: "Erreur lors de la suppression du véhicule.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Erreur !",
        description: "Erreur lors de la suppression du véhicule.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Data management
  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/car/get", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
        setIsLoading(false);
      } else {
        toast({
          title: "Erreur !",
          description: "Erreur lors du chargement des véhicules.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Erreur !",
        description: "Erreur lors du chargement des véhicules.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const parseMultilingualField = (field: any): Lng => {
    if (!field) return { en: "", fr: "" };
    
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        return { en: field, fr: "" };
      }
    }
    
    return field;
  };

  const getVehicleById = async (id: string) => {
    try {
      const res = await fetch(`/api/car/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log("Vehicle details:", data);
        setVehicleDetail(data);
        
        const parsedName = parseMultilingualField(data.name);
        const parsedDescription = parseMultilingualField(data.description);
        
        const parsedFeatures = data.features && data.features.length > 0
          ? data.features.map((item: any) => 
              parseMultilingualField(item.text || item)
            )
          : [{ en: '', fr: '' }];
        
        setFormData({
          name: parsedName,
          categoryId: data.categoryId || "4x4",
          type: data.type || "",
          passengers: data.passengers || 5,
          pricePerDay: data.pricePerDay || 0,
          rating: data.rating || 4.0,
          mainImage: data.mainImage || "",
          detailImages: data.detailImages?.length ? data.detailImages : ['', '', '', ''],
          features: parsedFeatures,
          description: parsedDescription,
        });
        
        return data;
      } else {
        toast({
          title: "Erreur !",
          description: "Erreur lors du chargement du véhicule.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Erreur !",
        description: "Erreur lors du chargement du véhicule.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Utility function
  const resetFormData = () => {
    setFormData({
      name: { en: '', fr: '' },
      categoryId: '4x4',
      type: '',
      passengers: 5,
      pricePerDay: 0,
      rating: 4.0,
      mainImage: '',
      detailImages: ['', '', '', ''],
      features: [{ en: '', fr: '' }],
      description: { en: '', fr: '' }
    });
  };

  return (
    <VehicleContext.Provider
      value={{
        // Form data
        formData,
        setFormData,
        
        // Form handlers
        handleInputChange,
        handleMultilingualChange,
        handleArrayMultilingualChange,
        addArrayItem,
        removeArrayItem,
        handleImageUpload,
        
        // CRUD operations
        handleSubmit,
        handleUpdate,
        handleDelete,
        
        // Data management
        vehicles,
        fetchVehicles,
        getVehicleById,
        vehicleDetail,
        
        // States
        id,
        isLoading,
        isUpdate,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};