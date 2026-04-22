import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './RegionalDistributionPage.css'

const GEOJSON_PATH = '/turkey-provinces.json'
const STORAGE_KEY = 'regional-distribution-provinces'

const STYLE_DEFAULT = {
  color: '#94a3b8',
  weight: 1.2,
  fillColor: '#e2e8f0',
  fillOpacity: 0.9,
}

const STYLE_HOVER = {
  color: '#1e8e3e',
  weight: 2,
  fillColor: '#bbf7d0',
  fillOpacity: 0.95,
}

const STYLE_ACTIVE = {
  color: '#166534',
  weight: 2,
  fillColor: '#34a853',
  fillOpacity: 0.92,
}

function loadSelectedFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return new Set()
    return new Set(arr)
  } catch {
    return new Set()
  }
}

function MapFitBounds({ data }) {
  const map = useMap()
  useEffect(() => {
    if (!data?.features?.length) return
    const fg = L.geoJSON(data)
    const b = fg.getBounds()
    if (b.isValid()) {
      map.fitBounds(b, { padding: [32, 32], maxZoom: 7 })
    }
  }, [data, map])
  return null
}

function RegionalDistributionPage() {
  const [geoData, setGeoData] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [selected, setSelected] = useState(() => {
    const s = loadSelectedFromStorage()
    return s
  })
  const selectedRef = useRef(new Set())
  const layersByProvince = useRef(new Map())
  const [modal, setModal] = useState(null)
  const prevSelectedSnapshot = useRef(new Set())

  useEffect(() => {
    selectedRef.current = new Set(selected)
  }, [selected])

  useEffect(() => {
    if (!geoData) return
    const old = prevSelectedSnapshot.current
    for (const name of selected) {
      if (!old.has(name)) {
        layersByProvince.current.get(name)?.setStyle(STYLE_ACTIVE)
      }
    }
    for (const name of old) {
      if (!selected.has(name)) {
        layersByProvince.current.get(name)?.setStyle(STYLE_DEFAULT)
      }
    }
    prevSelectedSnapshot.current = new Set(selected)
  }, [selected, geoData])

  useEffect(() => {
    if (!selected || selected.size === 0) {
      localStorage.setItem(STORAGE_KEY, '[]')
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]))
    }
  }, [selected])

  useEffect(
    () => () => {
      layersByProvince.current.clear()
    },
    [],
  )

  useEffect(() => {
    let cancelled = false
    fetch(GEOJSON_PATH)
      .then((r) => {
        if (!r.ok) throw new Error('Harita verisi yüklenemedi')
        return r.json()
      })
      .then((data) => {
        if (!cancelled) {
          if (data?.type === 'FeatureCollection' && data.features?.length) {
            setGeoData(data)
          } else {
            setLoadError('Geçersiz harita verisi')
          }
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e?.message || 'Bilinmeyen hata')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const getProvinceName = useCallback((feature) => feature?.properties?.NAME_1, [])

  const applyLayerStyle = useCallback((name) => {
    const layer = layersByProvince.current.get(name)
    if (!layer) return
    if (selectedRef.current.has(name)) {
      layer.setStyle(STYLE_ACTIVE)
    } else {
      layer.setStyle(STYLE_DEFAULT)
    }
  }, [])

  const onEachFeature = useCallback(
    (feature, layer) => {
      const name = getProvinceName(feature)
      if (!name) return
      if (!(layer instanceof L.Path)) return
      layersByProvince.current.set(name, layer)
      if (selectedRef.current.has(name)) {
        layer.setStyle(STYLE_ACTIVE)
      } else {
        layer.setStyle(STYLE_DEFAULT)
      }
      layer.on({
        mouseover: () => {
          if (!selectedRef.current.has(name)) {
            layer.setStyle(STYLE_HOVER)
            layer.bringToFront()
          }
        },
        mouseout: () => {
          applyLayerStyle(name)
        },
        click: (e) => {
          L.DomEvent.stop(e)
          const isOn = selectedRef.current.has(name)
          setModal({ name, mode: isOn ? 'remove' : 'add' })
        },
      })
    },
    [applyLayerStyle, getProvinceName],
  )

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  const confirmModal = useCallback(() => {
    if (!modal) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (modal.mode === 'add') {
        next.add(modal.name)
      } else {
        next.delete(modal.name)
      }
      return next
    })
    setModal(null)
  }, [modal])

  const selectedSorted = useMemo(
    () => [...selected].sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' })),
    [selected],
  )

  const removeProvinceFromList = useCallback((name) => {
    setSelected((prev) => {
      if (!prev.has(name)) return prev
      const next = new Set(prev)
      next.delete(name)
      return next
    })
  }, [])

  return (
    <section className="regional-page" aria-labelledby="regional-page-title">
      <header className="regional-page__head">
        <h1 id="regional-page-title" className="regional-page__title">
          Bölgesel dağılım
        </h1>
        <p className="regional-page__subtitle">İllere tıklayarak uygulamayı açın veya kapatın; seçimler haritada yeşil alanla gösterilir.</p>
      </header>

      {loadError ? <p className="regional-page__error">{loadError}</p> : null}
      {!loadError && !geoData ? <p className="regional-page__loading" aria-live="polite">Harita yükleniyor…</p> : null}

      {geoData ? (
        <div className="regional-map-wrap">
          <div className="regional-map-legend" aria-hidden="true">
            <span>
              <span className="regional-map-legend__sw" data-variant="def" />
              Açık değil
            </span>
            <span>
              <span className="regional-map-legend__sw" data-variant="on" />
              Açık (seçili)
            </span>
          </div>
          <div className="regional-leaflet-root">
            <MapContainer
              className="regional-map"
              center={[39, 35.2]}
              zoom={6}
              minZoom={5}
              maxZoom={10}
              scrollWheelZoom
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <MapFitBounds data={geoData} />
              <GeoJSON
                data={geoData}
                onEachFeature={onEachFeature}
                style={STYLE_DEFAULT}
              />
            </MapContainer>
          </div>
          <p className="regional-map-hint" role="note">
            İl sınırları: GADM / FeatureCollection. Seçimler bu tarayıcıda saklanır.
          </p>
        </div>
      ) : null}

      {geoData ? (
        <section
          className="regional-selected"
          aria-labelledby="regional-selected-title"
        >
          <div className="regional-selected__head">
            <h2 id="regional-selected-title" className="regional-selected__title">
              Seçili iller
            </h2>
            <span
              className="regional-selected__count"
              aria-live="polite"
              aria-atomic="true"
            >
              {selected.size === 0
                ? '0 il'
                : `${selected.size} il seçildi`}
            </span>
          </div>

          {selected.size === 0 ? (
            <p className="regional-selected__empty">Haritadan il seçtiğinizde burada listelenir.</p>
          ) : (
            <ul className="regional-selected__chips" role="list">
              {selectedSorted.map((name) => (
                <li key={name} className="regional-chip" role="listitem">
                  <span className="regional-chip__label">{name}</span>
                  <button
                    type="button"
                    className="regional-chip__remove"
                    onClick={() => removeProvinceFromList(name)}
                    aria-label={`${name} ilini listeden ve haritadan kaldır`}
                  >
                    <span className="regional-chip__remove-icon" aria-hidden>×</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {modal ? (
        <div
          className="regional-modal-backdrop"
          role="presentation"
          onClick={closeModal}
        >
          <div
            className="regional-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="regional-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="regional-modal-title" className="regional-modal__title">
              {modal.mode === 'add' ? 'Bölge onayı' : 'Bölgeyi kapat'}
            </h2>
            {modal.mode === 'add' ? (
              <p className="regional-modal__text">
                <strong>{modal.name}</strong> — Uygulamayı bu bölgede açmak istiyor musunuz?
              </p>
            ) : (
              <p className="regional-modal__text">
                <strong>{modal.name}</strong> — Bu bölgede uygulamayı kapatmak istiyor musunuz?
              </p>
            )}
            <div className="regional-modal__actions">
              <button type="button" className="regional-btn regional-btn--ghost" onClick={closeModal}>
                Vazgeç
              </button>
              <button type="button" className="regional-btn regional-btn--primary" onClick={confirmModal}>
                Evet
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default RegionalDistributionPage
