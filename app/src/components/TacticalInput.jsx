import './TacticalInput.css'

/**
 * TacticalInput - Military-style form input
 *
 * Types:
 * - text: Standard text input
 * - textarea: Multi-line text
 * - select: Dropdown selection
 *
 * Props:
 * - label: string (field label)
 * - type: 'text' | 'textarea' | 'select'
 * - placeholder: string
 * - value: string
 * - onChange: function
 * - disabled: boolean
 * - options: array (for select type)
 * - rows: number (for textarea)
 */

const TacticalInput = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  options = [],
  rows = 3,
  ...props
}) => {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            className="tactical-field tactical-textarea"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={rows}
            {...props}
          />
        )

      case 'select':
        return (
          <select
            className="tactical-field tactical-select"
            value={value}
            onChange={onChange}
            disabled={disabled}
            {...props}
          >
            <option value="">SELECT OPTION</option>
            {options.map((opt, index) => (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      default:
        return (
          <input
            type="text"
            className="tactical-field tactical-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            {...props}
          />
        )
    }
  }

  return (
    <div className="tactical-input-group">
      {label && (
        <label className="tactical-label">
          <span className="label-bracket">{'['}</span>
          {label}
          <span className="label-bracket">{']'}</span>
        </label>
      )}
      <div className="tactical-field-wrapper">
        {renderInput()}
        <div className="field-corner"></div>
      </div>
    </div>
  )
}

export default TacticalInput
