"use client";

import { IArticle } from "@/src/domain/entities/blog";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ArticleEditorProps {
  article: any
  index: number;
  isDark?: boolean;
  handleArticleChange: (
    index: number,
    field: keyof IArticle,
    value: string
  ) => void;
}

export default function ArticleEditor({
  article,
  index,
  isDark = false,
  handleArticleChange,
}: ArticleEditorProps) {
  return (
    <div>

      <ReactQuill
        value={article.description || ""}
        onChange={(content) =>
          handleArticleChange(index, "description", content)
        }
        modules={{
          toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
        }}
        formats={[
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "color",
          "background",
          "list",
          "bullet",
          "link",
          "image",
          "video",
        ]}
        className={`w-full rounded-lg border min-h-32 ${
          isDark
            ? "bg-gray-600 border-gray-500 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }`}
        placeholder="Contenu de l'article"
      />
    </div>
  );
}
