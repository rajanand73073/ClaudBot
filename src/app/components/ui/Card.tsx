export function Card({
  title,
  content
}: {
  title: string
  content: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-700 leading-relaxed">
        {content}
      </p>
    </div>
  )
}
