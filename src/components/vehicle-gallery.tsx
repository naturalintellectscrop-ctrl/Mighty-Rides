"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface VehicleGalleryProps {
  photos: string[];
  vehicleName: string;
}

export function VehicleGallery({ photos, vehicleName }: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Placeholder images if no photos available
  const displayPhotos = photos.length > 0 
    ? photos 
    : [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
      ];
  
  const handlePrevious = () => {
    setSelectedIndex((prev) => 
      prev === 0 ? displayPhotos.length - 1 : prev - 1
    );
  };
  
  const handleNext = () => {
    setSelectedIndex((prev) => 
      prev === displayPhotos.length - 1 ? 0 : prev + 1
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] bg-surface border border-border overflow-hidden group">
        <img
          src={displayPhotos[selectedIndex]}
          alt={`${vehicleName} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {displayPhotos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        
        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black text-white transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        
        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-sm">
          {selectedIndex + 1} / {displayPhotos.length}
        </div>
      </div>
      
      {/* Thumbnails */}
      {displayPhotos.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {displayPhotos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square bg-surface border overflow-hidden transition-all ${
                index === selectedIndex 
                  ? "border-gold" 
                  : "border-border hover:border-gold-dim"
              }`}
            >
              <img
                src={photo}
                alt={`${vehicleName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === selectedIndex && (
                <div className="absolute inset-0 border-2 border-gold pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors"
            aria-label="Close zoom"
          >
            <span className="text-2xl">&times;</span>
          </button>
          
          <div className="relative max-w-5xl max-h-[90vh] mx-4">
            <img
              src={displayPhotos[selectedIndex]}
              alt={`${vehicleName} - Zoomed`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            {/* Navigation in zoom mode */}
            {displayPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-surface hover:bg-surface-2 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-surface hover:bg-surface-2 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
