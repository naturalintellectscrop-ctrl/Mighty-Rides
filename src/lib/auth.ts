import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from './db'
import { isDemoMode } from './demo/config'
type UserRole = 'RENTEE' | 'ADMIN'

// Email verification can only be enforced when we can actually deliver the
// verification email. In Demo Mode (or with no Resend key) there is no email
// provider, so the check is skipped rather than locking users out.
const emailVerificationEnforced = !isDemoMode() && Boolean(process.env.RESEND_API_KEY)

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string
    role: UserRole
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        // Check account status
        if (user.account_status === 'SUSPENDED') {
          throw new Error('ACCOUNT_SUSPENDED')
        }

        // Verify password
        const isValidPassword = await compare(credentials.password, user.password_hash)
        if (!isValidPassword) {
          return null
        }

        // Require a verified email before allowing sign-in — but only when we
        // can actually send verification emails (see emailVerificationEnforced).
        if (emailVerificationEnforced && !user.email_verified) {
          throw new Error('EMAIL_NOT_VERIFIED')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.role as UserRole,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    // Rolling 30-minute inactivity window: the session expires 30 minutes after
    // the last activity. `updateAge` refreshes (rolls) the token on activity, so
    // active users stay signed in while idle users are logged out after 30 min.
    maxAge: 30 * 60, // 30 minutes
    updateAge: 5 * 60, // refresh at most every 5 minutes
  },
  jwt: {
    maxAge: 30 * 60, // keep the JWT lifetime in sync with the session window
  },
  secret: process.env.NEXTAUTH_SECRET,
}
