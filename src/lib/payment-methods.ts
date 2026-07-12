// ============================================================================
// PAYMENT METHOD CATALOG (client-safe — no server imports)
// Shared between the checkout UI and the payment service.
// ============================================================================

export type PaymentMethod =
  | 'FLUTTERWAVE'
  | 'MOBILE_MONEY'
  | 'VISA'
  | 'MASTERCARD'
  | 'BANK_TRANSFER'

export interface PaymentMethodInfo {
  id: PaymentMethod
  label: string
  description: string
  /** lucide-react icon name used by the checkout UI */
  icon: 'Smartphone' | 'CreditCard' | 'Landmark' | 'Wallet'
}

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  { id: 'FLUTTERWAVE', label: 'Flutterwave', description: 'Card, mobile money & bank in one secure checkout', icon: 'Wallet' },
  { id: 'MOBILE_MONEY', label: 'Mobile Money', description: 'MTN MoMo or Airtel Money', icon: 'Smartphone' },
  { id: 'VISA', label: 'Visa', description: 'Visa debit or credit card', icon: 'CreditCard' },
  { id: 'MASTERCARD', label: 'Mastercard', description: 'Mastercard debit or credit card', icon: 'CreditCard' },
  { id: 'BANK_TRANSFER', label: 'Bank Transfer', description: 'Direct transfer to Mighty Rides', icon: 'Landmark' },
]

export function paymentMethodLabel(method: string): string {
  return PAYMENT_METHODS.find((m) => m.id === method)?.label ?? method
}
