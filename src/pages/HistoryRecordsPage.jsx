import { useMemo, useState } from 'react'
import './HistoryRecordsPage.css'

const MOCK_RECORDS = [
  {
    id: 'h1',
    serviceType: 'trip',
    providerRole: 'driver',
    completedAt: '2026-04-03T14:22:00',
    userName: 'Ayşe Yıldız',
    userPublicId: 'USR-1042',
    providerName: 'Ahmet Yılmaz',
    feeLabel: '343 ₺',
    fromAddress: 'Kadıköy, Moda Cd. No: 12',
    toAddress: 'Beşiktaş, Abbasağa Mah.',
  },
  {
    id: 'h2',
    serviceType: 'delivery',
    providerRole: 'courier',
    completedAt: '2026-04-03T11:05:00',
    userName: 'Mehmet Öz',
    userPublicId: 'USR-8821',
    providerName: 'Ali Veli',
    feeLabel: '45 ₺',
    fromAddress: 'Restoran — Nişantaşı',
    toAddress: 'Teşvikiye Mah. No: 8',
  },
  {
    id: 'h3',
    serviceType: 'delivery',
    providerRole: 'courier',
    completedAt: '2026-04-02T18:40:00',
    userName: 'Zeynep Arslan',
    userPublicId: 'USR-3301',
    providerName: 'Veli Demir',
    feeLabel: '60 ₺',
    fromAddress: 'Depo — Ümraniye',
    toAddress: 'Ataşehir Finans Merkezi',
  },
  {
    id: 'h4',
    serviceType: 'trip',
    providerRole: 'driver',
    completedAt: '2026-04-01T09:15:00',
    userName: 'Can Demir',
    userPublicId: 'USR-5510',
    providerName: 'Burak Şen',
    feeLabel: '420 ₺',
    fromAddress: 'Sabiha Gökçen Havalimanı',
    toAddress: 'Kadıköy İskelesi',
  },
  {
    id: 'h5',
    serviceType: 'trip',
    providerRole: 'driver',
    completedAt: '2026-03-30T22:10:00',
    userName: 'Elif Kara',
    userPublicId: 'USR-2204',
    providerName: 'Kerem Ak',
    feeLabel: '210 ₺',
    fromAddress: 'Üsküdar Sahil',
    toAddress: 'Taksim Meydanı',
  },
  {
    id: 'h6',
    serviceType: 'delivery',
    providerRole: 'courier',
    completedAt: '2026-03-29T16:00:00',
    userName: 'Fatma Güneş',
    userPublicId: 'USR-9912',
    providerName: 'Zeki Koç',
    feeLabel: '38 ₺',
    fromAddress: 'Market — Bebek',
    toAddress: 'Etiler, Nispetiye Cd. 44',
  },
]

function parseDateInput(value) {
  if (!value) return null
  const parts = value.split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null
  const [y, m, d] = parts
  return new Date(y, m - 1, d)
}

