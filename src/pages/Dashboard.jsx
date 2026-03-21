import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CloudIcon, StoryCard, StoryScreen, CTAButton } from '../components/StoryUI'
import { useMoodEntries } from '../hooks/useIndexedDB'
import { useI18n } from '../i18n/index.jsx'

export default function Dashboard() {
  const { t } = useI18n()
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
              {t('dashboard.titlePrefix')} <span className="storyAccent">{t('dashboard.titleAccent')}</span>
            </h1>
            <p className="storyLead">{t('dashboard.lead')}</p>
          </div>
          <CloudIcon mood="calm" label="Spokojna chmurka" />
        </div>

        <div className="moodReport mt12">
          <div className="moodMetric">
            <div className="moodMetricValue">{recent.length}</div>
            <div className="moodMetricLabel">{t('dashboard.entries14')}</div>
          </div>
          <div className="moodMetric">
            <div className="moodMetricValue">{lastLabel || t('dashboard.none')}</div>
            <div className="moodMetricLabel">{t('dashboard.lastEntry')}</div>
          </div>
          <div className="moodMetric">
            <div className="moodMetricValue" style={{ fontSize: 14, fontWeight: 900 }}>
              {lastEmotions || t('dashboard.none')}
            </div>
            <div className="moodMetricLabel">{t('dashboard.lastEmotions')}</div>
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
              <div className="textStrong">{t('dashboard.mood')}</div>
              <div className="textMuted textSm">{t('dashboard.quickEntry')}</div>
            </div>
            <CloudIcon mood="smile" label="Uśmiechnięta chmurka" />
          </div>
          <div style={{ marginTop: 12 }}>
            <CTAButton as={Link} to="/mood" tone="primary">
              {t('dashboard.add')}
            </CTAButton>
          </div>
        </StoryCard>

        <StoryCard tone="glass" style={{ padding: 16 }}>
          <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div className="textStrong">{t('dashboard.crisis')}</div>
              <div className="textMuted textSm">{t('dashboard.hereNow')}</div>
            </div>
            <CloudIcon mood="sad" label="Smutna chmurka" />
          </div>
          <div style={{ marginTop: 12 }}>
            <CTAButton as={Link} to="/crisis" tone="dark">
              {t('dashboard.open')}
            </CTAButton>
          </div>
        </StoryCard>

          <StoryCard tone="surface" style={{ padding: 16 }}>
            <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'grid', gap: 4 }}>
                <div className="textStrong">{t('dashboard.sobriety')}</div>
                <div className="textMuted textSm">{t('dashboard.counter')}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>🧼</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <CTAButton as={Link} to="/sobriety" tone="ghost">
                {t('dashboard.go')}
              </CTAButton>
            </div>
          </StoryCard>
        <StoryCard tone="surface" style={{ padding: 16 }}>
          <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div className="textStrong">{t('dashboard.knowledge')}</div>
              <div className="textMuted textSm">{t('dashboard.quickTopics')}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>📚</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <CTAButton as={Link} to="/knowledge" tone="ghost">
              {t('dashboard.go')}
            </CTAButton>
          </div>
        </StoryCard>

        <StoryCard tone="surface" style={{ padding: 16 }}>
          <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <div className="textStrong">{t('dashboard.friend')}</div>
              <div className="textMuted textSm">{t('dashboard.howToHelp')}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>🤝</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <CTAButton as={Link} to="/friend" tone="ghost">
              {t('dashboard.open')}
            </CTAButton>
          </div>
        </StoryCard>
      </div>

      <StoryCard tone="surface" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <div className="textStrong">{t('dashboard.discord')}</div>
            <div className="textMuted">{t('dashboard.discordLead')}</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>#</div>
        </div>
        <div style={{ marginTop: 14 }}>
          <CTAButton as="a" href="https://discord.gg/kjHr5E35js" target="_blank" rel="noreferrer" tone="primary">
            {t('dashboard.join')}
          </CTAButton>
        </div>
      </StoryCard>
    </StoryScreen>
  )
}
