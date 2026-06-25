"use client";

import Link from "next/link";
import { Car, MessageCircle, Phone } from "lucide-react";

export default function BlogCTA() {
  return (
    <section className="py-16 md:py-24 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="eyebrow mb-2">Ready to Find Your Perfect Vehicle?</p>
          <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
            Let Mighty Rides Help You
          </h2>
          <p className="text-silver max-w-2xl mx-auto">
            Whether you&apos;re looking to buy, hire, or source a luxury vehicle, 
            our team of experts is ready to assist you in finding your dream car.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Browse Vehicles Card */}
          <div className="bg-black border border-border p-6 hover:border-gold-dim transition-colors group">
            <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <Car className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-display text-lg text-white mb-2">
              Browse Our Inventory
            </h3>
            <p className="text-sm text-silver mb-4">
              Explore our curated selection of luxury vehicles for sale and hire.
            </p>
            <Link
              href="/cars"
              className="inline-block text-sm text-gold border border-gold px-4 py-2 hover:bg-gold/10 transition-colors"
            >
              View Vehicles
            </Link>
          </div>

          {/* Vehicle Sourcing Card */}
          <div className="bg-black border border-border p-6 hover:border-gold-dim transition-colors group">
            <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-display text-lg text-white mb-2">
              Vehicle Sourcing
            </h3>
            <p className="text-sm text-silver mb-4">
              Can&apos;t find what you&apos;re looking for? We&apos;ll search globally for your dream car.
            </p>
            <Link
              href="/sourcing"
              className="inline-block text-sm text-gold border border-gold px-4 py-2 hover:bg-gold/10 transition-colors"
            >
              Request Sourcing
            </Link>
          </div>

          {/* Contact Card */}
          <div className="bg-black border border-border p-6 hover:border-gold-dim transition-colors group">
            <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <Phone className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-display text-lg text-white mb-2">
              Get in Touch
            </h3>
            <p className="text-sm text-silver mb-4">
              Speak with our team of luxury vehicle experts today.
            </p>
            <Link
              href="/contact"
              className="inline-block text-sm text-black bg-gold px-4 py-2 hover:bg-gold/90 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
