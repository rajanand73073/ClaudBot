export function Card({
  title,
  content
}: {
  title: string
  content: string
}) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm">{content}</p>
    </div>
  )
}
