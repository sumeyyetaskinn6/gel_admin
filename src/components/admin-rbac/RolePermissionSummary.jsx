import { RBAC_MODULES, RBAC_PERMISSION_KEYS } from '../../data/rbacMock'
import './admin-rbac.css'

function RolePermissionSummary({ permissions }) {
  return (
    <div className="arb-perm-summary" aria-label="Rol izin özeti">
      <div className="arb-perm-summary__head">
        <span>Modül</span>
        {RBAC_PERMISSION_KEYS.map((p) => (
          <span key={p.key}>{p.label}</span>
        ))}
      </div>
      {RBAC_MODULES.map((mod) => (
        <div key={mod.id} className="arb-perm-summary__row">
          <span className="arb-perm-summary__mod">{mod.label}</span>
          {RBAC_PERMISSION_KEYS.map((p) => (
            <span key={p.key} className="arb-perm-summary__cell">
              {permissions?.[mod.id]?.[p.key] ? (
                <span className="arb-perm-summary__yes" title="Açık">
                  ✓
                </span>
              ) : (
                <span className="arb-perm-summary__no" title="Kapalı">
                  —
                </span>
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default RolePermissionSummary
