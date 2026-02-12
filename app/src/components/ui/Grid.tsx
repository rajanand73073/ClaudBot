export function Grid({
  columns,
  children
}: {
  columns: number
  children?: React.ReactNode
}) {
  return (
    <div
      className={`grid gap-4`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  )
}
