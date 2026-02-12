export function Navbar({ title }: { title: string }) {
  return (
    <nav className="bg-white shadow px-4 py-3 mb-6">
      <h1 className="text-lg font-bold">{title}</h1>
    </nav>
  )
}

