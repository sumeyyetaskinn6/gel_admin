import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

const REJECT_SECTION = {
  REG: 'Kayıt bilgileri',
  VEH: 'Araç bilgileri',
  DOC: 'Yüklenen belgeler',
}

function truncateDetail(val, max = 44) {
  if (val === undefined || val === null || val === '') return '—'
  const s = String(val)
  return s.length > max ? `${s.slice(0, max - 1)}…` : s
}

function docStatus(url) {
  return url ? 'Dosya yüklü' : 'Dosya yok'
}

/**
 * Red modalında listelenecek kalemler — kayıt sırasında toplanan alan ve belgelerle uyumlu.
 * @param {'driver'|'courier'} role
 */
function buildRejectChecklistItems(app, role) {
  const items = []

  const push = (id, label, section, detail) => {
    items.push({ id, label, section, detail })
  }

  push('field_phone', 'Telefon numarası', REJECT_SECTION.REG, truncateDetail(app.phone))
  push('field_firstname', 'Ad', REJECT_SECTION.REG, truncateDetail(app.firstName))
  push('field_lastname', 'Soyad', REJECT_SECTION.REG, truncateDetail(app.lastName))
  push('field_email', 'E-posta adresi', REJECT_SECTION.REG, truncateDetail(app.email))
  push('field_gsm', 'GSM numarası', REJECT_SECTION.REG, truncateDetail(app.gsm))
  push('field_gender', 'Cinsiyet', REJECT_SECTION.REG, truncateDetail(app.gender))
  push('field_iban', 'IBAN numarası', REJECT_SECTION.REG, truncateDetail(app.iban))
  push('field_profile_visual', 'Başvuru / profil görseli', REJECT_SECTION.REG, 'Liste görünümündeki görsel')

  if (role === 'courier') {
    push('field_vehicle_type', 'Araç tipi', REJECT_SECTION.VEH, truncateDetail(app.vehicleType))
    push('field_vehicle_brand', 'Araç markası', REJECT_SECTION.VEH, truncateDetail(app.vehicleBrand))
    push('field_vehicle_model', 'Araç modeli', REJECT_SECTION.VEH, truncateDetail(app.vehicleModel))
    push('field_vehicle_year', 'Model yılı', REJECT_SECTION.VEH, truncateDetail(app.vehicleYear))
    push('field_vehicle_color', 'Araç rengi', REJECT_SECTION.VEH, truncateDetail(app.vehicleColor))
  } else {
    push('field_vehicle_brand', 'Araç markası', REJECT_SECTION.VEH, truncateDetail(app.vehicleBrand))
    push('field_vehicle_model', 'Araç modeli', REJECT_SECTION.VEH, truncateDetail(app.vehicleModel))
    push('field_vehicle_year', 'Model yılı', REJECT_SECTION.VEH, truncateDetail(app.vehicleYear))
    push('field_vehicle_color', 'Araç rengi', REJECT_SECTION.VEH, truncateDetail(app.vehicleColor))
    push('field_plate', 'Plaka', REJECT_SECTION.VEH, truncateDetail(app.plate))
  }

  push('doc_license_front', 'Ehliyet ön yüzü', REJECT_SECTION.DOC, docStatus(app.licenseFrontUrl))
  push('doc_license_back', 'Ehliyet arka yüzü', REJECT_SECTION.DOC, docStatus(app.licenseBackUrl))
  push('doc_registration_front', 'Ruhsat ön yüzü', REJECT_SECTION.DOC, docStatus(app.registrationFrontUrl))
  push('doc_registration_back', 'Ruhsat arka yüzü', REJECT_SECTION.DOC, docStatus(app.registrationBackUrl))
  push('doc_criminal_record', 'Sabıka kaydı', REJECT_SECTION.DOC, docStatus(app.criminalRecordUrl))
  if (role === 'courier') {
    push('doc_p1', 'P1 belgesi', REJECT_SECTION.DOC, docStatus(app.p1DocumentUrl))
  }

  return items
}

