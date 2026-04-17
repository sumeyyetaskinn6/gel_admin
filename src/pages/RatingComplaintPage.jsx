import { useMemo, useState, useEffect } from 'react'
import './RatingComplaintPage.css'

const IMG_PASSENGER = '/passenger.jpg'
const IMG_DRIVER = '/carrr.png'
const IMG_COURIER = '/bike.png'

function providerRoleImageSrc(role) {
  return role === 'driver' ? IMG_DRIVER : IMG_COURIER
}

const MOCK_ROWS = [
  {
    id: 'rc1',
    user: { name: 'Ayşe Yıldız', phone: '+90 551 111 2233', publicId: 'USR-1042' },
    provider: { name: 'Ahmet Yılmaz', role: 'driver' },
    serviceType: 'trip',
    rating: 2,
    complaintText:
      'Araç içi klima çalışmadı, rota uzatıldı. Şoför iletişimi yetersizdi. İade talep ediyorum.',
    createdAt: '2026-04-02',
    detail: {
      from: 'Kadıköy, Moda',
      to: 'Beşiktaş, Abbasağa',
      fee: '185 ₺',
    },
  },
  {
    id: 'rc2',
    user: { name: 'Mehmet Öz', phone: '+90 532 444 5566', publicId: 'USR-8821' },
    provider: { name: 'Ali Veli', role: 'courier' },
    serviceType: 'delivery',
    rating: 5,
    complaintText: null,
    createdAt: '2026-04-03',
    detail: {
      from: 'Restoran — Nişantaşı',
      to: 'Teşvikiye Mah. No: 8',
      fee: '45 ₺',
    },
  },
  {
    id: 'rc3',
    user: { name: 'Zeynep Arslan', phone: '+90 533 777 8899', publicId: 'USR-3301' },
    provider: { name: 'Veli Demir', role: 'courier' },
    serviceType: 'delivery',
    rating: 1,
    complaintText: 'Paket ezilmiş teslim edildi. Müşteri hizmetleri aranmadı.',
    createdAt: '2026-04-01',
    detail: {
      from: 'Depo — Ümraniye',
      to: 'Ataşehir Finans Merkezi',
      fee: '60 ₺',
    },
  },
  {
    id: 'rc4',
    user: { name: 'Can Demir', phone: '+90 534 000 1122', publicId: 'USR-5510' },
    provider: { name: 'Burak Şen', role: 'driver' },
    serviceType: 'trip',
    rating: 4,
    complaintText: null,
    createdAt: '2026-03-30',
    detail: {
      from: 'Sabiha Gökçen Havalimanı',
      to: 'Kadıköy İskelesi',
      fee: '420 ₺',
    },
  },
  {
    id: 'rc5',
    user: { name: 'Elif Kara', phone: '+90 554 000 1122', publicId: 'USR-2204' },
    provider: { name: 'Kerem Ak', role: 'driver' },
    serviceType: 'trip',
    rating: 3,
    complaintText: 'Bekleme süresi bildirilmedi, ancak yolculuk sorunsuzdu.',
    createdAt: '2026-03-28',
    detail: {
      from: 'Üsküdar',
      to: 'Taksim',
      fee: '210 ₺',
    },
  },
  {
    id: 'rc6',
    user: { name: 'Fatma Güneş', phone: '+90 552 333 4455', publicId: 'USR-9912' },
    provider: { name: 'Zeki Koç', role: 'courier' },
    serviceType: 'delivery',
    rating: 5,
    complaintText: null,
    createdAt: '2026-04-03',
    detail: {
      from: 'E-ticaret gönderi',
      to: 'Bakırköy',
      fee: '35 ₺',
    },
  },
]

function parseDate(iso) {
  return new Date(`${iso}T12:00:00`)
}

function isToday(iso) {
  const d = parseDate(iso)
  const t = new Date()
  return d.toDateString() === t.toDateString()
}

function isWithinDays(iso, days) {
  const d = parseDate(iso)
  const now = new Date()
  const diff = (now - d) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= days
}

