/* jshint esversion: 11, asi: true, module: true, jsx: true */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useIndexedDB'
import { CTAButton, CloudIcon, StoryCard, StoryScreen } from './StoryUI'
import { useI18n } from '../i18n/index.jsx'

function FirstRunGateInner({ children }) {
  const { t } = useI18n()
  const { value: accepted, set: setAccepted, loading } = useSettings('legal_ack_v1_2026-02-04', false)
  const [step, setStep] = useState(0)
  const [checked, setChecked] = useState(false)
  const [saving, setSaving] = useState(false)

  const slidesCount = 3

  const onContinue = async () => {
    if (!checked) return
    setSaving(true)
    try {
      await setAccepted(true)
    } finally {
      setSaving(false)
    }
  }

  const dotIndex = useMemo(() => Math.min(step, slidesCount - 1), [step])

  if (loading) return children
  if (accepted) return children

  return (
    <div className="onbRoot" style={{ minHeight: '100svh' }}>
      {step === 0 ? (
        <StoryScreen variant="light">
          <StoryCard tone="surface">
            <CloudIcon mood="smile" label="Uśmiechnięta chmurka" />
            <h1 className="storyTitle" style={{ marginTop: 14 }}>
              {t('firstRun.slide1.title')} <span className="storyAccent">{t('firstRun.slide1.accent')}</span>
            </h1>
            <p className="storyLead">
              {t('firstRun.slide1.lead')}
            </p>
          </StoryCard>
          <CTAButton tone="primary" onClick={() => setStep(1)}>
            {t('firstRun.continue')}
          </CTAButton>
          <div className="textSm" style={{ textAlign: 'center', color: 'var(--t-ink-muted)' }}>
            {t('firstRun.swipe')}
          </div>
        </StoryScreen>
      ) : null}

      {step === 1 ? (
        <StoryScreen variant="violet">
          <StoryCard tone="surface">
            <CloudIcon mood="portal" label="Smutna chmurka w portalu" />
            <h1 className="storyTitle" style={{ marginTop: 14 }}>
              {t('firstRun.slide2.title')} <span className="storyAccent">{t('firstRun.slide2.accent')}</span> jest blisko
            </h1>
            <p className="storyLead">
              {t('firstRun.slide2.lead')}
            </p>
          </StoryCard>
          <div className="row" style={{ gap: 10 }}>
            <CTAButton tone="ghost" onClick={() => setStep(0)}>
              {t('firstRun.back')}
            </CTAButton>
            <CTAButton tone="primary" onClick={() => setStep(2)}>
              {t('firstRun.next')}
            </CTAButton>
          </div>
          <div className="textSm" style={{ textAlign: 'center', color: 'var(--t-ink-muted)' }}>
            {t('firstRun.swipe')}
          </div>
        </StoryScreen>
      ) : null}

      {step === 2 ? (
        <StoryScreen variant="dark">
          <StoryCard tone="dark">
            <CloudIcon mood="duo" label="Dwie chmurki obok siebie" />
            <h1 className="storyTitle" style={{ marginTop: 14, color: '#fff' }}>
              {t('firstRun.slide3.title')} <span className="storyAccent">{t('firstRun.slide3.accent')}</span>
            </h1>
            <p className="storyLead" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {t('firstRun.slide3.lead')}
            </p>

            <div className="cardInset" style={{ marginTop: 12, background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.14)' }}>
              <label className="onbCheck" style={{ color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <span>
                  {t('firstRun.slide3.consent')}
                </span>
              </label>

              <div className="row mt12" style={{ justifyContent: 'space-between' }}>
                <Link className="onbLinkBtn" to="/terms">
                  {t('firstRun.terms')}
                </Link>
                <Link className="onbLinkBtn" to="/privacy">
                  {t('firstRun.privacy')}
                </Link>
              </div>
            </div>
          </StoryCard>

          <div className="row" style={{ gap: 10 }}>
            <CTAButton tone="ghost" onClick={() => setStep(1)}>
              {t('firstRun.back')}
            </CTAButton>
            <CTAButton tone="primary" onClick={onContinue} disabled={!checked || saving}>
              {saving ? t('firstRun.saving') : t('firstRun.finish')}
            </CTAButton>
          </div>
        </StoryScreen>
      ) : null}

      <div aria-hidden="true" style={{ position: 'fixed', left: 0, right: 0, bottom: 10, display: 'grid', placeItems: 'center' }}>
        <div className="onbDots" style={{ background: 'rgba(255,255,255,0.10)', padding: 8, borderRadius: 999 }}>
          {Array.from({ length: slidesCount }).map((_, i) => (
            <div key={i} className={`onbDot ${i === dotIndex ? 'isActive' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FirstRunGate({ children }) {
  return <FirstRunGateInner>{children}</FirstRunGateInner>
}
