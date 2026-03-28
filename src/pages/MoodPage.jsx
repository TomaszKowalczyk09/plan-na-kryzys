import { useMemo, useState } from 'react'
import { useMoodEntries } from '../hooks/useIndexedDB'
import { StoryScreen } from '../components/StoryUI'
import { useI18n } from '../i18n/index.jsx'

const EMOTION_GROUPS = {
  positive: new Set(['spokojny', 'zadowolony', 'wdzięczny', 'ruhig', 'zufrieden', 'dankbar']),
  neutral: new Set(['zmęczony', 'zestresowany', 'zaniepokojony', 'müde', 'gestresst', 'besorgt']),
  negative: new Set(['przytłoczony', 'smutny', 'zły', 'samotny', 'überfordert', 'traurig', 'wütend', 'einsam']),
}

const getCategoryForEntry = (entry) => {
  const emotions = Array.isArray(entry.emotions) ? entry.emotions : []
  if (emotions.length === 0) return 'neutral'

  let score = 0
  emotions.forEach((emotion) => {
    if (EMOTION_GROUPS.positive.has(emotion)) score += 2
    else if (EMOTION_GROUPS.neutral.has(emotion)) score += 1
  })

  const avg = score / emotions.length
  if (avg >= 1.5) return 'positive'
  if (avg >= 0.75) return 'neutral'
  return 'negative'
}

