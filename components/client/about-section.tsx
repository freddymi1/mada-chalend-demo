"use client";
import { Card, CardContent } from "@/components/client/ui/card";
import { Heart, Shield, Users } from "lucide-react";
import { useLocale, useTranslations } from "use-intl";
import { useCiContact } from "../providers/client/ClContactProvider";
import { useEffect } from "react";
import AnimateLoading from "./animate-loading";

// Type pour les services
interface Service {
  id: string;
  title: string;
  content: string;
  contactId: string;
  createdAt: string;
  updatedAt: string;
}

export function AboutSection() {
  const t = useTranslations("lng");
  const { contacts, loading, fetchContacts } = useCiContact();
  const locale = useLocale(); // fr ou en
  const currentLang = locale.toUpperCase() as "FR" | "EN";

  useEffect(() => {
    const loadContacts = async () => {
      await fetchContacts();
    };
    loadContacts();
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

  const profile = contacts[0];

  // Récupérer les services dynamiques
  const services: Service[] | any = profile?.services || [];

  // Icons mapping - vous pouvez personnaliser selon vos besoins
  const iconMap = [Heart, Shield, Users];

  const aboutTitle = profile?.aboutTitle
    ? parseJSON(profile.aboutTitle as string)
    : t("about.title");
  const aboutContent = profile?.aboutContent
    ? parseJSON(profile.aboutContent as string)
    : t("about.subtitle");
  const subContent = profile?.subContent
    ? parseJSON(profile.subContent as string)
    : t("about.conclusion");

  if (loading) {
    return <AnimateLoading />;
  }

  return (
    <section id="a-propos" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            {aboutTitle[currentLang] || aboutTitle.FR}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {aboutContent[currentLang] || aboutContent.FR}
          </p>
        </div>

        {/* SERVICES DYNAMIQUES */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service: any, index: any) => {
            const serviceTitle = parseJSON(service.title);
            const serviceContent = parseJSON(service.content);
            const Icon = iconMap[index % iconMap.length];

            return (
              <Card
                key={service.id}
                className="text-center hover-lift animate-fade-in"
                style={{
                  animationDelay: `${0.2 * (index + 1)}s`,
                  animationFillMode: "both",
                }}
              >
                <CardContent className="pt-8 pb-6">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4 animate-float" />
                  <h3 className="text-xl font-semibold mb-3">
                    {serviceTitle[currentLang] || serviceTitle.FR}
                  </h3>
                  <p className="text-muted-foreground">
                    {serviceContent[currentLang] || serviceContent.FR}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div
          className="text-center animate-fade-in"
          style={{ animationDelay: "0.8s", animationFillMode: "both" }}
        >
          {(subContent[currentLang] || subContent.FR) && (
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 italic">
              {subContent[currentLang] || subContent.FR}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}