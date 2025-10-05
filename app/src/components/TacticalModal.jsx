import './TacticalModal.css'

/**
 * TacticalModal - Military-style modal dialog
 *
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - title: string
 * - children: modal content
 */

const TacticalModal = ({
  isOpen = false,
  onClose,
  title,
  children,
  ...props
}) => {
  if (!isOpen) return null

  return (
    <div className="tactical-modal-overlay" onClick={onClose}>
      <div className="tactical-modal" onClick={(e) => e.stopPropagation()} {...props}>
        <div className="modal-header">
          <h3 className="modal-title">
            <span className="title-bracket">[</span>
            {title}
            <span className="title-bracket">]</span>
          </h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-corner top-left"></div>
        <div className="modal-corner top-right"></div>
        <div className="modal-corner bottom-left"></div>
        <div className="modal-corner bottom-right"></div>
      </div>
    </div>
  )
}

export default TacticalModal
