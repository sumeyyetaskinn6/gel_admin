import { useEffect, useId } from 'react'
import './admin-rbac.css'

function Modal({ title, isOpen, onClose, children, footer }) {
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="arb-modal-root" role="presentation">
      <button type="button" className="arb-modal-backdrop" aria-label="Kapat" onClick={onClose} />
      <div className="arb-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="arb-modal__head">
          <h2 id={titleId} className="arb-modal__title">
            {title}
          </h2>
          <button type="button" className="arb-modal__close" onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </header>
        <div className="arb-modal__body">{children}</div>
        {footer ? <footer className="arb-modal__foot">{footer}</footer> : null}
      </div>
    </div>
  )
}

export default Modal
