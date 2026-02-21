import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CloudIcon, StoryCard, StoryScreen, CTAButton } from '../components/StoryUI'
import { useMoodEntries } from '../hooks/useIndexedDB'

export default function Dashboard() {
  const { getEntriesFromDays } = useMoodEntries()
  const recent = useMemo(() => getEntriesFromDays(14), [getEntriesFromDays])
  const recentSorted = useMemo(
    () => [...recent].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0)),
    [recent],
  )

  const last = recentSorted.at(-1)
  const lastLabel = last?.date ? new Date(last.date).toLocaleString() : null
  const lastEmotions = Array.isArray(last?.emotions) ? last.emotions.join(', ') : null

  return (
    <StoryScreen variant="light" className="pageAnim">
      <StoryCard tone="surface" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 className="storyTitle">
              Twoje <span className="storyAccent">centrum</span>
            </h1>
            <p className="storyLead">Skróty do najważniejszych modułów i szybkie podsumowanie.</p>
          </div>
          <CloudIcon mood="calm" label="Spokojna chmurka" />
        </div>

        <div className="moodReport mt12">
          <div className="moodMetric">
            <div className="moodMetricValue">{recent.length}</div>
            <div className="moodMetricLabel">Wpisy (14 dni)</div>
          </div>
          <div className="moodMetric">
            <div className="moodMetricValue">{lastLabel || '—'}</div>
            <div className="moodMetricLabel">Ostatni wpis</div>
          </div>
          <div className="moodMetric">
            <div className="moodMetricValue" style={{ fontSize: 14, fontWeight: 900 }}>
              {lastEmotions || '—'}
            </div>
            <div className="moodMetricLabel">Ostatnie emocje</div>
          </div>
        </div>
      </StoryCard>

      <div
        className="pageAnimItem"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
      >
        <StoryCard tone="surface" style={{ padding: 16 }}>
          <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div className="textStrong">Mój nastrój</div>
              <div className="textMuted textSm">Szybki wpis</div>
            </div>
            <CloudIcon mood="smile" label="Uśmiechnięta chmurka" />
          </div>
          <div style={{ marginTop: 12 }}>
            <CTAButton as={Link} to="/mood" tone="primary">
              Dodaj
            </CTAButton>
          </div>
        </StoryCard>

        <StoryCard tone="glass" style={{ padding: 16 }}>
          <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div className="textStrong">Kryzys</div>
              <div className="textMuted textSm">Tu i teraz</div>
            </div>
            <CloudIcon mood="sad" label="Smutna chmurka" />
          </div>
          <div style={{ marginTop: 12 }}>
            <CTAButton as={Link} to="/crisis" tone="dark">
              Otwórz
            </CTAButton>
          </div>
        </StoryCard>

          <StoryCard tone="surface" style={{ padding: 16 }}>
            <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'grid', gap: 4 }}>
                <div className="textStrong">Czystość</div>
                <div className="textMuted textSm">Twój licznik</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>🧼</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <CTAButton as={Link} to="/sobriety" tone="ghost">
                Przejdź
              </CTAButton>
            </div>
          </StoryCard>
        <StoryCard tone="surface" style={{ padding: 16 }}>
          <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div className="textStrong">Wiedza</div>
              <div className="textMuted textSm">Szybkie tematy</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>📚</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <CTAButton as={Link} to="/knowledge" tone="ghost">
              Przejdź
            </CTAButton>
          </div>
        </StoryCard>

        <StoryCard tone="surface" style={{ padding: 16 }}>
          <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div className="textStrong">Dla przyjaciela</div>
              <div className="textMuted textSm">Jak pomóc</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>🤝</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <CTAButton as={Link} to="/friend" tone="ghost">
              Otwórz
            </CTAButton>
          </div>
        </StoryCard>
      </div>

      <StoryCard tone="surface" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <div className="textStrong">Discord</div>
            <div className="textMuted">Dołącz do serwera — informacje i kontakt ze społecznością.</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>#</div>
        </div>
        <div style={{ marginTop: 14 }}>
          <CTAButton as="a" href="https://discord.gg/" target="_blank" rel="noreferrer" tone="primary">
            Dołącz
          </CTAButton>
        </div>
      </StoryCard>
    </StoryScreen>
  )
}
