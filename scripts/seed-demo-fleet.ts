/**
 * Demo fleet seed — populates the site with a presentable mix of sale & hire
 * vehicles (with real, verified photos) so every data-driven page fills in.
 *
 * Idempotent: upserts on stable ids (demo-*), so it is safe to re-run and easy
 * to remove later (all demo rows share the `demo-` id prefix).
 *
 *   npx tsx scripts/seed-demo-fleet.ts
 */
import { db } from '../src/lib/db'

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`

// Detail/on-road shots reused as secondary gallery images.
const DETAIL = img('1583121274602-3e2820c69888')
const ONROAD = img('1552519507-da3b142c6e3d')
const NIGHT = img('1503376780353-7e6692767b70')

type Spec = {
  engine: string; transmission: string; drive: string; fuel: string
  seats: number; colour: string; mileage: string; body_type: string; features: string[]
}

interface Seed {
  id: string
  name: string; make: string; model: string; year: number
  slug: string; type: 'SALE' | 'HIRE' | 'BOTH'; status: string
  sale_price_ugx?: number; daily_rate_ugx?: number
  photos: string[]; specs: Spec; description: string
  occasions?: string[]; featured?: boolean
}

const V: Seed[] = [
  // ─── SALE (+ featured hero pieces) ──────────────────────────────────────
  {
    id: 'demo-sale-1', name: 'Range Rover Autobiography', make: 'Land Rover',
    model: 'Range Rover Autobiography', year: 2024, slug: 'range-rover-autobiography-2024',
    type: 'SALE', status: 'AVAILABLE', sale_price_ugx: 920_000_000, featured: true,
    photos: [img('1606664515524-ed2f786a0bd6'), DETAIL, ONROAD],
    specs: { engine: '4.4L V8', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 5, colour: 'Santorini Black', mileage: '9,000 km', body_type: 'SUV', features: ['Executive Rear Seats', 'Meridian Signature', 'Massage Seats', '24-way Adjust'] },
    description: 'The definitive luxury SUV — commanding presence with limousine-grade refinement.',
  },
  {
    id: 'demo-sale-2', name: 'Mercedes-Benz S 580', make: 'Mercedes-Benz',
    model: 'S 580 4MATIC', year: 2023, slug: 'mercedes-benz-s-580-2023',
    type: 'SALE', status: 'AVAILABLE', sale_price_ugx: 780_000_000, featured: true,
    photos: [img('1549927681-0b673b8243ab'), DETAIL, NIGHT],
    specs: { engine: '4.0L V8 Biturbo', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 5, colour: 'Obsidian Black', mileage: '14,000 km', body_type: 'Sedan', features: ['Burmester 4D', 'Rear Executive Package', 'Chauffeur Ready', 'Ambient Lighting'] },
    description: 'The benchmark executive saloon — serene, sophisticated, and impeccably appointed.',
  },
  {
    id: 'demo-sale-3', name: 'Porsche 911 Carrera S', make: 'Porsche',
    model: '911 Carrera S', year: 2023, slug: 'porsche-911-carrera-s-2023',
    type: 'SALE', status: 'AVAILABLE', sale_price_ugx: 690_000_000, featured: true,
    photos: [img('1614162692292-7ac56d7f7f1e'), NIGHT, ONROAD],
    specs: { engine: '3.0L Twin-Turbo Flat-6', transmission: 'PDK Automatic', drive: 'RWD', fuel: 'Petrol', seats: 4, colour: 'Guards Red', mileage: '6,500 km', body_type: 'Coupe', features: ['Sport Chrono', 'PASM', 'Sport Exhaust', 'BOSE Surround'] },
    description: 'A modern icon — everyday usability wrapped around genuine supercar pace.',
  },
  {
    id: 'demo-sale-4', name: 'Aston Martin DB11', make: 'Aston Martin',
    model: 'DB11 V8', year: 2022, slug: 'aston-martin-db11-2022',
    type: 'SALE', status: 'AVAILABLE', sale_price_ugx: 850_000_000, featured: true,
    photos: [img('1618843479313-40f8afb4b4d8'), DETAIL, ONROAD],
    specs: { engine: '4.0L V8 Twin-Turbo', transmission: 'Automatic', drive: 'RWD', fuel: 'Petrol', seats: 4, colour: 'Magnetic Silver', mileage: '11,000 km', body_type: 'Coupe', features: ['Bang & Olufsen', 'Carbon Trim', 'Sport Plus', 'Handcrafted Interior'] },
    description: 'Grand touring at its most elegant — effortless power and unmistakable British poise.',
  },
  {
    id: 'demo-sale-5', name: 'Ferrari Roma', make: 'Ferrari',
    model: 'Roma', year: 2023, slug: 'ferrari-roma-2023',
    type: 'SALE', status: 'AVAILABLE', sale_price_ugx: 1_150_000_000, featured: true,
    photos: [img('1592198084033-aade902d1aae'), NIGHT, DETAIL],
    specs: { engine: '3.9L V8 Twin-Turbo', transmission: 'Automatic', drive: 'RWD', fuel: 'Petrol', seats: 4, colour: 'Rosso Corsa', mileage: '3,200 km', body_type: 'Coupe', features: ['Carbon Package', 'JBL Professional', 'Adaptive Suspension', 'Launch Control'] },
    description: 'La Nuova Dolce Vita — timeless proportions with 620 hp of Maranello theatre.',
  },
  {
    id: 'demo-sale-6', name: 'Lamborghini Huracán EVO', make: 'Lamborghini',
    model: 'Huracán EVO', year: 2022, slug: 'lamborghini-huracan-evo-2022',
    type: 'SALE', status: 'RESERVED', sale_price_ugx: 1_050_000_000, featured: true,
    photos: [img('1544636331-e26879cd4d9b'), NIGHT, ONROAD],
    specs: { engine: '5.2L V10', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 2, colour: 'Verde Mantis', mileage: '4,800 km', body_type: 'Coupe', features: ['Lifting System', 'Sensonum Audio', 'Dynamic Steering', 'Sport Exhaust'] },
    description: 'A naturally-aspirated V10 masterpiece — raw, vocal, and endlessly exciting.',
  },
  {
    id: 'demo-sale-7', name: 'BMW 760i xDrive', make: 'BMW',
    model: '760i xDrive', year: 2023, slug: 'bmw-760i-xdrive-2023',
    type: 'SALE', status: 'AVAILABLE', sale_price_ugx: 640_000_000,
    photos: [img('1606152421802-db97b9c7a11b'), DETAIL, NIGHT],
    specs: { engine: '4.4L V8', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 5, colour: 'Tanzanite Blue', mileage: '12,500 km', body_type: 'Sedan', features: ['Bowers & Wilkins', 'Executive Lounge', 'Theatre Screen', 'Sky Lounge'] },
    description: 'Flagship 7 Series luxury — commanding, connected, and quietly imperious.',
  },
  {
    id: 'demo-sale-8', name: 'McLaren GT', make: 'McLaren',
    model: 'GT', year: 2022, slug: 'mclaren-gt-2022',
    type: 'SALE', status: 'AVAILABLE', sale_price_ugx: 980_000_000,
    photos: [img('1621135802920-133df287f89c'), NIGHT, ONROAD],
    specs: { engine: '4.0L V8 Twin-Turbo', transmission: 'Automatic', drive: 'RWD', fuel: 'Petrol', seats: 2, colour: 'Silica White', mileage: '5,600 km', body_type: 'Coupe', features: ['Carbon Ceramic Brakes', 'Bowers & Wilkins', 'Panoramic Roof', 'Nose Lift'] },
    description: 'Supercar performance with genuine grand-touring comfort and luggage space.',
  },
  {
    id: 'demo-sale-9', name: 'Audi RS Q8', make: 'Audi',
    model: 'RS Q8', year: 2023, slug: 'audi-rs-q8-2023',
    type: 'SALE', status: 'AVAILABLE', sale_price_ugx: 720_000_000,
    photos: [img('1601925260368-ae2f83cf8b7f'), DETAIL, ONROAD],
    specs: { engine: '4.0L V8 Twin-Turbo', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 5, colour: 'Daytona Grey', mileage: '10,200 km', body_type: 'SUV', features: ['Bang & Olufsen 3D', 'RS Sport Exhaust', 'Air Suspension', 'Carbon Package'] },
    description: 'The super-SUV — 600 hp, everyday practicality, and a genuinely thunderous soundtrack.',
  },

  // ─── HIRE / BOTH (across occasions) ─────────────────────────────────────
  {
    id: 'demo-hire-1', name: 'Rolls-Royce Ghost', make: 'Rolls-Royce',
    model: 'Ghost', year: 2023, slug: 'rolls-royce-ghost-2023',
    type: 'BOTH', status: 'AVAILABLE', sale_price_ugx: 1_450_000_000, daily_rate_ugx: 5_000_000, featured: true,
    photos: [img('1563720360172-67b8f3dce741'), DETAIL, NIGHT],
    specs: { engine: '6.75L V12', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 5, colour: 'Diamond Black', mileage: '8,000 km', body_type: 'Sedan', features: ['Starlight Headliner', 'Bespoke Audio', 'Massage Seats', 'Coach Doors'] },
    description: 'The ultimate statement of arrival — silent, serene, and utterly bespoke.',
    occasions: ['WEDDING', 'EXECUTIVE', 'CORPORATE'],
  },
  {
    id: 'demo-hire-2', name: 'Bentley Bentayga', make: 'Bentley',
    model: 'Bentayga V8', year: 2023, slug: 'bentley-bentayga-2023',
    type: 'BOTH', status: 'AVAILABLE', sale_price_ugx: 1_100_000_000, daily_rate_ugx: 4_200_000, featured: true,
    photos: [img('1631295868223-63265b40d9e4'), DETAIL, ONROAD],
    specs: { engine: '4.0L V8', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 5, colour: 'Beluga Black', mileage: '9,500 km', body_type: 'SUV', features: ['Naim Audio', 'Mulliner Trim', 'Rear Entertainment', 'Air Suspension'] },
    description: 'Handcrafted luxury on any road — the SUV that redefined the segment.',
    occasions: ['WEDDING', 'EXECUTIVE', 'AIRPORT', 'CORPORATE'],
  },
  {
    id: 'demo-hire-3', name: 'Mercedes-AMG G 63', make: 'Mercedes-Benz',
    model: 'G 63 AMG', year: 2023, slug: 'mercedes-amg-g63-2023',
    type: 'HIRE', status: 'AVAILABLE', daily_rate_ugx: 3_000_000,
    photos: [img('1520031441872-265e4ff70366'), DETAIL, ONROAD],
    specs: { engine: '4.0L V8 Biturbo', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 5, colour: 'Polar White', mileage: '17,000 km', body_type: 'SUV', features: ['AMG Package', 'Burmester Sound', 'Night Package', 'Widescreen Cockpit'] },
    description: 'The icon — unmistakable presence for weddings, arrivals and statement travel.',
    occasions: ['WEDDING', 'EXECUTIVE', 'PERSONAL', 'CORPORATE'],
  },
  {
    id: 'demo-hire-4', name: 'Range Rover Vogue', make: 'Land Rover',
    model: 'Range Rover Vogue', year: 2023, slug: 'range-rover-vogue-2023',
    type: 'HIRE', status: 'AVAILABLE', daily_rate_ugx: 2_500_000,
    photos: [img('1580273916550-e323be2ae537'), DETAIL, ONROAD],
    specs: { engine: '3.0L I6', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 5, colour: 'Byron Blue', mileage: '19,000 km', body_type: 'SUV', features: ['Panoramic Roof', 'Meridian Sound', 'Air Suspension', 'Heated Seats'] },
    description: 'Refined and versatile — the default choice for executive comfort and wedding convoys.',
    occasions: ['WEDDING', 'EXECUTIVE', 'AIRPORT', 'PERSONAL'],
  },
  {
    id: 'demo-hire-5', name: 'BMW X7 M50i', make: 'BMW',
    model: 'X7 M50i', year: 2023, slug: 'bmw-x7-m50i-2023',
    type: 'HIRE', status: 'RESERVED', daily_rate_ugx: 2_200_000,
    photos: [img('1555215695-3004980ad54e'), DETAIL, NIGHT],
    specs: { engine: '4.4L V8', transmission: 'Automatic', drive: 'AWD', fuel: 'Petrol', seats: 7, colour: 'Arctic Blue', mileage: '13,000 km', body_type: 'SUV', features: ['Sky Lounge', 'Bowers & Wilkins', 'Executive Seats', '7 Seats'] },
    description: 'Seven-seat luxury for families and delegations — space without compromise.',
    occasions: ['EXECUTIVE', 'AIRPORT', 'LONG_TERM', 'CORPORATE'],
  },
  {
    id: 'demo-hire-6', name: 'Toyota Land Cruiser 300', make: 'Toyota',
    model: 'Land Cruiser 300 GR', year: 2023, slug: 'toyota-land-cruiser-300-2023',
    type: 'HIRE', status: 'AVAILABLE', daily_rate_ugx: 1_600_000,
    photos: [img('1619767886558-efdc259cde1a'), DETAIL, ONROAD],
    specs: { engine: '3.5L V6 Twin-Turbo', transmission: 'Automatic', drive: 'AWD', fuel: 'Diesel', seats: 7, colour: 'Precious Silver', mileage: '22,000 km', body_type: 'SUV', features: ['JBL Audio', 'Multi-Terrain', 'Cool Box', '7 Seats'] },
    description: 'Unstoppable and dependable — the workhorse of choice for long-term and upcountry hire.',
    occasions: ['LONG_TERM', 'CORPORATE', 'AIRPORT', 'PERSONAL'],
  },
]

async function main() {
  const now = new Date()
  for (const v of V) {
    const data = {
      id: v.id, name: v.name, make: v.make, model: v.model, year: v.year,
      slug: v.slug, type: v.type, status: v.status,
      sale_price_ugx: v.sale_price_ugx ?? null,
      daily_rate_ugx: v.daily_rate_ugx ?? null,
      weekly_rate_ugx: v.daily_rate_ugx ? Math.round(v.daily_rate_ugx * 6) : null,
      monthly_rate_ugx: v.daily_rate_ugx ? Math.round(v.daily_rate_ugx * 20) : null,
      photos: JSON.stringify(v.photos),
      specs: JSON.stringify(v.specs),
      description: v.description,
      occasions: v.occasions ? JSON.stringify(v.occasions) : null,
      published: true, featured: v.featured ?? false, created_at: now,
    }
    await db.vehicle.upsert({ where: { id: v.id }, update: data, create: data })
    console.log(`✓ ${v.type.padEnd(4)} ${v.status.padEnd(10)} ${v.name}`)
  }
  const total = await db.vehicle.count()
  console.log(`\nDone. ${V.length} demo vehicles upserted · ${total} vehicles in DB.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
