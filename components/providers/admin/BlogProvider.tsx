"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/shared/use-toast";
import { IBlog, IArticle } from "@/src/domain/entities/blog";

interface BlogFormData {
  title: string;
  image: string;
  articles: IArticle[];
}

interface BlogContextType {
  formData: BlogFormData;
  setFormData: React.Dispatch<React.SetStateAction<BlogFormData>>;
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleArticleChange: (
    index: number,
    field: keyof IArticle,
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

export const BlogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [addedBlogs, setAddedBlogs] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blogDetail, setBlogDetail] = useState<IBlog | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
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

  const handleArticleChange = (
    index: number,
    field: keyof IArticle,
    value: string
  ) => {
    const newArticles = [...formData.articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    setFormData((prev) => ({ ...prev, articles: newArticles }));
  };

  const addArticle = () => {
    const newArticle: IArticle = {
      id: `temp-${Date.now()}`,
      title: "",
      image: "",
      caption: "",
      description: "",
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

    const filteredArticles = formData.articles.filter(
      (article) => article.title?.trim() !== "" || article.caption?.trim() !== ""
    );

    const blogData = {
      title: formData.title,
      image: formData.image,
      articles: filteredArticles.map(({ id, blogId, blog, ...rest }) => rest),
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
          title: "",
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

    const filteredArticles = formData.articles.filter(
      (article) => article.title?.trim() !== "" || article.caption?.trim() !== ""
    );

    const blogData = {
      title: formData.title,
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
          title: "",
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
        setAddedBlogs(data);
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

  const getBlogById = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBlogDetail(data);
        setFormData({
          title: data.title || "",
          image: data.image || "",
          articles:
            data.articles && data.articles.length > 0 ? data.articles : [],
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
        handleArticleChange,
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