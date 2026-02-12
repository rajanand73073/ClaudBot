export function Button({ label }: { label: string }) {
  return (
    <button className="px-4 py-2 bg-black text-white rounded">
      {label}
    </button>
  )
}