function StarRow({ value }) {
  const bucket = value <= 2 ? 'low' : value === 3 ? 'mid' : 'high'
  return (
    <span className={`rpc-stars rpc-stars--${bucket}`} aria-label={`${value} yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? 'rpc-star rpc-star--on' : 'rpc-star'}>
          ★
        </span>
      ))}
    </span>
  )
}

function Chip({ active, children, onClick }) {
  return (
    <button type="button" className={`rpc-chip${active ? ' rpc-chip--active' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

function RatingComplaintPage() {
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [datePreset, setDatePreset] = useState('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [modalRow, setModalRow] = useState(null)

  useEffect(() => {
    if (!modalRow) return
    const onKey = (e) => {
      if (e.key === 'Escape') setModalRow(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalRow])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_ROWS.filter((row) => {
      if (q) {
        const hay = `${row.user.name} ${row.user.phone} ${row.user.publicId}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (serviceFilter !== 'all' && row.serviceType !== serviceFilter) return false
      if (ratingFilter === 'low' && row.rating > 2) return false
      if (ratingFilter === '3' && row.rating !== 3) return false
      if (ratingFilter === 'high' && row.rating < 4) return false
      if (statusFilter === 'complaint' && !row.complaintText) return false
      if (statusFilter === 'rating_only' && row.complaintText) return false
      if (datePreset === 'today' && !isToday(row.createdAt)) return false
      if (datePreset === '7d' && !isWithinDays(row.createdAt, 7)) return false
      if (datePreset === 'custom' && customStart && customEnd) {
        const t = parseDate(row.createdAt).getTime()
        const a = parseDate(customStart).getTime()
        const b = parseDate(customEnd).getTime()
        if (t < a || t > b) return false
      }
      return true
    })
  }, [search, serviceFilter, ratingFilter, statusFilter, datePreset, customStart, customEnd])

  const summary = useMemo(() => {
    if (filtered.length === 0) {
      return { avg: 0, lowCount: 0, complaintCount: 0 }
    }
    const sum = filtered.reduce((s, r) => s + r.rating, 0)
    const avg = sum / filtered.length
    const lowCount = filtered.filter((r) => r.rating <= 2).length
    const complaintCount = filtered.filter((r) => r.complaintText).length
    return { avg, lowCount, complaintCount }
  }, [filtered])

  const openDetail = (row) => setModalRow(row)

  return (
    <section className="rpc-page">
      <div className="rpc-shell">
        <header className="rpc-topbar">
          <div className="rpc-topbar__lead">
            <h1 className="rpc-title">Puan &amp; Şikayet Yönetimi</h1>
            <p className="rpc-kicker">Geri bildirimleri tek ekranda yönetin</p>
          </div>
          <div className="rpc-search-wrap">
            <span className="rpc-search-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              className="rpc-search-input"
              placeholder="İsim, telefon veya ID ara…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="İsim telefon veya ID ile ara"
            />
          </div>
        </header>

        <div className="rpc-filters rpc-filters--rail" role="toolbar" aria-label="Filtreler">
          <div className="rpc-filter-segment">
            <span className="rpc-filter-tag">Hizmet</span>
            <div className="rpc-chip-row">
              <Chip active={serviceFilter === 'all'} onClick={() => setServiceFilter('all')}>
                Tümü
              </Chip>
              <Chip active={serviceFilter === 'trip'} onClick={() => setServiceFilter('trip')}>
                Yolculuk
              </Chip>
              <Chip active={serviceFilter === 'delivery'} onClick={() => setServiceFilter('delivery')}>
                Teslimat
              </Chip>
            </div>
          </div>
          <span className="rpc-filter-divider" aria-hidden />
          <div className="rpc-filter-segment">
            <span className="rpc-filter-tag">Puan</span>
            <div className="rpc-chip-row">
              <Chip active={ratingFilter === 'all'} onClick={() => setRatingFilter('all')}>
                Tümü
              </Chip>
              <Chip active={ratingFilter === 'low'} onClick={() => setRatingFilter('low')}>
                1–2
              </Chip>
              <Chip active={ratingFilter === '3'} onClick={() => setRatingFilter('3')}>
                3
              </Chip>
              <Chip active={ratingFilter === 'high'} onClick={() => setRatingFilter('high')}>
                4–5
              </Chip>
            </div>
          </div>
          <span className="rpc-filter-divider" aria-hidden />
          <div className="rpc-filter-segment">
            <span className="rpc-filter-tag">Durum</span>
            <div className="rpc-chip-row">
              <Chip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
                Tümü
              </Chip>
              <Chip active={statusFilter === 'complaint'} onClick={() => setStatusFilter('complaint')}>
                Şikayet
              </Chip>
              <Chip active={statusFilter === 'rating_only'} onClick={() => setStatusFilter('rating_only')}>
                Sadece puan
              </Chip>
            </div>
          </div>
          <span className="rpc-filter-divider" aria-hidden />
          <div className="rpc-filter-segment rpc-filter-segment--grow">
            <span className="rpc-filter-tag">Tarih</span>
            <div className="rpc-chip-row">
              <Chip active={datePreset === 'all'} onClick={() => setDatePreset('all')}>
                Tümü
              </Chip>
              <Chip active={datePreset === 'today'} onClick={() => setDatePreset('today')}>
                Bugün
              </Chip>
              <Chip active={datePreset === '7d'} onClick={() => setDatePreset('7d')}>
                7 gün
              </Chip>
              <Chip active={datePreset === 'custom'} onClick={() => setDatePreset('custom')}>
                Özel
              </Chip>
            </div>
            {datePreset === 'custom' && (
              <div className="rpc-custom-dates">
                <input
                  type="date"
                  className="rpc-date-input"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  aria-label="Başlangıç tarihi"
                />
                <span className="rpc-date-sep">—</span>
                <input
                  type="date"
                  className="rpc-date-input"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  aria-label="Bitiş tarihi"
                />
              </div>
            )}
          </div>
        </div>

        <div className="rpc-summary">
          <article className="rpc-summary-card">
            <p className="rpc-summary-card__label">Ortalama puan</p>
            <p className="rpc-summary-card__value">{summary.avg ? summary.avg.toFixed(1) : '—'}</p>
          </article>
          <article className="rpc-summary-card rpc-summary-card--warn">
            <p className="rpc-summary-card__label">Düşük puanlı (1–2)</p>
            <p className="rpc-summary-card__value">{summary.lowCount}</p>
          </article>
          <article className="rpc-summary-card rpc-summary-card--chat">
            <p className="rpc-summary-card__label">Toplam şikayet</p>
            <p className="rpc-summary-card__value">{summary.complaintCount}</p>
          </article>
        </div>

        <div className="rpc-table-wrap">
        <table className="rpc-table">
          <thead>
            <tr>
              <th>Kullanıcı</th>
              <th>Sürücü / Kurye</th>
              <th>Hizmet</th>
              <th>Puan</th>
              <th>Şikayet</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="rpc-table-empty">
                  Filtrelere uygun kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="rpc-role-cell">
                      <img
                        src={IMG_PASSENGER}
                        alt=""
                        className="rpc-role-thumb rpc-role-thumb--passenger"
                      />
                      <div className="rpc-text-cell">
                        <div className="rpc-name">{row.user.name}</div>
                        <div className="rpc-sub">{row.user.publicId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="rpc-role-cell">
                      <img
                        src={providerRoleImageSrc(row.provider.role)}
                        alt=""
                        className="rpc-role-thumb rpc-role-thumb--vehicle"
                      />
                      <div className="rpc-text-cell">
                        <div className="rpc-name">{row.provider.name}</div>
                        <div className="rpc-sub">{row.provider.role === 'driver' ? 'Sürücü' : 'Kurye'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`rpc-badge rpc-badge--${row.serviceType}`}>
                      {row.serviceType === 'trip' ? 'Yolculuk' : 'Teslimat'}
                    </span>
                  </td>
                  <td>
                    <StarRow value={row.rating} />
                  </td>
                  <td className="rpc-complaint-cell">
                    {row.complaintText ? (
                      <>
                        <p className="rpc-complaint-preview">{row.complaintText}</p>
                        <button type="button" className="rpc-link" onClick={() => openDetail(row)}>
                          Devamını gör
                        </button>
                      </>
                    ) : (
                      <span className="rpc-muted">—</span>
                    )}
                  </td>
                  <td>
                    <time dateTime={row.createdAt}>
                      {parseDate(row.createdAt).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </td>
                  <td>
                    <div className="rpc-actions">
                      <button type="button" className="rpc-btn rpc-btn--ghost" onClick={() => openDetail(row)} title="Detay">
                        Detay
                      </button>
                      <button
                        type="button"
                        className="rpc-btn rpc-btn--ghost"
                        onClick={() => {
                          const tel = row.user.phone.replace(/[^\d+]/g, '')
                          window.location.href = `tel:${tel}`
                        }}
                        title="İletişim"
                      >
                        İletişim
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {modalRow && (
        <div
          className="rpc-modal-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalRow(null)
          }}
        >
          <div className="rpc-modal" role="dialog" aria-modal="true" aria-labelledby="rpc-modal-title">
            <div className="rpc-modal__head">
              <h2 id="rpc-modal-title">İşlem detayı</h2>
              <button type="button" className="rpc-modal__close" onClick={() => setModalRow(null)} aria-label="Kapat">
                ×
              </button>
            </div>
            <div className="rpc-modal__body">
              <section className="rpc-modal-block">
                <h3 className="rpc-modal-h3">Kullanıcı</h3>
                <div className="rpc-modal-role">
                  <img
                    src={IMG_PASSENGER}
                    alt=""
                    className="rpc-modal-thumb rpc-modal-thumb--passenger"
                  />
                  <div className="rpc-modal-stack">
                    <p className="rpc-modal-strong">{modalRow.user.name}</p>
                    <p className="rpc-modal-muted">{modalRow.user.phone}</p>
                    <p className="rpc-modal-muted">{modalRow.user.publicId}</p>
                  </div>
                </div>
              </section>
              <section className="rpc-modal-block">
                <h3 className="rpc-modal-h3">Sürücü / Kurye</h3>
                <div className="rpc-modal-role">
                  <img
                    src={providerRoleImageSrc(modalRow.provider.role)}
                    alt=""
                    className="rpc-modal-thumb rpc-modal-thumb--vehicle"
                  />
                  <div className="rpc-modal-stack">
                    <p className="rpc-modal-strong">{modalRow.provider.name}</p>
                    <p className="rpc-modal-muted">
                      {modalRow.provider.role === 'driver' ? 'Sürücü' : 'Kurye'}
                    </p>
                  </div>
                </div>
              </section>
              <section className="rpc-modal-block">
                <h3 className="rpc-modal-h3">Yolculuk / teslimat</h3>
                <dl className="rpc-dl">
                  <dt>Başlangıç</dt>
                  <dd>{modalRow.detail.from}</dd>
                  <dt>Varış</dt>
                  <dd>{modalRow.detail.to}</dd>
                  <dt>Tarih</dt>
                    <dd>
                    {parseDate(modalRow.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </dd>
                  <dt>Ücret</dt>
                  <dd>{modalRow.detail.fee}</dd>
                  <dt>Hizmet</dt>
                  <dd>
                    <span className={`rpc-badge rpc-badge--${modalRow.serviceType}`}>
                      {modalRow.serviceType === 'trip' ? 'Yolculuk' : 'Teslimat'}
                    </span>
                  </dd>
                </dl>
              </section>
              <section className="rpc-modal-block">
                <h3 className="rpc-modal-h3">Puan</h3>
                <StarRow value={modalRow.rating} />
              </section>
              <section className="rpc-modal-block">
                <h3 className="rpc-modal-h3">Şikayet</h3>
                {modalRow.complaintText ? (
                  <p className="rpc-modal-complaint">{modalRow.complaintText}</p>
                ) : (
                  <p className="rpc-modal-muted">Şikayet metni yok (sadece puan).</p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default RatingComplaintPage
