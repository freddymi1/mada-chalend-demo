"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/client/ui/button"
import { Menu, X, MapPin } from "lucide-react"
import {LanguageSwitcher} from "./LanguageSwitcher"
import { useTranslations } from "use-intl"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations("lng");

  const navItems = [
    { href: "/", label: `${t('navigation.home')}` },
    { href: "/a-propos", label: `${t('navigation.about')}` },
    { href: "/circuits", label: `${t('navigation.tours')}` },
    { href: "/reservation", label: `${t('navigation.booking')}` },
    { href: "/blog", label: `${t('navigation.blog')}` },
    { href: "/contact", label: `${t('navigation.contact')}` },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg lg:text-2xl font-bold text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary animate-float" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <span className="hidden lg:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mada Chaland
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-foreground hover:text-primary transition-all duration-300 hover:scale-105 ${
                  pathname === item.href ? "text-primary font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
                           
            ))}
          </nav>
          
          {/* Right side: Language Switcher + Mobile Menu */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-transform duration-200 hover:scale-110"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 border-b shadow-lg animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 ${
                    pathname === item.href ? "text-primary font-semibold bg-primary/10 rounded-md" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
               
      </div>
    </header>
  )
}