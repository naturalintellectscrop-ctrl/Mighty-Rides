import { Car, Calendar, CreditCard, Key, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Car,
    step: 'STEP 1',
    title: 'Choose Car',
    description: 'Browse our collection and select your perfect car from our premium fleet.',
  },
  {
    icon: Calendar,
    step: 'STEP 2',
    title: 'Pick Date',
    description: 'Select your pick-up and return dates that work best for your schedule.',
  },
  {
    icon: CreditCard,
    step: 'STEP 3',
    title: 'Make Payment',
    description: 'Secure payment through our safe gateway with multiple payment options.',
  },
  {
    icon: Key,
    step: 'STEP 4',
    title: 'Get Car',
    description: 'Pick up your car and enjoy the ultimate driving experience.',
  },
]

/**
 * HowItWorks Component - Visual Design Specification
 * 
 * Design Requirements:
 * - Light background (#F8F6F2)
 * - 100px circle icons with gold border
 * - Step labels in gold, Montserrat SemiBold
 * - Generous spacing between steps
 * - Arrow connectors between steps (desktop)
 */
export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24 md:py-28 bg-surface-light">
      <div className="container mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="eyebrow mb-3 sm:mb-4">SIMPLE PROCESS</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-midnight">
            How It Works
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-brand-muted max-w-xl mx-auto leading-relaxed">
            Getting your dream car is easy. Follow these four simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-6 relative">
          {steps.map((step, index) => (
            <div 
              key={step.step} 
              className="text-center group relative"
            >
              {/* Arrow connector (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-brand-gold/30 to-transparent z-0">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold/30" />
                </div>
              )}

              {/* Icon Circle - 100px per spec */}
              <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6 bg-midnight border-[3px] border-brand-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              {/* Step Number */}
              <p className="font-label text-xs sm:text-sm font-bold text-brand-gold tracking-[0.15em] mb-2 sm:mb-3">
                {step.step}
              </p>

              {/* Step Title */}
              <h3 className="font-display text-lg sm:text-xl font-semibold text-midnight mb-3 sm:mb-4">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-[260px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
