import { Navbar } from '@/components/shared'

// Route-level skeleton for the hire page — dark hero, neutral occasion strip,
// then the light rental-card grid.
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#141312] pt-20">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[360px] md:h-[440px] flex items-center section-dark px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="w-full max-w-2xl">
          <div className="sk sk-dark h-3.5 w-44 mb-6" />
          <div className="sk sk-dark h-12 md:h-16 w-3/4 mb-5" />
          <div className="sk sk-dark h-4 w-full max-w-md" />
        </div>
      </section>

      {/* Occasion strip */}
      <section className="section-neutral px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sk h-28 !bg-white/70 border border-[#ECEAE3]" />
          ))}
        </div>
      </section>

      {/* Rental cards */}
      <section className="section-light px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#ECEAE3] bg-white overflow-hidden shadow-[0_1px_2px_rgba(26,24,21,0.04),0_10px_30px_rgba(26,24,21,0.06)]">
              <div className="sk h-56 !rounded-none" />
              <div className="p-6 space-y-3">
                <div className="sk h-5 w-2/3" />
                <div className="sk h-4 w-1/3" />
                <div className="sk h-11 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
