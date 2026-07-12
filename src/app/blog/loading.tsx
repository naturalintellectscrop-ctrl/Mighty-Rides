import { Navbar } from '@/components/shared'

// Route-level skeleton for the blog listing — dark header band, light post grid.
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#141312] flex flex-col">
      <Navbar />

      <section className="pt-32 pb-12 md:pb-16 section-dark px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="sk sk-dark h-3.5 w-28 mb-4" />
        <div className="sk sk-dark h-10 md:h-12 w-72 max-w-full mb-4" />
        <div className="sk sk-dark h-4 w-full max-w-lg" />
      </section>

      <section className="section-light flex-1 px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="sk h-9 w-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#ECEAE3] bg-white overflow-hidden shadow-[0_1px_2px_rgba(26,24,21,0.04)]">
              <div className="sk aspect-[16/10] !rounded-none" />
              <div className="p-6 space-y-3">
                <div className="sk h-3 w-24" />
                <div className="sk h-5 w-3/4" />
                <div className="sk h-4 w-full" />
                <div className="sk h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
