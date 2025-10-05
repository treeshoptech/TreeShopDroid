import './TacticalCheckbox.css'

/**
 * TacticalCheckbox - Military-style checkbox
 *
 * Props:
 * - label: string (checkbox label)
 * - checked: boolean
 * - onChange: function
 * - disabled: boolean
 */

const TacticalCheckbox = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  ...props
}) => {
  return (
    <label className={`tactical-checkbox ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <span className="checkbox-box">
        <span className="checkbox-check">{checked ? '✓' : ''}</span>
      </span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  )
}

export default TacticalCheckbox
