import './TacticalSpinner.css'

/**
 * TacticalSpinner - Military-style loading spinner
 *
 * Sizes:
 * - small: 24px
 * - medium: 40px (default)
 * - large: 64px
 *
 * Props:
 * - size: 'small' | 'medium' | 'large'
 * - label: string (optional loading text)
 */

const TacticalSpinner = ({
  size = 'medium',
  label,
  ...props
}) => {
  return (
    <div className={`tactical-spinner-container spinner-${size}`} {...props}>
      <div className="tactical-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-core"></div>
      </div>
      {label && <div className="spinner-label">{label}</div>}
    </div>
  )
}

export default TacticalSpinner
