import { useEffect, useMemo, useRef, useState } from 'react'
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

const APPLICANT_PHOTO = '/car.png'

const MOCK_DRIVER_APPLICATIONS = [
  {
    id: 'd1',
    name: 'Burak Yazar',
    note:
      'Başvuru yazısı, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy.',
    photo: APPLICANT_PHOTO,
  },
  {
    id: 'd2',
    name: 'Ayşe Kaya',
    note:
      'Başvuru yazısı, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy.',
    photo: APPLICANT_PHOTO,
  },
  {
    id: 'd3',
    name: 'Mehmet Öz',
    note:
      'Başvuru yazısı, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy.',
    photo: APPLICANT_PHOTO,
  },
  {
    id: 'd4',
    name: 'Zeynep Arslan',
    note:
      'Başvuru yazısı, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy.',
    photo: APPLICANT_PHOTO,
  },
]

const MOCK_COURIER_APPLICATIONS = [
  {
    id: 'c1',
    name: 'Can Demir',
    note:
      'Kurye başvurusu metni, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy.',
    photo: APPLICANT_PHOTO,
  },
  {
    id: 'c2',
    name: 'Elif Şahin',
    note:
      'Kurye başvurusu metni, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy.',
    photo: APPLICANT_PHOTO,
  },
]

function FolderIcon() {
  return (
    <svg className="approval-doc-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
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
  const dayCardRefs = useRef([])

  useEffect(() => {
    dayCardRefs.current[selectedDayIndex]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedDayIndex])

  const applications = useMemo(
    () => (activeTab === 'driver' ? MOCK_DRIVER_APPLICATIONS : MOCK_COURIER_APPLICATIONS),
    [activeTab],
  )

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
              <img className="approval-row__photo" src={app.photo} alt="" width={96} height={96} />
              <div className="approval-row__body">
                <h2 className="approval-row__name">{app.name}</h2>
                <p className="approval-row__note">{app.note}</p>
                <button type="button" className="approval-doc-btn">
                  <FolderIcon />
                  Belgeler
                </button>
              </div>
              <div className="approval-row__side">
                <div className="approval-dots" aria-label="Ön değerlendirme">
                  <span className="approval-dots__item" />
                  <span className="approval-dots__item" />
                  <span className="approval-dots__item approval-dots__item--on" />
                </div>
                <div className="approval-actions">
                  <button type="button" className="approval-btn approval-btn--approve" aria-label="Onayla">
                    <CheckIcon />
                  </button>
                  <button type="button" className="approval-btn approval-btn--reject" aria-label="Reddet">
                    <XIcon />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DriverCourierApprovalPage
