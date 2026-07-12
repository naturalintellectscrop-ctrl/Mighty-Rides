import { Navbar } from '@/components/shared'

// Premium route-level skeleton for the cars inventory — mirrors the real page's
// dark hero band + light card grid so the swap feels seamless.
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#141312] pt-20">
      <Navbar />

      {/* Hero band */}
      <section className="section-dark px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
        <div className="sk sk-dark h-3.5 w-40 mb-6" />
        <div className="sk sk-dark h-12 md:h-16 w-2/3 max-w-xl mb-5" />
        <div className="sk sk-dark h-4 w-full max-w-md" />
      </section>

      {/* Card grid */}
      <section className="section-light px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#ECEAE3] bg-white overflow-hidden shadow-[0_1px_2px_rgba(26,24,21,0.04),0_10px_30px_rgba(26,24,21,0.06)]">
              <div className="sk aspect-[16/10] !rounded-none" />
              <div className="p-6 md:p-8 space-y-3">
                <div className="sk h-6 w-3/4" />
                <div className="sk h-4 w-1/2" />
                <div className="sk h-8 w-2/5 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
