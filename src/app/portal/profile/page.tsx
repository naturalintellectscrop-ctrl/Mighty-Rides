import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PortalLayout } from '@/components/portal/PortalLayout'
import ProfileForm from '@/components/portal/ProfileForm'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role === 'ADMIN') {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      full_name: true,
      email: true,
      phone: true,
      nationality: true,
      id_type: true,
      id_verified: true,
      email_verified: true,
    },
  })

  if (!user) redirect('/login')

  return (
    <PortalLayout>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-brand-white mb-2">Profile</h1>
        <p className="text-brand-silver mb-8">Manage your account details</p>
        <ProfileForm user={user} />
      </div>
    </PortalLayout>
  )
}
