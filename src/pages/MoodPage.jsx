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
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card">
        <h1 className="h1">Szybki wpis</h1>
        <p className="p">Wybierz 1–3 emocje (albo więcej, jeśli potrzebujesz).</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {EMOTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => toggle(e)}
              className={selected.includes(e) ? 'btn btnPrimary' : 'btn'}
            >
              {e}
            </button>
          ))}
        </div>

        <label className="label" htmlFor="notes">Notatka (opcjonalnie)</label>
        <textarea
          id="notes"
          className="textarea"
          value={notes}
          onChange={(ev) => setNotes(ev.target.value)}
          placeholder="Co się wydarzyło? Co było trudne / co pomogło?"
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
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
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {recent.map((it) => (
              <div key={it.id ?? it.timestamp} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>{new Date(it.date).toLocaleString()}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {Array.isArray(it.emotions) ? it.emotions.join(', ') : ''}
                  </div>
                </div>
                {it.notes ? <div style={{ marginTop: 6, color: 'var(--muted)' }}>{it.notes}</div> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
