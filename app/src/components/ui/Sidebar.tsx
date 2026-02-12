export function Sidebar({ items }: { items: string[] }) {
  return (
    <aside className="bg-white shadow p-4 w-48">
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm">
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}
