/* jshint esversion: 11, asi: true, module: true, jsx: true */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useIndexedDB'

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
    <div className="onbRoot onbRootWarm">
      <div className="onbShell">
        <div className="onbContent">
          <div className="onbSlide onbSlideWarm">
            {step === 0 ? (
              <>
                <div className="onbHero">
                  <h1 className="onbTitle onbTitleWarm">Twoje narzędzia w jednym miejscu</h1>
                  <p className="onbBody onbBodyWarm">
                    Aplikacja pomaga przejść przez trudne chwile i lepiej rozumieć emocje. Bez oceniania, krótko i konkretnie.
                  </p>
                </div>

                <div className="onbCardGrid">
                  <div className="onbCard">
                    <div className="onbCardTitle">Mój nastrój</div>
                    <div className="onbCardText">Szybkie wpisy i prosty podgląd ostatnich 14 dni.</div>
                  </div>
                  <div className="onbCard">
                    <div className="onbCardTitle">Kryzys</div>
                    <div className="onbCardText">Kroki „tu i teraz”, infolinie i plan bezpieczeństwa.</div>
                  </div>
                  <div className="onbCard">
                    <div className="onbCardTitle">Wiedza</div>
                    <div className="onbCardText">Krótkie teksty psychoedukacyjne napisane prostym językiem.</div>
                  </div>
                  <div className="onbCard">
                    <div className="onbCardTitle">Dla przyjaciela</div>
                    <div className="onbCardText">Jak wspierać kogoś w kryzysie i kiedy poprosić dorosłego.</div>
                  </div>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="onbHero">
                  <h1 className="onbTitle onbTitleWarm">Prywatnie. Offline‑first.</h1>
                  <p className="onbBody onbBodyWarm">
                    Nie ma kont i logowania. Wpisy nastroju i plan bezpieczeństwa zapisują się lokalnie na Twoim urządzeniu.
                  </p>
                </div>

                <div className="onbPanel onbPanelWarm">
                  <div className="onbList">
                    <div className="onbListItem">
                      <div className="onbListTitle">Dane tylko lokalnie</div>
                      <div className="onbListText">Nie wysyłamy Twoich wpisów na serwer.</div>
                    </div>
                    <div className="onbListItem">
                      <div className="onbListTitle">Brak kont</div>
                      <div className="onbListText">To oznacza anonimowość i brak profilu.</div>
                    </div>
                    <div className="onbListItem">
                      <div className="onbListTitle">Wspólne urządzenie</div>
                      <div className="onbListText">Jeśli ktoś używa tej samej przeglądarki, może mieć dostęp do danych.</div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div className="onbHero">
                  <h1 className="onbTitle onbTitleWarm">W kryzysie: pomoc jest teraz</h1>
                  <p className="onbBody onbBodyWarm">
                    To nie jest usługa ratunkowa. Aplikacja nie dzwoni automatycznie. Jeśli jesteś w bezpośrednim zagrożeniu — zadzwoń pod 112.
                  </p>
                </div>

                <div className="onbPanel onbPanelWarm" onClick={(e) => e.stopPropagation()}>
                  <label className="onbCheck">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                    <span>
                      Rozumiem zasady: dane są lokalne, nie ma kont, a kontakt z pomocą inicjuję sam/a.
                    </span>
                  </label>

                  <div className="onbLinks">
                    <Link className="onbLinkBtn" to="/terms" aria-label="Otwórz regulamin">
                      Regulamin
                    </Link>
                    <Link className="onbLinkBtn" to="/privacy" aria-label="Otwórz politykę prywatności">
                      Polityka prywatności
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="onbBottomBar">
          <div className="onbCtaRow">
            {step === 0 ? (
              <div />
            ) : (
              <button
                type="button"
                className="onbBtn onbBtnGhost onbBtnGhostWarm"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Wstecz
              </button>
            )}

            {step === 0 ? (
              <button type="button" className="onbBtn onbBtnPrimary onbBtnPrimaryWarm" onClick={() => setStep(1)}>
                Dalej
              </button>
            ) : step === 1 ? (
              <button type="button" className="onbBtn onbBtnPrimary onbBtnPrimaryWarm" onClick={() => setStep(2)}>
                Dalej
              </button>
            ) : (
              <button
                type="button"
                className="onbBtn onbBtnPrimary onbBtnPrimaryWarm"
                onClick={onContinue}
                disabled={!checked || saving}
                style={{ width: '100%' }}
              >
                {saving ? 'Zapisuję…' : 'Zaczynam'}
              </button>
            )}
          </div>

          <div className="onbProgress" aria-hidden="true">
            <div className="onbDots">
              {Array.from({ length: slidesCount }).map((_, i) => (
                <div key={i} className={`onbDot ${i === dotIndex ? 'isActive' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FirstRunGate({ children }) {
  return <FirstRunGateInner>{children}</FirstRunGateInner>
}
