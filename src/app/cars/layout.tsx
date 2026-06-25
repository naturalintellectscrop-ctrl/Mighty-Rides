import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cars for Sale — Mighty Rides Uganda',
  description: 'Browse our premium fleet of vehicles for sale in Kampala, Uganda. Luxury cars, SUVs, and sports cars from top brands like Ferrari, Range Rover, and Porsche.',
  openGraph: {
    title: 'Cars for Sale — Mighty Rides Uganda',
    description: 'Browse our premium fleet of vehicles for sale in Kampala, Uganda.',
    url: 'https://themightyrides.com/cars',
    siteName: 'Mighty Rides',
    locale: 'en_UG',
    type: 'website',
  },
}

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
