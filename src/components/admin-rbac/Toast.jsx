import { useEffect } from 'react'
import './admin-rbac.css'

function Toast({ message, variant = 'success', onDismiss }) {
  useEffect(() => {
    if (!message) return
    const t = window.setTimeout(() => onDismiss?.(), 3800)
    return () => window.clearTimeout(t)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className={`arb-toast arb-toast--${variant}`} role="status">
      <span className="arb-toast__msg">{message}</span>
      <button type="button" className="arb-toast__dismiss" onClick={onDismiss} aria-label="Kapat">
        ×
      </button>
    </div>
  )
}

export default Toast
