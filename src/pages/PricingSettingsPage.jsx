import { useEffect, useMemo, useState } from 'react'
import './PricingSettingsPage.css'

const STORAGE_KEY = 'geladmin_pricing_settings'
const MAX_DISCOUNT_CAP = 100

function readInitialSettings() {
  if (typeof window === 'undefined') {
    return { kmFee: '12', maxDiscountRate: '20' }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { kmFee: '12', maxDiscountRate: '20' }
    const parsed = JSON.parse(raw)
    return {
      kmFee: String(parsed.kmFee ?? '12'),
      maxDiscountRate: String(parsed.maxDiscountRate ?? '20'),
    }
  } catch {
    return { kmFee: '12', maxDiscountRate: '20' }
  }
}

function clampRate(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(MAX_DISCOUNT_CAP, n))
}

function PricingSettingsPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [kmFee, setKmFee] = useState('12')
  const [maxDiscountRate, setMaxDiscountRate] = useState('20')
  const [savedKmFee, setSavedKmFee] = useState('12')
  const [kmMessage, setKmMessage] = useState('')
  const [discountMessage, setDiscountMessage] = useState('')

  useEffect(() => {
    const initial = readInitialSettings()
    setKmFee(initial.kmFee)
    setSavedKmFee(initial.kmFee)
    setMaxDiscountRate(initial.maxDiscountRate)
  }, [])

  const preview = useMemo(() => {
    const kmFeeNumber = Math.max(0, Number(savedKmFee) || 0)
    const maxDiscount = clampRate(maxDiscountRate)
    const sampleDistance = 10
    const grossAmount = kmFeeNumber * sampleDistance
    const discountAmount = (grossAmount * maxDiscount) / 100
    return {
      kmFeeNumber,
      maxDiscount,
      grossAmount,
      discountAmount,
      netAmount: Math.max(0, grossAmount - discountAmount),
    }
  }, [savedKmFee, maxDiscountRate])

  const savePayload = (payload) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  const handleSaveKmFee = () => {
    const safeKmFee = Math.max(0, Number(kmFee) || 0)
    const safeDiscount = clampRate(maxDiscountRate)
    const payload = {
      kmFee: Number(safeKmFee.toFixed(2)),
      maxDiscountRate: safeDiscount,
      updatedAt: new Date().toISOString(),
    }
    savePayload(payload)
    setSavedKmFee(String(payload.kmFee))
    setKmFee(String(payload.kmFee))
    setKmMessage('Km başına ücret kaydedildi.')
    window.setTimeout(() => setKmMessage(''), 2600)
    setActiveStep(2)
  }

  const handleSaveDiscount = () => {
    const safeKmFee = Math.max(0, Number(savedKmFee) || 0)
    const safeDiscount = clampRate(maxDiscountRate)
    const payload = {
      kmFee: Number(safeKmFee.toFixed(2)),
      maxDiscountRate: safeDiscount,
      updatedAt: new Date().toISOString(),
    }
    savePayload(payload)
    setMaxDiscountRate(String(safeDiscount))
    setDiscountMessage('Maksimum indirim oranı kaydedildi.')
    window.setTimeout(() => setDiscountMessage(''), 2600)
  }

  return (
    <section className="pricing-page" aria-labelledby="pricing-page-title">
      <header className="pricing-page__head">
        <h1 id="pricing-page-title" className="pricing-page__title">
          Ücret ve indirim ayarları
        </h1>
        <p className="pricing-page__subtitle">
          Km başına ücret ve toplam tutar için izin verilen maksimum indirim oranını yönetin.
        </p>
      </header>

      <div className="pricing-wizard">
        <aside className="pricing-steps" aria-label="Ayar adımları">
          <button
            type="button"
            className={`pricing-step${activeStep === 1 ? ' pricing-step--active' : ''}`}
            onClick={() => setActiveStep(1)}
          >
            <span className="pricing-step__badge">1</span>
            <span className="pricing-step__text">
              <strong>Km ücreti</strong>
              <small>Önce birim fiyatı gir ve kaydet</small>
            </span>
          </button>

          <button
            type="button"
            className={`pricing-step${activeStep === 2 ? ' pricing-step--active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className="pricing-step__badge">2</span>
            <span className="pricing-step__text">
              <strong>İndirim oranı</strong>
              <small>Toplam tutar için yüzde sınırını ayarla</small>
            </span>
          </button>
        </aside>

        <article className="pricing-card pricing-card--main">
          {activeStep === 1 ? (
            <>
              <h2 className="pricing-card__title">Adım 1: Km başına ücret</h2>
              <p className="pricing-card__subtitle">
                Mobil uygulamadaki hesaplamaların temelini oluşturacak birim fiyatı belirleyin.
              </p>

              <label className="pricing-field">
                <span className="pricing-field__label">Km başına ücret (TL)</span>
                <div className="pricing-input-wrap">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    value={kmFee}
                    onChange={(e) => setKmFee(e.target.value)}
                    className="pricing-input"
                  />
                  <span className="pricing-input__suffix">TL</span>
                </div>
              </label>

              <div className="pricing-actions">
                <button type="button" className="pricing-save-btn" onClick={handleSaveKmFee}>
                  Km ücretini kaydet
                </button>
                <button type="button" className="pricing-next-btn" onClick={() => setActiveStep(2)}>
                  Sonraki adım
                </button>
              </div>

              {kmMessage ? <p className="pricing-save-msg">{kmMessage}</p> : null}
            </>
          ) : (
            <>
              <h2 className="pricing-card__title">Adım 2: Maksimum indirim oranı</h2>
              <p className="pricing-card__subtitle">
                Belirlenen km ücreti üzerinden hesaplanan toplam tutara uygulanabilecek üst indirim
                sınırını %0 ile %{MAX_DISCOUNT_CAP} arasında tanımlayın.
              </p>

              <label className="pricing-field">
                <span className="pricing-field__label">
                  Maksimum indirim oranı (%0 - %{MAX_DISCOUNT_CAP})
                </span>
                <div className="pricing-discount-row">
                  <input
                    type="range"
                    min="0"
                    max={MAX_DISCOUNT_CAP}
                    step="1"
                    value={clampRate(maxDiscountRate)}
                    onChange={(e) => setMaxDiscountRate(e.target.value)}
                    className="pricing-range"
                  />
                  <input
                    type="number"
                    min="0"
                    max={MAX_DISCOUNT_CAP}
                    step="1"
                    inputMode="numeric"
                    value={maxDiscountRate}
                    onChange={(e) => setMaxDiscountRate(String(clampRate(e.target.value)))}
                    className="pricing-input pricing-input--small"
                  />
                  <span className="pricing-input__suffix">%</span>
                </div>
              </label>

              <aside className="pricing-card pricing-card--preview" aria-live="polite">
                <h3 className="pricing-card__title pricing-card__title--small">Canlı önizleme</h3>
                <p className="pricing-preview__text">Örnek hesaplama (10 km):</p>
                <dl className="pricing-preview-list">
                  <dt>Kayıtlı km ücreti</dt>
                  <dd>{preview.kmFeeNumber.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</dd>

                  <dt>Ara toplam</dt>
                  <dd>{preview.grossAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</dd>

                  <dt>Maksimum indirim (%{preview.maxDiscount})</dt>
                  <dd>-{preview.discountAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</dd>

                  <dt>Minimum ödenecek tutar</dt>
                  <dd className="pricing-preview-list__final">
                    {preview.netAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                  </dd>
                </dl>
              </aside>

              <div className="pricing-actions">
                <button type="button" className="pricing-back-btn" onClick={() => setActiveStep(1)}>
                  Önceki adım
                </button>
                <button type="button" className="pricing-save-btn" onClick={handleSaveDiscount}>
                  İndirim oranını kaydet
                </button>
              </div>

              {discountMessage ? <p className="pricing-save-msg">{discountMessage}</p> : null}
            </>
          )}
        </article>
      </div>
    </section>
  )
}

export default PricingSettingsPage
