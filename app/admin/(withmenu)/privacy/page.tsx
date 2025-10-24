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

const PrivacyPolicyPage = () => {
  const router = useRouter();
  const {
    privacyPolicies,
    loading,
    deletePrivacyPolicy,
    getText,
    currentLanguage,
  } = usePrivacy();
  const locale = useLocale();

  // Convertir privacyPolicies en tableau s'il ne l'est pas déjà
  const policiesArray = React.useMemo(() => {
    if (!privacyPolicies || !Array.isArray(privacyPolicies)) return [];

    return privacyPolicies.filter(
      (item) => item.id !== null && item.id !== undefined
    );
  }, [privacyPolicies]);

  const handleAdd = () => {
    router.push("/admin/privacy/add?isEdit=false");
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/privacy/add?id=${id}&isEdit=true`);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette politique de confidentialité ?"
      )
    ) {
      await deletePrivacyPolicy(id);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                  Politiques de Confidentialité
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  Gérez les politiques de confidentialité de votre application
                </p>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg text-sm sm:text-base`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Ajouter une politique
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Chargement des politiques...
            </p>
          </div>
        ) : policiesArray.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              Aucune politique de confidentialité
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-6">
              Commencez par créer votre première politique de confidentialité
            </p>
            <button
              disabled={Number(policiesArray.length) > 0}
              onClick={handleAdd}
              className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg text-sm sm:text-base`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Créer une politique
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {policiesArray.map((policy, index) => {
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
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 sm:p-3 rounded-xl flex-shrink-0">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-1 break-words">
                            Politique de Confidentialité #{index + 1}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">
                                Créé le {formatDate(policy.createdAt)}
                              </span>
                            </div>
                            {policy.updatedAt &&
                              policy.updatedAt !== policy.createdAt && (
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400 hidden sm:inline">
                                    •
                                  </span>
                                  <span className="truncate">
                                    Modifié le {formatDate(policy.updatedAt)}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleEdit(policy.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(policy.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl sm:text-2xl">
                          {locale === "fr" ? "🇫🇷" : "🇬🇧"}
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-slate-700">
                          {locale === "fr" ? "Français" : "English"}
                        </span>
                      </div>
                      <div
                        className="min-h-48 overflow-y-auto text-xs sm:text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
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

export default PrivacyPolicyPage;