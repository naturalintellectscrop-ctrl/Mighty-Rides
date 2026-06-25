// ============================================================================
// EMAIL SYSTEM - Resend Integration
// All transactional emails for Mighty Rides
// ============================================================================

// Email configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const EMAIL_FROM = process.env.EMAIL_FROM || 'Mighty Rides <noreply@mightyrides.com>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Email types
export type EmailTemplate = 
  | 'email_verification'
  | 'password_reset'
  | 'booking_pending'
  | 'booking_confirmed'
  | 'booking_active'
  | 'booking_returned'
  | 'booking_declined'
  | 'extension_approved'
  | 'extension_declined'
  | 'admin_notification'
  | 'complaint_response'
  | 'pickup_reminder'
  | 'return_reminder'

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

interface EmailData {
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
// EMAIL TEMPLATES - SPECIFIC
// ============================================================================

/**
 * Email verification email
 */
export function emailVerificationTemplate(
  email: string,
  verificationToken: string,
  userName: string
): EmailData {
  const verificationUrl = `${SITE_URL}/verify-email?token=${verificationToken}`
  
  return {
    to: email,
    subject: 'Verify Your Email - Mighty Rides',
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #FFFFFF;">Hello ${userName},</h2>
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
    text: `Hello ${userName},\n\nPlease verify your email address by visiting: ${verificationUrl}\n\nThis link expires in 24 hours.`,
  }
}

/**
 * Password reset email
 */
export function passwordResetTemplate(
  email: string,
  resetToken: string,
  userName: string
): EmailData {
  const resetUrl = `${SITE_URL}/reset-password?token=${resetToken}`
  
  return {
    to: email,
    subject: 'Reset Your Password - Mighty Rides',
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #FFFFFF;">Hello ${userName},</h2>
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
    text: `Hello ${userName},\n\nReset your password by visiting: ${resetUrl}\n\nThis link expires in 1 hour.`,
  }
}

/**
 * Booking created notification (to admin)
 */
export function bookingPendingAdminTemplate(
  adminEmail: string,
  bookingDetails: {
    bookingRef: string
    renteeName: string
    renteePhone: string
    renteeEmail: string
    vehicleName: string
    pickupDate: string
    returnDate: string
    totalCostUgx: number
    depositUgx: number
    depositPaid: boolean
  }
): EmailData {
  return {
    to: adminEmail,
    subject: `New Rental Booking - ${bookingDetails.bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #C8952A;">New Rental Booking</h2>
      <p style="margin: 0 0 20px 0; padding: 15px; background-color: #1E1E1E; border-radius: 6px; font-size: 18px; color: #FFFFFF; text-align: center;">
        Reference: <strong>${bookingDetails.bookingRef}</strong>
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Rentee:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${bookingDetails.renteeName}</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Phone:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${bookingDetails.renteePhone}</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Email:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${bookingDetails.renteeEmail}</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Vehicle:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${bookingDetails.vehicleName}</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Pickup:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${bookingDetails.pickupDate} (EAT)</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Return:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${bookingDetails.returnDate} (EAT)</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Total Cost:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">UGX ${bookingDetails.totalCostUgx.toLocaleString()}</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Deposit:</td><td style="padding: 8px 0; color: ${bookingDetails.depositPaid ? '#4CAF50' : '#C8952A'}; font-size: 14px;">UGX ${bookingDetails.depositUgx.toLocaleString()} ${bookingDetails.depositPaid ? '✓ PAID' : '(PENDING)'}</td></tr>
      </table>
      <a href="${SITE_URL}/admin/bookings" style="display: inline-block; margin-top: 20px; padding: 14px 28px; background-color: transparent; border: 1px solid #C8952A; color: #C8952A; text-decoration: none; font-weight: 500; border-radius: 6px;">
        View in Admin Dashboard
      </a>
    `),
    text: `New Rental Booking\n\nReference: ${bookingDetails.bookingRef}\nRentee: ${bookingDetails.renteeName}\nVehicle: ${bookingDetails.vehicleName}\nPickup: ${bookingDetails.pickupDate}\nReturn: ${bookingDetails.returnDate}\nTotal: UGX ${bookingDetails.totalCostUgx.toLocaleString()}\nDeposit: UGX ${bookingDetails.depositUgx.toLocaleString()}`,
  }
}

