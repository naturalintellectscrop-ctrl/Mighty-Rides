"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, ArrowUp } from "lucide-react";
import { contactInfo } from "@/lib/data";

interface FooterProps {
  onViewChange?: (view: string) => void;
}

export function Footer({ onViewChange }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (viewId: string) => {
    if (onViewChange) {
      onViewChange(viewId);
    }
    scrollToTop();
  };

  return (
    <footer className="bg-[#0F0F10] border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo-new.png"
                alt="Mighty Rides"
                width={100}
                height={54}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-[#8B8F96] text-sm leading-relaxed mb-6">
              East Africa&apos;s premier destination for luxury vehicles and premium automotive services. 
              Experience excellence in every journey.
            </p>
            <div className="flex gap-3">
              <a
                href={contactInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#1A1C1F] border border-border flex items-center justify-center text-[#8B8F96] hover:text-[#C6A969] hover:border-[#C6A969]/30 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={contactInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#1A1C1F] border border-border flex items-center justify-center text-[#8B8F96] hover:text-[#C6A969] hover:border-[#C6A969]/30 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={contactInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#1A1C1F] border border-border flex items-center justify-center text-[#8B8F96] hover:text-[#C6A969] hover:border-[#C6A969]/30 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Cars for Sale", view: "inventory" },
                { label: "Rentals", view: "rentals" },
                { label: "Services", view: "services" },
                { label: "About Us", view: "about" },
                { label: "Contact", view: "contact" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.view)}
                    className="text-[#8B8F96] hover:text-[#C6A969] transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Premium Services</h4>
            <ul className="space-y-3">
              {[
                { label: "Private Buyer Concierge", view: "concierge" },
                { label: "Corporate Mobility", view: "corporate" },
                { label: "Trade-In / Upgrade", view: "trade-in" },
                { label: "Vehicle Sourcing", view: "sourcing" },
                { label: "After-Sale Support", view: "after-sale" },
              ].map((service) => (
                <li key={service.label}>
                  <button
                    onClick={() => handleNavClick(service.view)}
                    className="text-[#8B8F96] hover:text-[#C6A969] transition-colors text-sm"
                  >
                    {service.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C6A969] shrink-0 mt-1" />
                <span className="text-[#8B8F96] text-sm">{contactInfo.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C6A969] shrink-0 mt-1" />
                <div>
                  <a href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`} className="text-[#8B8F96] text-sm hover:text-[#C6A969] transition-colors block">
                    {contactInfo.phones[0]}
                  </a>
                  <a href={`tel:${contactInfo.phones[1].replace(/\s/g, "")}`} className="text-[#8B8F96] text-sm hover:text-[#C6A969] transition-colors block">
                    {contactInfo.phones[1]}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C6A969] shrink-0 mt-1" />
                <a href={`mailto:${contactInfo.email}`} className="text-[#8B8F96] text-sm hover:text-[#C6A969] transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C6A969] shrink-0 mt-1" />
                <div className="text-[#8B8F96] text-sm">
                  <p>Mon - Fri: {contactInfo.hours.weekdays}</p>
                  <p>Saturday: {contactInfo.hours.saturday}</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-12 border-t border-border">
          <div className="max-w-xl">
            <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
            <p className="text-[#8B8F96] text-sm mb-4">
              Subscribe to receive updates on new arrivals, exclusive offers, and automotive insights.
            </p>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-[#1A1C1F] border-border text-white placeholder:text-[#8B8F96]"
              />
              <Button className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A] shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#8B8F96] text-sm text-center md:text-left">
              © {new Date().getFullYear()} Mighty Rides. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-[#8B8F96] hover:text-[#C6A969] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[#8B8F96] hover:text-[#C6A969] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#C6A969] text-[#0F0F10] flex items-center justify-center shadow-lg hover:bg-[#D4B87A] transition-colors z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${contactInfo.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#20BD5A] transition-colors z-50 whatsapp-pulse"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </footer>
  );
}
