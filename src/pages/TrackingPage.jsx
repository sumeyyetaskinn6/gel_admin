import { useCallback, useEffect, useMemo, useState } from 'react'
import './TrackingPage.css'

const MOCK_TRACKS = [
  {
    id: 'tr1',
    type: 'trip',
    user: { name: 'Ayşe Yıldız', phone: '+90 551 111 2233' },
    providerLabel: 'Sürücü: Ahmet Yılmaz',
    from: 'Kadıköy, Moda Cd.',
    to: 'Beşiktaş, Abbasağa',
    status: 'on_the_way',
    etaMinutes: 14,
    marker: { top: '38%', left: '48%' },
  },
  {
    id: 'tr2',
    type: 'delivery',
    user: { name: 'Mehmet Öz', phone: '+90 532 444 5566' },
    providerLabel: 'Kurye: Ali Veli',
    from: 'Restoran — Nişantaşı',
    to: 'Teşvikiye Mah. No: 8',
    status: 'on_the_way',
    etaMinutes: 6,
    marker: { top: '52%', left: '62%' },
  },
  {
    id: 'tr3',
    type: 'delivery',
    user: { name: 'Zeynep Arslan', phone: '+90 533 777 8899' },
    providerLabel: 'Kurye: Veli Demir',
    from: 'Depo — Ümraniye',
    to: 'Ataşehir Finans Merkezi',
    status: 'delivered',
    etaMinutes: 0,
    marker: { top: '44%', left: '72%' },
  },
  {
    id: 'tr4',
    type: 'trip',
    user: { name: 'Can Demir', phone: '+90 534 000 1122' },
    providerLabel: 'Sürücü: Burak Şen',
    from: 'Sabiha Gökçen Havalimanı',
    to: 'Kadıköy İskelesi',
    status: 'on_the_way',
    etaMinutes: 38,
    marker: { top: '68%', left: '38%' },
  },
  {
    id: 'tr5',
    type: 'trip',
    user: { name: 'Elif Kara', phone: '+90 554 000 1122' },
    providerLabel: 'Sürücü: Kerem Ak',
    from: 'Üsküdar Sahil',
    to: 'Taksim Meydanı',
    status: 'delivered',
    etaMinutes: 0,
    marker: { top: '35%', left: '58%' },
  },
]

function statusLabel(status) {
  return status === 'delivered' ? 'Teslim edildi' : 'Yolda'
}

function TrackingPage() {
  const [selectedId, setSelectedId] = useState(MOCK_TRACKS[0]?.id ?? null)
  const [mapExpanded, setMapExpanded] = useState(false)

  const selected = useMemo(
    () => MOCK_TRACKS.find((t) => t.id === selectedId) ?? null,
    [selectedId],
  )

  const toggleFullscreen = useCallback(() => {
    setMapExpanded((v) => !v)
  }, [])

  useEffect(() => {
    if (!mapExpanded) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mapExpanded])

  return (
    <section className="track-page">
      <header className={`track-page__intro${mapExpanded ? ' track-page__intro--hidden' : ''}`}>
        <div>
          <h1 className="track-page__title">Yolculuk / Teslimat Takibi</h1>
          <p className="track-page__purpose">Canlı durum takibi</p>
        </div>
        <div className="track-page__legend" aria-label="Renk açıklaması">
          <span className="track-legend__item">
            <span className="track-legend__dot track-legend__dot--trip" aria-hidden />
            Aktif yolculuk
          </span>
          <span className="track-legend__item">
            <span className="track-legend__dot track-legend__dot--delivery" aria-hidden />
            Aktif teslimat
          </span>
        </div>
      </header>

      <div className={`track-layout${mapExpanded ? ' track-layout--fullscreen' : ''}`}>
        <div className="track-map-wrap">
          <div className="track-map-toolbar">
            <span className="track-map-toolbar__hint">Haritada işaretçiye tıklayarak seçin</span>
            <button type="button" className="track-btn-fullscreen" onClick={toggleFullscreen}>
              {mapExpanded ? 'Tam ekrandan çık' : 'Haritayı tam ekran'}
            </button>
          </div>
          <div className="track-map-frame">
            <iframe
              title="İstanbul harita"
              className="track-map-iframe"
              src="https://www.google.com/maps?q=Istanbul&z=11&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="track-map-overlay" aria-hidden>
              {MOCK_TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`track-marker track-marker--${t.type}${selectedId === t.id ? ' track-marker--selected' : ''}`}
                  style={{ top: t.marker.top, left: t.marker.left }}
                  onClick={() => setSelectedId(t.id)}
                  title={`${t.user.name} — ${t.type === 'trip' ? 'Yolculuk' : 'Teslimat'}`}
                  aria-label={`${t.user.name}, ${t.type === 'trip' ? 'yolculuk' : 'teslimat'}`}
                >
                  <img
                    src={t.type === 'trip' ? '/carrr.png' : '/bike.png'}
                    alt=""
                    className="track-marker__img"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside
          className={`track-panel${mapExpanded ? ' track-panel--fullscreen' : ''}`}
          aria-label="Seçili gönderi detayı"
        >
          <h2 className="track-panel__heading">Aktif gönderiler</h2>
          <ul className="track-list">
            {MOCK_TRACKS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`track-list-item${selectedId === t.id ? ' track-list-item--active' : ''}`}
                  onClick={() => setSelectedId(t.id)}
                >
                  <span className={`track-list-item__badge track-list-item__badge--${t.type}`}>
                    {t.type === 'trip' ? 'Yolculuk' : 'Teslimat'}
                  </span>
                  <span className="track-list-item__name">{t.user.name}</span>
                  <span className="track-list-item__status">{statusLabel(t.status)}</span>
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <div className="track-detail">
              <h3 className="track-detail__title">Seçili kayıt</h3>
              <dl className="track-dl">
                <dt>Kullanıcı</dt>
                <dd className="track-detail__strong">{selected.user.name}</dd>
                <dt>Telefon</dt>
                <dd>
                  <a href={`tel:${selected.user.phone.replace(/\s/g, '')}`} className="track-detail__link">
                    {selected.user.phone}
                  </a>
                </dd>
                <dt>Başlangıç</dt>
                <dd>{selected.from}</dd>
                <dt>Varış</dt>
                <dd>{selected.to}</dd>
                <dt>Durum</dt>
                <dd>
                  <span
                    className={`track-status-pill track-status-pill--${selected.status === 'delivered' ? 'done' : 'active'}`}
                  >
                    {statusLabel(selected.status)}
                  </span>
                </dd>
                <dt>Tahmini varış</dt>
                <dd>
                  {selected.status === 'delivered' ? (
                    <span className="track-detail__muted">Tamamlandı</span>
                  ) : (
                    <span className="track-detail__eta">~{selected.etaMinutes} dk</span>
                  )}
                </dd>
              </dl>
              <p className="track-detail__provider">{selected.providerLabel}</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export default TrackingPage
