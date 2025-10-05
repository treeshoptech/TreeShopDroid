import { useState, useRef, useEffect } from 'react'
import './TacticalDropdown.css'

/**
 * TacticalDropdown - Military-style dropdown menu
 *
 * Props:
 * - trigger: ReactNode (button/element that opens dropdown)
 * - items: array of { label, value, onClick } objects
 */

const TacticalDropdown = ({
  trigger,
  items = [],
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick(item.value)
    }
    setIsOpen(false)
  }

  return (
    <div className="tactical-dropdown" ref={dropdownRef} {...props}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item, index) => (
            <button
              key={index}
              className="dropdown-item"
              onClick={() => handleItemClick(item)}
            >
              <span className="item-bullet">▸</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TacticalDropdown
