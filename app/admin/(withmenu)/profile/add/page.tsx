// components/AddProfile.tsx
"use client";

import { useContact } from "@/components/providers/admin/ContactProvider";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const AddProfile: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleMultilingualChange,
    handleServiceMultilingualChange,
    addService,
    removeService,
    createContact,
    updateContact,
    loading,
    error,
    clearError,
    currentContact,
    getContact
  } = useContact();

  const searchParams = useSearchParams();
  const isEdit = searchParams.get("isEdit") === "true";
  const id = searchParams.get("id");

  // Charger les données du contact si on est en mode édition
  useEffect(() => {
    if (id) {
      getContact(id);
    }
  }, [id]);

  const isUpdate = Boolean(currentContact) && isEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.instaLink) {
      alert("Le lien Instagram est requis");
      return;
    }

    if (isUpdate && id) {
      updateContact(id);
    } else {
      createContact();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isUpdate ? "Modifier le profil" : "Créer un nouveau profil"}
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section À Propos */}
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Informations À Propos
            </h2>

            {/* Titre À Propos - FR/EN côte à côte */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Titre À Propos
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    🇫🇷 Français
                  </label>
                  <input
                    type="text"
                    value={formData.aboutTitle?.FR || ""}
                    onChange={(e) =>
                      handleMultilingualChange(
                        "aboutTitle",
                        "FR",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre en français"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    🇬🇧 English
                  </label>
                  <input
                    type="text"
                    value={formData.aboutTitle?.EN || ""}
                    onChange={(e) =>
                      handleMultilingualChange(
                        "aboutTitle",
                        "EN",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Title in English"
                  />
                </div>
              </div>
            </div>

            {/* Contenu À Propos - FR/EN côte à côte */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Contenu À Propos
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    🇫🇷 Français
                  </label>
                  <textarea
                    value={formData.aboutContent?.FR || ""}
                    onChange={(e) =>
                      handleMultilingualChange(
                        "aboutContent",
                        "FR",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description en français"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    🇬🇧 English
                  </label>
                  <textarea
                    value={formData.aboutContent?.EN || ""}
                    onChange={(e) =>
                      handleMultilingualChange(
                        "aboutContent",
                        "EN",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description in English"
                  />
                </div>
              </div>
            </div>

            {/* Sous-contenu - FR/EN côte à côte */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Sous-contenu
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    🇫🇷 Français
                  </label>
                  <textarea
                    value={formData.subContent?.FR || ""}
                    onChange={(e) =>
                      handleMultilingualChange(
                        "subContent",
                        "FR",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sous-contenu en français"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    🇬🇧 English
                  </label>
                  <textarea
                    value={formData.subContent?.EN || ""}
                    onChange={(e) =>
                      handleMultilingualChange(
                        "subContent",
                        "EN",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sub-content in English"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section Contact */}
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Informations de Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+261 34 00 000 00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+261 32 00 000 00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Lien Facebook
                </label>
                <input
                  type="url"
                  name="fbLink"
                  value={formData.fbLink}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/votrepage"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Lien Instagram *
                </label>
                <input
                  type="url"
                  name="instaLink"
                  value={formData.instaLink}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/votrepseudo"
                />
              </div>
            </div>
          </section>

          {/* Section Services */}
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Services</h2>
              <button
                type="button"
                onClick={addService}
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                + Ajouter un Service
              </button>
            </div>

            {formData.services.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>
                  Aucun service ajouté. Cliquez sur "Ajouter un Service" pour en
                  créer.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.services.map((service: any, index: any) => (
                  <div
                    key={service.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-700 dark:text-gray-200">
                        Service {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>

                    {/* Titre du service - FR/EN côte à côte */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Titre du service
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            🇫🇷 Français
                          </label>
                          <input
                            type="text"
                            value={service.title?.FR || ""}
                            onChange={(e) =>
                              handleServiceMultilingualChange(
                                service.id,
                                "title",
                                "FR",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Titre du service en français"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            🇬🇧 English
                          </label>
                          <input
                            type="text"
                            value={service.title?.EN || ""}
                            onChange={(e) =>
                              handleServiceMultilingualChange(
                                service.id,
                                "title",
                                "EN",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Service title in English"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description du service - FR/EN côte à côte */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Description du service
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            🇫🇷 Français
                          </label>
                          <textarea
                            value={service.content?.FR || ""}
                            onChange={(e) =>
                              handleServiceMultilingualChange(
                                service.id,
                                "content",
                                "FR",
                                e.target.value
                              )
                            }
                            rows={4}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Description du service en français"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            🇬🇧 English
                          </label>
                          <textarea
                            value={service.content?.EN || ""}
                            onChange={(e) =>
                              handleServiceMultilingualChange(
                                service.id,
                                "content",
                                "EN",
                                e.target.value
                              )
                            }
                            rows={4}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Service description in English"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Boutons de soumission */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-6 py-2 rounded-md transition duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Chargement..."
                : isUpdate
                ? "Mettre à jour"
                : "Créer le profil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;