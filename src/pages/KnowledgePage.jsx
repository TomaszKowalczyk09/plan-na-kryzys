import { useEffect, useMemo, useState } from 'react'
import { KNOWLEDGE_ARTICLES } from '../data/knowledge'
import { CTAButton, CloudIcon, StoryCard, StoryScreen } from '../components/StoryUI'

function GroundingGuideModal({ open, onClose }) {
  const steps = useMemo(
    () => [
      {
        id: 'intro',
        title: 'Uziemienie: 5–4–3–2–1',
        text: [
          'To krótka technika, która pomaga wrócić uwagą do „tu i teraz”.',
          'Idź spokojnie. Jeśli któryś krok jest trudny, pomiń i przejdź dalej.',
        ],
        prompt: 'Zacznij od rozejrzenia się po otoczeniu.',
      },
      {
        id: '5',
        title: 'Krok 1/5: Wzrok (5 rzeczy)',
        text: ['Nazwij 5 rzeczy, które widzisz. Mogą być małe: kolor, kształt, cień, napis.'],
        prompt: 'Powiedz w myślach lub na głos: „Widzę…” i wymień 5 rzeczy.',
      },
      {
        id: '4',
        title: 'Krok 2/5: Dotyk (4 rzeczy)',
        text: ['Nazwij 4 rzeczy, które czujesz dotykiem (np. tkaninę na skórze, oparcie krzesła, telefon w dłoni).'],
        prompt: 'Dotknij 1–2 przedmiotów i zauważ fakturę oraz temperaturę.',
      },
      {
        id: '3',
        title: 'Krok 3/5: Słuch (3 dźwięki)',
        text: ['Nazwij 3 dźwięki. Bliskie lub dalekie. Nawet bardzo ciche.'],
        prompt: 'Zatrzymaj się na 10 sekund i „poluj” na dźwięki.',
      },
      {
        id: '2',
        title: 'Krok 4/5: Zapach (2 rzeczy)',
        text: ['Nazwij 2 zapachy. Jeśli trudno — nazwij 2 rzeczy, które „czujesz w powietrzu” (np. świeże, ciepłe).'],
        prompt: 'Zrób 2 spokojne wdechy nosem.',
      },
      {
        id: '1',
        title: 'Krok 5/5: Smak (1 rzecz)',
        text: ['Nazwij 1 smak. Może być „neutralnie”.'],
        prompt: 'Jeśli możesz, napij się łyka wody i zauważ smak.',
      },
      {
        id: 'finish',
        title: 'Koniec',
        text: [
          'Dobrze. To już wszystko.',
          'Na koniec dociśnij stopy do podłogi na 10 sekund i puść. Powtórz 2 razy.',
          'Jeśli chcesz: wdech 4 sekundy, wydech 6 sekund (6 razy).',
        ],
        prompt: 'Możesz zakończyć lub zacząć od początku.',
      },
    ],
    []
  )

  const [index, setIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const step = steps[index]
  const isFirst = index === 0
  const isLast = index === steps.length - 1

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    // restart animacji przy zmianie kroku
    setAnimKey((k) => k + 1)
  }, [open, index])

  if (!open) return null

  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(steps.length - 1, i + 1))
  const restart = () => setIndex(0)

  return (
    <div className="onbOverlay" role="dialog" aria-modal="true" aria-label="Uziemienie krok po kroku">
      <div className="onbModal">
        <div className="onbModalHeader">
          <div className="rowBetween" style={{ gap: 12 }}>
            <div style={{ display: 'grid', gap: 2 }}>
              <div className="textStrong">Uziemienie</div>
              <div className="textSm textMuted">{index + 1}/{steps.length} • {step.title}</div>
            </div>
            <button type="button" className="btn" onClick={onClose} aria-label="Zamknij przewodnik">
              Zamknij
            </button>
          </div>
        </div>

        <div className="onbModalBody">
          <div key={animKey} className="guideStepAnim">
            <h2 className="sectionTitle" style={{ fontSize: 20 }}>{step.title}</h2>
            <div className="stackSm mt12">
              {step.text.map((t) => (
                <div key={t} className="textBody">
                  {t}
                </div>
              ))}
              <div className="cardInset cardMuted" style={{ marginTop: 8 }}>
                <div className="textStrong">Zadanie</div>
                <div className="textBody" style={{ marginTop: 4 }}>{step.prompt}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="onbModalFooter">
          <div className="row" style={{ justifyContent: 'space-between', width: '100%' }}>
            <button type="button" className="btn" onClick={goPrev} disabled={isFirst}>
              Wstecz
            </button>

            <div className="row" style={{ marginLeft: 'auto' }}>
              <button type="button" className="btn" onClick={restart}>
                Od nowa
              </button>
              <button type="button" className="btn btnPrimary" onClick={isLast ? onClose : goNext}>
                {isLast ? 'Zakończ' : 'Dalej'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KnowledgePage() {
  const [guideOpen, setGuideOpen] = useState(false)

  return (
    <StoryScreen variant="violet" className="pageAnim">
      <StoryCard tone="surface" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 className="storyTitle">
              Szybka <span className="storyAccent">wiedza</span>
            </h1>
            <p className="storyLead">
              Krótkie treści. Jeśli czujesz, że robi Ci się gorzej — przejdź do „Kryzys”.
            </p>
          </div>
          <CloudIcon mood="calm" label="Spokojna chmurka" />
        </div>

        <div className="row mt12">
          <CTAButton as="button" type="button" tone="primary" onClick={() => setGuideOpen(true)}>
            Uziemienie: przewodnik
          </CTAButton>
        </div>
      </StoryCard>

      <GroundingGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />

      <div className="tilesGrid">
        {KNOWLEDGE_ARTICLES.map((a) => (
          <details key={a.id} className="tileCard pageAnimItem">
            <summary className="tileSummary">
              <div className="tileIcon" aria-hidden="true">☁️</div>
              <div style={{ minWidth: 0 }}>
                <div className="tileTitle">{a.title}</div>
                <div className="tileSub">Krótkie i na temat</div>
              </div>
              <span className="tileChevron" aria-hidden="true">▾</span>
            </summary>
            <div className="tileBody">
              {a.warning ? <p className="p warningNote">{a.warning}</p> : null}
              <div className="stackSm mt12">
                {a.body.map((p) => (
                  <div key={p} className="textBody">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </StoryScreen>
  )
}
