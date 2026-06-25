import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 10,
    color: '#666666',
  },
  receiptInfo: {
    alignItems: 'flex-end',
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  receiptNumber: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 2,
  },
  receiptDate: {
    fontSize: 10,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: '35%',
    color: '#666666',
    fontSize: 10,
  },
  value: {
    width: '65%',
    color: '#1a1a1a',
    fontSize: 10,
  },
  twoColumnSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    fontSize: 10,
    color: '#333333',
  },
  col1: { width: '50%' },
  col2: { width: '25%', textAlign: 'right' },
  col3: { width: '25%', textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#D4AF37',
    marginTop: 10,
  },
  totalLabel: {
    width: '50%',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalValue: {
    width: '25%',
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  currencyNote: {
    fontSize: 9,
    color: '#888888',
    fontStyle: 'italic',
    marginTop: 5,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  thankYou: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  contactItem: {
    fontSize: 9,
    color: '#666666',
    marginHorizontal: 10,
  },
  termsSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  termsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 5,
  },
  termsText: {
    fontSize: 8,
    color: '#888888',
    lineHeight: 1.4,
  },
})

// Type definitions
interface ReceiptData {
  booking_ref: string
  issued_date: string
  customer: {
    name: string
    email: string
    phone: string
  }
  vehicle: {
    name: string
    plate_number: string | null
  }
  rental: {
    pickup_date: string
    return_date: string
    duration_days: number
    pickup_location: string | null
  }
  costs: {
    rental_cost_ugx: number
    daily_rate_ugx: number
    days: number
    deposit_ugx: number
    balance_ugx: number
    total_ugx: number
  }
}

// USD conversion rate
const UGX_TO_USD_RATE = 3700

// Helper to format currency
const formatUGX = (amount: number): string => {
  return `UGX ${amount.toLocaleString('en-US')}`
}

const formatUSD = (ugxAmount: number): string => {
  const usdAmount = ugxAmount / UGX_TO_USD_RATE
  return `USD ${usdAmount.toFixed(2)}`
}

// PDF Document Component
export function RentalReceipt({ data }: { data: ReceiptData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.companyName}>Mighty Rides</Text>
            <Text style={styles.tagline}>Premium Car Rental Services</Text>
          </View>
          <View style={styles.receiptInfo}>
            <Text style={styles.receiptTitle}>RECEIPT</Text>
            <Text style={styles.receiptNumber}>{data.booking_ref}</Text>
            <Text style={styles.receiptDate}>Issued: {data.issued_date}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{data.customer.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{data.customer.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{data.customer.phone}</Text>
          </View>
        </View>

        {/* Vehicle & Rental Details */}
        <View style={styles.twoColumnSection}>
          <View style={[styles.section, styles.column]}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Vehicle:</Text>
              <Text style={styles.value}>{data.vehicle.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Plate No:</Text>
              <Text style={styles.value}>{data.vehicle.plate_number || 'N/A'}</Text>
            </View>
          </View>
          <View style={[styles.section, styles.column]}>
            <Text style={styles.sectionTitle}>Rental Period</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Pickup:</Text>
              <Text style={styles.value}>{data.rental.pickup_date}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Return:</Text>
              <Text style={styles.value}>{data.rental.return_date}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>{data.rental.duration_days} day(s)</Text>
            </View>
          </View>
        </View>

        {/* Pickup Location */}
        {data.rental.pickup_location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Location</Text>
            <Text style={styles.value}>{data.rental.pickup_location}</Text>
          </View>
        )}

        {/* Cost Breakdown Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost Breakdown</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col1]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.col2]}>UGX</Text>
              <Text style={[styles.tableHeaderCell, styles.col3]}>USD</Text>
            </View>
            
            {/* Rental Cost Row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                Rental ({data.costs.days} day(s) @ {formatUGX(data.costs.daily_rate_ugx)}/day)
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>{formatUGX(data.costs.rental_cost_ugx)}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{formatUSD(data.costs.rental_cost_ugx)}</Text>
            </View>

            {/* Deposit Paid Row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>Deposit Paid</Text>
              <Text style={[styles.tableCell, styles.col2]}>{formatUGX(data.costs.deposit_ugx)}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{formatUSD(data.costs.deposit_ugx)}</Text>
            </View>

            {/* Balance Paid Row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>Balance Paid</Text>
              <Text style={[styles.tableCell, styles.col2]}>{formatUGX(data.costs.balance_ugx)}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{formatUSD(data.costs.balance_ugx)}</Text>
            </View>

            {/* Total Row */}
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel]}>TOTAL</Text>
              <Text style={[styles.totalValue]}>{formatUGX(data.costs.total_ugx)}</Text>
              <Text style={[styles.totalValue]}>{formatUSD(data.costs.total_ugx)}</Text>
            </View>
          </View>
          <Text style={styles.currencyNote}>
            * USD amounts are approximate, calculated at a rate of 1 USD = {UGX_TO_USD_RATE.toLocaleString()} UGX
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>Thank you for choosing Mighty Rides!</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>Phone: +256 700 123 456</Text>
            <Text style={styles.contactItem}>Email: info@mightyrides.co.ug</Text>
            <Text style={styles.contactItem}>Web: www.mightyrides.co.ug</Text>
          </View>
          
          {/* Terms & Conditions */}
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Text style={styles.termsText}>
              This receipt confirms payment for the rental service described above. The vehicle was returned in acceptable 
              condition as per our rental agreement. Any damages or violations incurred during the rental period are the 
              responsibility of the rentee. This receipt is valid for accounting and record-keeping purposes. For any 
              queries regarding this transaction, please contact our customer service within 30 days of the issue date.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
