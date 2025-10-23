"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";
import { IBlog, IArticle } from "@/src/domain/entities/blog";

export interface Lng {
  en: string;
  fr: string;
}

interface BlogFormData {
  title: Lng;
  image: string;
  articles: IArticle[];
}

interface BlogContextType {
  formData: BlogFormData;
  setFormData: React.Dispatch<React.SetStateAction<BlogFormData>>;
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleMultilingualChange: (
    field: "title",
    lang: "en" | "fr",
    value: string
  ) => void;
  handleArticleChange: (
    index: number,
    field: keyof IArticle,
    value: string
  ) => void;
  handleArticleMultilingualChange: (
    index: number,
    field: "title" | "caption" | "description",
    lang: "en" | "fr",
    value: string
  ) => void;
  addArticle: () => void;
  removeArticle: (index: number) => void;
  handleImageUpload: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  addedBlogs: IBlog[];
  handleDelete: (id: string) => void;
  fetchBlogs: () => void;
  getBlogById: (id: string) => void;
  blogDetail: IBlog | null;
  isLoading: boolean;
  handleUpdate: (id: string) => void;
  isUpdate: string | null;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [addedBlogs, setAddedBlogs] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blogDetail, setBlogDetail] = useState<IBlog | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: { en: "", fr: "" },
    image: "",
    articles: [],
  });

  const params = useSearchParams();
  const id = params.get("id");
  const isUpdate = params.get("update");

  useEffect(() => {
    if (id) {
      getBlogById(id.toString());
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultilingualChange = (
    field: "title",
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

  const handleArticleChange = (
    index: number,
    field: keyof IArticle,
    value: string
  ) => {
    const newArticles = [...formData.articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    setFormData((prev) => ({ ...prev, articles: newArticles }));
  };

  const handleArticleMultilingualChange = (
    index: number,
    field: "title" | "caption" | "description",
    lang: "en" | "fr",
    value: string
  ) => {
    setFormData((prev) => {
      const newArticles = [...prev.articles];
      const currentArticle = newArticles[index];

      // Si le champ n'existe pas encore ou est une string, initialiser avec un objet Lng vide
      const currentField = currentArticle[field];
      let newFieldValue: Lng;

      if (!currentField || typeof currentField === "string") {
        newFieldValue = { en: "", fr: "" };
      } else {
        newFieldValue = { ...(currentField as Lng) };
      }

      // Mettre à jour la valeur pour la langue spécifique
      newFieldValue[lang] = value;

      // Créer la nouvelle version de l'article
      newArticles[index] = {
        ...currentArticle,
        [field]: newFieldValue,
      };

      return {
        ...prev,
        articles: newArticles,
      };
    });
  };

  const addArticle = () => {
    const newArticle: IArticle = {
      id: `temp-${Date.now()}`,
      title: { en: "", fr: "" },
      image: "",
      caption: { en: "", fr: "" },
      description: { en: "", fr: "" },
      blogId: "",
    };
    setFormData((prev) => ({
      ...prev,
      articles: [...prev.articles, newArticle],
    }));
  };

  const removeArticle = (index: number) => {
    const newArticles = formData.articles.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, articles: newArticles }));
  };

  const handleImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          handleArticleChange(index, "image", data.url);
        } else {
          toast({
            title: "Error !",
            description: "Erreur lors de l'upload de l'image",
          });
        }
      } catch (error) {
        toast({
          title: "Error !",
          description: "Erreur lors de l'upload de l'image",
        });
      }
    }
  };

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({ ...prev, image: data.url }));
        } else {
          toast({
            title: "Error !",
            description: "Erreur lors de l'upload de l'image principale",
          });
        }
      } catch (error) {
        toast({
          title: "Error !",
          description: "Erreur lors de l'upload de l'image principale",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Filtrer et préparer les articles
    const filteredArticles = formData.articles
      .filter((article) => {
        const title = article.title as Lng;
        const caption = article.caption as Lng;
        return (
          title?.fr?.trim() !== "" ||
          title?.en?.trim() !== "" ||
          caption?.fr?.trim() !== "" ||
          caption?.en?.trim() !== ""
        );
      })
      .map(({ id, blogId, blog, ...rest }) => ({
        ...rest,
        title: JSON.stringify(rest.title),
        caption: JSON.stringify(rest.caption),
        description: JSON.stringify(rest.description),
      }));

    const blogData = {
      title: JSON.stringify(formData.title),
      image: formData.image,
      articles: filteredArticles,
    };

    try {
      const res = await fetch("/api/blog/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (res.ok) {
        const newBlog = await res.json();
        setAddedBlogs((prev) => [...prev, newBlog]);
        toast({
          title: "Félicitation !",
          description: "Blog ajouté avec succès !",
        });
        setIsLoading(false);
        router.push("/admin/blog");
        setFormData({
          title: { en: "", fr: "" },
          image: "",
          articles: [],
        });
      } else {
        toast({
          title: "Error !",
          description: "Erreur serveur lors de l'ajout du blog",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur serveur lors de l'ajout du blog",
      });
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setIsLoading(true);

    // Préparer les articles pour la mise à jour
    const filteredArticles = formData.articles
      .filter((article) => {
        const title = article.title as Lng;
        const caption = article.caption as Lng;
        return (
          title?.fr?.trim() !== "" ||
          title?.en?.trim() !== "" ||
          caption?.fr?.trim() !== "" ||
          caption?.en?.trim() !== ""
        );
      })
      .map((article) => ({
        ...article,
        title: JSON.stringify(article.title),
        caption: JSON.stringify(article.caption),
        description: JSON.stringify(article.description),
      }));

    const blogData = {
      title: JSON.stringify(formData.title),
      image: formData.image,
      articles: filteredArticles,
    };

    try {
      const res = await fetch(`/api/blog/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (res.ok) {
        const updatedBlog = await res.json();
        setAddedBlogs((prev) =>
          prev.map((blog) => (blog.id === id ? updatedBlog : blog))
        );
        toast({
          title: "Success !",
          description: "Blog mis à jour !",
        });
        setIsLoading(false);
        router.push("/admin/blog");
        await getBlogById(id);
        await fetchBlogs();
        setFormData({
          title: { en: "", fr: "" },
          image: "",
          articles: [],
        });
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de la mise à jour du blog.",
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Error !",
        description: "Erreur lors de la mise à jour du blog.",
      });
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddedBlogs((prev) => prev.filter((blog) => blog.id !== id));
        toast({
          title: "Success !",
          description: "Blog supprimé !",
        });
        setIsLoading(false);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors de la suppression du blog.",
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: "Error !",
        description: "Erreur lors de la suppression du blog.",
      });
      setIsLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog/get", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log("DATA", data);
        setAddedBlogs(data.blogs);
        setIsLoading(false);
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement des blogs.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement des blogs.",
      });
      setIsLoading(false);
    }
  };

  const parseMultilingualField = (field: any): Lng => {
    if (!field) return { en: "", fr: "" };

    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch (e) {
        return { en: field, fr: "" };
      }
    }

    return field;
  };

  const getBlogById = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBlogDetail(data);

        const parsedTitle = parseMultilingualField(data.title);

        const parsedArticles =
          data.articles && data.articles.length > 0
            ? data.articles.map((article: any) => ({
                ...article,
                title: parseMultilingualField(article.title),
                caption: parseMultilingualField(article.caption),
                description: parseMultilingualField(article.description),
              }))
            : [];

        setFormData({
          title: parsedTitle,
          image: data.image || "",
          articles: parsedArticles,
        });
        return data;
      } else {
        toast({
          title: "Error !",
          description: "Erreur lors du chargement du blog.",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Error !",
        description: "Erreur lors du chargement du blog.",
      });
      return null;
    }
  };

  return (
    <BlogContext.Provider
      value={{
        formData,
        setFormData,
        handleInputChange,
        handleMultilingualChange,
        handleArticleChange,
        handleArticleMultilingualChange,
        addArticle,
        removeArticle,
        handleImageUpload,
        handleMainImageUpload,
        handleSubmit,
        addedBlogs,
        handleDelete,
        fetchBlogs,
        getBlogById,
        blogDetail,
        isLoading,
        handleUpdate,
        isUpdate,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
