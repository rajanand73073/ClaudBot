export function Modal({
  title,
  content
}: {
  title: string
  content: string
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96 ">
        <h3 className="font-semibold mb-2 text-black">{title}</h3>
        <p className="text-sm text-black">{content}</p>
      </div>
    </div>
  )
}