/**
 * Booking confirmed notification (to rentee)
 */
export function bookingConfirmedTemplate(
  email: string,
  bookingDetails: {
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
): EmailData {
  return {
    to: email,
    subject: `Booking Confirmed - ${bookingDetails.bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #4CAF50;">Your Booking is Confirmed!</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        Great news! Your rental booking has been confirmed. Here are the details:
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #FFFFFF;"><strong>${bookingDetails.vehicleName}</strong></p>
        ${bookingDetails.plateNumber ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #B0B0B0;">Plate: ${bookingDetails.plateNumber}</p>` : ''}
        <p style="margin: 0; font-size: 14px; color: #C8952A;">Reference: ${bookingDetails.bookingRef}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Pickup:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${bookingDetails.pickupDate} at ${bookingDetails.pickupTime} (EAT)</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Return:</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${bookingDetails.returnDate} at ${bookingDetails.returnTime} (EAT)</td></tr>
      </table>
      <div style="padding: 20px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A; font-weight: 500;">Next Step: Visit Our Office</p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #FFFFFF;">${bookingDetails.officeAddress}</p>
        <p style="margin: 0; font-size: 13px; color: #B0B0B0;">Office Hours: ${bookingDetails.officeHours}</p>
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
    text: `Your Booking is Confirmed!\n\nReference: ${bookingDetails.bookingRef}\nVehicle: ${bookingDetails.vehicleName}\nPickup: ${bookingDetails.pickupDate} at ${bookingDetails.pickupTime} (EAT)\nReturn: ${bookingDetails.returnDate} at ${bookingDetails.returnTime} (EAT)\n\nNext Step: Visit our office at ${bookingDetails.officeAddress}\nOffice Hours: ${bookingDetails.officeHours}\n\nBring: Valid ID (original), deposit receipt, and balance payment.`,
  }
}

/**
 * Booking active notification (to rentee)
 */
export function bookingActiveTemplate(
  email: string,
  bookingDetails: {
    bookingRef: string
    vehicleName: string
    plateNumber?: string
    returnDate: string
    returnTime: string
    officeAddress: string
    fuelLevel?: string
    odometer?: string
  }
): EmailData {
  return {
    to: email,
    subject: `Your Rental is Active - ${bookingDetails.bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #4CAF50;">Your Rental is Now Active!</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        Your vehicle has been handed over. Enjoy your ride!
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #FFFFFF;"><strong>${bookingDetails.vehicleName}</strong></p>
        ${bookingDetails.plateNumber ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #B0B0B0;">Plate: ${bookingDetails.plateNumber}</p>` : ''}
        <p style="margin: 0; font-size: 14px; color: #C8952A;">Reference: ${bookingDetails.bookingRef}</p>
      </div>
      ${bookingDetails.fuelLevel || bookingDetails.odometer ? `
      <div style="padding: 15px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">Vehicle at Handover:</p>
        ${bookingDetails.fuelLevel ? `<p style="margin: 0 0 5px 0; font-size: 14px; color: #B0B0B0;">Fuel Level: ${bookingDetails.fuelLevel}</p>` : ''}
        ${bookingDetails.odometer ? `<p style="margin: 0; font-size: 14px; color: #B0B0B0;">Odometer: ${bookingDetails.odometer} km</p>` : ''}
      </div>
      ` : ''}
      <div style="padding: 20px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A; font-weight: 500;">Return By</p>
        <p style="margin: 0; font-size: 16px; color: #FFFFFF;">${bookingDetails.returnDate} at ${bookingDetails.returnTime} (EAT)</p>
      </div>
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #B0B0B0;">
        Return to: ${bookingDetails.officeAddress}
      </p>
      <p style="margin: 0 0 20px 0; font-size: 13px; color: #666;">
        Please return the vehicle with the same fuel level. Late returns may incur additional charges.
      </p>
      <p style="margin: 0; font-size: 14px; color: #B0B0B0;">
        Need help? WhatsApp us: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
      </p>
    `),
    text: `Your Rental is Active!\n\nVehicle: ${bookingDetails.vehicleName}\nReturn by: ${bookingDetails.returnDate} at ${bookingDetails.returnTime} (EAT)\nReturn to: ${bookingDetails.officeAddress}\n\nNeed help? WhatsApp: +256 785 642 717`,
  }
}

/**
 * Booking declined notification (to rentee)
 */
export function bookingDeclinedTemplate(
  email: string,
  bookingDetails: {
    bookingRef: string
    vehicleName: string
    declineReason: string
    depositPaid: boolean
    depositAmount?: number
  }
): EmailData {
  return {
    to: email,
    subject: `Booking Update - ${bookingDetails.bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #cc4444;">Booking Update</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        We regret to inform you that your booking could not be confirmed at this time.
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #FFFFFF;">Reference: ${bookingDetails.bookingRef}</p>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">Vehicle: ${bookingDetails.vehicleName}</p>
      </div>
      <div style="padding: 15px; background-color: rgba(204, 68, 68, 0.1); border: 1px solid #cc4444; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #cc4444; font-weight: 500;">Reason:</p>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">${bookingDetails.declineReason}</p>
      </div>
      ${bookingDetails.depositPaid && bookingDetails.depositAmount ? `
      <div style="padding: 15px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #C8952A;">Your deposit of UGX ${bookingDetails.depositAmount.toLocaleString()} will be refunded within 5 business days to your original payment method.</p>
      </div>
      ` : ''}
      <p style="margin: 0 0 20px 0; font-size: 14px; color: #B0B0B0;">
        We'd love to help you find an alternative. WhatsApp us: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
      </p>
    `),
    text: `Booking Update\n\nWe regret that your booking (Reference: ${bookingDetails.bookingRef}) could not be confirmed.\n\nReason: ${bookingDetails.declineReason}\n\nWe'd love to help you find an alternative. WhatsApp: +256 785 642 717`,
  }
}

