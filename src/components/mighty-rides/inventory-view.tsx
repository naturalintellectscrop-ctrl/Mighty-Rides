"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Fuel, Gauge, Settings, X, ArrowLeft } from "lucide-react";
import { vehicles, Vehicle, bodyTypes, fuelTypes, transmissions } from "@/lib/data";

interface InventoryViewProps {
  onBack: () => void;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

export function InventoryView({ onBack, onVehicleSelect }: InventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState<string>("");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  const availableVehicles = vehicles.filter(v => !v.isSold);

  const filteredVehicles = useMemo(() => {
    let result = availableVehicles;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.year.toString().includes(query)
      );
    }

    // Body type filter
    if (selectedBodyType) {
      result = result.filter((v) => v.bodyType === selectedBodyType);
    }

    // Fuel type filter
    if (selectedFuelType) {
      result = result.filter((v) => v.fuelType === selectedFuelType);
    }

    // Condition filter
    if (selectedCondition) {
      result = result.filter((v) => v.condition === selectedCondition);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "year-new":
        result = [...result].sort((a, b) => b.year - a.year);
        break;
      case "mileage-low":
        result = [...result].sort((a, b) => a.mileage - b.mileage);
        break;
      case "featured":
      default:
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [availableVehicles, searchQuery, selectedBodyType, selectedFuelType, selectedCondition, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBodyType("");
    setSelectedFuelType("");
    setSelectedCondition("");
  };

  const hasActiveFilters = searchQuery || selectedBodyType || selectedFuelType || selectedCondition;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="min-h-screen bg-[#0F0F10] pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-[#8B8F96] hover:text-white mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Cars for Sale
          </h1>
          <p className="text-[#8B8F96] text-lg max-w-2xl">
            Explore our curated selection of premium vehicles. Each one inspected, 
            certified, and ready for its next chapter.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#1A1C1F] rounded-xl border border-border p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8F96]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by make, model, or year..."
                className="pl-10 bg-[#0F0F10] border-border text-white placeholder:text-[#8B8F96]"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
                <SelectTrigger className="w-[140px] bg-[#0F0F10] border-border text-white">
                  <SelectValue placeholder="Body Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F10] border-border">
                  {bodyTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger className="w-[140px] bg-[#0F0F10] border-border text-white">
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F10] border-border">
                  {fuelTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="w-[140px] bg-[#0F0F10] border-border text-white">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F10] border-border">
                  <SelectItem value="New" className="text-white">New</SelectItem>
                  <SelectItem value="Used" className="text-white">Used</SelectItem>
                  <SelectItem value="Certified Pre-Owned" className="text-white">Certified Pre-Owned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-[#0F0F10] border-border text-white">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F10] border-border">
                  <SelectItem value="featured" className="text-white">Featured</SelectItem>
                  <SelectItem value="price-low" className="text-white">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="text-white">Price: High to Low</SelectItem>
                  <SelectItem value="year-new" className="text-white">Year: Newest First</SelectItem>
                  <SelectItem value="mileage-low" className="text-white">Mileage: Lowest First</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-[#C6A969] hover:text-[#D4B87A] hover:bg-[#C6A969]/10"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#8B8F96]">
            Showing <span className="text-white font-medium">{filteredVehicles.length}</span> vehicles
          </p>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="bg-[#1A1C1F] border-border hover:border-[#C6A969]/30 transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => onVehicleSelect(vehicle)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-[#0F0F10] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#1A1C1F] flex items-center justify-center">
                      <Settings className="w-6 h-6 text-[#C6A969]/50" />
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-[#0F0F10]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]">
                      View Details
                    </Button>
                  </div>

                  {vehicle.condition === "New" && (
                    <Badge className="absolute top-3 left-3 bg-[#C6A969] text-[#0F0F10] text-xs">
                      New
                    </Badge>
                  )}
                  {vehicle.isFeatured && (
                    <Badge className="absolute top-3 right-3 bg-[#0F0F10]/80 text-[#C6A969] text-xs">
                      Featured
                    </Badge>
                  )}
                </div>

                <CardContent className="p-5">
                  <div className="mb-3">
                    <p className="text-sm text-[#8B8F96] mb-1">{vehicle.make}</p>
                    <h3 className="text-lg font-semibold text-white truncate">
                      {vehicle.model} {vehicle.year}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#8B8F96] mb-4">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5" />
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5" />
                      <span>{vehicle.fuelType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-white">
                      {formatPrice(vehicle.price)}
                    </p>
                    <Badge variant="secondary" className="bg-[#0F0F10] text-[#8B8F96] text-xs">
                      {vehicle.bodyType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Settings className="w-16 h-16 text-[#8B8F96]/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No vehicles found</h3>
            <p className="text-[#8B8F96] mb-6">Try adjusting your filters or search query</p>
            <Button onClick={clearFilters} className="bg-[#C6A969] text-[#0F0F10] hover:bg-[#D4B87A]">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
