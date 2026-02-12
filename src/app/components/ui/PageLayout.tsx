export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex gap-8 items-start">
      {children}
    </div>
  )
}
