import { useMemo, useState } from 'react'
import { EMOTIONS } from '../data/emotions'
import { useMoodEntries } from '../hooks/useIndexedDB'

const MOOD_PRESETS = [
  { id: 'calm', label: 'Calm', emotion: 'spokojny', emoji: '😌', color: 'moodCard--green', activeIndex: 5 },
  { id: 'happy', label: 'Happy', emotion: 'zadowolony', emoji: '😊', color: 'moodCard--yellow', activeIndex: 4 },
  { id: 'overwhelmed', label: 'Overwhelmed', emotion: 'przytłoczony', emoji: '😵', color: 'moodCard--orange', activeIndex: 3 },
  { id: 'sad', label: 'Sad', emotion: 'smutny', emoji: '😔', color: 'moodCard--brown', activeIndex: 2 },
]

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

  const setPreset = (emotion) => {
    setSelected([emotion])
  }

  return (
    <div className="screen">
      <div className="card">
        <h1 className="sectionTitle">Mood selector</h1>
        <p className="sectionSub">Wybierz szybki nastrój lub przejdź do szczegółów poniżej.</p>

        <div className="moodCardGrid mt12">
          {MOOD_PRESETS.map((preset) => (
            <div key={preset.id} className={`moodCard ${preset.color}`}>
              <div className="moodCardTitle">I&apos;m Feeling {preset.label}</div>
              <div className="moodCardEmote" aria-hidden="true">{preset.emoji}</div>
              <div className="moodSlider" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span
                    key={index}
                    className={`moodSliderDot ${index === preset.activeIndex ? 'isActive' : ''}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="moodPrimaryButton"
                onClick={() => setPreset(preset.emotion)}
              >
                Set Mood
              </button>
              <div className="moodCardDivider" />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Szybki wpis</h1>
        <p className="p">Wybierz 1–3 emocje (albo więcej, jeśli potrzebujesz).</p>

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
