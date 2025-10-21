"use client";
import { Facebook, Instagram, PhoneCall } from "lucide-react";
import { useTranslations } from "use-intl";
import TrustpilotWidget from "./TrustpilotWidget";
import { useAuthClient } from "@/src/hooks/useAuthClient";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const t = useTranslations("lng");
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthClient();
  console.log("isAuthenticated", isAuthenticated);
  
  return (
    <footer className="bg-background border-t dark:bg-gray-900 py-12">
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
                  <FaWhatsapp className="inline-block h-6 w-6 mr-1" /> +261 32 77 113 88
                </p>
                <p className="text-sm text-muted-foreground">
                  <PhoneCall className="inline-block h-5 w-5 mr-1" /> +261 34 25 105 85
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/madachaland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/madachaland"
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
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2"
              >
                {t("footer.legalInfos.legalMention")}
              </a>
              <a
                href="#"
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
          <Button 
            className="cursor-pointer" 
            onClick={() => isAuthenticated ? router.push("/avis") : router.push("/auth/login")}
          >
            {t("footer.createReview")}
          </Button>
        </div>
      </div>
    </footer>
  );
}