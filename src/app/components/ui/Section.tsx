export function Section({
  title,
  children
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-8">
      {title && (
        <h2 className="text-2xl font-semibold text-gray-900">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
