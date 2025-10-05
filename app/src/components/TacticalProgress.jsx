import './TacticalProgress.css'

/**
 * TacticalProgress - Military-style progress bar
 *
 * Props:
 * - value: number (0-100)
 * - label: string (optional label)
 * - showPercentage: boolean (show percentage text)
 */

const TacticalProgress = ({
  value = 0,
  label,
  showPercentage = true,
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className="tactical-progress-container" {...props}>
      {label && (
        <div className="progress-header">
          <span className="progress-label">{label}</span>
          {showPercentage && (
            <span className="progress-percentage">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className="tactical-progress">
        <div
          className="progress-bar"
          style={{ width: `${clampedValue}%` }}
        >
          <div className="progress-glow"></div>
        </div>
        <div className="progress-segments">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="segment"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TacticalProgress
