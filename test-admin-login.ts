import { compare } from 'bcryptjs'
import { db } from './src/lib/db'

async function testAdminLogin() {
  console.log('=== Admin Login Test ===\n')
  
  const email = 'admin@mightyrides.com'
  const password = 'Admin@2024!'
  
  console.log('Testing credentials:')
  console.log('  Email:', email)
  console.log('  Password:', password)
  console.log('')
  
  // Step 1: Check if user exists
  console.log('Step 1: Checking if user exists in database...')
  const user = await db.user.findUnique({
    where: { email },
  })
  
  if (!user) {
    console.log('❌ FAILED: User not found')
    await db.$disconnect()
    return
  }
  
  console.log('✅ User found:', {
    id: user.id,
    email: user.email,
    role: user.role,
    account_status: user.account_status
  })
  console.log('')
  
  // Step 2: Check account status
  console.log('Step 2: Checking account status...')
  if (user.account_status === 'SUSPENDED') {
    console.log('❌ FAILED: Account is suspended')
    await db.$disconnect()
    return
  }
  console.log('✅ Account is active')
  console.log('')
  
  // Step 3: Verify password
  console.log('Step 3: Verifying password...')
  const isValid = await compare(password, user.password_hash)
  
  if (!isValid) {
    console.log('❌ FAILED: Invalid password')
    await db.$disconnect()
    return
  }
  console.log('✅ Password is correct')
  console.log('')
  
  // Step 4: Check role
  console.log('Step 4: Checking admin role...')
  if (user.role !== 'ADMIN') {
    console.log('❌ FAILED: User is not an admin (role:', user.role, ')')
    await db.$disconnect()
    return
  }
  console.log('✅ User has ADMIN role')
  console.log('')
  
  console.log('=== LOGIN TEST PASSED ===')
  console.log('')
  console.log('Summary:')
  console.log('  - Admin user exists in database')
  console.log('  - Account status is ACTIVE')
  console.log('  - Password verification successful')
  console.log('  - User has ADMIN role')
  console.log('')
  console.log('Expected redirect after login: /portal (default) or /admin (for admin users)')
  
  await db.$disconnect()
}

testAdminLogin().catch(console.error)
