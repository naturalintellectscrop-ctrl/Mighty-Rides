// Seed script for hire vehicles
import { db } from '../src/lib/db'

async function main() {
  const now = new Date()
  
  // Create test hire vehicles
  const vehicles = [
    {
      id: 'hire-1',
      name: 'Range Rover Vogue',
      make: 'Land Rover',
      model: 'Range Rover Vogue',
      year: 2023,
      plate_number: 'UAZ 123A',
      slug: 'range-rover-vogue-2023',
      type: 'HIRE',
      status: 'AVAILABLE',
      daily_rate_ugx: 2500000,
      weekly_rate_ugx: 15000000,
      monthly_rate_ugx: 50000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
      ]),
      specs: JSON.stringify({
        engine: '4.4L V8',
        transmission: 'Automatic',
        drive: 'AWD',
        fuel: 'Petrol',
        seats: 5,
        colour: 'Black',
        mileage: '15,000 km',
        features: ['Panoramic Roof', 'Meridian Sound', 'Air Suspension']
      }),
      description: 'Luxury SUV perfect for weddings and executive travel.',
      occasions: JSON.stringify(['WEDDING', 'EXECUTIVE', 'AIRPORT', 'PERSONAL']),
      published: true,
      created_at: now,
    },
    {
      id: 'hire-2',
      name: 'Mercedes G-Wagon',
      make: 'Mercedes-Benz',
      model: 'G63 AMG',
      year: 2022,
      plate_number: 'UAZ 456B',
      slug: 'mercedes-g-wagon-2022',
      type: 'BOTH',
      status: 'AVAILABLE',
      daily_rate_ugx: 3000000,
      weekly_rate_ugx: 18000000,
      monthly_rate_ugx: 60000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800',
      ]),
      specs: JSON.stringify({
        engine: '4.0L V8 Biturbo',
        transmission: 'Automatic',
        drive: 'AWD',
        fuel: 'Petrol',
        seats: 5,
        colour: 'White',
        mileage: '20,000 km',
        features: ['AMG Package', 'Burmester Sound', 'Night Package']
      }),
      description: 'Iconic G-Wagon for special occasions.',
      occasions: JSON.stringify(['WEDDING', 'EXECUTIVE', 'PERSONAL', 'CORPORATE']),
      published: true,
      created_at: now,
    },
    {
      id: 'hire-3',
      name: 'Toyota Land Cruiser V8',
      make: 'Toyota',
      model: 'Land Cruiser V8',
      year: 2023,
      plate_number: 'UAZ 789C',
      slug: 'toyota-land-cruiser-v8-2023',
      type: 'HIRE',
      status: 'RENTED_OUT',
      daily_rate_ugx: 1500000,
      weekly_rate_ugx: 9000000,
      monthly_rate_ugx: 30000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
      ]),
      specs: JSON.stringify({
        engine: '5.7L V8',
        transmission: 'Automatic',
        drive: 'AWD',
        fuel: 'Petrol',
        seats: 7,
        colour: 'Silver',
        mileage: '25,000 km',
        features: ['Leather Seats', 'JBL Audio', 'Kinetic Suspension']
      }),
      description: 'Reliable and comfortable for long trips.',
      occasions: JSON.stringify(['LONG_TERM', 'CORPORATE', 'AIRPORT']),
      published: true,
      created_at: now,
    },
    {
      id: 'hire-4',
      name: 'BMW X7',
      make: 'BMW',
      model: 'X7 M50i',
      year: 2023,
      plate_number: 'UAZ 101D',
      slug: 'bmw-x7-2023',
      type: 'HIRE',
      status: 'RESERVED',
      daily_rate_ugx: 2000000,
      weekly_rate_ugx: 12000000,
      monthly_rate_ugx: 40000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      ]),
      specs: JSON.stringify({
        engine: '4.4L V8',
        transmission: 'Automatic',
        drive: 'AWD',
        fuel: 'Petrol',
        seats: 7,
        colour: 'Blue',
        mileage: '10,000 km',
        features: ['Sky Lounge', 'Bowers & Wilkins', 'Executive Seats']
      }),
      description: 'Ultimate luxury SUV for families and executives.',
      occasions: JSON.stringify(['WEDDING', 'EXECUTIVE', 'AIRPORT', 'LONG_TERM']),
      published: true,
      created_at: now,
    },
    {
      id: 'hire-5',
      name: 'Porsche Cayenne',
      make: 'Porsche',
      model: 'Cayenne Turbo GT',
      year: 2023,
      plate_number: 'UAZ 202E',
      slug: 'porsche-cayenne-2023',
      type: 'HIRE',
      status: 'IN_SERVICE',
      daily_rate_ugx: 2800000,
      weekly_rate_ugx: 16800000,
      monthly_rate_ugx: 56000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      ]),
      specs: JSON.stringify({
        engine: '4.0L V8',
        transmission: 'Automatic',
        drive: 'AWD',
        fuel: 'Petrol',
        seats: 5,
        colour: 'Grey',
        mileage: '8,000 km',
        features: ['Sport Chrono', 'PASM', 'Bose Sound']
      }),
      description: 'Performance meets luxury.',
      occasions: JSON.stringify(['PERSONAL', 'EXECUTIVE', 'WEDDING']),
      published: true,
      created_at: now,
    },
    {
      id: 'hire-6',
      name: 'Rolls-Royce Ghost',
      make: 'Rolls-Royce',
      model: 'Ghost',
      year: 2022,
      plate_number: 'UAZ 303F',
      slug: 'rolls-royce-ghost-2022',
      type: 'HIRE',
      status: 'AVAILABLE',
      daily_rate_ugx: 5000000,
      weekly_rate_ugx: 30000000,
      monthly_rate_ugx: 100000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800',
      ]),
      specs: JSON.stringify({
        engine: '6.75L V12',
        transmission: 'Automatic',
        drive: 'AWD',
        fuel: 'Petrol',
        seats: 5,
        colour: 'Diamond Black',
        mileage: '12,000 km',
        features: ['Starlight Headliner', 'Bespoke Audio', 'Massage Seats']
      }),
      description: 'The ultimate in luxury transportation.',
      occasions: JSON.stringify(['WEDDING', 'EXECUTIVE', 'CORPORATE']),
      published: true,
      created_at: now,
    },
  ]
  
  for (const vehicle of vehicles) {
    await db.vehicle.upsert({
      where: { id: vehicle.id },
      update: vehicle,
      create: vehicle,
    })
    console.log(`Created/updated vehicle: ${vehicle.name}`)
  }
  
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
