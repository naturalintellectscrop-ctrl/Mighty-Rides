"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, X, ChevronDown, Crown, Building2, ArrowRightLeft, Search } from "lucide-react";
import { contactInfo } from "@/lib/data";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "home", label: "Home" },
  { id: "inventory", label: "Cars for Sale" },
  { id: "rentals", label: "Rentals" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const premiumServices = [
  { id: "concierge", label: "Private Buyer Concierge", icon: Crown, description: "Premium guided buying" },
  { id: "corporate", label: "Corporate Mobility", icon: Building2, description: "B2B solutions" },
  { id: "trade-in", label: "Trade-In / Upgrade", icon: ArrowRightLeft, description: "Upgrade your vehicle" },
  { id: "sourcing", label: "Vehicle Sourcing", icon: Search, description: "Find your dream car" },
];

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPremiumMenu, setShowPremiumMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
    setShowPremiumMenu(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0F0F10]/95 backdrop-blur-lg border-b border-border/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <div className="relative">
              <Image
                src="/logo-new.png"
                alt="Mighty Rides - Premium Autos"
                width={100}
                height={54}
                className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  currentView === item.id
                    ? "text-[#C6A969] bg-[#C6A969]/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Premium Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPremiumMenu(!showPremiumMenu)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  ["concierge", "corporate", "trade-in", "after-sale"].includes(currentView)
                    ? "text-[#C6A969] bg-[#C6A969]/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <Crown className="w-4 h-4" />
                Premium
                <ChevronDown className={`w-4 h-4 transition-transform ${showPremiumMenu ? "rotate-180" : ""}`} />
              </button>
              
              {showPremiumMenu && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#1A1C1F] border border-border rounded-lg shadow-xl overflow-hidden">
                  {premiumServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleNavClick(service.id)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <service.icon className="w-5 h-5 text-[#C6A969] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">{service.label}</p>
                        <p className="text-xs text-[#8B8F96]">{service.description}</p>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-border">
                    <button
                      onClick={() => handleNavClick("after-sale")}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="text-sm text-[#8B8F96]">After-Sale Support →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{contactInfo.phones[0]}</span>
            </a>
            <Button
              onClick={() => handleNavClick("sourcing")}
              className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] font-medium px-5"
            >
              Source a Car
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#0F0F10] border-l border-border/50 w-full max-w-sm p-0"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo-new.png"
                      alt="Mighty Rides"
                      width={100}
                      height={54}
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/80"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          currentView === item.id
                            ? "text-[#C6A969] bg-[#C6A969]/10"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Premium Services */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs uppercase tracking-wider text-[#8B8F96] mb-3 px-4">Premium Services</p>
                    <div className="space-y-2">
                      {premiumServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleNavClick(service.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <service.icon className="w-5 h-5 text-[#C6A969]" />
                          {service.label}
                        </button>
                      ))}
                      <button
                        onClick={() => handleNavClick("after-sale")}
                        className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
                      >
                        After-Sale Support
                      </button>
                    </div>
                  </div>
                </nav>

                {/* Mobile Footer */}
                <div className="p-6 border-t border-border/50 space-y-4">
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#25D366] text-white font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp Us
                  </a>
                  <Button
                    onClick={() => {
                      handleNavClick("sourcing");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] font-medium py-6"
                  >
                    Source a Car
                  </Button>
                  <p className="text-center text-sm text-[#8B8F96]">
                    {contactInfo.phones[0]} | {contactInfo.phones[1]}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Click outside to close premium menu */}
      {showPremiumMenu && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setShowPremiumMenu(false)}
        />
      )}
    </header>
  );
}
