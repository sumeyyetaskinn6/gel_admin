import './admin-rbac.css'

function SimpleTable({ columns, children }) {
  return (
    <div className="arb-table-wrap">
      <table className="arb-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={[col.align === 'right' ? 'arb-table__th--right' : '', col.className || '']
                  .filter(Boolean)
                  .join(' ')}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export default SimpleTable
