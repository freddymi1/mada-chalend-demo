"use client";

import AnimateLoading from "@/components/client/animate-loading";
import { Header } from "@/components/client/header";
import { useCiPrivacy } from "@/components/providers/client/CiPrivacyProvider";
import { Calendar, FileText } from "lucide-react";
import { useLocale } from "next-intl";
import React from "react";

const PrivacyPolicyPage = () => {
  const { privacyPolicies, loading, getText } = useCiPrivacy();
  const locale = useLocale();

  const policiesArray = React.useMemo(() => {
    if (!privacyPolicies || !Array.isArray(privacyPolicies)) return [];

    return privacyPolicies.filter(
      (item) => item.id !== null && item.id !== undefined
    );
  }, [privacyPolicies]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <AnimateLoading />;
  }
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto">
        {policiesArray.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              {locale === "fr"
                ? "Aucune politique de confidentialité"
                : "No privacy policy"}
            </h3>
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
                            {locale === "fr"
                              ? "Politique de Confidentialité"
                              : "Privacy policy"}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">
                                {locale === "fr" ? "Créé le" : "Created at"}{" "}
                                {formatDate(policy.createdAt)}
                              </span>
                            </div>
                            {policy.updatedAt &&
                              policy.updatedAt !== policy.createdAt && (
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400 hidden sm:inline">
                                    •
                                  </span>
                                  <span className="truncate">
                                    {locale === "fr"
                                      ? "Modifié le"
                                      : "Updated at"}{" "}
                                    {formatDate(policy.updatedAt)}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
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
    </main>
  );
};

export default PrivacyPolicyPage;
