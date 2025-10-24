"use client";

import { usePrivacy } from "@/components/providers/admin/PrivacyProvider";
import React from "react";
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  Loader2,
  Shield,
  Globe,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCgu } from "@/components/providers/admin/CguProvider";

const CguPage = () => {
  const router = useRouter();
  const { cguS, loading, deleteCGU, getText, fetchCguS } = useCgu();
  const locale = useLocale();
  console.log("CGUS", cguS);

  // Convertir privacyPolicies en tableau s'il ne l'est pas déjà
  const cgusArray = React.useMemo(() => {
    if (!cguS || !Array.isArray(cguS)) return [];

    return cguS.filter((item) => item.id !== null && item.id !== undefined);
  }, [cguS]);

  const handleAdd = () => {
    router.push("/admin/cgu/add?isEdit=false");
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/cgu/add?id=${id}&isEdit=true`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette CGU ?")) {
      await deleteCGU(id);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Condition general d'utilisation
                </h1>
                <p className="text-slate-600 mt-1">
                  Gérez les CGU de votre application
                </p>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg`}
            >
              <Plus className="w-5 h-5" />
              Ajouter un CGU
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Chargement des CGU...</p>
          </div>
        ) : cgusArray.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Aucune CGU
            </h3>
            <p className="text-slate-600 mb-6">
              Commencez par créer votre première CGU
            </p>
            <button
              onClick={handleAdd}
              className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg`}
            >
              <Plus className="w-5 h-5" />
              Créer une CGU
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cgusArray.map((policy, index) => {
              // Parser le contenu s'il est en string JSON
              let parsedContent;
              try {
                parsedContent =
                  typeof policy.content === "string"
                    ? JSON.parse(policy.content)
                    : policy.content;
              } catch (e) {
                parsedContent = policy.content;
              }

              return (
                <div
                  key={policy.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">
                            Politique de Confidentialité #{index + 1}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Créé le {formatDate(policy.createdAt)}
                              </span>
                            </div>
                            {policy.updatedAt &&
                              policy.updatedAt !== policy.createdAt && (
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400">•</span>
                                  <span>
                                    Modifié le {formatDate(policy.updatedAt)}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(policy.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(policy.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">
                          {locale === "fr" ? "🇫🇷" : "🇬🇧"}
                        </span>
                        <span className="font-semibold text-slate-700">
                          {locale === "fr" ? "Français" : "English"}
                        </span>
                      </div>
                      <div
                        className="min-h-64 overflow-y-auto text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            getText(
                              parsedContent,
                              locale === "fr" ? "FR" : "EN"
                            ) ||
                            `<span class="text-slate-400 italic">${
                              locale === "fr" ? "Aucun contenu" : "No content"
                            }</span>`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CguPage;
