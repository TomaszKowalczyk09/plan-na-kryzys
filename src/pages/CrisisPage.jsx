import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHotlines } from '../data/hotlines'
import { StoryScreen } from '../components/StoryUI'
import { useI18n } from '../i18n/index.jsx'

export default function CrisisPage() {
  const { lang, t } = useI18n()
  const hotlines = useMemo(() => getHotlines(lang), [lang])
  const [isBreathing, setIsBreathing] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const breathingPhases = useMemo(
    () => [
      { key: 'inhale', label: t('crisisPage.inhale', 'Inhale'), duration: 4 },
      { key: 'hold', label: t('crisisPage.hold', 'Hold'), duration: 3 },
      { key: 'exhale', label: t('crisisPage.exhale', 'Exhale'), duration: 5 },
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

  const primaryHotline = hotlines[0]
  const secondaryHotline = hotlines[1]
  const tertiaryHotline = hotlines[2]

  const callHref = (phone) => `tel:${String(phone ?? '').replace(/[^\d+]/g, '')}`
  const activePhaseKey = phaseState.phase?.key ?? 'inhale'
  const remainingPhaseSeconds = Math.max(phaseState.phase.duration - phaseState.phaseElapsed, 1)

  const toggleBreathing = () => {
    setIsBreathing((previous) => !previous)
  }

  const resetBreathing = () => {
    setIsBreathing(false)
    setElapsedSeconds(0)
  }

  return (
    <StoryScreen variant="light" className="pageAnim crisisVioletPage">
      <section className="pageAnimItem crisisVioletBreathing">
        <div className="crisisVioletBreathingInner">
          <h2>{t('crisisPage.breatheTitle', 'Breathe with us')}</h2>
          <p>{t('crisisPage.breatheLead', 'Follow the light. Soften your shoulders.')}</p>

          <button
            type="button"
            className={`crisisVioletOrbWrap is-${activePhaseKey} ${isBreathing ? 'isRunning' : 'isPaused'}`}
            onClick={toggleBreathing}
            aria-label={isBreathing ? t('crisisPage.pause', 'Pause breathing') : t('crisisPage.start', 'Start breathing')}
            style={{ '--breath-dur': `${phaseState.phase.duration}s` }}
          >
            <div className="crisisVioletOrbGlow" />
            <div className="crisisVioletOrbCenter">
              <span>{phaseState.phase.label}</span>
              <small>{remainingPhaseSeconds}s</small>
            </div>
          </button>

          <div className="crisisVioletPager" aria-label={t('crisisPage.phaseCounter', 'Breathing phase')}>
            {breathingPhases.map((phase) => (
              <span key={phase.key} className={phase.key === activePhaseKey ? 'isActive' : ''} />
            ))}
          </div>

          <div className="crisisVioletBreathControls">
            <button type="button" onClick={toggleBreathing} className="crisisVioletBreathBtn">
              {isBreathing ? t('crisisPage.pause', 'Pause') : t('crisisPage.start', 'Start')}
            </button>
            <button type="button" onClick={resetBreathing} className="crisisVioletBreathBtn ghost">
              {t('crisisPage.reset', 'Reset')}
            </button>
          </div>
        </div>
      </section>

      <section className="pageAnimItem crisisVioletSection">
        <div className="crisisVioletSectionHead">
          <h3>{t('crisisPage.immediateSupport', 'Immediate support')}</h3>
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
          <h3>{t('crisisPage.groundingTools', 'Grounding tools')}</h3>
          <Link to="/knowledge/grounding" className="crisisVioletViewAll">
            {t('crisisPage.viewAll', 'View all')}
          </Link>
        </div>

        <article className="crisisVioletToolCard crisisVioletToolCardMain">
          <div>
            <h4>5-4-3-2-1</h4>
            <p>{t('crisisPage.tool54321', 'Engage your senses to return to the present moment.')}</p>
          </div>
          <Link to="/knowledge/grounding" className="crisisVioletToolBtn">
            {t('crisisPage.startGuide', 'Start guide')}
          </Link>
          <span className="watermark" aria-hidden="true">◉</span>
        </article>

        <article className="crisisVioletToolCard crisisVioletToolCardBox">
          <div className="icon">▣</div>
          <h4>{t('crisisPage.boxBreath', 'Box breath')}</h4>
          <p>{t('crisisPage.boxBreathDesc', '4s in, 4s hold, 4s out, 4s hold.')}</p>
          <div className="progress"><div /></div>
        </article>

        <Link to="/crisis/cssrs" className="crisisVioletToolRow">
          <div className="left">
            <div className="icon">🧍</div>
            <div>
              <h4>{t('crisisPage.muscleRelaxation', 'Muscle relaxation')}</h4>
              <p>{t('crisisPage.muscleRelaxationDesc', 'Tense and release your body')}</p>
            </div>
          </div>
          <span className="arrow">›</span>
        </Link>
      </section>

      <section className="pageAnimItem crisisVioletQuoteBanner">
        <p>{t('crisisPage.quote', 'This feeling is temporary. You are safe.')}</p>
      </section>
    </StoryScreen>
  )
}
