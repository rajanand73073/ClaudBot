export function Sidebar({ items }: { items: string[] }) {
  return (
    <aside className="w-64 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-gray-800 font-medium hover:text-pink-600 transition cursor-pointer"
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}
