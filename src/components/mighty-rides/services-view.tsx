"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Sparkles, Search, Car, Package, ClipboardCheck, ArrowLeft, CheckCircle, Phone } from "lucide-react";
import { services, contactInfo } from "@/lib/data";

interface ServicesViewProps {
  onBack: () => void;
}

const serviceIcons: Record<string, React.ElementType> = {
  Wrench: Wrench,
  Sparkles: Sparkles,
  Search: Search,
  Car: Car,
  Package: Package,
  ClipboardCheck: ClipboardCheck,
};

export function ServicesView({ onBack }: ServicesViewProps) {
  return (
    <section className="min-h-screen bg-[#0F0F10] pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-[#8B8F96] hover:text-white mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Comprehensive automotive care for the discerning owner. From routine maintenance 
            to bespoke customization, we deliver excellence at every touchpoint.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => {
            const IconComponent = serviceIcons[service.icon] || Wrench;
            return (
              <Card
                key={service.id}
                className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all overflow-hidden group"
              >
                <CardContent className="p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-[#C6A969]/10 flex items-center justify-center mb-6 group-hover:bg-[#C6A969]/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-[#C6A969]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#C6A969] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#8B8F96] mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-[#C6A969] shrink-0" />
                        <span className="text-sm text-white">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex gap-3">
                    <a
                      href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#C6A969] text-[#0F0F10] font-medium hover:bg-[#D4B87A] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp}?text=I'm interested in your ${service.title} service`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#1A1C1F] to-[#0F0F10] rounded-2xl border border-border overflow-hidden mb-20">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need a Custom Service?
            </h2>
            <p className="text-[#8B8F96] max-w-xl mx-auto mb-8">
              Our team can handle any automotive requirement. From major repairs to 
              complete restorations, we have the expertise and facilities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                className="flex items-center gap-2 px-8 py-4 rounded-lg bg-[#C6A969] text-[#0F0F10] font-medium hover:bg-[#D4B87A] transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Us: {contactInfo.phones[0]}
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#20BD5A] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
