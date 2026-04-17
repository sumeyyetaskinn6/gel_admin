import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_BY_ROLE, formatKayitTarihi } from '../data/userManagementMock'
import './UserManagementPage.css'

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2" />
      <path d="M20 20l-4.5-4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" stroke="#100F14" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SortChevrons() {
  return (
    <span className="um-sort" aria-hidden>
      <span className="um-sort__up" />
      <span className="um-sort__down" />
    </span>
  )
}

function Th({ children, className = '' }) {
  return (
    <th scope="col" className={`um-th ${className}`.trim()}>
      <span className="um-th__inner">
        {children}
        <SortChevrons />
      </span>
    </th>
  )
}

function Td({ children, title, className = '' }) {
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : ''
  return (
    <td className={`um-td ${className}`.trim()} title={title ?? text}>
      {children}
    </td>
  )
}

function DocumentStrip({ user, role }) {
  if (role !== 'driver' && role !== 'courier') return <Td title="—">—</Td>

  const items = [
    { url: user.licenseFrontUrl, label: 'Ehliyet ön' },
    { url: user.licenseBackUrl, label: 'Ehliyet arka' },
    { url: user.registrationFrontUrl, label: 'Ruhsat ön' },
    { url: user.registrationBackUrl, label: 'Ruhsat arka' },
    { url: user.criminalRecordUrl, label: 'Sabıka' },
  ]
  if (role === 'courier') {
    items.push({ url: user.p1DocumentUrl, label: 'P1' })
  }

  return (
    <td className="um-td um-td--docs">
      <div className="um-doc-strip">
        {items.map((doc) => (
          <a
            key={doc.label}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="um-doc-thumb"
            title={doc.label}
            aria-label={doc.label}
          >
            <img src={doc.url} alt="" width={32} height={32} />
          </a>
        ))}
      </div>
    </td>
  )
}

