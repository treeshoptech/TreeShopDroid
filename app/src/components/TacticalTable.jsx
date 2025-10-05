import './TacticalTable.css'

/**
 * TacticalTable - Military-style data table
 *
 * Props:
 * - columns: array of { key, label, width } objects
 * - data: array of row objects
 * - onRowClick: function (optional row click handler)
 */

const TacticalTable = ({
  columns = [],
  data = [],
  onRowClick,
  ...props
}) => {
  return (
    <div className="tactical-table-wrapper">
      <table className="tactical-table" {...props}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                style={{ width: col.width }}
                className="table-header"
              >
                <span className="header-bracket">[</span>
                {col.label}
                <span className="header-bracket">]</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                NO DATA AVAILABLE
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={onRowClick ? 'clickable' : ''}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="table-cell">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TacticalTable
