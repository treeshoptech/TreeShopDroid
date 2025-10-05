import './TacticalBadge.css'

/**
 * TacticalBadge - Military-style status indicator
 *
 * Variants:
 * - status: Workflow stage badges (lead, proposal, workorder, invoice, completed)
 * - count: Numerical indicator badge
 * - priority: Task priority badges (low, medium, high, critical)
 *
 * Props:
 * - variant: 'count' (for numerical badges)
 * - status: 'lead' | 'proposal' | 'workorder' | 'invoice' | 'completed'
 * - priority: 'low' | 'medium' | 'high' | 'critical'
 * - children: badge content
 */

const TacticalBadge = ({
  variant,
  status,
  priority,
  children,
  ...props
}) => {
  // Determine the class name based on props
  let className = 'tactical-badge'

  if (variant === 'count') {
    className += ' tactical-badge-count'
  } else if (status) {
    className += ` tactical-badge-status status-${status}`
  } else if (priority) {
    className += ` tactical-badge-priority priority-${priority}`
  }

  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}

export default TacticalBadge
