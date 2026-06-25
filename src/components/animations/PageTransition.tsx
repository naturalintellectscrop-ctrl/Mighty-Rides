'use client'

import { motion, type Variants } from 'framer-motion'
import { ReactNode } from 'react'

// ============================================================================
// PAGE TRANSITION CONFIGURATION
// Visual Design Specification:
// - Page load: Content fades in (opacity 0→1) + slides up (y: 10px→0)
// - Duration: 250ms
// ============================================================================

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * PageTransition - Wraps page content with fade-up animation
 * 
 * Usage:
 * ```tsx
 * export default function Page() {
 *   return (
 *     <PageTransition>
 *       <PageContent />
 *     </PageTransition>
 *   )
 * }
 * ```
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * FadeIn - Wraps elements with fade-in animation on scroll
 * 
 * Usage:
 * ```tsx
 * <FadeIn>
 *   <Card />
 * </FadeIn>
 * ```
 */
export function FadeIn({ 
  children, 
  delay = 0, 
  className 
}: { 
  children: ReactNode
  delay?: number
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: 'easeOut' 
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerContainer - Staggers animation of children
 * 
 * Usage:
 * ```tsx
 * <StaggerContainer>
 *   {items.map(item => <Card key={item.id} />)}
 * </StaggerContainer>
 * ```
 */
export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.1
}: { 
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerItem - Child of StaggerContainer
 */
export function StaggerItem({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.4,
            ease: 'easeOut',
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * HoverLift - Adds hover lift effect to cards
 * Per Visual Design Spec: translateY(-8px) + gold shadow
 */
export function HoverLift({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        boxShadow: '0 12px 40px rgba(200, 149, 42, 0.2)',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScaleIn - Scale animation for modals and dialogs
 */
export function ScaleIn({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
