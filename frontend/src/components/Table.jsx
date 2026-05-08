export default function Table({ columns, data, emptyMessage }) {
  return (
    <div className="w-full">
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-slate-600">
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {data.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-400 shadow-card">
            {emptyMessage}
          </div>
        ) : (
          data.map((row) => (
            <div key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="space-y-3">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-4">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {column.label}
                    </span>
                    <span className="text-sm text-slate-700 text-right">{column.render(row)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
