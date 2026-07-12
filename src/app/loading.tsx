import { Navbar } from '@/components/shared'

// Root route-level skeleton — mirrors the cinematic homepage (dark hero →
// light collection) so the initial load reads as intentional, not empty.
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#141312]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="w-full max-w-xl pt-20">
          <div className="sk sk-dark h-4 w-40 mb-8" />
          <div className="sk sk-dark h-16 md:h-20 w-full mb-4" />
          <div className="sk sk-dark h-16 md:h-20 w-2/3 mb-8" />
          <div className="sk sk-dark h-4 w-full max-w-md mb-3" />
          <div className="sk sk-dark h-4 w-3/4 mb-10" />
          <div className="flex gap-4">
            <div className="sk sk-dark h-[52px] w-44 !rounded-xl" />
            <div className="sk sk-dark h-[52px] w-44 !rounded-xl" />
          </div>
        </div>
      </section>

      {/* Collection band */}
      <section className="section-light px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-20 md:py-32">
        <div className="sk h-4 w-32 mb-4" />
        <div className="sk h-12 w-2/3 max-w-lg mb-14" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="sk aspect-[16/11] !rounded-2xl" />
          <div className="space-y-4">
            <div className="sk h-4 w-24" />
            <div className="sk h-10 w-3/4" />
            <div className="sk h-6 w-40" />
            <div className="sk h-4 w-1/2 mt-4" />
          </div>
        </div>
      </section>
    </main>
  )
}
