import { useState } from 'react'
import './TacticalAccordion.css'

/**
 * TacticalAccordion - Military-style collapsible sections
 *
 * Props:
 * - items: array of { title, content } objects
 * - allowMultiple: boolean (allow multiple sections open)
 */

const TacticalAccordion = ({
  items = [],
  allowMultiple = false,
  ...props
}) => {
  const [openIndexes, setOpenIndexes] = useState([])

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenIndexes(prev =>
        prev.includes(index) ? [] : [index]
      )
    }
  }

  return (
    <div className="tactical-accordion" {...props}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index)

        return (
          <div key={index} className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button
              className="accordion-header"
              onClick={() => toggleItem(index)}
            >
              <span className="header-icon">{isOpen ? '▼' : '▶'}</span>
              <span className="header-title">
                <span className="title-bracket">[</span>
                {item.title}
                <span className="title-bracket">]</span>
              </span>
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
              <div className="content-inner">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TacticalAccordion
