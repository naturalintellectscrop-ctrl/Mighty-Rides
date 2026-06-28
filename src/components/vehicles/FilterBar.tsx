'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface FilterBarProps {
  makes: string[]
  currentFilters: {
    make?: string
    body?: string
    price?: string
    year?: string
    currency?: string
  }
}

export function FilterBar({ makes, currentFilters }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams()
    
    // Preserve existing filters except the one being changed
    if (key !== 'make' && currentFilters.make && currentFilters.make !== 'all') {
      params.set('make', currentFilters.make)
    }
    if (key !== 'body' && currentFilters.body && currentFilters.body !== 'all') {
      params.set('body', currentFilters.body)
    }
    if (key !== 'price' && currentFilters.price && currentFilters.price !== 'all') {
      params.set('price', currentFilters.price)
    }
    if (key !== 'year' && currentFilters.year && currentFilters.year !== 'all') {
      params.set('year', currentFilters.year)
    }
    if (currentFilters.currency) {
      params.set('currency', currentFilters.currency)
    }
    
    // Set the new value if it's not 'all'
    if (value && value !== 'all') {
      params.set(key, value)
    }
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <section className="sticky top-20 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-gray-800">
      <div className="px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full lg:w-auto">
            {/* Make Dropdown */}
            <div className="relative group">
              <select 
                value={currentFilters.make || 'all'}
                onChange={(e) => handleFilterChange('make', e.target.value)}
                className="appearance-none w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:border-[#C8952A] transition-colors cursor-pointer min-h-[48px]"
              >
                <option value="all">Make: All</option>
                {makes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
            </div>
            
            {/* Body Type Dropdown */}
            <div className="relative group">
              <select 
                value={currentFilters.body || 'all'}
                onChange={(e) => handleFilterChange('body', e.target.value)}
                className="appearance-none w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:border-[#C8952A] transition-colors cursor-pointer min-h-[48px]"
              >
                <option value="all">Body: All</option>
                <option value="suv">SUV</option>
                <option value="sedan">Sedan</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
            </div>
            
            {/* Price Range Dropdown */}
            <div className="relative group">
              <select 
                value={currentFilters.price || 'all'}
                onChange={(e) => handleFilterChange('price', e.target.value)}
                className="appearance-none w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:border-[#C8952A] transition-colors cursor-pointer min-h-[48px]"
              >
                <option value="all">Price Range</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="100k-250k">$100k - $250k</option>
                <option value="250k+">$250k+</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
            </div>
            
            {/* Year Dropdown */}
            <div className="relative group">
              <select 
                value={currentFilters.year || 'all'}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="appearance-none w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:border-[#C8952A] transition-colors cursor-pointer min-h-[48px]"
              >
                <option value="all">Year: All</option>
                {Array.from({ length: 5 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          {/* Currency Toggle */}
          <div className="flex items-center space-x-2 bg-[#1A1A1A] p-1 rounded-full border border-gray-700">
            <button
              onClick={() => handleFilterChange('currency', 'UGX')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 min-h-[40px] flex items-center justify-center ${
                currentFilters.currency === 'UGX' || !currentFilters.currency ? 'bg-[#C8952A] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              UGX
            </button>
            <button
              onClick={() => handleFilterChange('currency', 'USD')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 min-h-[40px] flex items-center justify-center ${
                currentFilters.currency === 'USD' ? 'bg-[#C8952A] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              USD
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
