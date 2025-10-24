"use client";

import { IArticle } from "@/src/domain/entities/blog";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface PrivacyEditorProps {
  avis: any;
  isDark?: boolean;
  handleEditorChange: (value: string) => void;
}

export default function PrivacyEditor({
  avis,
  isDark = false,
  handleEditorChange,
}: PrivacyEditorProps) {
  // Memoize the modules to prevent unnecessary re-renders
  const modules = useMemo(() => ({
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  }), []);

  const formats = [
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
  ];

  return (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Description
      </label>

      <ReactQuill
        value={avis.description || ""}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
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