import { useMemo, useState } from 'react'
import { EMOTIONS } from '../data/emotions'
import { useMoodEntries } from '../hooks/useIndexedDB'

export default function MoodPage() {
  const { addEntry, getEntriesFromDays, loading } = useMoodEntries()
  const [selected, setSelected] = useState([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const recent = useMemo(() => getEntriesFromDays(14), [getEntriesFromDays])

  const toggle = (e) => {
    setSelected((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
    )
  }

  const onSave = async () => {
    if (selected.length === 0) return
    setSaving(true)
    try {
      await addEntry(selected, notes.trim())
      setSelected([])
      setNotes('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="screen">
      <div className="card">
        <h1 className="sectionTitle">Wybór nastroju</h1>
        <p className="sectionSub">Wybierz 1–3 emocje (albo więcej, jeśli potrzebujesz).</p>

        <div className="row mt12">
          {EMOTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => toggle(e)}
              className={selected.includes(e) ? 'btn btnPrimary btnConfirm isActive' : 'btn'}
              aria-pressed={selected.includes(e)}
            >
              {e}
            </button>
          ))}
        </div>

        <label className="label" htmlFor="notes">Notatka (opcjonalnie)</label>
        <textarea
          id="notes"
          className="textarea expressionTextarea"
          value={notes}
          onChange={(ev) => setNotes(ev.target.value)}
          placeholder="Co się wydarzyło? Co było trudne / co pomogło?"
        />

        <div className="row mt12">
          <button
            type="button"
            className="btn btnPrimary"
            disabled={saving || selected.length === 0}
            onClick={onSave}
          >
            {saving ? 'Zapisuję…' : 'Zapisz'}
          </button>
          <button type="button" className="btn" onClick={() => setSelected([])} disabled={saving}>
            Wyczyść
          </button>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Ostatnie 14 dni</h1>
        <p className="p">To nie jest ocena. To tylko ślad, który może pomóc zauważyć zmianę.</p>

        {loading ? (
          <p className="p">Wczytuję…</p>
        ) : recent.length === 0 ? (
          <p className="p">Brak wpisów. Spróbuj dodać pierwszy.</p>
        ) : (
          <div className="stackSm mt12">
            {recent.map((it) => (
              <div key={it.id ?? it.timestamp} className="cardInset">
                <div className="rowBetween">
                  <div className="textStrong">{new Date(it.date).toLocaleString()}</div>
                  <div className="textMuted textSm">
                    {Array.isArray(it.emotions) ? it.emotions.join(', ') : ''}
                  </div>
                </div>
                {it.notes ? <div className="textMuted mt6">{it.notes}</div> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
