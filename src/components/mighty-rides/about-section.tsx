"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Clock, Users, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { contactInfo } from "@/lib/data";

export function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-[#0F0F10] relative">
      {/* Background */}
      <div className="absolute bottom-0 left-1/2 w-[600px] h-[400px] bg-[#C6A969]/5 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#C6A969]/30 text-[#C6A969] mb-4">
            About Us
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Mighty Rides
          </h2>
          <p className="text-[#8B8F96] text-lg max-w-2xl mx-auto">
            A premium automotive dealership based in Kampala, Uganda, serving East Africa 
            with quality vehicles and professional services.
          </p>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Our Story
            </h3>
            <div className="space-y-4 text-[#8B8F96] leading-relaxed">
              <p>
                Mighty Rides is a premium automotive dealership located in Kampala, Uganda. 
                We specialize in luxury vehicle sales, premium car rentals, and comprehensive 
                automotive services.
              </p>
              <p>
                Our commitment to quality and customer satisfaction drives everything we do. 
                From helping you find the perfect vehicle to providing expert maintenance 
                services, we are your trusted automotive partner in East Africa.
              </p>
              <p>
                We offer a curated selection of imported and local vehicles, along with 
                vehicle sourcing services to help you find exactly what you&apos;re looking for.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: "Trust", description: "Transparent transactions" },
              { icon: Award, title: "Quality", description: "Premium vehicles & service" },
              { icon: Clock, title: "Reliability", description: "Dependable support" },
              { icon: Users, title: "Client Focus", description: "Your satisfaction first" },
            ].map((value, index) => (
              <Card key={index} className="bg-[#1A1C1F] border-border">
                <CardContent className="p-6">
                  <value.icon className="w-8 h-8 text-[#C6A969] mb-4" />
                  <h4 className="font-semibold text-white mb-2">{value.title}</h4>
                  <p className="text-sm text-[#8B8F96]">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-[#1A1C1F] rounded-2xl border border-border overflow-hidden mb-20">
          <div className="p-8 md:p-12">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">
              What We Offer
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Luxury vehicle sales",
                "Premium car rentals",
                "Vehicle servicing & maintenance",
                "Spare parts",
                "Body kits & customization",
                "Vehicle sourcing services",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-[#0F0F10]">
                  <CheckCircle className="w-5 h-5 text-[#C6A969] shrink-0" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="bg-[#1A1C1F] rounded-2xl border border-border overflow-hidden">
          <div className="p-8 md:p-12">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8">
              Visit Our Location
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C6A969]" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Location</p>
                  <p className="text-sm text-[#8B8F96]">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C6A969]" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Phone</p>
                  <p className="text-sm text-[#8B8F96]">{contactInfo.phones[0]}</p>
                  <p className="text-sm text-[#8B8F96]">{contactInfo.phones[1]}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#C6A969]" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Email</p>
                  <p className="text-sm text-[#8B8F96]">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C6A969]/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#C6A969]" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Hours</p>
                  <p className="text-sm text-[#8B8F96]">Mon-Fri: {contactInfo.hours.weekdays}</p>
                  <p className="text-sm text-[#8B8F96]">Sat: {contactInfo.hours.saturday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
