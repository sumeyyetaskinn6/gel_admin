import './AdminProfilePage.css'

const ADMIN_PROFILE = {
  fullName: 'Ümit Cengiz Aktoprak',
  role: 'Sistem Yöneticisi',
  email: 'umit.aktoprak@geladmin.com',
  phone: '+90 532 000 00 00',
  gsm: '+90 532 000 00 00',
  department: 'Operasyon ve Yönetim',
 
}

function AdminProfilePage() {
  return (
    <section className="ap-page">
      <header className="ap-head">
        <h1 className="ap-title">Admin Profili</h1>
        <p className="ap-sub">Hesap bilgileri ve yönetim detayları</p>
      </header>

      <article className="ap-card">
        <div className="ap-identity">
          <div className="ap-avatar" aria-hidden>
            {ADMIN_PROFILE.fullName
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="ap-name">{ADMIN_PROFILE.fullName}</p>
            <span className="ap-role">{ADMIN_PROFILE.role}</span>
          </div>
        </div>

        <dl className="ap-grid">
          <dt>E-posta</dt>
          <dd>{ADMIN_PROFILE.email}</dd>

          <dt>Telefon</dt>
          <dd>{ADMIN_PROFILE.phone}</dd>

          <dt>GSM</dt>
          <dd>{ADMIN_PROFILE.gsm}</dd>

          <dt>Departman</dt>
          <dd>{ADMIN_PROFILE.department}</dd>

         
          <dd>{ADMIN_PROFILE.lastLogin}</dd>
        </dl>
      </article>
    </section>
  )
}

export default AdminProfilePage