function formatLogTime(d) {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return d.toISOString()
  }
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
  const [approveModal, setApproveModal] = useState(null)
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReasonIds, setRejectReasonIds] = useState([])
  const [rejectExtraNote, setRejectExtraNote] = useState('')
  const [rejectTouched, setRejectTouched] = useState(false)
  const [adminLog, setAdminLog] = useState([])
  const [toast, setToast] = useState(null)
  const dayCardRefs = useRef([])

  useEffect(() => {
    dayCardRefs.current[selectedDayIndex]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedDayIndex])

  const applications = useMemo(() => MOCK_BY_ROLE[activeTab] ?? [], [activeTab])

  const openApproveConfirm = (application) => {
    setApproveModal({ applicationId: application.id, name: application.name })
  }

  const closeRejectModal = useCallback(() => {
    setRejectModal(null)
    setRejectReasonIds([])
    setRejectExtraNote('')
    setRejectTouched(false)
  }, [])

  const openRejectFlow = (application) => {
    setRejectModal({
      applicationId: application.id,
      name: application.name,
      email: application.email,
      role: activeTab,
      application,
    })
    setRejectReasonIds([])
    setRejectExtraNote('')
    setRejectTouched(false)
  }

  useEffect(() => {
    const anyOpen = !!(approveModal || rejectModal)
    if (!anyOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setApproveModal(null)
        closeRejectModal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [approveModal, rejectModal, closeRejectModal])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(t)
  }, [toast])

  const toggleRejectReason = (id) => {
    setRejectReasonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const rejectChecklistItems = useMemo(
    () => (rejectModal ? buildRejectChecklistItems(rejectModal.application, rejectModal.role) : []),
    [rejectModal],
  )

  const rejectFormValid = rejectReasonIds.length >= 1

  const applyApprove = () => {
    if (!approveModal) return
    setDecisionById((prev) => ({ ...prev, [approveModal.applicationId]: 'approve' }))
    setApproveModal(null)
  }

  const submitReject = () => {
    setRejectTouched(true)
    if (!rejectModal || !rejectFormValid) return

    const byId = new Map(rejectChecklistItems.map((r) => [r.id, r]))
    const reasonLabels = rejectReasonIds.map((id) => byId.get(id)?.label).filter(Boolean)
    const now = new Date()
    const logEntry = {
      id: `log-${now.getTime()}`,
      at: now.toISOString(),
      applicationId: rejectModal.applicationId,
      applicantName: rejectModal.name,
      applicantEmail: rejectModal.email,
      role: rejectModal.role,
      reasons: reasonLabels,
      extraNote: rejectExtraNote.trim() || null,
      channels: ['email', 'push'],
    }
    setAdminLog((prev) => [logEntry, ...prev].slice(0, 40))
    setDecisionById((prev) => ({ ...prev, [rejectModal.applicationId]: 'reject' }))
    closeRejectModal()
    setToast({
      type: 'success',
      title: 'Red işlemi tamamlandı',
      body: `${rejectModal.name} başvurusu reddedildi. Bildirim ve e-posta kuyruğa alındı; kayıt yönetici günlüğüne eklendi.`,
    })
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
                      onClick={() => openApproveConfirm(app)}
                    >
                      <CheckIcon />
                    </button>
                    <button
                      type="button"
                      className="approval-btn approval-btn--reject"
                      aria-label="Reddet"
                      onClick={() => openRejectFlow(app)}
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

      <section className="approval-log" aria-label="Yönetici işlem günlüğü">
        <div className="approval-log__head">
          <h2 className="approval-log__title">İşlem günlüğü</h2>
          <p className="approval-log__sub">Red işlemleri e-posta / bildirim kuyruğu ve günlük kaydı (simülasyon)</p>
        </div>
        {adminLog.length === 0 ? (
          <p className="approval-log__empty">Henüz red kaydı yok. Red işlemi gönderildiğinde burada listelenir.</p>
        ) : (
          <ul className="approval-log__list">
            {adminLog.slice(0, 8).map((row) => (
              <li key={row.id} className="approval-log__item">
                <div className="approval-log__item-top">
                  <span className="approval-log__time">{formatLogTime(new Date(row.at))}</span>
                  <span className="approval-log__badge">Red</span>
                  <span className="approval-log__who">{row.applicantName}</span>
                </div>
                <span className="approval-log__reasons">{row.reasons.join(' · ')}</span>
                {row.extraNote ? <span className="approval-log__note">Ek not: “{row.extraNote}”</span> : null}
                <span className="approval-log__channels">
                  Bildirim: {row.channels.join(', ')} (kuyruk)
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {approveModal && (
        <div
          className="approval-confirm-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setApproveModal(null)
          }}
        >
          <div className="approval-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="approval-approve-title">
            <h2 id="approval-approve-title" className="approval-confirm-title">
              Başvuruyu onayla
            </h2>
            <p className="approval-confirm-text">
              <strong>{approveModal.name}</strong> için onay işlemini gerçekleştirmek istediğinize emin misiniz?
            </p>
            <div className="approval-confirm-actions">
              <button type="button" className="approval-confirm-btn approval-confirm-btn--ghost" onClick={() => setApproveModal(null)}>
                Vazgeç
              </button>
              <button type="button" className="approval-confirm-btn approval-confirm-btn--approve" onClick={applyApprove}>
                Evet, onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div
          className="approval-confirm-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRejectModal()
          }}
        >
          <div
            className="approval-reject-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="approval-reject-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="approval-reject-modal__head">
              <div>
                <h2 id="approval-reject-title" className="approval-reject-modal__title">
                  Başvuruyu reddet
                </h2>
                <p className="approval-reject-modal__sub">
                  <strong>{rejectModal.name}</strong>
                  {rejectModal.email ? (
                    <>
                      {' '}
                      <span className="approval-reject-modal__muted">({rejectModal.email})</span>
                    </>
                  ) : null}
                </p>
              </div>
              <button type="button" className="approval-reject-close" onClick={closeRejectModal} aria-label="Kapat">
                ×
              </button>
            </div>

            <div className="approval-reject-modal__body">
              <div className="approval-reject-modal__main">
                <div className="approval-reject-intro">
                  <p className="approval-reject-section-label">Başvuru kalemleri</p>
                  <p className="approval-reject-hint">
                    Kayıt bilgisi ve belgelerden red ile ilişkilendireceklerinizi işaretleyin. En az bir kalem
                    zorunludur.
                  </p>
                </div>
                <div className="approval-reject-columns" aria-label="Red için başvuru kalemleri sütunları">
                  {[REJECT_SECTION.REG, REJECT_SECTION.VEH, REJECT_SECTION.DOC].map((section) => {
                    const list = rejectChecklistItems.filter((i) => i.section === section)
                    if (!list.length) return null
                    return (
                      <div key={section} className="approval-reject-column">
                        <p className="approval-reason-section__title">{section}</p>
                        <div className="approval-reason-stack" role="group" aria-label={section}>
                          {list.map((r) => {
                            const on = rejectReasonIds.includes(r.id)
                            return (
                              <label key={r.id} className={`approval-reason-card${on ? ' approval-reason-card--on' : ''}`}>
                                <input
                                  type="checkbox"
                                  className="approval-reason-card__input"
                                  checked={on}
                                  onChange={() => toggleRejectReason(r.id)}
                                />
                                <span className="approval-reason-card__box" aria-hidden />
                                <span className="approval-reason-card__text">
                                  <span className="approval-reason-card__label">{r.label}</span>
                                  {r.detail ? <span className="approval-reason-card__detail">{r.detail}</span> : null}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {rejectTouched && rejectReasonIds.length === 0 ? (
                  <p className="approval-reject-error approval-reject-error--main" role="alert">
                    Göndermek için en az bir başvuru kalemi seçin.
                  </p>
                ) : null}
              </div>

              <aside className="approval-reject-modal__aside" aria-label="Red mesajı ve işlemler">
                <label className="approval-reject-field approval-reject-field--aside" htmlFor="reject-extra-note">
                  <span className="approval-reject-field__label">
                    Ek açıklama / red mesajı
                    <span className="approval-reject-field__opt"> (isteğe bağlı)</span>
                  </span>
                  <textarea
                    id="reject-extra-note"
                    className="approval-reject-textarea approval-reject-textarea--fill"
                    value={rejectExtraNote}
                    onChange={(e) => setRejectExtraNote(e.target.value)}
                    placeholder="Başvurana iletilecek ek not…"
                  />
                </label>
                <div className="approval-reject-aside-foot">
                  <p className="approval-reject-foot__note">
                    Gönderimde <strong>e-posta</strong> ve <strong>bildirim</strong> kuyruğa alınır; kayıt{' '}
                    <strong>günlüğe</strong> düşer.
                  </p>
                  <div className="approval-reject-actions">
                    <button type="button" className="approval-confirm-btn approval-confirm-btn--ghost" onClick={closeRejectModal}>
                      İptal
                    </button>
                    <button
                      type="button"
                      className={`approval-confirm-btn approval-confirm-btn--reject approval-confirm-btn--send${!rejectFormValid ? ' approval-confirm-btn--muted' : ''}`}
                      onClick={submitReject}
                      title={!rejectFormValid ? 'En az bir başvuru kalemi seçin' : undefined}
                    >
                      Gönder
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="approval-toast" role="status">
          <div className="approval-toast__icon" aria-hidden>
            ✓
          </div>
          <div>
            <p className="approval-toast__title">{toast.title}</p>
            <p className="approval-toast__body">{toast.body}</p>
          </div>
          <button type="button" className="approval-toast__close" onClick={() => setToast(null)} aria-label="Kapat">
            ×
          </button>
        </div>
      )}
    </section>
  )
}

export default DriverCourierApprovalPage