/**
 * Booking returned notification (to rentee) with receipt
 */
export function bookingReturnedTemplate(
  email: string,
  bookingDetails: {
    bookingRef: string
    vehicleName: string
    receiptUrl?: string
  }
): EmailData {
  return {
    to: email,
    subject: `Thank You - ${bookingDetails.bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #FFFFFF;">Thank You for Renting with Mighty Rides!</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        Your rental has been completed. We hope you enjoyed your experience!
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #FFFFFF;">Reference: ${bookingDetails.bookingRef}</p>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">Vehicle: ${bookingDetails.vehicleName}</p>
      </div>
      ${bookingDetails.receiptUrl ? `
      <a href="${bookingDetails.receiptUrl}" style="display: inline-block; padding: 14px 28px; background-color: transparent; border: 1px solid #C8952A; color: #C8952A; text-decoration: none; font-weight: 500; border-radius: 6px;">
        Download Receipt
      </a>
      ` : ''}
      <p style="margin: 20px 0 0 0; font-size: 14px; color: #B0B0B0;">
        We'd love to have you again. <a href="${SITE_URL}/hire" style="color: #C8952A; text-decoration: none;">View our fleet</a>
      </p>
    `),
    text: `Thank You for Renting with Mighty Rides!\n\nReference: ${bookingDetails.bookingRef}\nVehicle: ${bookingDetails.vehicleName}\n\nWe hope you enjoyed your experience. We'd love to have you again!`,
  }
}

/**
 * Extension approved/declined notification
 */
export function extensionResponseTemplate(
  email: string,
  details: {
    bookingRef: string
    vehicleName: string
    approved: boolean
    newReturnDate?: string
    additionalCost?: number
    declineReason?: string
  }
): EmailData {
  return {
    to: email,
    subject: `Extension ${details.approved ? 'Approved' : 'Declined'} - ${details.bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: ${details.approved ? '#4CAF50' : '#cc4444'};">
        Extension ${details.approved ? 'Approved' : 'Declined'}
      </h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        ${details.approved 
          ? 'Great news! Your rental extension has been approved.'
          : 'We regret that we could not accommodate your extension request at this time.'}
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #FFFFFF;">Reference: ${details.bookingRef}</p>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">Vehicle: ${details.vehicleName}</p>
      </div>
      ${details.approved && details.newReturnDate ? `
      <div style="padding: 15px; background-color: rgba(76, 175, 80, 0.1); border: 1px solid #4CAF50; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #4CAF50; font-weight: 500;">New Return Date:</p>
        <p style="margin: 0; font-size: 16px; color: #FFFFFF;">${details.newReturnDate} (EAT)</p>
        ${details.additionalCost ? `<p style="margin: 10px 0 0 0; font-size: 14px; color: #B0B0B0;">Additional cost: UGX ${details.additionalCost.toLocaleString()}</p>` : ''}
      </div>
      ` : ''}
      ${!details.approved && details.declineReason ? `
      <div style="padding: 15px; background-color: rgba(204, 68, 68, 0.1); border: 1px solid #cc4444; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">${details.declineReason}</p>
      </div>
      ` : ''}
      <p style="margin: 0; font-size: 14px; color: #B0B0B0;">
        Questions? WhatsApp us: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
      </p>
    `),
    text: `Extension ${details.approved ? 'Approved' : 'Declined'}\n\nReference: ${details.bookingRef}\n${details.approved ? `New return date: ${details.newReturnDate}` : details.declineReason}`,
  }
}

