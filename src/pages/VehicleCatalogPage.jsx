import { useMemo, useState } from 'react'
import './VehicleCatalogPage.css'

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/** Yalnız marka → model hiyerarşisi (araç tipi yok) */
const INITIAL_BRANDS = [
  {
    id: 'b-1',
    name: 'Ford',
    models: [
      { id: 'm-1', name: 'Focus' },
      { id: 'm-2', name: 'Fiesta' },
    ],
  },
  {
    id: 'b-2',
    name: 'Renault',
    models: [{ id: 'm-3', name: 'Clio' }],
  },
  {
    id: 'b-3',
    name: 'Yamaha',
    models: [{ id: 'm-4', name: 'NMAX 125' }],
  },
]

function VehicleCatalogPage() {
  const [brands, setBrands] = useState(INITIAL_BRANDS)
  const [selectedBrandId, setSelectedBrandId] = useState(INITIAL_BRANDS[0]?.id ?? null)
  const [newBrandName, setNewBrandName] = useState('')
  const [newModelName, setNewModelName] = useState('')
  const [editingBrandId, setEditingBrandId] = useState(null)
  const [editBrandDraft, setEditBrandDraft] = useState('')
  const [editingModelId, setEditingModelId] = useState(null)
  const [editModelDraft, setEditModelDraft] = useState('')

  const selectedBrand = useMemo(
    () => brands.find((b) => b.id === selectedBrandId) ?? null,
    [brands, selectedBrandId],
  )

  const cancelBrandEdit = () => {
    setEditingBrandId(null)
    setEditBrandDraft('')
  }

  const startEditBrand = (b) => {
    setEditingBrandId(b.id)
    setEditBrandDraft(b.name)
  }

  const saveBrandEdit = () => {
    const name = editBrandDraft.trim()
    if (!name || !editingBrandId) return
    setBrands((prev) =>
      prev.map((b) => (b.id === editingBrandId ? { ...b, name } : b)),
    )
    cancelBrandEdit()
  }

  const addBrand = () => {
    const name = newBrandName.trim()
    if (!name) return
    const id = newId('b')
    setBrands((prev) => [...prev, { id, name, models: [] }])
    setSelectedBrandId(id)
    setNewBrandName('')
    cancelBrandEdit()
  }

  const removeBrand = (brandId) => {
    if (!window.confirm('Bu markayı ve tüm modellerini silmek istiyor musunuz?')) return
    const next = brands.filter((b) => b.id !== brandId)
    setBrands(next)
    if (selectedBrandId === brandId) {
      setSelectedBrandId(next[0]?.id ?? null)
    }
    if (editingBrandId === brandId) cancelBrandEdit()
  }

  const cancelModelEdit = () => {
    setEditingModelId(null)
    setEditModelDraft('')
  }

  const startEditModel = (m) => {
    setEditingModelId(m.id)
    setEditModelDraft(m.name)
  }

  const saveModelEdit = () => {
    const name = editModelDraft.trim()
    if (!name || !editingModelId || !selectedBrandId) return
    setBrands((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBrandId) return b
        return {
          ...b,
          models: b.models.map((m) => (m.id === editingModelId ? { ...m, name } : m)),
        }
      }),
    )
    cancelModelEdit()
  }

  const addModel = () => {
    const name = newModelName.trim()
    if (!name || !selectedBrandId) return
    const id = newId('m')
    setBrands((prev) =>
      prev.map((b) =>
        b.id === selectedBrandId ? { ...b, models: [...b.models, { id, name }] } : b,
      ),
    )
    setNewModelName('')
  }

  const removeModel = (brandId, modelId) => {
    if (!window.confirm('Bu modeli silmek istiyor musunuz?')) return
    setBrands((prev) =>
      prev.map((b) =>
        b.id === brandId ? { ...b, models: b.models.filter((m) => m.id !== modelId) } : b,
      ),
    )
    if (editingModelId === modelId) cancelModelEdit()
  }

  return (
    <section className="veh-page">
      <header className="veh-page__head">
        <div>
          <h1 className="veh-page__title">Araç bilgileri</h1>
          <p className="veh-page__sub">
            Marka ve model listelerini ekleyin, düzenleyin veya kaldırın. Mobil uygulamadaki seçim alanlarına bağlanabilir.
          </p>
        </div>
      </header>

      <div className="veh-columns">
        <div className="veh-panel">
          <h2 className="veh-panel__title">Marka</h2>
          <ul className="veh-list">
            {brands.map((b) => (
              <li key={b.id}>
                {editingBrandId === b.id ? (
                  <div className="veh-edit-row">
                    <input
                      type="text"
                      className="veh-input"
                      value={editBrandDraft}
                      onChange={(e) => setEditBrandDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveBrandEdit()
                        if (e.key === 'Escape') cancelBrandEdit()
                      }}
                      aria-label="Marka adı"
                    />
                    <button type="button" className="veh-btn veh-btn--primary" onClick={saveBrandEdit}>
                      Kaydet
                    </button>
                    <button type="button" className="veh-btn veh-btn--ghost" onClick={cancelBrandEdit}>
                      İptal
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`veh-list-item${b.id === selectedBrandId ? ' veh-list-item--active' : ''}`}
                      onClick={() => setSelectedBrandId(b.id)}
                    >
                      <span className="veh-list-item__name">{b.name}</span>
                      <span className="veh-list-item__meta">{b.models.length} model</span>
                    </button>
                    <div className="veh-side-actions">
                      <button type="button" className="veh-text-btn" onClick={() => startEditBrand(b)}>
                        Düzenle
                      </button>
                      <button
                        type="button"
                        className="veh-icon-btn"
                        aria-label={`${b.name} sil`}
                        onClick={() => removeBrand(b.id)}
                      >
                        ×
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div className="veh-add">
            <input
              type="text"
              className="veh-input"
              placeholder="Yeni marka"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addBrand()}
            />
            <button type="button" className="veh-btn veh-btn--primary" onClick={addBrand}>
              Ekle
            </button>
          </div>
        </div>

        <div className="veh-panel">
          <h2 className="veh-panel__title">Model</h2>
          {!selectedBrand ? (
            <p className="veh-hint">Önce bir marka seçin.</p>
          ) : (
            <>
              <p className="veh-context">{selectedBrand.name}</p>
              <ul className="veh-list veh-list--models">
                {selectedBrand.models.map((m) => (
                  <li key={m.id} className="veh-model-li">
                    {editingModelId === m.id ? (
                      <div className="veh-edit-row veh-edit-row--model">
                        <input
                          type="text"
                          className="veh-input"
                          value={editModelDraft}
                          onChange={(e) => setEditModelDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveModelEdit()
                            if (e.key === 'Escape') cancelModelEdit()
                          }}
                          aria-label="Model adı"
                        />
                        <button type="button" className="veh-btn veh-btn--primary" onClick={saveModelEdit}>
                          Kaydet
                        </button>
                        <button type="button" className="veh-btn veh-btn--ghost" onClick={cancelModelEdit}>
                          İptal
                        </button>
                      </div>
                    ) : (
                      <div className="veh-list-row">
                        <span className="veh-list-item__name">{m.name}</span>
                        <div className="veh-side-actions">
                          <button type="button" className="veh-text-btn" onClick={() => startEditModel(m)}>
                            Düzenle
                          </button>
                          <button
                            type="button"
                            className="veh-icon-btn"
                            aria-label={`${m.name} sil`}
                            onClick={() => removeModel(selectedBrand.id, m.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="veh-add">
                <input
                  type="text"
                  className="veh-input"
                  placeholder="Yeni model"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addModel()}
                />
                <button type="button" className="veh-btn veh-btn--primary" onClick={addModel}>
                  Ekle
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default VehicleCatalogPage
