import { RBAC_MODULES, RBAC_PERMISSION_KEYS } from '../../data/rbacMock'
import ToggleSwitch from './ToggleSwitch'
import './admin-rbac.css'

function PermissionGrid({ permissions, onChange }) {
  const setPerm = (moduleId, key, value) => {
    onChange?.({
      ...permissions,
      [moduleId]: {
        ...permissions[moduleId],
        [key]: value,
      },
    })
  }

  return (
    <div className="arb-perm-grid" role="group" aria-label="İzinleri ve modülleri seçin">
      <div className="arb-perm-grid__head">
        <span className="arb-perm-grid__corner">Modül</span>
        {RBAC_PERMISSION_KEYS.map((p) => (
          <span key={p.key} className="arb-perm-grid__col-label">
            {p.label}
          </span>
        ))}
      </div>
      {RBAC_MODULES.map((mod) => (
        <div key={mod.id} className="arb-perm-grid__row">
          <div className="arb-perm-grid__module">{mod.label}</div>
          {RBAC_PERMISSION_KEYS.map((p) => (
            <div key={p.key} className="arb-perm-grid__cell">
              <ToggleSwitch
                id={`perm-${mod.id}-${p.key}`}
                compact
                checked={!!permissions[mod.id]?.[p.key]}
                onChange={(v) => setPerm(mod.id, p.key, v)}
                aria-label={`${mod.label} — ${p.label}`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default PermissionGrid
