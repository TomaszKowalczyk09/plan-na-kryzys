import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StoryScreen } from '../components/StoryUI'
import { useMoodEntries, useSobrietyTimer } from '../hooks/useIndexedDB'
import { useI18n } from '../i18n/index.jsx'

export default function Dashboard() {
  const { t, lang } = useI18n()
  const { getElapsed } = useSobrietyTimer()
  const { addEntry } = useMoodEntries()
  const [moodValue, setMoodValue] = useState(4)
  const [selectedTag, setSelectedTag] = useState('grateful')
  const [savingMood, setSavingMood] = useState(false)
  const [saveState, setSaveState] = useState('idle')

  const moodTags = useMemo(
    () => [
      { key: 'calm', label: t('dashboard.reflective', 'Reflective') },
      { key: 'grateful', label: t('dashboard.grateful', 'Grateful') },
      { key: 'restless', label: t('dashboard.restless', 'Restless') },
    ],
    [t],
  )

  const emotionByLang = useMemo(
    () => ({
      pl: { calm: 'spokojny', grateful: 'wdzięczny', restless: 'zestresowany' },
      de: { calm: 'ruhig', grateful: 'dankbar', restless: 'gestresst' },
    }),
    [],
  )

  const elapsed = getElapsed()
  const currentStreak = elapsed?.days ?? 14
  const nextMilestone = 30
  const progressToMilestone = Math.min(100, Math.round((currentStreak / nextMilestone) * 100))
  const daysToMilestone = Math.max(nextMilestone - currentStreak, 0)

  const onSaveQuickMood = async () => {
    setSaveState('idle')
    setSavingMood(true)

    const languageMap = emotionByLang[lang] ?? emotionByLang.pl
    const moodEmotion = languageMap[selectedTag] ?? languageMap.grateful

    try {
      await addEntry([moodEmotion], `${t('dashboard.mood', 'Mood')}: ${moodValue}/5`)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    } finally {
      setSavingMood(false)
    }
  }

  return (
    <StoryScreen variant="light" className="pageAnim dashboardPage">
      <section className="pageAnimItem dashboardCrisisHero">
        <div className="dashboardCrisisText">
          <h2>{t('dashboard.overwhelmed', 'Feeling overwhelmed?')}</h2>
          <p>
            {t(
              'dashboard.overwhelmedDesc',
              'Immediate support is available 24/7 if you need someone to talk to right now.',
            )}
          </p>
        </div>
        <Link to="/crisis" className="dashboardHeroBtn">
          {t('dashboard.helpNow', 'Help now')}
        </Link>
        <div className="dashboardCrisisGlow" aria-hidden="true" />
      </section>

      <section className="pageAnimItem dashboardBentoGrid">
        <article className="dashboardCard dashboardMoodCard">
          <div className="dashboardCardHead">
            <div>
              <span className="dashboardEyebrow">{t('dashboard.todayCheckIn', "Today's check-in")}</span>
              <h3>{t('dashboard.dailyMood', 'Daily mood')}</h3>
            </div>
            <div className="dashboardMoodBadge" aria-hidden="true">
              😊
            </div>
          </div>

          <p className="dashboardBodyText">{t('dashboard.howFeelingNow', 'How are you feeling in this moment?')}</p>

          <div className="dashboardMoodSliderWrap">
            <input
              type="range"
              min="1"
              max="5"
              value={moodValue}
              onChange={(event) => setMoodValue(Number(event.target.value))}
              aria-label={t('dashboard.mood', 'Mood')}
            />
            <div className="dashboardMoodScale">
              <span>{t('dashboard.calm', 'Calm')}</span>
              <span>{t('dashboard.neutral', 'Neutral')}</span>
              <span>{t('dashboard.radiant', 'Radiant')}</span>
            </div>
          </div>

          <div className="dashboardMoodTags">
            {moodTags.map((tag) => (
              <button
                key={tag.key}
                type="button"
                className={selectedTag === tag.key ? 'isActive' : ''}
                onClick={() => setSelectedTag(tag.key)}
                aria-pressed={selectedTag === tag.key}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <div className="dashboardMoodActions">
            <button type="button" className="dashboardSaveMoodBtn" onClick={onSaveQuickMood} disabled={savingMood}>
              {savingMood ? t('dashboard.saving', 'Saving...') : t('dashboard.saveQuickMood', 'Save mood')}
            </button>
            <Link to="/mood" className="dashboardInlineAction">
              {t('dashboard.dailyCheckIn', 'Daily check in')}
            </Link>
          </div>

          {saveState === 'saved' ? (
            <div className="dashboardSaveMoodNotice isSuccess">{t('dashboard.saved', 'Mood saved')}</div>
          ) : null}
          {saveState === 'error' ? (
            <div className="dashboardSaveMoodNotice isError">{t('dashboard.saveFailed', 'Could not save mood')}</div>
          ) : null}
        </article>

        <article className="dashboardCard dashboardSobrietyCard">
          <span className="dashboardEyebrow dashboardEyebrowDark">{t('dashboard.theJourney', 'The journey')}</span>
          <h3>{t('dashboard.sobrietyProgress', 'Sobriety progress')}</h3>

          <div className="dashboardSobrietyCount">{currentStreak}</div>
          <p className="dashboardSobrietySub">{t('dashboard.daysStrong', 'Days strong')}</p>

          <div className="dashboardSobrietyQuote">
            {t('dashboard.dayAtTime', 'One day at a time becomes a lifetime of freedom.')}
          </div>
        </article>

        <article className="dashboardCard dashboardInspirationCard">
          <div className="dashboardInspirationImage" role="img" aria-label={t('dashboard.dailyInspiration', 'Daily inspiration')} />
          <div>
            <h3>{t('dashboard.dailyInspiration', 'Daily inspiration')}</h3>
            <p>{t('dashboard.healingQuote', 'Healing is not linear, and every breath is a fresh start.')}</p>
            <button type="button" className="dashboardTextBtn">
              {t('dashboard.saveToJournal', 'Save to journal')}
            </button>
          </div>
        </article>

        <article className="dashboardCard dashboardMilestonesCard">
          <h3>{t('dashboard.upcomingMilestones', 'Upcoming milestones')}</h3>
          <ul>
            <li>
              <div className="dashboardMilestoneIcon" aria-hidden="true">🌱</div>
              <div>
                <p>{t('dashboard.threeWeek', '3-week milestone')}</p>
                <span>{t('dashboard.daysToGo', '{{count}} days to go', { count: daysToMilestone })}</span>
              </div>
            </li>
            <li className="isMuted">
              <div className="dashboardMilestoneIcon" aria-hidden="true">🗓️</div>
              <div>
                <p>{t('dashboard.monthlyReview', 'Monthly review')}</p>
                <span>{t('dashboard.sixteenDays', '16 days to go')}</span>
              </div>
            </li>
          </ul>
        </article>
      </section>

      <section className="pageAnimItem dashboardBreathingSection">
        <div className="dashboardBreathingHalo" aria-hidden="true" />
        <div className="dashboardBreathingInner">
          <div className="dashboardBreathingLogo" aria-hidden="true">◎</div>
          <h2>{t('dashboard.findRhythm', 'Find your rhythm')}</h2>
          <p>
            {t(
              'dashboard.breathingDesc',
              'Take 60 seconds to reset your nervous system with a guided breathing session.',
            )}
          </p>
          <Link to="/knowledge/grounding" className="dashboardBreathingBtn">
            {t('dashboard.startSession', 'Start session')}
          </Link>
        </div>
      </section>

      <section className="pageAnimItem dashboardProgressSection">
        <div className="dashboardProgressHeader">
          <span>{t('dashboard.nextMilestone', 'Next milestone')}</span>
          <span>{progressToMilestone}%</span>
        </div>
        <div className="dashboardProgressBar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressToMilestone}>
          <div className="dashboardProgressFill" style={{ width: `${progressToMilestone}%` }} />
        </div>
      </section>
    </StoryScreen>
  )
}
