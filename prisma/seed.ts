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

  // Demo vehicles and blog posts are intentionally NOT seeded — real
  // inventory/content is added by admins via /admin/fleet and /admin/blog.

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
