import './TacticalBreadcrumbs.css'

/**
 * TacticalBreadcrumbs - Military-style navigation trail
 *
 * Props:
 * - items: array of { label, href, onClick } objects
 * - separator: string (default: '>')
 */

const TacticalBreadcrumbs = ({
  items = [],
  separator = '>',
  ...props
}) => {
  const handleClick = (item, index) => {
    if (item.onClick) {
      item.onClick(item, index)
    }
  }

  return (
    <nav className="tactical-breadcrumbs" {...props}>
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item-wrapper">
          {item.href || item.onClick ? (
            <a
              href={item.href || '#'}
              className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault()
                  handleClick(item, index)
                }
              }}
            >
              {item.label}
            </a>
          ) : (
            <span className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="breadcrumb-separator">{separator}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export default TacticalBreadcrumbs
