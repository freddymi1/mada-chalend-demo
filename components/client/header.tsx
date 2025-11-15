"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/client/ui/button";
import { Menu, X, MapPin, ChevronDown, LogIn, LogOut } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "use-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuthClient } from "@/src/hooks/useAuthClient";
import Image from "next/image";
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("lng");
  const { user, logout, isAuthenticated } = useAuthClient();
  console.log("isAuthenticated",isAuthenticated);

  const navItems = [
    { href: "/", label: `${t("navigation.home")}` },
    { href: "/a-propos", label: `${t("navigation.about")}` },
    { href: "/circuits", label: `${t("navigation.tours")}` },
    { href: "/trip", label: `${t("navigation.trip")}` },
    { href: "/car", label: `${t("navigation.car")}` },
    { href: "/blog", label: `${t("navigation.blog")}` },
    { href: "/contact", label: `${t("navigation.contact")}` },
  ];

  const bookingItems = [
    {
      href: "/reservation/circuit",
      label: `${t("navigation.bookingCircuit")}`,
    },
    { href: "/reservation/car", label: `${t("navigation.bookingCar")}` },
    { href: "/reservation/trip", label: `${t("navigation.bookingTrip")}` },
  ];

  return (
    <header className="sticky top-0 z-50 !bg-[#603814] backdrop-blur supports-[backdrop-filter]:bg-[#603814] border-b">
      <div className="xl:container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg lg:text-2xl font-bold text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                {/* <MapPin className="h-8 w-8 text-secondary animate-float" /> */}
                <Image alt="logo" src="/assets/logo/logo.svg" width={50} height={50} className="animate-float"/>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <span className="hidden lg:block text-secondary">
                Mada Chaland
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-secondary hover:text-white transition-all duration-300 hover:scale-105 ${
                  pathname === item.href ? "text-white font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdown Menu pour Réservation */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-secondary hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none">
                {t("navigation.booking")}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {bookingItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="w-full cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right side: Language Switcher + Mobile Menu */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {isAuthenticated && (
              <button
                onClick={logout}
                className="cursor-pointer flex items-center space-x-2 bg-transparent border border-indigo-400 hover:text-slate-700 rounded-md px-3 py-2.5 text-sm hover:bg-indigo-50 transition-colors duration-200 justify-between"
              >
                <LogOut className="h-6 w-6" />
                <span>{user?.username}</span>
              </button>
            )}

            {/* Mobile menu button */}
            <div className="xl:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-transform text-secondary duration-200 hover:scale-110"
              >
                {isMenuOpen ? (
                  <X className="h-10 w-10" />
                ) : (
                  <Menu className="h-12 w-12" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 right-0 bg-[#603814] backdrop-blur supports-[backdrop-filter]:bg-[#603814] border-b shadow-lg animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-secondary hover:text-primary transition-all duration-300 hover:translate-x-2 ${
                    pathname === item.href
                      ? "text-white font-semibold bg-primary/10 rounded-md"
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Booking Submenu */}
              <div className="pt-2">
                <button
                  onClick={() => setIsBookingOpen(!isBookingOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-primary-foreground hover:text-primary-foreground transition-all duration-300"
                >
                  <span>{t("navigation.booking")}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isBookingOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isBookingOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    {bookingItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-primary-foreground hover:text-primary-foreground transition-all duration-300 hover:translate-x-2"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