/**
 * Pickup reminder (day before)
 */
export function pickupReminderTemplate(
  email: string,
  details: {
    bookingRef: string
    vehicleName: string
    pickupDate: string
    pickupTime: string
    officeAddress: string
    officeHours: string
  }
): EmailData {
  return {
    to: email,
    subject: `Reminder: Pickup Tomorrow - ${details.bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #C8952A;">Pickup Reminder</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        This is a friendly reminder that your vehicle pickup is scheduled for tomorrow.
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #FFFFFF;"><strong>${details.vehicleName}</strong></p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A;">${details.pickupDate} at ${details.pickupTime} (EAT)</p>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">Reference: ${details.bookingRef}</p>
      </div>
      <div style="padding: 15px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #FFFFFF;">${details.officeAddress}</p>
        <p style="margin: 0; font-size: 13px; color: #B0B0B0;">Office Hours: ${details.officeHours}</p>
      </div>
      <p style="margin: 0; font-size: 14px; color: #B0B0B0;">
        Questions? WhatsApp us: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
      </p>
    `),
    text: `Pickup Reminder\n\nVehicle: ${details.vehicleName}\nPickup: ${details.pickupDate} at ${details.pickupTime} (EAT)\nLocation: ${details.officeAddress}\n\nReference: ${details.bookingRef}`,
  }
}

/**
 * Return reminder (day before)
 */
