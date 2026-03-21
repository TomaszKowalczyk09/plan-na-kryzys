import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HOTLINES } from '../data/hotlines'
import { CTAButton, CloudIcon, StoryCard, StoryScreen } from '../components/StoryUI'

const QUESTIONS = [
  {
    id: 'wishToBeDead',
    label: '1) Czy zdarzało Ci się chcieć zasnąć i już się nie obudzić?',
  },
  {
    id: 'suicidalThoughts',
    label: '2) Czy miałeś/aś myśli o odebraniu sobie życia?',
  },
  {
    id: 'method',
    label: '3) Czy myślałeś/aś, jak mógłbyś/mogłabyś to zrobić?',
  },
  {
    id: 'intent',
    label: '4) Czy miałeś/aś zamiar to zrobić?',
  },
  {
    id: 'plan',
    label: '5) Czy miałeś/aś konkretny plan odebrania sobie życia?',
  },
  {
    id: 'behaviorLifetime',
    label: '6) Czy kiedykolwiek podjąłeś/podjęłaś próbę odebrania sobie życia?',
  },
  {
    id: 'behaviorRecent',
    label: '7) Czy taka próba miała miejsce w ostatnich 3 miesiącach?',
  },
]

function getInitialAnswers() {
  return QUESTIONS.reduce((acc, question) => {
    acc[question.id] = null
    return acc
  }, {})
}

function evaluateCSSRS(answers) {
  if (answers.behaviorRecent) {
    return {
      level: 'Bardzo wysokie ryzyko',
      tone: 'danger',
      summary: 'Wynik wskazuje na pilną potrzebę natychmiastowego wsparcia.',
      feedback: [
        'Nie zostawaj teraz sam/a, jeśli to możliwe.',
        'Skontaktuj się natychmiast z numerem 112 lub najbliższym SOR.',
        'Powiedz zaufanej osobie dorosłej, co się dzieje, jeszcze dziś.',
      ],
    }
  }

  if (answers.behaviorLifetime || answers.plan || answers.intent) {
    return {
      level: 'Wysokie ryzyko',
      tone: 'danger',
      summary: 'Wynik wskazuje na zwiększone ryzyko i potrzebę szybkiego kontaktu z pomocą.',
      feedback: [
        'Skontaktuj się dziś z psychologiem, psychiatrą lub telefonem wsparcia.',
        'Zastosuj plan bezpieczeństwa i usuń z otoczenia rzeczy, które mogą być niebezpieczne.',
        'Umów, że ktoś bliski będzie z Tobą w kontakcie przez najbliższe godziny.',
      ],
    }
  }

  if (answers.method) {
    return {
      level: 'Umiarkowane ryzyko',
      tone: 'warn',
      summary: 'Wynik wskazuje na myśli wymagające uważności i wsparcia.',
      feedback: [
        'Porozmawiaj z zaufaną osobą dorosłą o tym, co przeżywasz.',
        'Skorzystaj z modułu kryzysowego i ćwiczeń uziemiających.',
        'Jeśli objawy się nasilą, zadzwoń na infolinię lub po pomoc medyczną.',
      ],
    }
  }

  if (answers.suicidalThoughts || answers.wishToBeDead) {
    return {
      level: 'Niskie ryzyko (obecne sygnały ostrzegawcze)',
      tone: 'warn',
      summary: 'Wynik sugeruje, że warto zadbać o wsparcie i monitorować samopoczucie.',
      feedback: [
        'Nie bagatelizuj tych sygnałów — porozmawiaj z kimś zaufanym.',
        'Zrób krótką przerwę regulacyjną: oddech, woda, kontakt z kimś bliskim.',
        'Wróć do testu, jeśli sytuacja się pogorszy.',
      ],
    }
  }

  return {
    level: 'Brak aktualnych sygnałów w teście',
    tone: 'ok',
    summary: 'Wynik nie pokazuje aktualnych odpowiedzi dodatnich.',
    feedback: [
      'To nadal dobry moment, aby dbać o rutynę snu, jedzenia i odpoczynku.',
      'Jeśli Twoje samopoczucie się zmieni, możesz wrócić i ponownie wykonać test.',
    ],
  }
}

