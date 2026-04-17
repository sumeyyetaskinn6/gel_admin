import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  MOCK_COURIER_DELIVERIES_BY_USER_ID,
  MOCK_DRIVER_TRIPS_BY_USER_ID,
  MOCK_PASSENGER_RIDES_BY_USER_ID,
  MOCK_PASSENGER_SENDS_BY_USER_ID,
  VALID_ROLES,
  findUser,
  formatKayitTarihi,
  getMockLiveLocation,
} from '../data/userManagementMock'
import './UserDetailPage.css'

const ROLE_LABELS = {
  driver: 'Sürücü',
  courier: 'Kurye',
  passenger: 'Yolcu',
}

function DefRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  )
}

function DocumentCard({ label, url }) {
  if (!url) return null
  return (
    <figure className="ud-doc">
      <a href={url} target="_blank" rel="noopener noreferrer" className="ud-doc__link">
        <img src={url} alt="" className="ud-doc__thumb" />
      </a>
      <figcaption className="ud-doc__cap">{label}</figcaption>
    </figure>
  )
}

function UserDetailPage() {
  const { role, userId } = useParams()
  const navigate = useNavigate()

  if (!VALID_ROLES.includes(role)) {
    return <Navigate to="/dashboard/user-management" replace />
  }

  const user = findUser(role, userId)
  if (!user) {
    return <Navigate to="/dashboard/user-management" replace />
  }

  const isLocationEligibleRole = role === 'driver' || role === 'courier'
  const isLocationOnline = isLocationEligibleRole && Boolean(user.locationEnabled)
  const mapSrc = isLocationOnline
    ? (() => {
        const { lat, lng } = getMockLiveLocation(user.id)
        return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      })()
    : null

  const driverTrips = MOCK_DRIVER_TRIPS_BY_USER_ID[user.id] ?? []
  const courierDeliveries = MOCK_COURIER_DELIVERIES_BY_USER_ID[user.id] ?? []
  const passengerSends = MOCK_PASSENGER_SENDS_BY_USER_ID[user.id] ?? []
  const passengerRides = MOCK_PASSENGER_RIDES_BY_USER_ID[user.id] ?? []

  return (
    <section className="ud-page">
      <button type="button" className="ud-back" onClick={() => navigate('/dashboard/user-management')}>
        ← Kullanıcı listesine dön
      </button>

      <header className="ud-header">
        <div>
          <h1 className="ud-title">{user.name}</h1>
          <p className="ud-meta">
            <span>{user.phone}</span>
            <span className="ud-badge">{ROLE_LABELS[role]}</span>
            {isLocationEligibleRole && (
              <span className={`ud-location-badge ${isLocationOnline ? 'ud-location-badge--online' : 'ud-location-badge--offline'}`}>
                Konum {isLocationOnline ? 'Açık' : 'Kapalı'}
              </span>
            )}
            <span className="ud-meta__muted">Kayıt: {formatKayitTarihi(user.registeredAt)}</span>
          </p>
        </div>
      </header>

      <article className="ud-profile-card" aria-labelledby="ud-profile-title">
        <h2 id="ud-profile-title" className="ud-section-title">
          Kayıt bilgileri
        </h2>
        <p className="ud-section-hint">Kullanıcı tipine göre kayıtta yer alan tüm alanlar.</p>

        <dl className="ud-dl">
          <DefRow label="Telefon numarası" value={user.phone} />
          <DefRow label="Ad" value={user.firstName} />
          <DefRow label="Soyad" value={user.lastName} />
          <DefRow label="E-posta adresi" value={user.email} />
          <DefRow label="GSM numarası" value={user.gsm} />
          <DefRow label="Cinsiyet" value={user.gender} />

          {role === 'driver' && (
            <>
              <DefRow label="IBAN numarası" value={user.iban} />
              <DefRow label="Marka" value={user.vehicleBrand} />
              <DefRow label="Model" value={user.vehicleModel} />
              <DefRow label="Yıl" value={user.vehicleYear} />
              <DefRow label="Renk" value={user.vehicleColor} />
              <DefRow label="Plaka" value={user.plate} />
            </>
          )}

          {role === 'courier' && (
            <>
              <DefRow label="IBAN numarası" value={user.iban} />
              <DefRow label="Araç tipi" value={user.vehicleType} />
              <DefRow label="Marka" value={user.vehicleBrand} />
              <DefRow label="Model" value={user.vehicleModel} />
              <DefRow label="Yıl" value={user.vehicleYear} />
              <DefRow label="Renk" value={user.vehicleColor} />
            </>
          )}
        </dl>

        {(role === 'driver' || role === 'courier') && (
          <div className="ud-docs">
            <h3 className="ud-docs__title">Yüklenen belgeler</h3>
            <div className="ud-docs__grid">
              <DocumentCard label="Ehliyet ön yüzü" url={user.licenseFrontUrl} />
              <DocumentCard label="Ehliyet arka yüzü" url={user.licenseBackUrl} />
              <DocumentCard label="Ruhsat ön yüzü" url={user.registrationFrontUrl} />
              <DocumentCard label="Ruhsat arka yüzü" url={user.registrationBackUrl} />
              <DocumentCard label="Sabıka kaydı" url={user.criminalRecordUrl} />
              {role === 'courier' && <DocumentCard label="P1 belgesi" url={user.p1DocumentUrl} />}
            </div>
          </div>
        )}
      </article>

      {isLocationEligibleRole && (
        <article className="ud-map-card">
          <h2 className="ud-section-title">Canlı konum</h2>
          {isLocationOnline ? (
            <>
              <p className="ud-section-hint">Haritada gösterilen konum örnek (mock) veridir.</p>
              <div className="ud-map-frame">
                <iframe title={`${user.name} canlı konum`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </>
          ) : (
            <p className="ud-offline-note">
              Kullanıcı mobil uygulamada konum paylaşımını kapattığı için haritada canlı konum gösterilemiyor.
            </p>
          )}
        </article>
      )}

      {role === 'courier' && (
        <section className="ud-list-section" aria-labelledby="ud-courier-deliveries">
          <h2 id="ud-courier-deliveries" className="ud-section-title">
            Geçmiş teslimatlar
          </h2>
          {courierDeliveries.length === 0 ? (
            <p className="ud-empty">Kayıtlı teslimat bulunmuyor.</p>
          ) : (
            <ul className="ud-card-list">
              {courierDeliveries.map((d) => (
                <li key={d.id} className="ud-card">
                  <span className="ud-card__date">{d.date}</span>
                  <span className="ud-card__main">{d.address}</span>
                  <span className="ud-card__tag">{d.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {role === 'driver' && (
        <section className="ud-list-section" aria-labelledby="ud-driver-trips">
          <h2 id="ud-driver-trips" className="ud-section-title">
            Geçmiş yolculuklar
          </h2>
          {driverTrips.length === 0 ? (
            <p className="ud-empty">Kayıtlı yolculuk bulunmuyor.</p>
          ) : (
            <ul className="ud-card-list">
              {driverTrips.map((t) => (
                <li key={t.id} className="ud-card">
                  <span className="ud-card__date">{t.date}</span>
                  <span className="ud-card__main">{t.route}</span>
                  <span className="ud-card__amount">{t.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {role === 'passenger' && (
        <>
          <section className="ud-list-section" aria-labelledby="ud-passenger-sends">
            <h2 id="ud-passenger-sends" className="ud-section-title">
              Kurye gönderileri
            </h2>
            {passengerSends.length === 0 ? (
              <p className="ud-empty">Kayıtlı kurye gönderisi yok.</p>
            ) : (
              <ul className="ud-card-list">
                {passengerSends.map((s) => (
                  <li key={s.id} className="ud-card">
                    <span className="ud-card__date">{s.date}</span>
                    <span className="ud-card__main">
                      {s.item} — {s.address}
                    </span>
                    <span className="ud-card__tag">{s.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="ud-list-section" aria-labelledby="ud-passenger-rides">
            <h2 id="ud-passenger-rides" className="ud-section-title">
              Yolculuklar
            </h2>
            {passengerRides.length === 0 ? (
              <p className="ud-empty">Kayıtlı yolculuk yok.</p>
            ) : (
              <ul className="ud-card-list">
                {passengerRides.map((r) => (
                  <li key={r.id} className="ud-card">
                    <span className="ud-card__date">{r.date}</span>
                    <span className="ud-card__main">{r.route}</span>
                    <span className="ud-card__amount">{r.amount}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </section>
  )
}

export default UserDetailPage
