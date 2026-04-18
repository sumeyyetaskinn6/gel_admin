import { useCallback, useMemo, useState } from 'react'
import Card from '../components/admin-rbac/Card'
import FormInput from '../components/admin-rbac/FormInput'
import Modal from '../components/admin-rbac/Modal'
import PermissionGrid from '../components/admin-rbac/PermissionGrid'
import RolePermissionSummary from '../components/admin-rbac/RolePermissionSummary'
import SimpleTable from '../components/admin-rbac/SimpleTable'
import Toast from '../components/admin-rbac/Toast'
import ToggleSwitch from '../components/admin-rbac/ToggleSwitch'
import {
  emptyPermissions,
  INITIAL_AUTH_USERS,
  INITIAL_ROLES,
  newAuthUserId,
  newRoleId,
} from '../data/rbacMock'
import './AdminProfilePage.css'

const ADMIN_PROFILE = {
  fullName: 'Ümit Cengiz Aktoprak',
  role: 'Sistem Yöneticisi',
  email: 'umit.aktoprak@geladmin.com',
  phone: '+90 532 000 00 00',
  gsm: '+90 532 000 00 00',
  department: 'Operasyon ve Yönetim',
  lastLogin: '17.04.2026 — 09:42',
}

function clonePerms(perms) {
  return JSON.parse(JSON.stringify(perms))
}

