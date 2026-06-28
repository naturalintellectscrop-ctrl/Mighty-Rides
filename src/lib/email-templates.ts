// ============================================================================
// EMAIL TEMPLATES - Mighty Rides
// All HTML email templates for transactional emails
// ============================================================================

// Site URL for email links
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Email data interface
export interface EmailTemplateData {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

/**
 * Generate branded email HTML wrapper
 */
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mighty Rides</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0A0A0A;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #141414; border-radius: 12px; border: 1px solid #222;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; border-bottom: 1px solid #222;">
              <h1 style="margin: 0; font-family: 'Oswald', sans-serif; font-size: 24px; font-weight: 700; color: #C8952A; letter-spacing: 0.05em;">
                MIGHTY RIDES
              </h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #B0B0B0;">East Africa's Premium Car Dealership</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid #222; background-color: #0A0A0A; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; font-size: 13px; color: #666; text-align: center;">
                Mighty Rides<br>
                Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala, Uganda<br>
                <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">WhatsApp: +256 785 642 717</a>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 11px; color: #444; text-align: center;">
                © ${new Date().getFullYear()} Mighty Rides. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// ============================================================================
// EMAIL VERIFICATION TEMPLATE
// ============================================================================

export interface EmailVerificationParams {
  email: string
  token: string
  name: string
}

export function emailVerificationTemplate(params: EmailVerificationParams): EmailTemplateData {
  const { email, token, name } = params
  const verificationUrl = `${SITE_URL}/verify-email?token=${token}`
  
  return {
    to: email,
    subject: 'Verify Your Email - Mighty Rides',
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #FFFFFF;">Hello ${name},</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        Thank you for registering with Mighty Rides. Please verify your email address to activate your account.
      </p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 14px 28px; background-color: transparent; border: 1px solid #C8952A; color: #C8952A; text-decoration: none; font-weight: 500; border-radius: 6px;">
        Verify Email Address
      </a>
      <p style="margin: 20px 0 0 0; font-size: 13px; color: #666;">
        This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
      </p>
    `),
    text: `Hello ${name},\n\nPlease verify your email address by visiting: ${verificationUrl}\n\nThis link expires in 24 hours.`,
  }
}

// ============================================================================
// WELCOME EMAIL TEMPLATE
// ============================================================================

export interface WelcomeEmailParams {
  email: string
  name: string
}

export function welcomeEmailTemplate(params: WelcomeEmailParams): EmailTemplateData {
  const { email, name } = params
  
  return {
    to: email,
    subject: 'Welcome to Mighty Rides - Your Journey Begins',
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #FFFFFF;">Welcome, ${name}!</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        Your email has been verified and your account is now active. You're all set to explore East Africa's finest collection of premium vehicles.
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #C8952A; font-weight: 500;">What you can do now:</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #B0B0B0; line-height: 1.8;">
          <li>Browse our <a href="${SITE_URL}/hire" style="color: #C8952A;">rental fleet</a> for your next adventure</li>
          <li>Explore <a href="${SITE_URL}/cars" style="color: #C8952A;">vehicles for sale</a></li>
          <li>Request a <a href="${SITE_URL}/sourcing" style="color: #C8952A;">custom vehicle sourcing</a></li>
          <li>Book corporate or concierge services</li>
        </ul>
      </div>
      <div style="padding: 15px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A; font-weight: 500;">Need Help?</p>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">
          Our team is available via WhatsApp: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
        </p>
      </div>
      <a href="${SITE_URL}/portal" style="display: inline-block; padding: 14px 28px; background-color: transparent; border: 1px solid #C8952A; color: #C8952A; text-decoration: none; font-weight: 500; border-radius: 6px;">
        Go to Your Dashboard
      </a>
    `),
    text: `Welcome to Mighty Rides!\n\nYour account is now active. You can browse our rental fleet, explore vehicles for sale, request custom vehicle sourcing, and book corporate or concierge services.\n\nVisit your dashboard: ${SITE_URL}/portal\n\nNeed help? WhatsApp: +256 785 642 717`,
  }
}

// ============================================================================
// PASSWORD RESET TEMPLATE
// ============================================================================

export interface PasswordResetParams {
  email: string
  token: string
  name: string
}

