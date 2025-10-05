import './TacticalRadio.css'

/**
 * TacticalRadio - Military-style radio button
 *
 * Props:
 * - label: string (radio label)
 * - name: string (radio group name)
 * - value: string
 * - checked: boolean
 * - onChange: function
 * - disabled: boolean
 */

const TacticalRadio = ({
  label,
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  ...props
}) => {
  return (
    <label className={`tactical-radio ${disabled ? 'disabled' : ''}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <span className="radio-circle">
        <span className="radio-dot"></span>
      </span>
      {label && <span className="radio-label">{label}</span>}
    </label>
  )
}

export default TacticalRadio
