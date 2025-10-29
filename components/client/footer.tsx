"use client";
import { Facebook, Instagram, PhoneCall } from "lucide-react";
import { useLocale, useTranslations } from "use-intl";
import TrustpilotWidget from "./TrustpilotWidget";
import { useAuthClient } from "@/src/hooks/useAuthClient";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { useCiContact } from "../providers/client/ClContactProvider";
import { useEffect } from "react";
import AnimateLoading from "./animate-loading";
import FooterAnimateLoading from "./footer-animate-loading";

export function Footer() {
  const t = useTranslations("lng");
  const router = useRouter();
  const {isAuthenticated } = useAuthClient();
  const { contacts, loading, fetchContacts } = useCiContact();
  const locale = useLocale(); // fr ou en
  const currentLang = locale.toUpperCase() as "FR" | "EN";

  useEffect(() => {
    const loadContacts = async () => {
      await fetchContacts();
    };
    loadContacts();
  }, []);

  const profile = contacts[0];

  if(loading){
    return <FooterAnimateLoading/>
  }

  return (
    <footer className="bg-background border-t border-t-primary/50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="animate-fade-in"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Mada Chaland
            </h3>
            <p className="text-muted-foreground text-pretty">
              {t("footer.text")}
            </p>
          </div>

          <div
            className="animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <h4 className="text-lg font-semibold mb-4 text-foreground">
              {t("footer.followOur")}
            </h4>
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  <FaWhatsapp className="inline-block h-6 w-6 mr-1" /> {profile?.whatsapp}
                </p>
                <p className="text-sm text-muted-foreground">
                  <PhoneCall className="inline-block h-5 w-5 mr-1" /> {profile?.phone}
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href={profile?.fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </a>
                <a
                  href={profile?.instaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div
            className="animate-fade-in"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <h4 className="text-lg font-semibold mb-4 text-foreground">
              {t("footer.legalInfos.title")}
            </h4>
            <div className="space-y-2">
              <a
                href="/cgu"
                target="_blank"
                className="block text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2"
              >
                {t("footer.legalInfos.legalMention")}
              </a>
              <a
                href="/privacy-policy"
                target="_blank"
                className="block text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2"
              >
                {t("footer.legalInfos.politic")}
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t border-border mt-8 pt-8 text-center animate-fade-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <p className="text-muted-foreground">
            {t("footer.legalInfos.copyright")}
          </p>
        </div>

        {/* Button creer avis */}
        <div className="container w-full flex justify-center mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <button
            className="cursor-pointer text-secondary py-2 px-3 rounded-lg font-bold bg-[#603814]"
            onClick={() =>
              isAuthenticated
                ? router.push("/avis")
                : router.push("/auth/login")
            }
          >
            {t("footer.createReview")}
          </button>
        </div>
      </div>
    </footer>
  );
}
