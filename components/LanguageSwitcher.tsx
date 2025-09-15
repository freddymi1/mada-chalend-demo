"use client";

import { setUserLocale } from "@/lib/lngService";
import { Locale } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import React, { useState, useTransition } from "react";
import { useTranslations } from "use-intl";

/**
 * Component for switching between languages
 */

export const LanguageSwitcher: React.FC = () => {
  // État pour stocker les traductions et la langue actuelle
  const t = useTranslations("lng");

  const locale = useLocale();

  const [lang, setLang] = useState(locale ? locale : "");

  const [isPending, startTransition] = useTransition();

  const handleChangeLng = async (e: any) => {
    const lng = e.target.value as Locale;
    setLang(lng);
    startTransition(() => {
      setUserLocale(lng);
    });
  };
  return (
    <div className="flex items-center justify-between space-x-2">
      
      <select
        id="language-select"
        value={lang}
        onChange={handleChangeLng}
        className="bg-transparent border border-indigo-400 rounded-md text-sm p-1"
      >
        <option value="fr">{t("home.language.french")}</option>
        <option value="en">{t("home.language.english")}</option>
        <option value="mg">{t("home.language.malagasy")}</option>
      </select>
    </div>
  );
};
