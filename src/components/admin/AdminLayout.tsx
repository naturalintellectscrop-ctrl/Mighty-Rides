/**
 * Pass-through wrapper kept for backwards compatibility.
 *
 * Admin pages wrap their content in <AdminLayout>. The actual admin chrome
 * (single responsive sidebar + top bar + auth guard + light theme) now lives
 * in src/app/admin/layout.tsx. This component previously rendered its own
 * sidebar too, which produced a duplicate (double) sidebar — so it now just
 * renders its children.
 */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default AdminLayout
