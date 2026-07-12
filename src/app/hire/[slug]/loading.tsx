import { Navbar } from '@/components/shared'

// Route-level skeleton for a rental detail page — gallery + booking rail.
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#141312]">
      <Navbar />

      <div className="pt-24 pb-4">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="sk sk-dark h-3.5 w-56" />
        </div>
      </div>

      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="sk sk-dark aspect-[4/3] !rounded-2xl" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="sk sk-dark w-24 h-16" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="sk sk-dark h-6 w-28 !rounded-full" />
              <div className="sk sk-dark h-10 w-3/4" />
              <div className="sk sk-dark h-32 w-full !rounded-xl" />
              <div className="sk sk-dark h-14 w-full !rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