function AdminProfilePage() {
  const [subNav, setSubNav] = useState('roles')
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [authUsers, setAuthUsers] = useState(INITIAL_AUTH_USERS)
  const [selectedRoleId, setSelectedRoleId] = useState(INITIAL_ROLES[0]?.id ?? null)

  const [toast, setToast] = useState(null)
  const pushToast = useCallback((message, variant = 'success') => {
    setToast({ message, variant })
  }, [])

  const [roleModal, setRoleModal] = useState(null)
  const [userModal, setUserModal] = useState(null)

  const selectedRole = useMemo(() => roles.find((r) => r.id === selectedRoleId) ?? null, [roles, selectedRoleId])

  const roleNameById = useMemo(() => {
    const m = {}
    roles.forEach((r) => {
      m[r.id] = r.name
    })
    return m
  }, [roles])

  const openCreateRole = () => {
    setRoleModal({ mode: 'create', name: '', permissions: emptyPermissions() })
  }

  const openEditRole = (role) => {
    setRoleModal({
      mode: 'edit',
      id: role.id,
      name: role.name,
      permissions: clonePerms(role.permissions),
    })
  }

  const cancelRoleModal = () => setRoleModal(null)

  const saveRoleModal = () => {
    if (!roleModal) return
    const name = roleModal.name.trim()
    if (!name) {
      pushToast('Rol adı zorunludur.', 'error')
      return
    }
    if (roleModal.mode === 'create') {
      const id = newRoleId()
      setRoles((prev) => [...prev, { id, name, permissions: clonePerms(roleModal.permissions) }])
      setSelectedRoleId(id)
      pushToast('Rol oluşturuldu.')
    } else {
      setRoles((prev) =>
        prev.map((r) => (r.id === roleModal.id ? { ...r, name, permissions: clonePerms(roleModal.permissions) } : r)),
      )
      pushToast('Rol güncellendi.')
    }
    setRoleModal(null)
  }

  const deleteRole = (role) => {
    const inUse = authUsers.some((u) => u.roleId === role.id)
    if (inUse) {
      pushToast('Bu role atanmış kullanıcılar var; önce kullanıcıları güncelleyin.', 'error')
      return
    }
    if (!window.confirm(`“${role.name}” rolünü silmek istediğinize emin misiniz?`)) return
    const nextList = roles.filter((r) => r.id !== role.id)
    setRoles(nextList)
    if (selectedRoleId === role.id) {
      setSelectedRoleId(nextList[0]?.id ?? null)
    }
    pushToast('Rol silindi.')
  }

  const openCreateUser = () => {
    const defaultRole = roles[0]?.id ?? ''
    setUserModal({
      mode: 'create',
      username: '',
      password: '',
      roleId: defaultRole,
      active: true,
    })
  }

  const openEditUser = (u) => {
    setUserModal({
      mode: 'edit',
      id: u.id,
      username: u.username,
      password: '',
      roleId: u.roleId,
      active: u.active,
    })
  }

  const cancelUserModal = () => setUserModal(null)

  const saveUserModal = () => {
    if (!userModal) return
    const username = userModal.username.trim()
    if (!username) {
      pushToast('Kullanıcı adı zorunludur.', 'error')
      return
    }
    if (!userModal.roleId) {
      pushToast('Bir rol seçin.', 'error')
      return
    }
    if (userModal.mode === 'create') {
      if (!userModal.password.trim()) {
        pushToast('Şifre zorunludur.', 'error')
        return
      }
      setAuthUsers((prev) => [
        ...prev,
        {
          id: newAuthUserId(),
          username,
          password: userModal.password,
          roleId: userModal.roleId,
          active: userModal.active,
        },
      ])
      pushToast('Kullanıcı oluşturuldu.')
    } else {
      setAuthUsers((prev) =>
        prev.map((row) => {
          if (row.id !== userModal.id) return row
          const next = {
            ...row,
            username,
            roleId: userModal.roleId,
            active: userModal.active,
          }
          if (userModal.password.trim()) next.password = userModal.password
          return next
        }),
      )
      pushToast('Kullanıcı güncellendi.')
    }
    setUserModal(null)
  }

  const userColumns = [
    { key: 'u', header: 'Kullanıcı adı' },
    { key: 'r', header: 'Atanan rol' },
    { key: 's', header: 'Durum', width: 120 },
    { key: 'a', header: 'İşlemler', align: 'right', width: 120 },
  ]

  return (
    <section className="ap-page">
      {toast ? (
        <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
      ) : null}

      <header className="ap-head">
        <h1 className="ap-title">Yönetici profili</h1>
        <p className="ap-sub">Rol ve yetkilendirme yönetimi; hesap özeti aşağıda yer alır.</p>
      </header>

      <article className="ap-strip" aria-label="Yönetici özeti">
        <div className="ap-strip__avatar" aria-hidden>
          {ADMIN_PROFILE.fullName
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="ap-strip__main">
          <p className="ap-strip__name">{ADMIN_PROFILE.fullName}</p>
          <p className="ap-strip__meta">
            <span>{ADMIN_PROFILE.role}</span>
            <span className="ap-strip__dot" aria-hidden>
              ·
            </span>
            <span>{ADMIN_PROFILE.email}</span>
            <span className="ap-strip__dot" aria-hidden>
              ·
            </span>
            <span>Son oturum: {ADMIN_PROFILE.lastLogin}</span>
          </p>
        </div>
        <dl className="ap-strip__dl">
          <div>
            <dt>Telefon</dt>
            <dd>{ADMIN_PROFILE.phone}</dd>
          </div>
          <div>
            <dt>GSM</dt>
            <dd>{ADMIN_PROFILE.gsm}</dd>
          </div>
          <div>
            <dt>Departman</dt>
            <dd>{ADMIN_PROFILE.department}</dd>
          </div>
        </dl>
      </article>

      <div className="ap-layout">
        <nav className="ap-subnav" aria-label="Rol ve yetkilendirme">
          <p className="ap-subnav__label">Yönetici profili</p>
          <button
            type="button"
            className={`ap-subnav__link${subNav === 'roles' ? ' ap-subnav__link--active' : ''}`}
            onClick={() => setSubNav('roles')}
          >
            Rol yönetimi
          </button>
          <button
            type="button"
            className={`ap-subnav__link${subNav === 'users' ? ' ap-subnav__link--active' : ''}`}
            onClick={() => setSubNav('users')}
          >
            Kullanıcı yetkilendirmesi
          </button>
        </nav>

        <div className="ap-content">
          {subNav === 'roles' && (
            <div className="ap-stack">
              <div className="ap-split">
                <Card title="Rol yönetimi" subtitle="Rolleri tanımlayın ve modül izinlerini yapılandırın." padding="sm">
                  <button type="button" className="ap-btn ap-btn--primary ap-btn--block" onClick={openCreateRole}>
                    Yeni rol oluştur
                  </button>
                  <ul className="ap-role-list" role="list">
                    {roles.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          className={`ap-role-row${selectedRoleId === r.id ? ' ap-role-row--active' : ''}`}
                          onClick={() => setSelectedRoleId(r.id)}
                        >
                          <span className="ap-role-row__name">{r.name}</span>
                          <span className="ap-role-row__hint">İzinleri gör</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card
                  title="Seçili rol"
                  subtitle={selectedRole ? selectedRole.name : 'Soldan bir rol seçin'}
                  padding="sm"
                >
                  {selectedRole ? (
                    <>
                      <RolePermissionSummary permissions={selectedRole.permissions} />
                      <div className="ap-inline-actions">
                        <button type="button" className="ap-btn ap-btn--ghost" onClick={() => openEditRole(selectedRole)}>
                          Düzenle
                        </button>
                        <button
                          type="button"
                          className="ap-btn ap-btn--danger-ghost"
                          onClick={() => deleteRole(selectedRole)}
                        >
                          Sil
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="ap-muted">Liste boş veya seçim yok.</p>
                  )}
                </Card>
              </div>
            </div>
          )}

          {subNav === 'users' && (
            <Card title="Kullanıcı yetkilendirmesi" subtitle="Panel erişimi olan hesapları yönetin." padding="sm">
              <div className="ap-card-toolbar">
                <button type="button" className="ap-btn ap-btn--primary" onClick={openCreateUser}>
                  Yeni kullanıcı oluştur
                </button>
              </div>
              <SimpleTable columns={userColumns}>
                {authUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="ap-table-empty">
                      Henüz yetkili kullanıcı yok.
                    </td>
                  </tr>
                ) : (
                  authUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="ap-mono">{u.username}</td>
                      <td>{roleNameById[u.roleId] ?? '—'}</td>
                      <td>
                        <span className={`ap-pill${u.active ? ' ap-pill--on' : ' ap-pill--off'}`}>
                          {u.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="arb-table__th--right">
                        <button type="button" className="ap-text-btn" onClick={() => openEditUser(u)}>
                          Düzenle
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </SimpleTable>
            </Card>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!roleModal}
        onClose={cancelRoleModal}
        title={roleModal?.mode === 'edit' ? 'Rolü düzenle' : 'Yeni rol oluştur'}
        footer={
          <>
            <button type="button" className="arb-btn arb-btn--ghost" onClick={cancelRoleModal}>
              İptal
            </button>
            <button type="button" className="arb-btn arb-btn--primary" onClick={saveRoleModal}>
              Rolü kaydet
            </button>
          </>
        }
      >
        {roleModal ? (
          <>
            <FormInput
              label="Rol adı"
              value={roleModal.name}
              onChange={(e) => setRoleModal({ ...roleModal, name: e.target.value })}
              placeholder="Örn. Editör"
            />
            <p className="ap-section-label">İzinleri / modülleri seçin</p>
            <PermissionGrid
              permissions={roleModal.permissions}
              onChange={(next) => setRoleModal({ ...roleModal, permissions: next })}
            />
          </>
        ) : null}
      </Modal>

      <Modal
        isOpen={!!userModal}
        onClose={cancelUserModal}
        title={userModal?.mode === 'edit' ? 'Kullanıcıyı düzenle' : 'Yeni kullanıcı oluştur'}
        footer={
          <>
            <button type="button" className="arb-btn arb-btn--ghost" onClick={cancelUserModal}>
              İptal
            </button>
            <button type="button" className="arb-btn arb-btn--primary" onClick={saveUserModal}>
              Kullanıcıyı kaydet
            </button>
          </>
        }
      >
        {userModal ? (
          <>
            <FormInput
              label="Kullanıcı adı"
              value={userModal.username}
              onChange={(e) => setUserModal({ ...userModal, username: e.target.value })}
              placeholder="ornek.kullanici"
              autoComplete="username"
            />
            <FormInput
              label={userModal.mode === 'edit' ? 'Şifre (isteğe bağlı)' : 'Şifre'}
              type="password"
              value={userModal.password}
              onChange={(e) => setUserModal({ ...userModal, password: e.target.value })}
              placeholder={userModal.mode === 'edit' ? 'Değiştirmek için doldurun' : '••••••••'}
              autoComplete="new-password"
            />
            <label className="arb-form-field">
              <span className="arb-form-field__label">Rol</span>
              <select
                className="arb-form-field__control"
                value={userModal.roleId}
                onChange={(e) => setUserModal({ ...userModal, roleId: e.target.value })}
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="ap-user-active-row">
              <ToggleSwitch
                label="Hesap aktif"
                checked={userModal.active}
                onChange={(v) => setUserModal({ ...userModal, active: v })}
              />
            </div>
          </>
        ) : null}
      </Modal>
    </section>
  )
}

export default AdminProfilePage
