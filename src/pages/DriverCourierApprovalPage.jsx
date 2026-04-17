import { useEffect, useMemo, useRef, useState } from 'react'
import { MOCK_BY_ROLE } from '../data/userManagementMock'
import './DriverCourierApprovalPage.css'

const WEEKDAY_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']

/** 31 günlük ay şeridi (Ocak 2026 — 31 gün, hafta günleri doğru) */
function build31DayCards(year, monthIndex) {
  const cards = []
  for (let d = 1; d <= 31; d += 1) {
    const date = new Date(year, monthIndex, d)
    if (date.getMonth() !== monthIndex) break
    cards.push({
      day: String(d).padStart(2, '0'),
      weekday: WEEKDAY_TR[date.getDay()],
    })
  }
  return cards
}

const DAY_CARDS = build31DayCards(2026, 0)

const ROLE_ASSET = {
  driver: '/carrr.png',
  courier: '/bike.png',
}

function InfoItem({ label, value }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="approval-info-item">
      <span className="approval-info-item__label">{label}</span>
      <span className="approval-info-item__value">{value}</span>
    </div>
  )
}

function DocumentItem({ label, url }) {
  if (!url) return null
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="approval-doc-item" title={label}>
      <span className="approval-doc-item__icon" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V9l-5-7z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M14 2v7h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 14h6M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="approval-doc-item__label">{label}</span>
    </a>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function DriverCourierApprovalPage() {
  const [activeTab, setActiveTab] = useState('driver')
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [decisionById, setDecisionById] = useState({})
  const [confirmState, setConfirmState] = useState(null)
  const dayCardRefs = useRef([])

  useEffect(() => {
    dayCardRefs.current[selectedDayIndex]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedDayIndex])

  useEffect(() => {
    if (!confirmState) return
    const onKey = (e) => {
      if (e.key === 'Escape') setConfirmState(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmState])

  const applications = useMemo(() => MOCK_BY_ROLE[activeTab] ?? [], [activeTab])

  const openConfirm = (application, action) => {
    setConfirmState({ applicationId: application.id, name: application.name, action })
  }

  const applyDecision = () => {
    if (!confirmState) return
    setDecisionById((prev) => ({ ...prev, [confirmState.applicationId]: confirmState.action }))
    setConfirmState(null)
  }

  return (
    <section className="approval-page">
      <header className="approval-header">
        <div>
          <h1 className="approval-header__title">Sürücü / Kurye onayı</h1>
          <p className="approval-header__sub">Başvuruları tarihe göre süzün</p>
        </div>
      </header>

      <p className="approval-strip-label">Takvim</p>

      <div
        className="approval-day-strip"
        role="list"
        aria-label="Ayın günleri, yatay kaydırın"
      >
        {DAY_CARDS.map((item, index) => (
          <button
            key={item.day}
            ref={(el) => {
              dayCardRefs.current[index] = el
            }}
            type="button"
            role="listitem"
            aria-current={index === selectedDayIndex ? 'date' : undefined}
            className={`approval-day-card${index === selectedDayIndex ? ' approval-day-card--selected' : ''}`}
            onClick={() => setSelectedDayIndex(index)}
          >
            <span className="approval-day-card__num">{item.day}</span>
            <span className="approval-day-card__weekday">{item.weekday}</span>
          </button>
        ))}
      </div>

      <div className="approval-tabs">
        <div className="approval-tabs__track">
          <button
            type="button"
            className={`approval-tabs__pill${activeTab === 'driver' ? ' approval-tabs__pill--active' : ''}`}
            onClick={() => setActiveTab('driver')}
          >
            Sürücü
          </button>
          <button
            type="button"
            className={`approval-tabs__pill${activeTab === 'courier' ? ' approval-tabs__pill--active' : ''}`}
            onClick={() => setActiveTab('courier')}
          >
            Kurye
          </button>
        </div>
      </div>

      <div className="approval-list-shell">
        <div className="approval-list">
          {applications.map((app) => (
            <article key={app.id} className="approval-row">
              <img className="approval-row__photo" src={ROLE_ASSET[activeTab]} alt="" width={96} height={96} />
              <div className="approval-row__body">
                <h2 className="approval-row__name">{app.name}</h2>
                <div className="approval-info-grid">
                  <InfoItem label="Telefon Numarası" value={app.phone} />
                  <InfoItem label="Ad" value={app.firstName} />
                  <InfoItem label="Soyad" value={app.lastName} />
                  <InfoItem label="E-posta Adresi" value={app.email} />
                  <InfoItem label="GSM Numarası" value={app.gsm} />
                  <InfoItem label="Cinsiyet" value={app.gender} />
                  <InfoItem label="IBAN Numarası" value={app.iban} />

                  {activeTab === 'courier' && (
                    <>
                      <InfoItem label="Araç Tipi" value={app.vehicleType} />
                      <InfoItem label="Marka" value={app.vehicleBrand} />
                      <InfoItem label="Model" value={app.vehicleModel} />
                      <InfoItem label="Yıl" value={app.vehicleYear} />
                      <InfoItem label="Renk" value={app.vehicleColor} />
                    </>
                  )}

                  {activeTab === 'driver' && (
                    <>
                      <InfoItem label="Marka" value={app.vehicleBrand} />
                      <InfoItem label="Model" value={app.vehicleModel} />
                      <InfoItem label="Yıl" value={app.vehicleYear} />
                      <InfoItem label="Renk" value={app.vehicleColor} />
                      <InfoItem label="Plaka" value={app.plate} />
                    </>
                  )}
                </div>

                <div className="approval-docs">
                  <h3 className="approval-docs__title">Yüklenen Belgeler</h3>
                  <div className="approval-docs__grid">
                    <DocumentItem label="Ehliyet Ön Yüzü" url={app.licenseFrontUrl} />
                    <DocumentItem label="Ehliyet Arka Yüzü" url={app.licenseBackUrl} />
                    <DocumentItem label="Ruhsat Ön Yüzü" url={app.registrationFrontUrl} />
                    <DocumentItem label="Ruhsat Arka Yüzü" url={app.registrationBackUrl} />
                    <DocumentItem label="Sabıka Kaydı" url={app.criminalRecordUrl} />
                    {activeTab === 'courier' && <DocumentItem label="P1 Belgesi" url={app.p1DocumentUrl} />}
                  </div>
                </div>
              </div>
              <div className="approval-row__side">
                <div className="approval-dots" aria-label="Ön değerlendirme">
                  <span className="approval-dots__item" />
                  <span className="approval-dots__item" />
                  <span className="approval-dots__item approval-dots__item--on" />
                </div>
                {decisionById[app.id] ? (
                  <span
                    className={`approval-result-pill approval-result-pill--${decisionById[app.id] === 'approve' ? 'approve' : 'reject'}`}
                  >
                    {decisionById[app.id] === 'approve' ? 'Onaylandı' : 'Reddedildi'}
                  </span>
                ) : (
                  <div className="approval-actions">
                    <button
                      type="button"
                      className="approval-btn approval-btn--approve"
                      aria-label="Onayla"
                      onClick={() => openConfirm(app, 'approve')}
                    >
                      <CheckIcon />
                    </button>
                    <button
                      type="button"
                      className="approval-btn approval-btn--reject"
                      aria-label="Reddet"
                      onClick={() => openConfirm(app, 'reject')}
                    >
                      <XIcon />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {confirmState && (
        <div
          className="approval-confirm-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmState(null)
          }}
        >
          <div className="approval-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="approval-confirm-title">
            <h2 id="approval-confirm-title" className="approval-confirm-title">
              {confirmState.action === 'approve' ? 'Başvuruyu onayla' : 'Başvuruyu reddet'}
            </h2>
            <p className="approval-confirm-text">
              <strong>{confirmState.name}</strong> için
              {' '}
              {confirmState.action === 'approve' ? 'onay işlemini' : 'red işlemini'}
              {' '}
              gerçekleştirmek istediğinize emin misiniz?
            </p>
            <div className="approval-confirm-actions">
              <button type="button" className="approval-confirm-btn approval-confirm-btn--ghost" onClick={() => setConfirmState(null)}>
                Vazgeç
              </button>
              <button
                type="button"
                className={`approval-confirm-btn ${confirmState.action === 'approve' ? 'approval-confirm-btn--approve' : 'approval-confirm-btn--reject'}`}
                onClick={applyDecision}
              >
                {confirmState.action === 'approve' ? 'Evet, onayla' : 'Evet, reddet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default DriverCourierApprovalPage
