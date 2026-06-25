"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  slug: string;
  status: string;
  salePriceUgx: string | null;
  photos: string;
}

interface RelatedVehiclesProps {
  currentVehicleId: string;
  make: string;
}

export function RelatedVehicles({ currentVehicleId, make }: RelatedVehiclesProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    async function fetchRelatedVehicles() {
      try {
        const res = await fetch("/api/vehicles?limit=3");
        
        if (!res.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        
        const data = await res.json();
        
        // Filter out current vehicle and prioritize same make
        const filtered = data.vehicles
          .filter((v: Vehicle) => v.id !== currentVehicleId)
          .sort((a: Vehicle, b: Vehicle) => {
            // Prioritize same make
            if (a.make === make && b.make !== make) return -1;
            if (a.make !== make && b.make === make) return 1;
            return 0;
          })
          .slice(0, 3);
        
        setVehicles(filtered);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRelatedVehicles();
  }, [currentVehicleId, make]);
  
  // Format price
  const formatPrice = (price: string | null) => {
    if (!price) return null;
    const num = parseInt(price);
    return new Intl.NumberFormat("en-UG").format(num);
  };
  
  // Parse photos
  const getMainPhoto = (photosJson: string) => {
    try {
      const photos = JSON.parse(photosJson);
      return Array.isArray(photos) && photos.length > 0 
        ? photos[0] 
        : "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800";
    } catch {
      return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800";
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500 text-black";
      case "RESERVED":
        return "bg-yellow-500 text-black";
      case "SOLD":
        return "bg-muted text-white";
      default:
        return "bg-surface-2 text-silver";
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }
  
  if (error || vehicles.length === 0) {
    return null;
  }
  
  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="eyebrow mb-2">You May Also Like</p>
          <h2 className="font-display text-2xl text-white">Related Vehicles</h2>
        </div>
        <Link 
          href="/cars" 
          className="text-sm text-gold hover:underline hidden md:flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            href={`/cars/${vehicle.slug}`}
            className="group bg-black border border-border hover:border-gold-dim transition-all overflow-hidden"
          >
            {/* Image */}
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={getMainPhoto(vehicle.photos)}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="font-display text-lg text-white mb-1 group-hover:text-gold transition-colors">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              
              {vehicle.salePriceUgx && (
                <div>
                  <p className="text-gold font-medium">
                    UGX {formatPrice(vehicle.salePriceUgx)}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/cars"
          className="text-sm text-gold border border-gold px-6 py-2 inline-block hover:bg-gold/10 transition-colors"
        >
          View All Vehicles
        </Link>
      </div>
    </section>
  );
}
