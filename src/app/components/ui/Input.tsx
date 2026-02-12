export function Input({
  placeholder
}: {
  placeholder: string
}) {
  return (
    <input
      placeholder={placeholder}
      className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
    />
  )
}