function ResultBadge({ tone, children }) {
  const map = {
    danger: {
      bg: 'rgba(255, 107, 107, 0.18)',
      border: 'rgba(255, 107, 107, 0.4)',
      color: '#ffd5d5',
    },
    warn: {
      bg: 'rgba(255, 206, 86, 0.18)',
      border: 'rgba(255, 206, 86, 0.4)',
      color: '#fff3c5',
    },
    ok: {
      bg: 'rgba(140, 255, 180, 0.16)',
      border: 'rgba(140, 255, 180, 0.4)',
      color: '#d7ffe5',
    },
  }

  const style = map[tone] ?? map.ok

  return (
    <div
      className="textStrong"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        padding: '8px 12px',
        border: `1px solid ${style.border}`,
        background: style.bg,
        color: style.color,
      }}
    >
      {children}
    </div>
  )
}

export default function CSSRSPage() {
  const [answers, setAnswers] = useState(() => getInitialAnswers())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = useMemo(
    () => QUESTIONS.every((question) => typeof answers[question.id] === 'boolean'),
    [answers],
  )

  const result = useMemo(() => {
    if (!submitted || !allAnswered) return null
    return evaluateCSSRS(answers)
  }, [allAnswered, answers, submitted])

  const currentQuestion = QUESTIONS[currentIndex]
  const currentAnswer = answers[currentQuestion.id]
  const answeredCount = useMemo(
    () => QUESTIONS.filter((question) => typeof answers[question.id] === 'boolean').length,
    [answers],
  )
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100)
  const isDarkTheme = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setSubmitted(false)

    const questionIndex = QUESTIONS.findIndex((question) => question.id === id)
    if (questionIndex >= 0 && questionIndex < QUESTIONS.length - 1) {
      setCurrentIndex(questionIndex + 1)
      return
    }

    if (questionIndex === QUESTIONS.length - 1) {
      const nextAnswers = { ...answers, [id]: value }
      const full = QUESTIONS.every((question) => typeof nextAnswers[question.id] === 'boolean')
      if (full) setSubmitted(true)
    }
  }

  const onNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return
    }
    if (allAnswered) setSubmitted(true)
  }

  const onBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const onReset = () => {
    setAnswers(getInitialAnswers())
    setCurrentIndex(0)
    setSubmitted(false)
  }

  return (
    <StoryScreen variant={isDarkTheme ? 'dark' : 'light'} className="pageAnim">
      <StoryCard tone={isDarkTheme ? 'dark' : 'surface'} className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="badgeDanger">Ocena bezpieczeństwa</div>
            <h1 className="storyTitle" style={{ marginTop: 10, color: isDarkTheme ? '#fff' : 'var(--t-ink)' }}>
              Test <span className="storyAccent">C-SSRS</span>
            </h1>
            <p className="storyLead" style={{ color: isDarkTheme ? 'rgba(255,255,255,0.72)' : 'var(--t-ink-muted)' }}>
              Odpowiedz szczerze na pytania tak/nie. Na końcu zobaczysz wynik i wskazówki.
            </p>
            <p className="textSm" style={{ color: isDarkTheme ? 'rgba(255,255,255,0.64)' : 'var(--t-ink-muted)' }}>
              To narzędzie przesiewowe, nie diagnoza medyczna.
            </p>
          </div>
          <CloudIcon mood="support" label="Wspierająca chmurka" />
        </div>
      </StoryCard>

      <StoryCard tone="surface" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'center', gap: 10 }}>
          <div className="textStrong">
            Pytanie {currentIndex + 1}/{QUESTIONS.length}
          </div>
          <div className="textSm" style={{ color: 'var(--t-ink-muted)' }}>
            Ukończono: {progress}%
          </div>
        </div>

        <div
          className="mt12"
          style={{
            width: '100%',
            height: 10,
            borderRadius: 999,
            background: isDarkTheme ? 'rgba(255,255,255,0.12)' : 'rgba(7,7,22,0.10)',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #7a60ff, #b09bff)',
            }}
          />
        </div>

        <div className="cardInset mt12">
          <div className="textStrong" style={{ fontSize: 20, lineHeight: 1.35 }}>
            {currentQuestion.label}
          </div>
          <div className="row mt12" style={{ gap: 10, flexWrap: 'wrap' }}>
            <CTAButton
              as="button"
              type="button"
              tone={currentAnswer === true ? 'primary' : 'ghost'}
              onClick={() => setAnswer(currentQuestion.id, true)}
              style={{ minWidth: 96 }}
            >
              Tak
            </CTAButton>
            <CTAButton
              as="button"
              type="button"
              tone={currentAnswer === false ? 'dark' : 'ghost'}
              onClick={() => setAnswer(currentQuestion.id, false)}
              style={{ minWidth: 96 }}
            >
              Nie
            </CTAButton>
          </div>
        </div>

        <div className="row mt12" style={{ gap: 10, flexWrap: 'wrap' }}>
          <CTAButton as="button" type="button" tone="ghost" onClick={onBack} disabled={currentIndex === 0}>
            Wstecz
          </CTAButton>
          <CTAButton
            as="button"
            type="button"
            tone="primary"
            onClick={onNext}
            disabled={typeof currentAnswer !== 'boolean' || (currentIndex === QUESTIONS.length - 1 && !allAnswered)}
          >
            {currentIndex === QUESTIONS.length - 1 ? 'Pokaż wynik' : 'Dalej'}
          </CTAButton>
          <CTAButton as="button" type="button" tone="ghost" onClick={onReset}>
            Wyczyść
          </CTAButton>
          <CTAButton as={Link} to="/crisis" tone="ghost">
            Wróć do kryzysu
          </CTAButton>
        </div>

        {!allAnswered ? (
          <p className="textSm mt12" style={{ color: 'var(--t-ink-muted)' }}>
            Wybierz odpowiedź Tak/Nie i przejdź dalej. Wynik pokaże się po ostatnim pytaniu.
          </p>
        ) : null}
      </StoryCard>

      {result ? (
        <StoryCard tone={isDarkTheme ? 'dark' : 'surface'} className="pageAnimItem">
          <div className="stackSm">
            <ResultBadge tone={result.tone}>{result.level}</ResultBadge>
            <p className="storyLead" style={{ margin: 0, color: isDarkTheme ? 'rgba(255,255,255,0.82)' : 'var(--t-ink-muted)' }}>
              {result.summary}
            </p>
            <div className="stackSm">
              {result.feedback.map((item) => (
                <div
                  key={item}
                  className="cardInset"
                  style={{
                    background: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'var(--t-surface)',
                    borderColor: isDarkTheme ? 'rgba(255,255,255,0.14)' : 'color-mix(in srgb, var(--t-ink) 12%, transparent)',
                    color: isDarkTheme ? '#fff' : 'var(--t-ink)',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </StoryCard>
      ) : null}

      <StoryCard tone="surface" className="pageAnimItem">
        <div className="textStrong">Szybki kontakt</div>
        <div className="stackSm mt12">
          {HOTLINES.slice(0, 3).map((item) => (
            <a key={item.id} className="cardInset cardMuted" href={`tel:${item.phone}`}>
              <div className="rowBetween">
                <div className="textStrong">{item.name}</div>
                <div className="textEmphasis">{item.phone}</div>
              </div>
            </a>
          ))}
        </div>
        <p className="textSm mt12" style={{ color: 'var(--t-ink-muted)' }}>
          Jeśli jesteś w bezpośrednim zagrożeniu życia — zadzwoń pod 112.
        </p>
      </StoryCard>
    </StoryScreen>
  )
}
