'use client'

import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react'
import { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

export { useSession, signIn, signOut }
