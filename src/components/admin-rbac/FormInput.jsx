import './admin-rbac.css'

function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  className = '',
  multiline,
  rows = 4,
  ...rest
}) {
  const inputId = id || (label ? `field-${String(label).replace(/\s+/g, '-').toLowerCase()}` : undefined)

  return (
    <label className={`arb-form-field ${className}`.trim()} htmlFor={inputId}>
      {label ? <span className="arb-form-field__label">{label}</span> : null}
      {multiline ? (
        <textarea
          id={inputId}
          className="arb-form-field__control arb-form-field__control--textarea"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          {...rest}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          className="arb-form-field__control"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...rest}
        />
      )}
    </label>
  )
}

export default FormInput
