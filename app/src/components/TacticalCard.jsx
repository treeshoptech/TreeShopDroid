import './TacticalCard.css'

/**
 * TacticalCard - Military-style content container
 *
 * Variants:
 * - info: Standard information card (default)
 * - stat: Metric display with large numbers
 * - alert: Warning/alert notification
 *
 * Props:
 * - variant: 'info' | 'stat' | 'alert'
 * - children: card content
 */

const TacticalCard = ({
  variant = 'info',
  children,
  ...props
}) => {
  return (
    <div
      className={`tactical-card tactical-card-${variant}`}
      {...props}
    >
      <div className="card-corner top-left"></div>
      <div className="card-corner top-right"></div>
      <div className="card-corner bottom-left"></div>
      <div className="card-corner bottom-right"></div>
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}

export default TacticalCard
