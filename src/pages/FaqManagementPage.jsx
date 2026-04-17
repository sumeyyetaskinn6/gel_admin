import { useMemo, useState } from 'react'
import './FaqManagementPage.css'

function newFaqId() {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const INITIAL_FAQS = [
  {
    id: 'faq-1',
    question: 'Ücret nasıl hesaplanır?',
    answer: 'Mesafe ve süreye göre dinamik fiyatlandırma uygulanır. Detaylar uygulama içinde gösterilir.',
    sortOrder: 1,
  },
  {
    id: 'faq-2',
    question: 'Kayıt için hangi belgeler gerekir?',
    answer: 'Kimlik, iletişim bilgileri ve rolünüze göre ehliyet / araç evrakları istenebilir.',
    sortOrder: 2,
  },
]

function FaqManagementPage() {
  const [items, setItems] = useState(INITIAL_FAQS)
  const [draftQuestion, setDraftQuestion] = useState('')
  const [draftAnswer, setDraftAnswer] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [items],
  )

  const resetForm = () => {
    setDraftQuestion('')
    setDraftAnswer('')
    setEditingId(null)
    setFormOpen(false)
  }

  const openCreate = () => {
    setEditingId(null)
    setDraftQuestion('')
    setDraftAnswer('')
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setDraftQuestion(row.question)
    setDraftAnswer(row.answer)
    setFormOpen(true)
  }

  const save = () => {
    const q = draftQuestion.trim()
    const a = draftAnswer.trim()
    if (!q || !a) return

    if (editingId) {
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? { ...it, question: q, answer: a } : it)),
      )
    } else {
      const maxOrder = items.reduce((m, it) => Math.max(m, it.sortOrder ?? 0), 0)
      setItems((prev) => [
        ...prev,
        { id: newFaqId(), question: q, answer: a, sortOrder: maxOrder + 1 },
      ])
    }
    resetForm()
  }

  const remove = (id) => {
    if (!window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) return
    setItems((prev) => prev.filter((it) => it.id !== id))
    if (editingId === id) resetForm()
  }

  return (
    <section className="faq-page">
      <header className="faq-page__head">
        <div>
          <h1 className="faq-page__title">SSS yönetimi</h1>
          <p className="faq-page__sub">
            Mobil uygulamada gösterilen sıkça sorulan soruları ekleyin, düzenleyin veya kaldırın.
          </p>
        </div>
        <button type="button" className="faq-btn faq-btn--primary" onClick={openCreate}>
          Yeni SSS
        </button>
      </header>

      {formOpen && (
        <div className="faq-form-card">
          <h2 className="faq-form-card__title">{editingId ? 'SSS düzenle' : 'Yeni SSS'}</h2>
          <label className="faq-field">
            <span className="faq-field__label">Soru</span>
            <textarea
              className="faq-field__input faq-field__input--area"
              rows={2}
              value={draftQuestion}
              onChange={(e) => setDraftQuestion(e.target.value)}
              placeholder="Kullanıcıya gösterilecek soru metni"
            />
          </label>
          <label className="faq-field">
            <span className="faq-field__label">Cevap</span>
            <textarea
              className="faq-field__input faq-field__input--area"
              rows={5}
              value={draftAnswer}
              onChange={(e) => setDraftAnswer(e.target.value)}
              placeholder="Cevap metni"
            />
          </label>
          <div className="faq-form-actions">
            <button type="button" className="faq-btn faq-btn--ghost" onClick={resetForm}>
              Vazgeç
            </button>
            <button type="button" className="faq-btn faq-btn--primary" onClick={save}>
              Kaydet
            </button>
          </div>
        </div>
      )}

      <div className="faq-table-wrap">
        <table className="faq-table">
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Soru</th>
              <th>Cevap özeti</th>
              <th className="faq-table__th-actions">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="faq-table__empty">
                  Henüz kayıt yok. «Yeni SSS» ile ekleyin.
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr key={row.id}>
                  <td className="faq-table__num">{row.sortOrder}</td>
                  <td className="faq-table__q">{row.question}</td>
                  <td className="faq-table__a">{row.answer}</td>
                  <td className="faq-table__actions">
                    <button type="button" className="faq-link-btn" onClick={() => openEdit(row)}>
                      Güncelle
                    </button>
                    <button type="button" className="faq-link-btn faq-link-btn--danger" onClick={() => remove(row.id)}>
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

export default FaqManagementPage
