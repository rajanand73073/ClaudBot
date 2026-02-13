export function Navbar({ title }: { title: string }) {
  return (
    <nav className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <h1 className="text-lg font-bold text-black">{title}</h1>
    </nav>
  )
}

