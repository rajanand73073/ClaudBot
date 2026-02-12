export function Grid({
  columns,
  children
}: {
  columns: number
  children: React.ReactNode
}) {
  return (
    <div
      className="grid gap-8"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {children}
    </div>
  )
}
