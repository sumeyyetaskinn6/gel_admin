import './admin-rbac.css'

function Card({ title, subtitle, children, className = '', padding = 'md' }) {
  const pad = padding === 'sm' ? ' arb-card--pad-sm' : padding === 'lg' ? ' arb-card--pad-lg' : ''
  return (
    <section className={`arb-card${pad} ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="arb-card__head">
          {title ? <h2 className="arb-card__title">{title}</h2> : null}
          {subtitle ? <p className="arb-card__sub">{subtitle}</p> : null}
        </header>
      )}
      <div className="arb-card__body">{children}</div>
    </section>
  )
}

export default Card
