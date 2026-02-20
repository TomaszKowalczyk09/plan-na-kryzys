/* jshint esversion: 11, asi: true, module: true, jsx: true */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useIndexedDB'
import { CTAButton, CloudIcon, StoryCard, StoryScreen } from './StoryUI'

function FirstRunGateInner({ children }) {
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
              Zadbaj o swój <span className="storyAccent">nastrój</span>
            </h1>
            <p className="storyLead">
              Proste wpisy, czytelne podsumowanie i narzędzia, które możesz mieć zawsze przy sobie.
            </p>
          </StoryCard>
          <CTAButton tone="primary" onClick={() => setStep(1)}>
            Przejdź dalej
          </CTAButton>
          <div className="textSm" style={{ textAlign: 'center', color: 'var(--t-ink-muted)' }}>
            ↓ Przesuń dalej
          </div>
        </StoryScreen>
      ) : null}

      {step === 1 ? (
        <StoryScreen variant="violet">
          <StoryCard tone="surface">
            <CloudIcon mood="portal" label="Smutna chmurka w portalu" />
            <h1 className="storyTitle" style={{ marginTop: 14 }}>
              Pomoc w <span className="storyAccent">kryzysie</span> jest blisko
            </h1>
            <p className="storyLead">
              Konkretne kroki „tu i teraz”, numery pomocy i plan bezpieczeństwa.
            </p>
          </StoryCard>
          <div className="row" style={{ gap: 10 }}>
            <CTAButton tone="ghost" onClick={() => setStep(0)}>
              Wstecz
            </CTAButton>
            <CTAButton tone="primary" onClick={() => setStep(2)}>
              Dalej
            </CTAButton>
          </div>
          <div className="textSm" style={{ textAlign: 'center', color: 'var(--t-ink-muted)' }}>
            ↓ Przesuń dalej
          </div>
        </StoryScreen>
      ) : null}

      {step === 2 ? (
        <StoryScreen variant="dark">
          <StoryCard tone="dark">
            <CloudIcon mood="duo" label="Dwie chmurki obok siebie" />
            <h1 className="storyTitle" style={{ marginTop: 14, color: '#fff' }}>
              Nie jesteś z tym <span className="storyAccent">sam_a</span>
            </h1>
            <p className="storyLead" style={{ color: 'rgba(255,255,255,0.72)' }}>
              To nie jest usługa ratunkowa. Jeśli jesteś w bezpośrednim zagrożeniu — zadzwoń pod 112.
            </p>

            <div className="cardInset" style={{ marginTop: 12, background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.14)' }}>
              <label className="onbCheck" style={{ color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <span>
                  Rozumiem zasady: dane są lokalne, nie ma kont, a kontakt z pomocą inicjuję sam/a.
                </span>
              </label>

              <div className="row mt12" style={{ justifyContent: 'space-between' }}>
                <Link className="onbLinkBtn" to="/terms">
                  Regulamin
                </Link>
                <Link className="onbLinkBtn" to="/privacy">
                  Prywatność
                </Link>
              </div>
            </div>
          </StoryCard>

          <div className="row" style={{ gap: 10 }}>
            <CTAButton tone="ghost" onClick={() => setStep(1)}>
              Wstecz
            </CTAButton>
            <CTAButton tone="primary" onClick={onContinue} disabled={!checked || saving}>
              {saving ? 'Zapisuję…' : 'Wejdź do aplikacji'}
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
