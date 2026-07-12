// ============================================================================
// REFERENCE / DOCUMENT NUMBER GENERATORS
// ----------------------------------------------------------------------------
// Professional, human-readable, reasonably-unique references for every
// customer-facing document. Format: <PREFIX>-<YYYYMMDD>-<RANDOM>. The random
// suffix is drawn from a crypto RNG so collisions are astronomically unlikely
// for demo volumes; unique DB constraints are the ultimate guard.
// ============================================================================

import { randomBytes } from 'crypto'

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // no ambiguous chars (0/O/1/I/L)

function randomCode(length: number): string {
  const bytes = randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length]
  }
  return out
}

function today(): string {
  const d = new Date()
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

/** Generic reference: `PREFIX-YYYYMMDD-XXXXX`. */
export function makeRef(prefix: string, codeLen = 5): string {
  return `${prefix}-${today()}-${randomCode(codeLen)}`
}

// ---- Document-specific helpers (named for the journey they belong to) -------

/** Purchase Order Number for a vehicle sale. */
export const purchaseOrderNumber = () => makeRef('PO')
/** Invoice number issued alongside a purchase. */
export const invoiceNumber = () => makeRef('INV')
/** Reservation reference. */
export const reservationNumber = () => makeRef('RSV')
/** Finance application reference. */
export const financeNumber = () => makeRef('FIN')
/** After-sales / service booking reference. */
export const serviceNumber = () => makeRef('SVC')
/** Trade-in request reference. */
export const tradeInNumber = () => makeRef('TRD')
/** Corporate fleet inquiry reference. */
export const corporateNumber = () => makeRef('CORP')
/** General contact / inquiry reference. */
export const inquiryNumber = () => makeRef('ENQ')
/** Payment receipt number. */
export const receiptNumber = () => makeRef('RCP')

/** Payment transaction reference (used as the gateway tx_ref). */
export function transactionRef(): string {
  return `MR-TX-${today()}-${randomCode(8)}`
}

/** A believable gateway transaction id for the simulated provider. */
export function demoTransactionId(): string {
  // Numeric-looking id similar to real gateway ids.
  return `${Date.now()}${Math.floor(Math.random() * 900 + 100)}`
}
