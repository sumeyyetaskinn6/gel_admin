/** Modül kimlikleri ve Türkçe etiketler */
export const RBAC_MODULES = [
  { id: 'dashboard', label: 'Kontrol Paneli' },
  { id: 'users', label: 'Kullanıcılar' },
  { id: 'orders', label: 'Siparişler' },
  { id: 'reports', label: 'Raporlar' },
  { id: 'settings', label: 'Ayarlar' },
  { id: 'notifications', label: 'Bildirimler' },
]

/** İzin anahtarları ve Türkçe etiketler */
export const RBAC_PERMISSION_KEYS = [
  { key: 'view', label: 'Görüntüle' },
  { key: 'create', label: 'Oluştur' },
  { key: 'edit', label: 'Düzenle' },
  { key: 'delete', label: 'Sil' },
]

export function emptyPermissions() {
  return RBAC_MODULES.reduce((acc, m) => {
    acc[m.id] = { view: false, create: false, edit: false, delete: false }
    return acc
  }, {})
}

export function fullPermissions() {
  return RBAC_MODULES.reduce((acc, m) => {
    acc[m.id] = { view: true, create: true, edit: true, delete: true }
    return acc
  }, {})
}

const adminPerms = fullPermissions()
const editorPerms = {
  ...emptyPermissions(),
  dashboard: { view: true, create: false, edit: false, delete: false },
  users: { view: true, create: true, edit: true, delete: false },
  orders: { view: true, create: true, edit: true, delete: false },
  reports: { view: true, create: false, edit: false, delete: false },
  settings: { view: false, create: false, edit: false, delete: false },
  notifications: { view: true, create: true, edit: true, delete: false },
}
const supportPerms = {
  ...emptyPermissions(),
  dashboard: { view: true, create: false, edit: false, delete: false },
  users: { view: true, create: false, edit: false, delete: false },
  orders: { view: true, create: false, edit: true, delete: false },
  reports: { view: true, create: false, edit: false, delete: false },
  settings: { view: false, create: false, edit: false, delete: false },
  notifications: { view: true, create: false, edit: false, delete: false },
}

export const INITIAL_ROLES = [
  { id: 'role-admin', name: 'Yönetici', permissions: adminPerms },
  { id: 'role-editor', name: 'Editör', permissions: editorPerms },
  { id: 'role-support', name: 'Destek', permissions: supportPerms },
]

export const INITIAL_AUTH_USERS = [
  {
    id: 'au-1',
    username: 'ayse.demir',
    password: '••••••••',
    roleId: 'role-editor',
    active: true,
  },
  {
    id: 'au-2',
    username: 'mehmet.kaya',
    password: '••••••••',
    roleId: 'role-support',
    active: true,
  },
  {
    id: 'au-3',
    username: 'zeynep.arslan',
    password: '••••••••',
    roleId: 'role-admin',
    active: false,
  },
]

export function newRoleId() {
  return `role-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function newAuthUserId() {
  return `au-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
