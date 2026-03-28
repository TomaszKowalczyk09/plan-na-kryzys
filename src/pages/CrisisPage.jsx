import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHotlines } from '../data/hotlines'
import { StoryScreen } from '../components/StoryUI'
import { useI18n } from '../i18n/index.jsx'

const QUICK_ACTIONS_STORAGE_KEY = 'crisis_quick_actions_v1'

export default function CrisisPage() {
  const { t } = useI18n()
  const hotlines = useMemo(() => getHotlines('pl'), [])
  const [isBreathing, setIsBreathing] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [selectedPresetKey, setSelectedPresetKey] = useState('box')
  const [quickActions, setQuickActions] = useState([false, false, false])
  const [quoteIndex, setQuoteIndex] = useState(0)

  const breathingPresets = useMemo(
    () => [
      {
        key: 'box',
        label: t('crisisPage.presetBox', 'Box 4-4-4-4'),
        phases: [
          { key: 'inhale', label: t('crisisPage.inhale', 'Wdech'), duration: 4 },
          { key: 'hold-a', label: t('crisisPage.hold', 'Zatrzymaj'), duration: 4 },
          { key: 'exhale', label: t('crisisPage.exhale', 'Wydech'), duration: 4 },
          { key: 'hold-b', label: t('crisisPage.hold', 'Zatrzymaj'), duration: 4 },
        ],
      },
      {
        key: 'calm',
        label: t('crisisPage.presetCalm', 'Spokój 4-2-6'),
        phases: [
          { key: 'inhale', label: t('crisisPage.inhale', 'Wdech'), duration: 4 },
          { key: 'hold', label: t('crisisPage.hold', 'Zatrzymaj'), duration: 2 },
          { key: 'exhale', label: t('crisisPage.exhale', 'Wydech'), duration: 6 },
        ],
      },
      {
        key: 'focus',
        label: t('crisisPage.presetFocus', 'Skupienie 5-0-5'),
        phases: [
          { key: 'inhale', label: t('crisisPage.inhale', 'Wdech'), duration: 5 },
          { key: 'exhale', label: t('crisisPage.exhale', 'Wydech'), duration: 5 },
        ],
      },
    ],
    [t],
  )

  const selectedPreset = useMemo(
    () => breathingPresets.find((preset) => preset.key === selectedPresetKey) ?? breathingPresets[0],
    [breathingPresets, selectedPresetKey],
  )

  const breathingPhases = selectedPreset.phases

  const quickActionLabels = useMemo(
    () => [
      t('crisisPage.quickActionWater', 'Wypij szklankę wody'),
      t('crisisPage.quickActionMove', 'Poruszaj się przez 1 minutę'),
      t('crisisPage.quickActionContact', 'Napisz wiadomość do bezpiecznej osoby'),
    ],
    [t],
  )

  const rotatingQuotes = useMemo(
    () => [
      t('crisisPage.quote', 'To uczucie minie. Jesteś bezpieczny_a.'),
      t('crisisPage.quote2', 'Nie jesteś swoimi myślami. Możesz pozwolić im odpłynąć.'),
      t('crisisPage.quote3', 'Małe kroki to też postęp. Oddychaj dalej.'),
    ],
    [t],
  )

  const cycleDuration = useMemo(
    () => breathingPhases.reduce((sum, phase) => sum + phase.duration, 0),
    [breathingPhases],
  )

  const phaseState = useMemo(() => {
    const cyclePosition = cycleDuration > 0 ? elapsedSeconds % cycleDuration : 0
    let accumulator = 0

    for (const phase of breathingPhases) {
      if (cyclePosition < accumulator + phase.duration) {
        const elapsedInPhase = cyclePosition - accumulator
        return {
          phase,
          phaseElapsed: elapsedInPhase,
          phaseProgress: phase.duration > 0 ? elapsedInPhase / phase.duration : 0,
        }
      }
      accumulator += phase.duration
    }

    return {
      phase: breathingPhases[0],
      phaseElapsed: 0,
      phaseProgress: 0,
    }
  }, [breathingPhases, cycleDuration, elapsedSeconds])

  useEffect(() => {
    if (!isBreathing) return undefined
    const timer = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isBreathing])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUICK_ACTIONS_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : null
      if (Array.isArray(parsed) && parsed.length === quickActionLabels.length) {
        setQuickActions(parsed.map(Boolean))
      }
    } catch {
      // ignore storage errors in offline mode
    }
  }, [quickActionLabels.length])

  useEffect(() => {
    try {
      localStorage.setItem(QUICK_ACTIONS_STORAGE_KEY, JSON.stringify(quickActions))
    } catch {
      // ignore storage errors in offline mode
    }
  }, [quickActions])

  const primaryHotline = hotlines[0]
  const secondaryHotline = hotlines[1]
  const tertiaryHotline = hotlines[2]

  const callHref = (phone) => `tel:${String(phone ?? '').replace(/[^\d+]/g, '')}`
  const activePhaseKey = phaseState.phase?.key ?? 'inhale'
  const remainingPhaseSeconds = Math.max(phaseState.phase.duration - phaseState.phaseElapsed, 1)
  const completedBreathRounds = cycleDuration > 0 ? Math.floor(elapsedSeconds / cycleDuration) : 0
  const completedQuickActions = quickActions.filter(Boolean).length

  const toggleBreathing = () => {
    setIsBreathing((previous) => !previous)
  }

  const resetBreathing = () => {
    setIsBreathing(false)
    setElapsedSeconds(0)
  }

  const toggleQuickAction = (index) => {
    setQuickActions((previous) => previous.map((value, currentIndex) => (currentIndex === index ? !value : value)))
  }

  const resetQuickActions = () => {
    setQuickActions(quickActionLabels.map(() => false))
  }

  return (
    <StoryScreen variant="light" className="pageAnim crisisVioletPage">
      <section className="pageAnimItem crisisVioletBreathing">
        <div className="crisisVioletBreathingInner">
          <h2>{t('crisisPage.breatheTitle', 'Oddychaj z nami')}</h2>
          <p>{t('crisisPage.breatheLead', 'Podążaj za światłem. Rozluźnij ramiona.')}</p>

          <div className="crisisVioletPresetRow" role="tablist" aria-label={t('crisisPage.breathModes', 'Tryby oddychania')}>
            {breathingPresets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                role="tab"
                className={`crisisVioletPresetBtn ${selectedPresetKey === preset.key ? 'isActive' : ''}`}
                onClick={() => {
                  setSelectedPresetKey(preset.key)
                  setElapsedSeconds(0)
                }}
                aria-selected={selectedPresetKey === preset.key}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`crisisVioletOrbWrap is-${activePhaseKey.startsWith('hold') ? 'hold' : activePhaseKey} ${isBreathing ? 'isRunning' : 'isPaused'}`}
            onClick={toggleBreathing}
            aria-label={isBreathing ? t('crisisPage.pause', 'Pauza oddychania') : t('crisisPage.start', 'Start oddychania')}
            style={{ '--breath-dur': `${phaseState.phase.duration}s` }}
          >
            <div className="crisisVioletOrbGlow" />
            <div className="crisisVioletOrbCenter">
              <span>{phaseState.phase.label}</span>
              <small>{remainingPhaseSeconds}s</small>
            </div>
          </button>

          <div className="crisisVioletPager" aria-label={t('crisisPage.phaseCounter', 'Faza oddychania')}>
            {breathingPhases.map((phase) => (
              <span key={phase.key} className={phase.key === activePhaseKey ? 'isActive' : ''} />
            ))}
          </div>

          <div className="crisisVioletBreathControls">
            <button type="button" onClick={toggleBreathing} className="crisisVioletBreathBtn">
              {isBreathing ? t('crisisPage.pause', 'Pauza') : t('crisisPage.start', 'Start')}
            </button>
            <button type="button" onClick={resetBreathing} className="crisisVioletBreathBtn ghost">
              {t('crisisPage.reset', 'Reset')}
            </button>
          </div>

          <div className="crisisVioletBreathStats">
            <span>{t('crisisPage.rounds', 'Rundy')}: {completedBreathRounds}</span>
            <span>{t('crisisPage.time', 'Czas')}: {elapsedSeconds}s</span>
          </div>
        </div>
      </section>

      <section className="pageAnimItem crisisVioletSection">
        <div className="crisisVioletSectionHead">
          <h3>{t('crisisPage.immediateSupport', 'Natychmiastowe wsparcie')}</h3>
        </div>

        {primaryHotline ? (
          <a className="crisisVioletPrimaryCall" href={callHref(primaryHotline.phone)}>
            <div>
              <strong>{primaryHotline.name}</strong>
              <span>{primaryHotline.note}</span>
            </div>
            <span className="icon">📞</span>
          </a>
        ) : null}

        <div className="crisisVioletMiniGrid">
          {secondaryHotline ? (
            <a className="crisisVioletMiniCard" href={callHref(secondaryHotline.phone)}>
              <span className="icon">➕</span>
              <strong>{secondaryHotline.name}</strong>
            </a>
          ) : null}

          {tertiaryHotline ? (
            <a className="crisisVioletMiniCard" href={callHref(tertiaryHotline.phone)}>
              <span className="icon">❤</span>
              <strong>{tertiaryHotline.name}</strong>
            </a>
          ) : null}
        </div>
      </section>

      <section className="pageAnimItem crisisVioletSection">
        <div className="crisisVioletSectionHead rowBetween">
          <h3>{t('crisisPage.quickActions', 'Szybkie działania')}</h3>
          <span className="crisisVioletQuickCount">{completedQuickActions}/{quickActions.length}</span>
        </div>

        <div className="crisisVioletQuickList">
          {quickActionLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => toggleQuickAction(index)}
              className={`crisisVioletQuickItem ${quickActions[index] ? 'isDone' : ''}`}
              aria-pressed={quickActions[index]}
            >
              <span className="dot" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <button type="button" onClick={resetQuickActions} className="crisisVioletResetActions">
          {t('crisisPage.resetActions', 'Resetuj działania')}
        </button>
      </section>

      <section className="pageAnimItem crisisVioletSection">
        <div className="crisisVioletSectionHead rowBetween">
          <h3>{t('crisisPage.groundingTools', 'Narzędzia uziemiające')}</h3>
          <Link to="/knowledge/grounding" className="crisisVioletViewAll">
            {t('crisisPage.viewAll', 'Zobacz wszystko')}
          </Link>
        </div>

        <article className="crisisVioletToolCard crisisVioletToolCardMain">
          <div>
            <h4>5-4-3-2-1</h4>
            <p>{t('crisisPage.tool54321', 'Zaangażuj zmysły, aby wrócić do chwili obecnej.')}</p>
          </div>
          <Link to="/knowledge/grounding" className="crisisVioletToolBtn">
            {t('crisisPage.startGuide', 'Rozpocznij')}
          </Link>
          <span className="watermark" aria-hidden="true">◉</span>
        </article>

        <article className="crisisVioletToolCard crisisVioletToolCardBox">
          <div className="icon">▣</div>
          <h4>{t('crisisPage.boxBreath', 'Oddech pudełkowy')}</h4>
          <p>{t('crisisPage.boxBreathDesc', '4 s wdech, 4 s zatrzymanie, 4 s wydech, 4 s zatrzymanie.')}</p>
          <div className="progress"><div /></div>
        </article>

        <Link to="/crisis/cssrs" className="crisisVioletToolRow">
          <div className="left">
            <div className="icon">🧍</div>
            <div>
              <h4>{t('crisisPage.muscleRelaxation', 'Relaksacja mięśni')}</h4>
              <p>{t('crisisPage.muscleRelaxationDesc', 'Napinaj i rozluźniaj ciało')}</p>
            </div>
          </div>
          <span className="arrow">›</span>
        </Link>
      </section>

      <button type="button" className="pageAnimItem crisisVioletQuoteBanner" onClick={() => setQuoteIndex((index) => (index + 1) % rotatingQuotes.length)}>
        <p>{rotatingQuotes[quoteIndex]}</p>
        <small>{t('crisisPage.tapForNextQuote', 'Dotknij, aby zobaczyć kolejne wsparcie')}</small>
      </button>
    </StoryScreen>
  )
}