export default function MoodPage() {
  const { t, lang } = useI18n()
  const { addEntry, getEntriesFromDays } = useMoodEntries()

  const [selectedMood, setSelectedMood] = useState('calm')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] = useState('idle')

  const moodOptions = useMemo(
    () => [
      {
        key: 'calm',
        label: t('moodPage.calm', 'Calm'),
        icon: '🪷',
        emotion: lang === 'de' ? 'ruhig' : 'spokojny',
        tone: 'calm',
      },
      {
        key: 'joy',
        label: t('moodPage.joy', 'Joy'),
        icon: '☀️',
        emotion: lang === 'de' ? 'zufrieden' : 'zadowolony',
        tone: 'joy',
      },
      {
        key: 'anxious',
        label: t('moodPage.anxious', 'Anxious'),
        icon: '〰️',
        emotion: lang === 'de' ? 'gestresst' : 'zestresowany',
        tone: 'anxious',
      },
      {
        key: 'sad',
        label: t('moodPage.sad', 'Sad'),
        icon: '🌧️',
        emotion: lang === 'de' ? 'traurig' : 'smutny',
        tone: 'sad',
      },
      {
        key: 'angry',
        label: t('moodPage.angry', 'Angry'),
        icon: '⚡',
        emotion: lang === 'de' ? 'wütend' : 'zły',
        tone: 'angry',
      },
    ],
    [lang, t],
  )

  const recent = useMemo(
    () => getEntriesFromDays(14).sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0)),
    [getEntriesFromDays],
  )

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date()
        date.setHours(12, 0, 0, 0)
        date.setDate(date.getDate() - (6 - index))
        return date
      }),
    [],
  )

  const weekBars = useMemo(() => {
    const recent7 = recent.slice(-7)
    const byDay = new Map()

    recent7.forEach((entry) => {
      const date = entry?.date ? new Date(entry.date) : new Date(entry?.timestamp ?? Date.now())
      const key = date.toDateString()
      if (!byDay.has(key)) byDay.set(key, [])
      byDay.get(key).push(entry)
    })

    return weekDays.map((day) => {
      const key = day.toDateString()
      const entries = byDay.get(key) ?? []
      const counts = { positive: 0, neutral: 0, negative: 0 }

      entries.forEach((entry) => {
        counts[getCategoryForEntry(entry)] += 1
      })

      let dominant = 'neutral'
      if (counts.positive >= counts.neutral && counts.positive >= counts.negative) dominant = 'positive'
      else if (counts.negative > counts.positive && counts.negative >= counts.neutral) dominant = 'negative'

      const total = counts.positive + counts.neutral + counts.negative
      const ratio = total > 0 ? (counts.positive * 1 + counts.neutral * 0.65 + counts.negative * 0.35) / total : 0.3
      const height = Math.max(18, Math.min(100, Math.round(ratio * 100)))

      return {
        dayLabel: day.toLocaleDateString(lang === 'de' ? 'de-DE' : 'pl-PL', { weekday: 'short' }).toUpperCase(),
        height,
        dominant,
        isToday: day.toDateString() === new Date().toDateString(),
      }
    })
  }, [lang, recent, weekDays])

  const onSave = async () => {
    const chosen = moodOptions.find((mood) => mood.key === selectedMood)
    if (!chosen) return

    setSaveState('idle')
    setSaving(true)
    try {
      await addEntry([chosen.emotion], notes.trim())
      setNotes('')
      setSaveState('saved')
    } catch {
      setSaveState('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <StoryScreen variant="light" className="pageAnim moodVioletPage">
      <section className="pageAnimItem moodVioletHero">
        <div className="moodVioletHeroDivider" aria-hidden="true">
          <div className="moodVioletLine" />
          <div className="moodVioletDot">◌</div>
          <div className="moodVioletLine" />
        </div>
        <h1>{t('moodPage.title', 'How are you feeling right now?')}</h1>
        <p>{t('moodPage.subtitle', 'Take a deep breath. Acknowledge the present moment without judgment.')}</p>
      </section>

      <section className="pageAnimItem moodVioletMoodGrid">
        {moodOptions.map((mood) => (
          <button
            key={mood.key}
            type="button"
            onClick={() => setSelectedMood(mood.key)}
            className={`moodVioletMoodCard moodVioletMoodCard--${mood.tone} ${selectedMood === mood.key ? 'isActive' : ''}`}
            aria-pressed={selectedMood === mood.key}
          >
            <span className="moodVioletMoodIcon" aria-hidden="true">{mood.icon}</span>
            <span className="moodVioletMoodLabel">{mood.label}</span>
          </button>
        ))}
      </section>

      <section className="pageAnimItem moodVioletColumns">
        <article className="moodVioletNotesCard">
          <label className="moodVioletNotesLabel" htmlFor="mood-notes">
            {t('moodPage.addNotes', 'Add notes')}
          </label>
          <textarea
            id="mood-notes"
            className="moodVioletTextarea"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t('moodPage.notesPlaceholder', "What's on your mind?")}
          />

          <button
            type="button"
            className="moodVioletSaveBtn"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? t('moodPage.saving', 'Saving...') : t('moodPage.saveMood', 'Save mood')}
          </button>

          {saveState === 'saved' ? (
            <p className="moodVioletSaveState isSuccess">{t('moodPage.saved', 'Mood saved')}</p>
          ) : null}
          {saveState === 'error' ? (
            <p className="moodVioletSaveState isError">{t('moodPage.error', 'Could not save mood')}</p>
          ) : null}
        </article>

        <aside className="moodVioletMindfulCard">
          <div>
            <h3>{t('moodPage.mindfulTitle', 'Mindful moment')}</h3>
            <p>{t('moodPage.mindfulText', 'Take 3 deep breaths before saving.')}</p>
          </div>
          <div className="moodVioletPulse" aria-hidden="true">◌</div>
        </aside>
      </section>

      <section className="pageAnimItem moodVioletHistorySection">
        <div className="moodVioletHistoryHead">
          <h2>{t('moodPage.historyTitle', 'Recent mood history')}</h2>
          <span>{t('moodPage.last7', 'Last 7 days')}</span>
        </div>

        <div className="moodVioletChartCard">
          <div className="moodVioletBars" role="img" aria-label={t('moodPage.historyAria', 'Mood chart for the last 7 days')}>
            {weekBars.map((bar, index) => (
              <div key={`${bar.dayLabel}-${index}`} className="moodVioletBarCol">
                <div
                  className={`moodVioletBar moodVioletBar--${bar.dominant} ${bar.isToday ? 'isToday' : ''}`}
                  style={{ height: `${bar.height}%` }}
                />
                <span className={bar.isToday ? 'isToday' : ''}>{bar.dayLabel}</span>
              </div>
            ))}
          </div>

          <div className="moodVioletLegend">
            <div><span className="dot positive" />{t('moodPage.positive', 'Positive')}</div>
            <div><span className="dot neutral" />{t('moodPage.neutral', 'Neutral')}</div>
            <div><span className="dot tense" />{t('moodPage.tense', 'Tense')}</div>
          </div>
        </div>

        <blockquote className="moodVioletQuote">
          {t(
            'moodPage.quote',
            'Emotional awareness is the first step toward inner peace. Every feeling is a temporary visitor.',
          )}
        </blockquote>
      </section>
    </StoryScreen>
  )
}