export function returnReminderTemplate(
  email: string,
  details: {
    bookingRef: string
    vehicleName: string
    returnDate: string
    returnTime: string
    officeAddress: string
  }
): EmailData {
  return {
    to: email,
    subject: `Reminder: Return Due Tomorrow - ${details.bookingRef} - Mighty Rides`,
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #C8952A;">Return Reminder</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #B0B0B0; line-height: 1.6;">
        This is a friendly reminder that your vehicle is due for return tomorrow.
      </p>
      <div style="padding: 20px; background-color: #1E1E1E; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #FFFFFF;"><strong>${details.vehicleName}</strong></p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A;">${details.returnDate} at ${details.returnTime} (EAT)</p>
        <p style="margin: 0; font-size: 14px; color: #B0B0B0;">Reference: ${details.bookingRef}</p>
      </div>
      <div style="padding: 15px; background-color: rgba(200, 149, 42, 0.1); border: 1px solid #C8952A; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #C8952A; font-weight: 500;">Return to:</p>
        <p style="margin: 0; font-size: 14px; color: #FFFFFF;">${details.officeAddress}</p>
      </div>
      <p style="margin: 0 0 20px 0; font-size: 13px; color: #666;">
        Please ensure the vehicle is returned with the same fuel level as at handover. Late returns may incur additional charges.
      </p>
      <p style="margin: 0; font-size: 14px; color: #B0B0B0;">
        Need to extend? WhatsApp us: <a href="https://wa.me/256785642717" style="color: #C8952A; text-decoration: none;">+256 785 642 717</a>
      </p>
    `),
    text: `Return Reminder\n\nVehicle: ${details.vehicleName}\nReturn by: ${details.returnDate} at ${details.returnTime} (EAT)\nReturn to: ${details.officeAddress}\n\nReference: ${details.bookingRef}`,
  }
}

/**
 * Welcome email template (after email verification)
 */
export function welcomeEmailTemplate(
  email: string,
  userName: string
): EmailData {
  return {
    to: email,
    subject: 'Welcome to Mighty Rides - Your Journey Begins',
    html: emailWrapper(`
      <h2 style="margin: 0 0 20px 0; font-family: 'Oswald', sans-serif; font-size: 22px; color: #FFFFFF;">Welcome, ${userName}!</h2>
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

/**
 * Admin alert template for various notifications
 */
export function adminAlertTemplate(
  adminEmail: string,
  type: 'new_booking' | 'new_inquiry' | 'new_complaint' | 'extension_request' | 'sourcing_request',
  data: Record<string, unknown>
): EmailData {
  const typeLabels = {
    new_booking: 'New Booking Request',
    new_inquiry: 'New Inquiry Received',
    new_complaint: 'New Complaint Submitted',
    extension_request: 'Extension Request',
    sourcing_request: 'New Sourcing Request',
  }

  const typeColors = {
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

// ============================================================================
// EMAIL SENDING FUNCTION
// ============================================================================

/**
 * Send an email using Resend
 */
export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
  // If no API key, log in development
  if (!RESEND_API_KEY) {
    console.log('[EMAIL] Development mode - would send:', {
      to: emailData.to,
      subject: emailData.subject,
    })
    return { success: true }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[EMAIL] Failed to send:', error)
      return { success: false, error: JSON.stringify(error) }
    }

    return { success: true }
  } catch (error) {
    console.error('[EMAIL] Error sending:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================================================
// CONVENIENCE WRAPPER FUNCTIONS
// These functions provide simpler interfaces for common email operations
// ============================================================================

/**
 * Send email verification email
 * @param email - Recipient email address
 * @param token - Verification token
 * @param name - User's name
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const emailData = emailVerificationTemplate(email, token, name)
  return sendEmail(emailData)
}

/**
 * Send welcome email after email verification
 * @param email - Recipient email address
 * @param name - User's name
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const emailData = welcomeEmailTemplate(email, name)
  return sendEmail(emailData)
}

/**
 * Send password reset email
 * @param email - Recipient email address
 * @param token - Reset token
 * @param name - User's name
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const emailData = passwordResetTemplate(email, token, name)
  return sendEmail(emailData)
}

/**
 * Send booking confirmation email
 * @param email - Recipient email address
 * @param booking - Booking details object
 */
export async function sendBookingConfirmationEmail(
  email: string,
  booking: {
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
): Promise<{ success: boolean; error?: string }> {
  const emailData = bookingConfirmedTemplate(email, booking)
  return sendEmail(emailData)
}

/**
 * Send reminder email for pickup or return
 * @param email - Recipient email address
 * @param booking - Booking details object
 * @param type - Type of reminder ('pickup_24h', 'pickup_2h', 'return_24h', 'return_2h')
 */
export async function sendReminderEmail(
  email: string,
  booking: {
    bookingRef: string
    vehicleName: string
    pickupDate?: string
    pickupTime?: string
    returnDate?: string
    returnTime?: string
    officeAddress: string
    officeHours?: string
  },
  type: 'pickup_24h' | 'pickup_2h' | 'return_24h' | 'return_2h'
): Promise<{ success: boolean; error?: string }> {
  let emailData: EmailData

  if (type === 'pickup_24h' || type === 'pickup_2h') {
    emailData = pickupReminderTemplate(email, {
      bookingRef: booking.bookingRef,
      vehicleName: booking.vehicleName,
      pickupDate: booking.pickupDate || '',
      pickupTime: booking.pickupTime || '',
      officeAddress: booking.officeAddress,
      officeHours: booking.officeHours || '',
    })
  } else {
    emailData = returnReminderTemplate(email, {
      bookingRef: booking.bookingRef,
      vehicleName: booking.vehicleName,
      returnDate: booking.returnDate || '',
      returnTime: booking.returnTime || '',
      officeAddress: booking.officeAddress,
    })
  }

  return sendEmail(emailData)
}

/**
 * Send admin alert email for various notifications
 * @param adminEmail - Admin email address
 * @param type - Type of alert
 * @param data - Alert data object
 */
export async function sendAdminAlertEmail(
  adminEmail: string,
  type: 'new_booking' | 'new_inquiry' | 'new_complaint' | 'extension_request' | 'sourcing_request',
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const emailData = adminAlertTemplate(adminEmail, type, data)
  return sendEmail(emailData)
}
