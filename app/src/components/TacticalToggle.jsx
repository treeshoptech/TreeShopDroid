import './TacticalToggle.css'

/**
 * TacticalToggle - Military-style toggle switch
 *
 * Props:
 * - label: string (toggle label)
 * - checked: boolean
 * - onChange: function
 * - disabled: boolean
 */

const TacticalToggle = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  ...props
}) => {
  return (
    <label className={`tactical-toggle ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="toggle-indicator">{checked ? 'ON' : 'OFF'}</span>
        </div>
      </div>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  )
}

export default TacticalToggle
