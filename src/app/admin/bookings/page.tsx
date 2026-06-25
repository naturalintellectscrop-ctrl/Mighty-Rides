import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import BookingsClient from './bookings-client'

async function getBookings() {
  const bookings = await db.booking.findMany({
    include: {
      rentee: { select: { full_name: true, email: true, phone: true } },
      vehicle: { select: { name: true, plate_number: true } }
    },
    orderBy: { created_at: 'desc' },
    take: 50
  })
  return bookings.map(booking => ({
    id: booking.id,
    booking_ref: booking.booking_ref,
    status: booking.status,
    pickup_datetime: booking.pickup_datetime,
    return_datetime: booking.return_datetime,
    total_cost_ugx: booking.total_cost_ugx,
    rentee: booking.rentee,
    vehicle: booking.vehicle
  }))
}

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const bookings = await getBookings()

  return (
    <AdminLayout>
      <BookingsClient bookings={bookings} />
    </AdminLayout>
  )
}
