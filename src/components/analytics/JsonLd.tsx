// ============================================================================
// JSON-LD STRUCTURED DATA FOR SEO
// ============================================================================

interface OrganizationJsonLdProps {
  name?: string
  url?: string
  logo?: string
  phone?: string
  email?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressCountry: string
  }
}

export function OrganizationJsonLd({
  name = 'Mighty Rides',
  url = 'https://mightyrides.com',
  logo = 'https://mightyrides.com/logo.png',
  phone = '+256 700 000 000',
  email = 'info@mightyrides.com',
  address = {
    streetAddress: 'Plot 18 Lugogo Bypass, Mirembe Business Centre',
    addressLocality: 'Kampala',
    addressCountry: 'UG',
  },
}: OrganizationJsonLdProps = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name,
    url,
    logo,
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 0.3167,
      longitude: 32.5953,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'UGX, USD',
    paymentAccepted: 'Cash, Credit Card, Mobile Money',
    areaServed: {
      '@type': 'Country',
      name: 'Uganda',
    },
    sameAs: [
      'https://facebook.com/mightyrides',
      'https://instagram.com/mightyrides',
      'https://twitter.com/mightyrides',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ============================================================================
// VEHICLE JSON-LD
// ============================================================================

interface VehicleJsonLdProps {
  name: string
  description: string
  image: string[]
  brand: string
  model: string
  year: number
  mileage?: number
  fuelType?: string
  transmission?: string
  price: number
  priceCurrency: 'UGX' | 'USD'
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  url: string
}

export function VehicleJsonLd({
  name,
  description,
  image,
  brand,
  model,
  year,
  mileage,
  fuelType,
  transmission,
  price,
  priceCurrency,
  availability,
  url,
}: VehicleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    model,
    vehicleModelDate: year,
    mileageFromOdometer: mileage
      ? {
          '@type': 'QuantitativeValue',
          value: mileage,
          unitText: 'KM',
        }
      : undefined,
    fuelType,
    vehicleTransmission: transmission,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: priceCurrency === 'UGX' ? 'UGX' : 'USD',
      availability: `https://schema.org/${availability}`,
      url,
      seller: {
        '@type': 'AutoDealer',
        name: 'Mighty Rides',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ============================================================================
// BLOG POST JSON-LD
// ============================================================================

interface BlogPostJsonLdProps {
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
}

export function BlogPostJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: BlogPostJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    image: image || 'https://mightyrides.com/og-image.png',
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author || 'Mighty Rides',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mighty Rides',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mightyrides.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ============================================================================
// FAQ JSON-LD
// ============================================================================

interface FAQItem {
  question: string
  answer: string
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ============================================================================
// LOCAL BUSINESS JSON-LD
// ============================================================================

export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://mightyrides.com/#business',
    name: 'Mighty Rides',
    alternateName: 'Mighty Rides Car Dealership',
    description: 'Premium car dealership and rental service in Kampala, Uganda. We specialize in luxury, exotic, and performance vehicles for sale and hire.',
    url: 'https://mightyrides.com',
    telephone: '+256 700 000 000',
    email: 'info@mightyrides.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 18 Lugogo Bypass, Mirembe Business Centre',
      addressLocality: 'Kampala',
      addressRegion: 'Central Region',
      postalCode: 'P.O. Box 12345',
      addressCountry: 'UG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 0.3167,
      longitude: 32.5953,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    image: 'https://mightyrides.com/showroom.jpg',
    sameAs: [
      'https://facebook.com/mightyrides',
      'https://instagram.com/mightyrides',
      'https://twitter.com/mightyrides',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
