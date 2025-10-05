import './TacticalDivider.css'

/**
 * TacticalDivider - Military-style section separator
 *
 * Props:
 * - label: string (optional label in the middle)
 * - variant: 'solid' | 'dashed' | 'dotted'
 */

const TacticalDivider = ({
  label,
  variant = 'solid',
  ...props
}) => {
  return (
    <div className={`tactical-divider divider-${variant}`} {...props}>
      {label ? (
        <>
          <div className="divider-line"></div>
          <span className="divider-label">
            <span className="label-bracket">[</span>
            {label}
            <span className="label-bracket">]</span>
          </span>
          <div className="divider-line"></div>
        </>
      ) : (
        <div className="divider-line full"></div>
      )}
    </div>
  )
}

export default TacticalDivider