function formatDateTime(iso) {
  const d = new Date(iso)
  return d.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function HistoryRecordsPage() {
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [search, setSearch] = useState('')
  const [providerKind, setProviderKind] = useState('all')
  const [detail, setDetail] = useState(null)

  const filtered = useMemo(() => {
    const start = parseDateInput(dateStart)
    const end = parseDateInput(dateEnd)
    const q = search.trim().toLowerCase()

    return MOCK_RECORDS.filter((row) => {
      if (providerKind === 'driver' && row.providerRole !== 'driver') return false
      if (providerKind === 'courier' && row.providerRole !== 'courier') return false

      const completed = new Date(row.completedAt)
      if (start) {
        const s = new Date(start)
        s.setHours(0, 0, 0, 0)
        if (completed < s) return false
      }
      if (end) {
        const e = new Date(end)
        e.setHours(23, 59, 59, 999)
        if (completed > e) return false
      }

      if (q) {
        const hay = [
          row.userName,
          row.userPublicId,
          row.providerName,
          row.fromAddress,
          row.toAddress,
          row.id,
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [dateStart, dateEnd, search, providerKind])

  return (
    <section className="hr-page">
      <header className="hr-page__head">
        <h1 className="hr-page__title">Geçmiş Yolculuk / Teslimat Kayıtları</h1>
        <p className="hr-page__subtitle">Tamamlanan işlemleri inceleyin</p>
      </header>

      <div
        className="hr-segment"
        role="tablist"
        aria-label="Sürücü veya kurye kayıtları"
      >
        <button
          type="button"
          role="tab"
          aria-selected={providerKind === 'all'}
          className={`hr-segment__opt${providerKind === 'all' ? ' hr-segment__opt--active' : ''}`}
          onClick={() => setProviderKind('all')}
        >
          Tümü
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={providerKind === 'driver'}
          className={`hr-segment__opt${providerKind === 'driver' ? ' hr-segment__opt--active' : ''}`}
          onClick={() => setProviderKind('driver')}
        >
          Sürücü
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={providerKind === 'courier'}
          className={`hr-segment__opt${providerKind === 'courier' ? ' hr-segment__opt--active' : ''}`}
          onClick={() => setProviderKind('courier')}
        >
          Kurye
        </button>
      </div>

      <div className="hr-toolbar">
        <div className="hr-dates">
          <label className="hr-date-field">
            <span className="hr-date-field__icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              aria-label="Başlangıç tarihi"
            />
          </label>
          <span className="hr-dates__sep">—</span>
          <label className="hr-date-field">
            <span className="hr-date-field__icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              aria-label="Bitiş tarihi"
            />
          </label>
        </div>

        <div className="hr-search">
          <span className="hr-search__icon" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            className="hr-search__input"
            placeholder="İsim, adres veya ID ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="İsim adres veya ID ile ara"
          />
        </div>
      </div>

      <p className="hr-table-hint" aria-hidden="true">
        Tüm sütunları görmek için tabloyu yatay kaydırın.
      </p>

      <div className="hr-table-card">
        <div className="hr-table-scroll">
          <table className="hr-table">
            <thead>
              <tr>
                <th className="hr-table__th--type" scope="col" aria-label="Tür" />
                <th scope="col">Tarih</th>
                <th scope="col">Kullanıcı adı</th>
                <th scope="col">Sürücü / kurye</th>
                <th scope="col">Ücret</th>
                <th scope="col">Durum</th>
                <th scope="col">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="hr-table__empty">
                    Filtrelere uygun kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id}>
                    <td className="hr-table__type" data-label="Tür">
                      <img
                        src={row.serviceType === 'trip' ? '/carrr.png' : '/bike.png'}
                        alt=""
                        className="hr-type-img"
                      />
                    </td>
                    <td data-label="Tarih">
                      <time dateTime={row.completedAt} className="hr-table__time">
                        {formatDateTime(row.completedAt)}
                      </time>
                    </td>
                    <td data-label="Kullanıcı">
                      <div className="hr-user">
                        <span className="hr-user__name">{row.userName}</span>
                        <span className="hr-user__id">{row.userPublicId}</span>
                      </div>
                    </td>
                    <td data-label="Sürücü / kurye">
                      <div className="hr-provider">
                        <span
                          className={`hr-pill hr-pill--${row.providerRole === 'driver' ? 'trip' : 'delivery'}`}
                        >
                          {row.providerRole === 'driver' ? 'Yolculuk' : 'Kurye'}
                        </span>
                        <span className="hr-provider__name">{row.providerName}</span>
                      </div>
                    </td>
                    <td className="hr-table__fee" data-label="Ücret">
                      {row.feeLabel}
                    </td>
                    <td data-label="Durum">
                      <span className="hr-status">Tamamlandı</span>
                    </td>
                    <td data-label="İşlem">
                      <button type="button" className="hr-btn-detail" onClick={() => setDetail(row)}>
                        Detay görüntüle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div
          className="hr-modal-backdrop"
          role="presentation"
          onClick={() => setDetail(null)}
        >
          <div
            className="hr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hr-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hr-modal__head">
              <h2 id="hr-modal-title">İşlem detayı</h2>
              <button type="button" className="hr-modal__close" onClick={() => setDetail(null)} aria-label="Kapat">
                ×
              </button>
            </div>
            <div className="hr-modal__body">
              <div className="hr-modal__hero">
                <img
                  src={detail.serviceType === 'trip' ? '/carrr.png' : '/bike.png'}
                  alt=""
                  className="hr-modal__hero-img"
                />
                <span
                  className={`hr-pill hr-pill--${detail.providerRole === 'driver' ? 'trip' : 'delivery'}`}
                >
                  {detail.providerRole === 'driver' ? 'Yolculuk' : 'Kurye'}
                </span>
              </div>
              <p className="hr-modal__datetime">{formatDateTime(detail.completedAt)}</p>

              <div className="hr-route-block">
                <h3 className="hr-route-block__title">Rota</h3>
                <div className="hr-route">
                  <div className="hr-route__line" aria-hidden />
                  <div className="hr-route__texts">
                    <p className="hr-route__addr">{detail.fromAddress}</p>
                    <p className="hr-route__addr">{detail.toAddress}</p>
                  </div>
                </div>
              </div>

              <dl className="hr-dl">
                <dt>Kullanıcı</dt>
                <dd>
                  {detail.userName} <span className="hr-dl__muted">({detail.userPublicId})</span>
                </dd>
                <dt>Sürücü / kurye</dt>
                <dd>{detail.providerName}</dd>
                <dt>Ücret</dt>
                <dd className="hr-dl__fee">{detail.feeLabel}</dd>
                <dt>Durum</dt>
                <dd>
                  <span className="hr-status">Tamamlandı</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HistoryRecordsPage
