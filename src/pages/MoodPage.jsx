import { useMemo, useState } from 'react'
import { EMOTIONS } from '../data/emotions'
import { useMoodEntries } from '../hooks/useIndexedDB'

const EMOTION_GROUPS = {
  positive: new Set(['spokojny', 'zadowolony', 'wdzięczny']),
  neutral: new Set(['zmęczony', 'zestresowany', 'zaniepokojony']),
  negative: new Set(['przytłoczony', 'smutny', 'zły', 'samotny']),
}

const getCategoryForEntry = (entry) => {
  const emotions = Array.isArray(entry.emotions) ? entry.emotions : []
  if (emotions.length === 0) return 'neutral'

  let score = 0
  emotions.forEach((e) => {
    if (EMOTION_GROUPS.positive.has(e)) score += 2
    else if (EMOTION_GROUPS.neutral.has(e)) score += 1
  })

  const avg = score / emotions.length
  if (avg >= 1.5) return 'positive'
  if (avg >= 0.75) return 'neutral'
  return 'negative'
}

export default function MoodPage() {
  const { addEntry, getEntriesFromDays, loading } = useMoodEntries()
  const [selected, setSelected] = useState([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const recent = useMemo(() => getEntriesFromDays(14), [getEntriesFromDays])
  const recentSorted = useMemo(
    () => [...recent].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0)),
    [recent],
  )

  const emotionCounts = useMemo(() => {
    const counts = {}
    recent.forEach((entry) => {
      ;(entry.emotions || []).forEach((e) => {
        counts[e] = (counts[e] || 0) + 1
      })
    })
    return counts
  }, [recent])

  const topEmotion = useMemo(() => {
    const entries = Object.entries(emotionCounts)
    if (entries.length === 0) return null
    entries.sort((a, b) => b[1] - a[1])
    return entries[0][0]
  }, [emotionCounts])

  const categoryCounts = useMemo(() => {
    const counts = { positive: 0, neutral: 0, negative: 0 }
    recent.forEach((entry) => {
      counts[getCategoryForEntry(entry)] += 1
    })
    return counts
  }, [recent])

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
        <h1 className="h1">Podsumowanie nastroju</h1>
        <p className="p">Ostatnie 14 dni w skrócie.</p>

        <div className="moodReport mt12">
          <div className="moodMetric">
            <div className="moodMetricValue">{recent.length}</div>
            <div className="moodMetricLabel">Wpisy</div>
          </div>
          <div className="moodMetric">
            <div className="moodMetricValue">{topEmotion || '—'}</div>
            <div className="moodMetricLabel">Najczęstsza emocja</div>
          </div>
          <div className="moodMetric">
            <div className="moodMetricValue">{recentSorted.at(-1)?.date ? new Date(recentSorted.at(-1).date).toLocaleDateString() : '—'}</div>
            <div className="moodMetricLabel">Ostatni wpis</div>
          </div>
        </div>

        <div className="moodLegend mt12">
          <div className="moodLegendItem"><span className="moodDot moodDotPositive" />Pozytywne ({categoryCounts.positive})</div>
          <div className="moodLegendItem"><span className="moodDot moodDotNeutral" />Neutralne ({categoryCounts.neutral})</div>
          <div className="moodLegendItem"><span className="moodDot moodDotNegative" />Trudne ({categoryCounts.negative})</div>
        </div>

        <div className="moodTimeline mt12" aria-label="Oś nastroju z ostatnich 14 dni">
          {recentSorted.map((entry) => {
            const category = getCategoryForEntry(entry)
            const label = Array.isArray(entry.emotions) ? entry.emotions.join(', ') : ''
            return (
              <span
                key={entry.id ?? entry.timestamp}
                className={`moodDot moodDot${category === 'positive' ? 'Positive' : category === 'negative' ? 'Negative' : 'Neutral'}`}
                title={`${new Date(entry.date).toLocaleDateString()}${label ? ` • ${label}` : ''}`}
              />
            )
          })}
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
