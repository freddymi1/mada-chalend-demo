"use client";

import { useContact } from "@/components/providers/admin/ContactProvider";
import { useLocale } from "next-intl";
import React, { useEffect } from "react";
import { Phone, Mail, MessageCircle, Facebook, Instagram, Edit } from "lucide-react";
import Link from "next/link";

const ProfilePage = () => {
  const { contacts, fetchContacts, loading, getText } = useContact();
  const locale = useLocale(); // fr ou en
  const currentLang = locale.toUpperCase() as "FR" | "EN";

  useEffect(() => {
    fetchContacts();
  }, []);

  // Helper pour parser les champs JSON
  const parseJSON = (value: string | undefined) => {
    if (!value) return { FR: "", EN: "" };
    try {
      return JSON.parse(value);
    } catch {
      return { FR: "", EN: "" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Aucun profil trouvé
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Créez votre premier profil pour commencer
            </p>
          </div>
        </div>
      </div>
    );
  }

  const profile = contacts[0];
  const aboutTitle = parseJSON(profile.aboutTitle as string);
  const aboutContent = parseJSON(profile.aboutContent as string);
  const subContent = parseJSON(profile.subContent as string);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {/* Edit Button */}
          <div className="flex justify-end mb-4">
            <Link
              href={`/admin/profile/add?isEdit=true&id=${profile.id}`}
              className="group inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-medium"
            >
              <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>{currentLang === "FR" ? "Mettre à jour" : "Update"}</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              {aboutTitle[currentLang] || aboutTitle.FR}
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {aboutContent[currentLang] || aboutContent.FR}
              </p>
              {(subContent[currentLang] || subContent.FR) && (
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 italic">
                  {subContent[currentLang] || subContent.FR}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      {profile.services && profile.services.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {currentLang === "FR" ? "Nos Services" : "Our Services"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.services.map((service, index) => {
              const serviceTitle = parseJSON(service.title as string);
              const serviceContent = parseJSON(service.content as string);

              return (
                <div
                  key={service.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative bg-white dark:bg-gray-800 m-[2px] rounded-2xl p-6">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl text-white">✨</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {serviceTitle[currentLang] || serviceTitle.FR}
                    </h3>

                    {/* Content */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {serviceContent[currentLang] || serviceContent.FR}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {currentLang === "FR" ? "Contactez-nous" : "Contact Us"}
            </h2>
            <p className="text-blue-100 dark:text-blue-200 text-lg">
              {currentLang === "FR"
                ? "Nous sommes là pour vous aider"
                : "We're here to help you"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {/* WhatsApp */}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/\s/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  WhatsApp
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  {profile.whatsapp}
                </span>
              </a>
            )}

            {/* Phone */}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentLang === "FR" ? "Téléphone" : "Phone"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  {profile.phone}
                </span>
              </a>
            )}

            {/* Email */}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center break-all">
                  {profile.email}
                </span>
              </a>
            )}

            {/* Facebook */}
            {profile.fbLink && (
              <a
                href={profile.fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Facebook
                </span>
              </a>
            )}

            {/* Instagram */}
            {profile.instaLink && (
              <a
                href={profile.instaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Instagram
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 dark:bg-gray-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Mada Chaland.{" "}
            {currentLang === "FR"
              ? "Tous droits réservés."
              : "All rights reserved."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;