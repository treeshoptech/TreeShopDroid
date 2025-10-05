import './TacticalButton.css'

/**
 * TacticalButton - Military-style action button
 *
 * Variants:
 * - primary: Main action button (green accent)
 * - secondary: Alternative action (outlined)
 * - icon: Compact icon-only button
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'icon'
 * - disabled: boolean
 * - onClick: function
 * - children: button content
 */

const TacticalButton = ({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
  ...props
}) => {
  return (
    <button
      className={`tactical-btn tactical-btn-${variant} ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {variant !== 'icon' && <span className="btn-bracket">[</span>}
      <span className="btn-content">{children}</span>
      {variant !== 'icon' && <span className="btn-bracket">]</span>}
    </button>
  )
}

export default TacticalButton
