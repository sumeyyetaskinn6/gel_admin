import { useId } from 'react'
import './admin-rbac.css'

function ToggleSwitch({
  checked,
  onChange,
  id,
  label,
  disabled,
  compact,
  'aria-label': ariaLabel,
}) {
  const uid = useId()
  const switchId = id || uid

  return (
    <div
      className={`arb-toggle${disabled ? ' arb-toggle--disabled' : ''}${compact ? ' arb-toggle--compact' : ''}`}
    >
      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label || 'Anahtar'}
        disabled={disabled}
        className={`arb-toggle__btn${checked ? ' arb-toggle__btn--on' : ''}`}
        onClick={() => !disabled && onChange?.(!checked)}
      />
      {label ? <span className="arb-toggle__text">{label}</span> : null}
    </div>
  )
}

export default ToggleSwitch
