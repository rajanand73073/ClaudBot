export function Table({
  headers,
  rows
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="border px-2 py-1 text-left text-sm text-black">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="border px-2 py-1 text-sm text-black">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