function UserManagementPage() {
  const navigate = useNavigate()
  const [roleTab, setRoleTab] = useState('driver')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState(() => new Set())

  const rows = useMemo(() => {
    const list = MOCK_BY_ROLE[roleTab] ?? []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return list
    return list.filter((u) => {
      const parts = [
        u.name,
        u.firstName,
        u.lastName,
        u.phone,
        u.email,
        u.gsm,
        u.iban,
        u.plate,
        u.vehicleBrand,
        u.vehicleModel,
        u.vehicleType,
        u.vehicleYear != null ? String(u.vehicleYear) : '',
        u.vehicleColor,
      ].filter(Boolean)
      const hay = parts.join(' ').toLowerCase()
      const digits = (s) => s.replace(/\D/g, '')
      return (
        hay.includes(q) ||
        digits(u.phone || '').includes(digits(q)) ||
        digits(u.gsm || '').includes(digits(q))
      )
    })
  }, [roleTab, searchQuery])

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === rows.length && rows.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)))
    }
  }

  const openDetail = (userId) => {
    navigate(`/dashboard/user-management/${roleTab}/${userId}`)
  }

  const tableClass =
    roleTab === 'passenger' ? 'um-data-table um-data-table--passenger' : roleTab === 'courier'
      ? 'um-data-table um-data-table--courier'
      : 'um-data-table um-data-table--driver'

  return (
    <section className="um-page">
      <div className="um-search-bar">
        <input
          type="search"
          className="um-search-bar__input"
          placeholder="Ad, telefon, e-posta, plaka, IBAN ara…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Kullanıcı ara"
        />
        <button type="button" className="um-search-bar__btn" aria-label="Ara">
          <SearchIcon />
        </button>
      </div>

      <nav className="um-role-tabs" aria-label="Kullanıcı tipi">
        <button
          type="button"
          className={`um-role-tabs__item${roleTab === 'driver' ? ' um-role-tabs__item--active' : ''}`}
          onClick={() => setRoleTab('driver')}
        >
          Sürücü
        </button>
        <button
          type="button"
          className={`um-role-tabs__item${roleTab === 'courier' ? ' um-role-tabs__item--active' : ''}`}
          onClick={() => setRoleTab('courier')}
        >
          Kurye
        </button>
        <button
          type="button"
          className={`um-role-tabs__item${roleTab === 'passenger' ? ' um-role-tabs__item--active' : ''}`}
          onClick={() => setRoleTab('passenger')}
        >
          Yolcu
        </button>
      </nav>

      <div className="um-table-shell">
        <header className="um-table-toolbar">
          <div className="um-table-toolbar__titles">
            <h1 className="um-table-toolbar__title">Kullanıcı Yönetimi</h1>
            <p className="um-table-toolbar__subtitle">Liste ve işlemler — tabloyu yatay kaydırarak tüm alanları görün</p>
          </div>
          <div className="um-table-toolbar__actions">
            <label className="um-field um-field--search">
              <span className="um-sr-only">Arama</span>
              <input
                type="text"
                placeholder="Arama"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
            <button type="button" className="um-field um-field--filter">
              <FilterIcon />
              Filtrele
            </button>
          </div>
        </header>

        <div className="um-table-scroll">
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className="um-th um-th--check">
                  <input
                    type="checkbox"
                    className="um-checkbox"
                    checked={rows.length > 0 && selectedIds.size === rows.length}
                    onChange={toggleAll}
                    aria-label="Tümünü seç"
                  />
                </th>
                <Th>Ad</Th>
                <Th>Soyad</Th>
                <Th>Telefon</Th>
                <Th>E-posta</Th>
                <Th>GSM</Th>
                <Th>Cinsiyet</Th>
                {roleTab === 'driver' && (
                  <>
                    <Th>IBAN</Th>
                    <Th>Marka</Th>
                    <Th>Model</Th>
                    <Th>Yıl</Th>
                    <Th>Renk</Th>
                    <Th>Plaka</Th>
                    <Th>Belgeler</Th>
                  </>
                )}
                {roleTab === 'courier' && (
                  <>
                    <Th>IBAN</Th>
                    <Th>Araç tipi</Th>
                    <Th>Marka</Th>
                    <Th>Model</Th>
                    <Th>Yıl</Th>
                    <Th>Renk</Th>
                    <Th>Belgeler</Th>
                  </>
                )}
                <Th className="um-th--date">Kayıt tarihi</Th>
                <th scope="col" className="um-th um-th--action">
                  <span className="um-th__inner um-th__inner--muted um-th__inner--nosort">İşlem</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="um-tr">
                  <td className="um-td um-td--check">
                    <input
                      type="checkbox"
                      className="um-checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      aria-label={`${row.name} seç`}
                    />
                  </td>
                  <Td>{row.firstName}</Td>
                  <Td>{row.lastName}</Td>
                  <Td>{row.phone}</Td>
                  <Td className="um-td--wide">{row.email}</Td>
                  <Td>{row.gsm}</Td>
                  <Td>{row.gender}</Td>
                  {roleTab === 'driver' && (
                    <>
                      <Td className="um-td--iban">{row.iban}</Td>
                      <Td>{row.vehicleBrand}</Td>
                      <Td>{row.vehicleModel}</Td>
                      <Td>{row.vehicleYear}</Td>
                      <Td>{row.vehicleColor}</Td>
                      <Td>{row.plate}</Td>
                      <DocumentStrip user={row} role="driver" />
                    </>
                  )}
                  {roleTab === 'courier' && (
                    <>
                      <Td className="um-td--iban">{row.iban}</Td>
                      <Td>{row.vehicleType}</Td>
                      <Td>{row.vehicleBrand}</Td>
                      <Td>{row.vehicleModel}</Td>
                      <Td>{row.vehicleYear}</Td>
                      <Td>{row.vehicleColor}</Td>
                      <DocumentStrip user={row} role="courier" />
                    </>
                  )}
                  <Td className="um-td--date">
                    <time dateTime={row.registeredAt}>{formatKayitTarihi(row.registeredAt)}</time>
                  </Td>
                  <td className="um-td um-td--action">
                    <button type="button" className="um-action-btn" onClick={() => openDetail(row.id)}>
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default UserManagementPage
