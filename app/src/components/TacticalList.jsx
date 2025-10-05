import './TacticalList.css'

/**
 * TacticalList - Military-style list component
 *
 * Props:
 * - items: array of strings or objects with { label, value }
 * - ordered: boolean (true for ordered list, false for unordered)
 * - onItemClick: function (optional item click handler)
 */

const TacticalList = ({
  items = [],
  ordered = false,
  onItemClick,
  ...props
}) => {
  const ListTag = ordered ? 'ol' : 'ul'

  return (
    <ListTag className={`tactical-list ${ordered ? 'ordered' : 'unordered'}`} {...props}>
      {items.map((item, index) => {
        const displayText = typeof item === 'string' ? item : item.label
        const itemValue = typeof item === 'string' ? item : item.value

        return (
          <li
            key={index}
            className={`list-item ${onItemClick ? 'clickable' : ''}`}
            onClick={() => onItemClick && onItemClick(itemValue || displayText)}
          >
            <span className="item-marker">
              {ordered ? `${index + 1}.` : '▸'}
            </span>
            <span className="item-content">{displayText}</span>
          </li>
        )
      })}
    </ListTag>
  )
}

export default TacticalList
