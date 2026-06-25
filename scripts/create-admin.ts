import { hash } from 'bcryptjs'
import { db } from '../src/lib/db'

async function createAdmin() {
  try {
    const existingAdmin = await db.user.findUnique({
      where: { email: 'admin@mightyrides.com' },
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    const hashedPassword = await hash('Admin@2024!', 12)

    const admin = await db.user.create({
      data: {
        email: 'admin@mightyrides.com',
        password_hash: hashedPassword,
        full_name: 'Admin User',
        phone: '+256700000000',
        role: 'ADMIN',
        account_status: 'ACTIVE',
        email_verified: true,
      },
    })

    console.log('Admin user created successfully:', admin.email)
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await db.$disconnect()
  }
}

createAdmin()
