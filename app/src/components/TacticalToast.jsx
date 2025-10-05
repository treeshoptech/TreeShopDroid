import { useEffect } from 'react'
import './TacticalToast.css'

/**
 * TacticalToast - Military-style notification toast
 *
 * Types:
 * - success: Success message (green)
 * - error: Error message (red)
 * - warning: Warning message (amber)
 * - info: Information message (blue)
 *
 * Props:
 * - type: 'success' | 'error' | 'warning' | 'info'
 * - message: string
 * - isVisible: boolean
 * - onClose: function
 * - duration: number (ms, default 3000)
 */

const TacticalToast = ({
  type = 'info',
  message,
  isVisible = false,
  onClose,
  duration = 3000,
  ...props
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`tactical-toast toast-${type}`} {...props}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  )
}

export default TacticalToast
