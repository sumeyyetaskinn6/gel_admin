import { useMemo, useState } from 'react'
import './ContractsManagementPage.css'

function newContractId() {
  return `ctr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const INITIAL_CONTRACTS = [
  {
    id: 'ctr-1',
    name: 'Kullanım koşulları',
    content:
      'Bu sözleşme, Gel mobil uygulamasının kullanımına ilişin hak ve yükümlülükleri düzenler. Hizmeti kullanarak bu koşulları kabul etmiş sayılırsınız.',
    active: true,
    updatedAt: '2026-04-10',
  },
  {
    id: 'ctr-2',
    name: 'Gizlilik politikası',
    content:
      'Kişisel verileriniz 6698 sayılı KVKK kapsamında işlenir. Veri işleme amaçları, saklama süreleri ve haklarınız bu metinde açıklanmıştır.',
    active: true,
    updatedAt: '2026-04-08',
  },
]

function ContractsManagementPage() {
  const [items, setItems] = useState(INITIAL_CONTRACTS)
  const [draftName, setDraftName] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [draftActive, setDraftActive] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const sorted = useMemo(() => [...items].sort((a, b) => a.name.localeCompare(b.name, 'tr')), [items])

  const resetForm = () => {
    setDraftName('')
    setDraftContent('')
    setDraftActive(true)
    setEditingId(null)
    setFormOpen(false)
  }

  const openCreate = () => {
    setEditingId(null)
    setDraftName('')
    setDraftContent('')
    setDraftActive(true)
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setDraftName(row.name)
    setDraftContent(row.content)
    setDraftActive(!!row.active)
    setFormOpen(true)
  }

  const todayStr = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const save = () => {
    const name = draftName.trim()
    const content = draftContent.trim()
    if (!name || !content) return

    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? { ...it, name, content, active: draftActive, updatedAt: todayStr() }
            : it,
        ),
      )
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: newContractId(),
          name,
          content,
          active: draftActive,
          updatedAt: todayStr(),
        },
      ])
    }
    resetForm()
  }

  const remove = (id) => {
    const row = items.find((it) => it.id === id)
    const msg = row?.active
      ? 'Bu aktif sözleşmeyi silmek istediğinize emin misiniz?'
      : 'Bu sözleşmeyi silmek istediğinize emin misiniz?'
    if (!window.confirm(msg)) return
    setItems((prev) => prev.filter((it) => it.id !== id))
    if (editingId === id) resetForm()
  }

  return (
    <section className="contracts-page">
      <header className="contracts-page__head">
        <div>
          <h1 className="contracts-page__title">Sözleşmeler</h1>
          <p className="contracts-page__sub">
            Mobil uygulamada gösterilecek sözleşmeleri ekleyin; aktif olanları güncelleyin veya kaldırın.
          </p>
        </div>
        <button type="button" className="contracts-btn contracts-btn--primary" onClick={openCreate}>
          Yeni sözleşme
        </button>
      </header>

      {formOpen && (
        <div className="contracts-form-card">
          <h2 className="contracts-form-card__title">{editingId ? 'Sözleşmeyi düzenle' : 'Yeni sözleşme'}</h2>
          <label className="contracts-field">
            <span className="contracts-field__label">Sözleşme adı</span>
            <input
              type="text"
              className="contracts-field__input"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Örn. Kullanım koşulları"
            />
          </label>
          <label className="contracts-field">
            <span className="contracts-field__label">İçerik</span>
            <textarea
              className="contracts-field__input contracts-field__input--area"
              rows={8}
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder="Sözleşme metni"
            />
          </label>
          <label className="contracts-field contracts-field--inline">
            <input
              type="checkbox"
              className="contracts-field__check"
              checked={draftActive}
              onChange={(e) => setDraftActive(e.target.checked)}
            />
            <span className="contracts-field__check-label">Aktif (uygulamada göster)</span>
          </label>
          <div className="contracts-form-actions">
            <button type="button" className="contracts-btn contracts-btn--ghost" onClick={resetForm}>
              Vazgeç
            </button>
            <button type="button" className="contracts-btn contracts-btn--primary" onClick={save}>
              Kaydet
            </button>
          </div>
        </div>
      )}

      <div className="contracts-table-wrap">
        <table className="contracts-table">
          <thead>
            <tr>
              <th>Durum</th>
              <th>Sözleşme adı</th>
              <th>İçerik özeti</th>
              <th>Son güncelleme</th>
              <th className="contracts-table__th-actions">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="contracts-table__empty">
                  Henüz kayıt yok. «Yeni sözleşme» ile ekleyin.
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span
                      className={`contracts-pill${row.active ? ' contracts-pill--on' : ' contracts-pill--off'}`}
                    >
                      {row.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="contracts-table__name">{row.name}</td>
                  <td className="contracts-table__body">{row.content}</td>
                  <td className="contracts-table__date">{row.updatedAt ?? '—'}</td>
                  <td className="contracts-table__actions">
                    <button type="button" className="contracts-link-btn" onClick={() => openEdit(row)}>
                      Güncelle
                    </button>
                    <button
                      type="button"
                      className="contracts-link-btn contracts-link-btn--danger"
                      onClick={() => remove(row.id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ContractsManagementPage