export function passwordResetTemplate(params: PasswordResetParams): EmailTemplateData {
  const { email, token, name } = params
  const resetUrl = `${SITE_URL}/reset-password?token=${token}`
  
  return {
    to: email,
    subject: 'Reset Your Password - Mighty Rides',
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #FFFFFF;">Hello ${name},</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        We received a request to reset your password. Click the button below to create a new password.
      </p>
      <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: transparent; border: 1px solid #C8952A; color: #C8952A; text-decoration: none; font-weight: 500; border-radius: 6px;">
        Reset Password
      </a>
      <p style="margin: 20px 0 0 0; font-size: 13px; color: #666;">
        This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.
      </p>
    `),
    text: `Hello ${name},\n\nReset your password by visiting: ${resetUrl}\n\nThis link expires in 1 hour.`,
  }
}

// ============================================================================
// BOOKING CONFIRMATION TEMPLATE
// ============================================================================

export interface BookingConfirmationParams {
  email: string
  bookingRef: string
  vehicleName: string
  plateNumber?: string
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
  pickupLocation?: string
  officeAddress: string
  officeHours: string
}

export function bookingConfirmationTemplate(params: BookingConfirmationParams): EmailTemplateData {
  const { email, bookingRef, vehicleName, plateNumber, pickupDate, pickupTime, returnDate, returnTime, officeAddress, officeHours } = params
  
  return {
    to: email,
    subject: `Booking Confirmed - ${bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #4CAF50;">Your Booking is Confirmed!</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        Great news! Your rental booking has been confirmed. Here are the details:
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #FFFFFF;"><strong>${vehicleName}</strong></p>
        ${plateNumber ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #B0B0B0;">Plate: ${plateNumber}</p>` : ''}
        <p style="margin: 0; font-size: 14px; color: #C8952A;">Reference: ${bookingRef}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Pickup:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${pickupDate} at ${pickupTime} (EAT)</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Return:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${returnDate} at ${returnTime} (EAT)</td></tr>
      </table>
      <div style="padding: 20px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A; font-weight: 500;">Next Step: Visit Our Office</p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #FFFFFF;">${officeAddress}</p>
        <p style="margin: 0; font-size: 13px; color: #B0B0B0;">Office Hours: ${officeHours}</p>
      </div>
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">What to bring:</p>
      <ul style="margin: 0 0 20px 0; padding-left: 20px; font-size: 14px; color: #B0B0B0;">
        <li>Valid ID (original)</li>
        <li>Deposit payment receipt</li>
        <li>Balance payment</li>
      </ul>
      <p style="margin: 0; font-size: 14px; color: #B0B0B0;">
        Questions? WhatsApp us: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
      </p>
    `),
    text: `Your Booking is Confirmed!\n\nReference: ${bookingRef}\nVehicle: ${vehicleName}\nPickup: ${pickupDate} at ${pickupTime} (EAT)\nReturn: ${returnDate} at ${returnTime} (EAT)\n\nNext Step: Visit our office at ${officeAddress}\nOffice Hours: ${officeHours}\n\nBring: Valid ID (original), deposit receipt, and balance payment.`,
  }
}

// ============================================================================
// REMINDER EMAIL TEMPLATE
// ============================================================================

export type ReminderType = 'pickup_24h' | 'pickup_2h' | 'return_24h' | 'return_2h'

export interface ReminderEmailParams {
  email: string
  bookingRef: string
  vehicleName: string
  pickupDate?: string
  pickupTime?: string
  returnDate?: string
  returnTime?: string
  officeAddress: string
  officeHours?: string
  type: ReminderType
}

export function reminderEmailTemplate(params: ReminderEmailParams): EmailTemplateData {
  const { email, bookingRef, vehicleName, type, officeAddress, officeHours } = params
  const isPickup = type === 'pickup_24h' || type === 'pickup_2h'
  
  if (isPickup) {
    return {
      to: email,
      subject: `Reminder: Pickup ${type === 'pickup_2h' ? 'In 2 Hours' : 'Tomorrow'} - ${bookingRef} - Mighty Rides`,
      html: emailWrapper(`
        <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #C8952A;">Pickup Reminder</h2>
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
          This is a friendly reminder that your vehicle pickup is scheduled for ${type === 'pickup_2h' ? 'in 2 hours' : 'tomorrow'}.
        </p>
        <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; font-size: 16px; color: #FFFFFF;"><strong>${vehicleName}</strong></p>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A;">${params.pickupDate} at ${params.pickupTime} (EAT)</p>
          <p style="margin: 0; font-size: 14px; color: #B0B0B0;">Reference: ${bookingRef}</p>
        </div>
        <div style="padding: 15px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #FFFFFF;">${officeAddress}</p>
          ${officeHours ? `<p style="margin: 0; font-size: 13px; color: #B0B0B0;">Office Hours: ${officeHours}</p>` : ''}
        </div>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">
          Questions? WhatsApp us: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
        </p>
      `),
      text: `Pickup Reminder\n\nVehicle: ${vehicleName}\nPickup: ${params.pickupDate} at ${params.pickupTime} (EAT)\nLocation: ${officeAddress}\n\nReference: ${bookingRef}`,
    }
  } else {
    return {
      to: email,
      subject: `Reminder: Return ${type === 'return_2h' ? 'In 2 Hours' : 'Tomorrow'} - ${bookingRef} - Mighty Rides`,
      html: emailWrapper(`
        <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #C8952A;">Return Reminder</h2>
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
          This is a friendly reminder that your vehicle is due for return ${type === 'return_2h' ? 'in 2 hours' : 'tomorrow'}.
        </p>
        <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; font-size: 16px; color: #FFFFFF;"><strong>${vehicleName}</strong></p>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A;">${params.returnDate} at ${params.returnTime} (EAT)</p>
          <p style="margin: 0; font-size: 14px; color: #B0B0B0;">Reference: ${bookingRef}</p>
        </div>
        <div style="padding: 15px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A; font-weight: 500;">Return to:</p>
          <p style="margin: 0; font-size: 14px; color: #FFFFFF;">${officeAddress}</p>
        </div>
        <p style="margin: 0 0 20px 0; font-size: 13px; color: #666;">
          Please ensure the vehicle is returned with the same fuel level as at handover. Late returns may incur additional charges.
        </p>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">
          Need to extend? WhatsApp us: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
        </p>
      `),
      text: `Return Reminder\n\nVehicle: ${vehicleName}\nReturn by: ${params.returnDate} at ${params.returnTime} (EAT)\nReturn to: ${officeAddress}\n\nReference: ${bookingRef}`,
    }
  }
}

// ============================================================================
// ADMIN ALERT TEMPLATE
// ============================================================================

export type AdminAlertType = 'new_booking' | 'new_inquiry' | 'new_complaint' | 'extension_request' | 'sourcing_request'

export interface AdminAlertParams {
  adminEmail: string
  type: AdminAlertType
  data: Record<string, unknown>
}

export function adminAlertTemplate(params: AdminAlertParams): EmailTemplateData {
  const { adminEmail, type, data } = params
  
  const typeLabels: Record<AdminAlertType, string> = {
    new_booking: 'New Booking Request',
    new_inquiry: 'New Inquiry Received',
    new_complaint: 'New Complaint Submitted',
    extension_request: 'Extension Request',
    sourcing_request: 'New Sourcing Request',
  }

  const typeColors: Record<AdminAlertType, string> = {
    new_booking: '#C8952A',
    new_inquiry: '#4CAF50',
    new_complaint: '#cc4444',
    extension_request: '#FF9800',
    sourcing_request: '#9C27B0',
  }

  return {
    to: adminEmail,
    subject: `${typeLabels[type]} - Mighty Rides Admin`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: ${typeColors[type]};">${typeLabels[type]}</h2>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <pre style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #B0B0B0; white-space: pre-wrap;">${JSON.stringify(data, null, 2)}</pre>
      </div>
      <a href="${SITE_URL}/admin" style="display: inline-block; padding: 14px 28px; background-color: transparent; border: 1px solid #C8952A; color: #C8952A; text-decoration: none; font-weight: 500; border-radius: 6px;">
        View in Admin Dashboard
      </a>
    `),
    text: `${typeLabels[type]}\n\n${JSON.stringify(data, null, 2)}\n\nView in Admin: ${SITE_URL}/admin`,
  }
}
