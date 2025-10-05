import './TacticalPagination.css'

/**
 * TacticalPagination - Military-style pagination
 *
 * Props:
 * - currentPage: number
 * - totalPages: number
 * - onPageChange: function
 * - maxVisible: number (max page buttons to show, default 5)
 */

const TacticalPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisible = 5,
  ...props
}) => {
  const getPageNumbers = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisible / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="tactical-pagination" {...props}>
      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀ PREV
      </button>

      {pages[0] > 1 && (
        <>
          <button
            className="page-btn"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {pages[0] > 2 && <span className="page-ellipsis">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`page-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="page-ellipsis">...</span>
          )}
          <button
            className="page-btn"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        NEXT ▶
      </button>
    </div>
  )
}

export default TacticalPagination
