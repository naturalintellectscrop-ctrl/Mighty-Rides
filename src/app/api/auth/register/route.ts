import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'
import { checkRateLimit, rateLimitResponse, getClientIp } from '@/lib/rate-limit'
import { sendEmail, emailVerificationTemplate } from '@/lib/email'
import { isDemoMode } from '@/lib/demo/config'
import crypto from 'crypto'

// Ugandan mobile numbers: 07XXXXXXXX, 2567XXXXXXXX or +2567XXXXXXXX
function isValidUgandaPhone(phone: string): boolean {
  const normalized = phone.replace(/[\s-]/g, '')
  return /^(?:\+?256|0)7\d{8}$/.test(normalized)
}

// Returns whole-year age for a YYYY-MM-DD (or parseable) date of birth.
function getAge(dob: string): number | null {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*etc.)')
  }

  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'letmein']
  const lowerPassword = password.toLowerCase()
  for (const pattern of commonPatterns) {
    if (lowerPassword.includes(pattern)) {
      errors.push('Password contains a common pattern that is easily guessed')
      break
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// ============================================================================
// POST /api/auth/register - Create a new user account
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = getClientIp(request)
    const rateLimitResult = await checkRateLimit(
      { limiter: null, config: { limit: 5, window: '1 h' } },
      `register:${ip}`
    )

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.reset)
    }

    const body = await request.json()

    const {
      fullName,
      dob,
      nationality,
      phone,
      email,
      password,
      confirmPassword,
      idType,
      idFrontUrl,
      idBackUrl,
      agreedToTerms,
    } = body

    // Validate required fields
    if (!fullName || !phone || !email || !password) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Validate phone number (Ugandan mobile)
    if (!isValidUgandaPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Ugandan phone number (e.g. 0772123456 or +256772123456).' },
        { status: 400 }
      )
    }

    // Validate date of birth (must be provided and 18+)
    if (!dob) {
      return NextResponse.json(
        { error: 'Please provide your date of birth.' },
        { status: 400 }
      )
    }
    const age = getAge(dob)
    if (age === null) {
      return NextResponse.json(
        { error: 'Please enter a valid date of birth.' },
        { status: 400 }
      )
    }
    if (age < 18) {
      return NextResponse.json(
        { error: 'You must be at least 18 years old to register.' },
        { status: 400 }
      )
    }

    // Check password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join('. ') },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // When we cannot actually deliver a verification email (Demo Mode or no
    // Resend key), auto-verify so the account can sign in immediately rather
    // than being locked out waiting for an email that will never arrive.
    const autoVerify = isDemoMode() || !process.env.RESEND_API_KEY

    // Create user
    const user = await db.user.create({
      data: {
        full_name: fullName,
        email: email.toLowerCase(),
        phone,
        password_hash: passwordHash,
        role: 'RENTEE',
        dob: dob || null,
        nationality: nationality || null,
        id_type: idType || null,
        id_front_url: idFrontUrl || null,
        id_back_url: idBackUrl || null,
        email_verified: autoVerify,
        id_verified: false,
        account_status: 'ACTIVE',
      }
    })

    // Only send a verification email when it can actually be delivered.
    if (!autoVerify) {
      // Generate an email-verification token and store it (24h expiry).
      // Token storage mirrors /api/auth/verify-email (settings table, key `verify_<token>`).
      try {
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
        await db.setting.upsert({
          where: { key: `verify_${token}` },
          create: {
            key: `verify_${token}`,
            value: JSON.stringify({ userId: user.id, expiresAt: expiresAt.toISOString() }),
          },
          update: {
            value: JSON.stringify({ userId: user.id, expiresAt: expiresAt.toISOString() }),
          },
        })

        await sendEmail(emailVerificationTemplate(user.email, token, user.full_name))
      } catch (emailError) {
        // Account is created; surface a soft failure so the user can request a resend.
        console.error('[REGISTER] Failed to send verification email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: autoVerify
        ? 'Account created. You can now sign in.'
        : 'Account created. Please check your email to verify your account.',
      autoVerified: autoVerify,
      userId: user.id
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
