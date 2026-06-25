import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await hash('Admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mightyrides.com' },
    update: {},
    create: {
      email: 'admin@mightyrides.com',
      full_name: 'Mighty Rides Admin',
      phone: '+256700000000',
      password_hash: adminPassword,
      role: 'ADMIN',
      email_verified: true,
      account_status: 'ACTIVE',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create settings
  const settings = [
    { key: 'ugx_usd_rate', value: '3700' },
    { key: 'deposit_percent', value: '30' },
    { key: 'notification_email', value: 'admin@mightyrides.com' },
    { key: 'whatsapp_number', value: '256700000000' },
    { key: 'site_announcement', value: 'East Africa\'s Premium Car Dealership →' },
    { key: 'announcement_active', value: 'true' },
    { key: 'office_hours', value: 'Mon–Sat 8am–6pm EAT' },
    { key: 'office_address', value: 'Mighty Rides, Kampala, Uganda' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'tc_summary_text', value: 'Mighty Rides Rental Terms and Conditions\n\n1. A 30% deposit is required to secure your booking.\n2. The remaining balance must be paid at our office before vehicle collection.\n3. A valid ID (National ID or Passport) is required for all rentals.\n4. The vehicle must be returned in the same condition as received.\n5. Fuel level must be topped up to the same level as at handover.\n6. Late returns will incur additional charges.\n7. Any damage must be reported immediately.\n8. Mighty Rides reserves the right to decline any booking.\n\nFor full terms and conditions, please contact our office.' },
    { key: 'privacy_policy_text', value: 'Mighty Rides Privacy Policy\n\nWe collect and process your personal information for the purpose of providing our services. Your data is stored securely and is never shared with third parties without your consent. You have the right to request access to, correction of, or deletion of your personal data.\n\nFor any privacy concerns, please contact us at admin@mightyrides.com' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('Created', settings.length, 'settings')

  // Create sample vehicles
  const vehicles = [
    {
      name: 'Range Rover Vogue 2023',
      make: 'Land Rover',
      model: 'Range Rover Vogue',
      year: 2023,
      plate_number: 'UAQ 123A',
      slug: 'land-rover-range-rover-vogue-2023-001',
      type: 'BOTH',
      status: 'AVAILABLE',
      sale_price_ugx: 450000000,
      daily_rate_ugx: 1500000,
      weekly_rate_ugx: 9000000,
      monthly_rate_ugx: 30000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      ]),
      specs: JSON.stringify({
        engine: '3.0L Diesel V6',
        transmission: 'Automatic',
        drive: '4WD',
        fuel: 'Diesel',
        seats: 5,
        colour: 'Santorini Black',
        mileage: 12000,
        features: ['Panoramic Roof', 'Meridian Sound', 'Air Suspension', 'Heated Seats'],
      }),
      description: 'Stunning Range Rover Vogue in pristine condition. This luxury SUV combines British elegance with serious off-road capability.',
      occasions: JSON.stringify(['WEDDING', 'AIRPORT', 'EXECUTIVE', 'CORPORATE']),
      published: true,
      featured: true,
    },
    {
      name: 'Mercedes-Benz G63 AMG 2022',
      make: 'Mercedes-Benz',
      model: 'G63 AMG',
      year: 2022,
      plate_number: 'UAQ 456B',
      slug: 'mercedes-benz-g63-amg-2022-002',
      type: 'BOTH',
      status: 'AVAILABLE',
      sale_price_ugx: 580000000,
      daily_rate_ugx: 2000000,
      weekly_rate_ugx: 12000000,
      monthly_rate_ugx: 40000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      ]),
      specs: JSON.stringify({
        engine: '4.0L V8 Biturbo',
        transmission: 'Automatic',
        drive: '4WD',
        fuel: 'Petrol',
        seats: 5,
        colour: 'Obsidian Black',
        mileage: 18000,
        features: ['AMG Performance Exhaust', 'Burmester Sound', 'Night Package', 'AMG Wheels'],
      }),
      description: 'The iconic G-Wagon. This G63 AMG delivers unmatched presence and performance.',
      occasions: JSON.stringify(['WEDDING', 'PERSONAL', 'EXECUTIVE']),
      published: true,
      featured: true,
    },
    {
      name: 'Toyota Land Cruiser V8 2023',
      make: 'Toyota',
      model: 'Land Cruiser V8',
      year: 2023,
      plate_number: 'UAQ 789C',
      slug: 'toyota-land-cruiser-v8-2023-003',
      type: 'BOTH',
      status: 'AVAILABLE',
      sale_price_ugx: 320000000,
      daily_rate_ugx: 800000,
      weekly_rate_ugx: 5000000,
      monthly_rate_ugx: 16000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1595558583858-5d8cb6f34a5d?w=800',
      ]),
      specs: JSON.stringify({
        engine: '4.5L V8 Diesel',
        transmission: 'Automatic',
        drive: '4WD',
        fuel: 'Diesel',
        seats: 7,
        colour: 'White Pearl',
        mileage: 8000,
        features: ['Leather Seats', 'Sunroof', 'Four-zone Climate', 'Kinetic Suspension'],
      }),
      description: 'The legendary Land Cruiser. Reliable, capable, and comfortable for any terrain.',
      occasions: JSON.stringify(['WEDDING', 'AIRPORT', 'EXECUTIVE', 'LONG_TERM', 'CORPORATE']),
      published: true,
      featured: true,
    },
    {
      name: 'BMW X7 M Sport 2023',
      make: 'BMW',
      model: 'X7 M Sport',
      year: 2023,
      plate_number: 'UAQ 321D',
      slug: 'bmw-x7-m-sport-2023-004',
      type: 'HIRE',
      status: 'AVAILABLE',
      daily_rate_ugx: 1200000,
      weekly_rate_ugx: 7500000,
      monthly_rate_ugx: 25000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      ]),
      specs: JSON.stringify({
        engine: '3.0L Diesel I6',
        transmission: 'Automatic',
        drive: 'xDrive AWD',
        fuel: 'Diesel',
        seats: 7,
        colour: 'Carbon Black',
        mileage: 15000,
        features: ['Sky Lounge Panoramic Roof', 'Executive Seats', 'Bowers & Wilkins Sound'],
      }),
      description: 'BMW\'s flagship SUV. Pure luxury and driving pleasure.',
      occasions: JSON.stringify(['WEDDING', 'AIRPORT', 'EXECUTIVE', 'CORPORATE']),
      published: true,
      featured: false,
    },
    {
      name: 'Porsche Cayenne Turbo 2022',
      make: 'Porsche',
      model: 'Cayenne Turbo',
      year: 2022,
      plate_number: 'UAQ 654E',
      slug: 'porsche-cayenne-turbo-2022-005',
      type: 'SALE',
      status: 'AVAILABLE',
      sale_price_ugx: 420000000,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      ]),
      specs: JSON.stringify({
        engine: '4.0L V8 Turbo',
        transmission: 'Automatic',
        drive: 'AWD',
        fuel: 'Petrol',
        seats: 5,
        colour: 'Carrara White',
        mileage: 22000,
        features: ['Sport Chrono Package', 'Bose Sound', 'Sport Exhaust', 'Air Suspension'],
      }),
      description: 'Porsche performance meets SUV practicality. A true driver\'s car.',
      published: true,
      featured: false,
    },
  ]

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { slug: vehicle.slug },
      update: {},
      create: vehicle,
    })
  }
  console.log('Created', vehicles.length, 'sample vehicles')

  // Create sample blog posts
  const blogPosts = [
    {
      title: 'Why Choose Mighty Rides for Your Next Vehicle Purchase',
      slug: 'why-choose-mighty-rides',
      category: 'BUYING_GUIDE',
      content: `# Why Choose Mighty Rides for Your Next Vehicle Purchase

When it comes to purchasing a premium vehicle in East Africa, the choice of dealership matters as much as the choice of car. Here's why Mighty Rides has become the trusted name for discerning buyers across the region.

## Our Commitment to Quality

Every vehicle in our showroom undergoes a rigorous 150-point inspection before it's offered for sale. We don't just sell cars—we curate a collection of the finest automobiles available.

## The Mighty Rides Difference

- **Verified Provenance**: Every vehicle comes with complete documentation and history
- **Transparent Pricing**: No hidden fees, no surprises
- **After-Sales Support**: Our relationship continues well beyond the sale
- **Expert Guidance**: Our team includes automotive specialists who understand these vehicles inside and out

## Ready to Find Your Perfect Vehicle?

Visit us at our Lugogo Bypass showroom or browse our inventory online. Your dream car awaits.`,
      excerpt: 'Discover why discerning buyers across East Africa trust Mighty Rides for premium vehicle purchases.',
      published: true,
      published_at: new Date(),
    },
    {
      title: 'Top 5 Wedding Cars for Your Special Day in Kampala',
      slug: 'top-5-wedding-cars-kampala',
      category: 'RENTAL_GUIDE',
      content: `# Top 5 Wedding Cars for Your Special Day in Kampala

Your wedding day deserves nothing but the best. Here are our top recommendations for luxury wedding car hire in Kampala.

## 1. Range Rover Vogue

The epitome of luxury and presence. Its commanding stance and opulent interior make it the perfect bridal car.

## 2. Mercedes-Benz G63 AMG

For the couple that wants to make a statement. The G-Wagon's iconic design turns heads everywhere.

## 3. Rolls-Royce Phantom

The ultimate in wedding day transportation. Pure elegance and timeless class.

## 4. Bentley Continental GT

British luxury at its finest. The Continental GT combines performance with unmatched comfort.

## 5. BMW 7 Series

Sophisticated and modern. The 7 Series offers a smooth, comfortable ride for the entire wedding party.

## Book Your Wedding Car

Contact us early to secure your preferred vehicle. Our wedding packages include decorations, a professional driver, and flexible timing.`,
      excerpt: 'Planning your wedding? Here are our top 5 luxury car recommendations for your special day in Kampala.',
      published: true,
      published_at: new Date(),
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }
  console.log('Created', blogPosts.length, 'sample blog posts')

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
