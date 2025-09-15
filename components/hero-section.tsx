"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "use-intl";

export function HeroSection() {
  const t = useTranslations("lng");
  
  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            text-shadow: 
              0 0 5px rgba(255, 255, 255, 0.8),
              0 0 10px rgba(255, 215, 0, 0.6),
              0 0 15px rgba(255, 215, 0, 0.4),
              0 0 20px rgba(255, 215, 0, 0.3),
              2px 2px 4px rgba(0, 0, 0, 0.8);
          }
          50% {
            text-shadow: 
              0 0 10px rgba(255, 255, 255, 1),
              0 0 20px rgba(255, 215, 0, 0.8),
              0 0 30px rgba(255, 215, 0, 0.6),
              0 0 40px rgba(255, 215, 0, 0.4),
              2px 2px 4px rgba(0, 0, 0, 0.8);
          }
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in-scale {
          animation: slideInScale 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-text-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-button-pulse {
          animation: buttonPulse 2s ease-in-out infinite;
        }
        
        .text-glow-effect {
          color: #ffffff;
          text-shadow: 
            0 0 5px rgba(255, 255, 255, 0.8),
            0 0 10px rgba(255, 215, 0, 0.6),
            0 0 15px rgba(255, 215, 0, 0.4),
            0 0 20px rgba(255, 215, 0, 0.3),
            2px 2px 4px rgba(0, 0, 0, 0.8);
          animation: textGlowPulse 3s ease-in-out infinite;
        }
        
        @keyframes textGlowPulse {
          0%, 100% {
            text-shadow: 
              0 0 5px rgba(255, 255, 255, 0.8),
              0 0 10px rgba(255, 215, 0, 0.6),
              0 0 15px rgba(255, 215, 0, 0.4),
              0 0 20px rgba(255, 215, 0, 0.3),
              2px 2px 4px rgba(0, 0, 0, 0.8);
          }
          50% {
            text-shadow: 
              0 0 10px rgba(255, 255, 255, 1),
              0 0 20px rgba(255, 215, 0, 0.8),
              0 0 30px rgba(255, 215, 0, 0.6),
              0 0 40px rgba(255, 215, 0, 0.4),
              2px 2px 4px rgba(0, 0, 0, 0.8);
          }
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
      `}</style>
      
      <section id="accueil" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image avec effet parallaxe */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/madagascar-baobab-trees-landscape-sunset.jpg')`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            transform: 'scale(1.1)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        </div>

        {/* Particules flottantes décoratives */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        </div>

        {/* Content avec effet de verre */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Conteneur principal avec effet de verre */}
          <div className="glass-effect p-8 sm:p-12 lg:p-16">
            {/* Titre principal */}
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-balance animate-fade-in-up animate-text-glow"
              style={{
                animationDelay: "0.2s",
                animationFillMode: "both",
                fontWeight: "900",
                letterSpacing: "-0.02em",
                lineHeight: "1.1",
                color: "#ffffff",
                opacity: 1,
              }}
            >
              {t('hero.title')}
            </h1>

            {/* Séparateur décoratif */}
            <div 
              className="w-24 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-6 animate-fade-in-up"
              style={{
                animationDelay: "0.4s",
                animationFillMode: "both",
              }}
            ></div>

            {/* Sous-titre */}
            <p
              className="text-xl sm:text-2xl lg:text-3xl mb-6 text-balance animate-fade-in-left font-light tracking-wide"
              style={{
                animationDelay: "0.6s",
                animationFillMode: "both",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                color: "#f8fafc",
              }}
            >
              {t('hero.subtitle')}
            </p>

            {/* Description principale */}
            <div 
              className="animate-fade-in-right"
              style={{
                animationDelay: "0.8s",
                animationFillMode: "both",
              }}
            >
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 text-pretty max-w-4xl mx-auto font-light leading-relaxed"
                 style={{
                   textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                   color: "#e2e8f0",
                 }}>
                {t('hero.description')}
              </p>
            </div>

            {/* Description longue */}
            <div 
              className="animate-fade-in-up"
              style={{
                animationDelay: "1s",
                animationFillMode: "both",
              }}
            >
              <p className="text-base sm:text-lg lg:text-xl mb-10 text-pretty max-w-3xl mx-auto font-light leading-relaxed opacity-90"
                 style={{
                   textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                   color: "#cbd5e1",
                 }}>
                {t('hero.longDescription')}
              </p>
            </div>

            {/* Call to Action */}
            <div 
              className="animate-slide-in-scale"
              style={{ 
                animationDelay: "1.2s", 
                animationFillMode: "both" 
              }}
            >
              <Link href="/circuits">
                <Button
                  size="lg"
                  className="text-lg sm:text-xl px-10 py-6 lg:px-12 lg:py-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 rounded-full font-semibold tracking-wide transition-all duration-300 animate-button-pulse hover:animate-none transform hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <span className="relative z-10">
                    {t('hero.cta')}
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Indicateur de scroll */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
            style={{
              animationDelay: "1.5s",
              animationFillMode: "both",
            }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}