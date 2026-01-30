import { useEffect, useState } from 'react'
import { HOTLINES } from '../data/hotlines'
import { useSafetyPlan } from '../hooks/useIndexedDB'

const STEPS_NOW = [
  'Jeśli możesz, zostań w bezpiecznym miejscu.',
  'Jeśli jesteś sam/a, spróbuj napisać lub zadzwonić do kogoś teraz.',
  'Jeśli masz przy sobie rzeczy, którymi możesz zrobić sobie krzywdę — odsuń je poza zasięg.',
  'Skup się na następnym małym kroku. Nie musisz rozwiązać wszystkiego naraz.',
]

export default function CrisisPage() {
  const { plan, loading, savePlan } = useSafetyPlan()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    warningSignals: '',
    copingStrategies: '',
    safePlaces: '',
    limitAccessToMeans: '',
  })

  // inicjalizacja formularza po wczytaniu
  useEffect(() => {
    if (!plan) return
    setForm({
      warningSignals: plan.warningSignals ?? '',
      copingStrategies: plan.copingStrategies ?? '',
      safePlaces: plan.safePlaces ?? '',
      limitAccessToMeans: plan.limitAccessToMeans ?? '',
    })
  }, [plan])

  const update = (key) => (ev) => setForm((p) => ({ ...p, [key]: ev.target.value }))

  const onSave = async () => {
    setSaving(true)
    try {
      await savePlan({
        ...plan,
        ...form,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="screen">
      <div className="card cardSoft">
        <div className="badgeDanger">Wysokie ryzyko</div>
        <h1 className="h1 mt10">
          Jeśli masz myśli o zrobieniu sobie krzywdy — spróbuj nie być z tym sam/a.
        </h1>
        <p className="p">To poważna sytuacja. Pomoc jest możliwa teraz.</p>

        <div className="stackSm mt12">
          {STEPS_NOW.map((s) => (
            <div key={s} className="cardInset">
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Infolinie</h1>
        <p className="p">Aplikacja nie dzwoni sama — Ty wybierasz.</p>

        <div className="stackSm mt12">
          {HOTLINES.map((h) => (
            <a key={h.id} className="cardInset cardMuted" href={`tel:${h.phone}`}>
              <div className="rowBetween">
                <div className="textStrong">{h.name}</div>
                <div className="textEmphasis">{h.phone}</div>
              </div>
              <div className="p mt6">{h.note}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Mój plan bezpieczeństwa</h1>
        <p className="p">To jest tylko na Twoim telefonie. Offline.</p>

        {loading ? (
          <p className="p">Wczytuję…</p>
        ) : (
          <>
            <label className="label" htmlFor="warningSignals">Moje sygnały ostrzegawcze</label>
            <textarea
              id="warningSignals"
              className="textarea"
              value={form.warningSignals}
              onChange={update('warningSignals')}
              placeholder="Co u mnie oznacza, że jest gorzej?"
            />

            <label className="label" htmlFor="copingStrategies">Co pomaga mi, gdy jest bardzo trudno</label>
            <textarea
              id="copingStrategies"
              className="textarea"
              value={form.copingStrategies}
              onChange={update('copingStrategies')}
              placeholder="Co mogę zrobić sam/a, żeby przetrwać najbliższe minuty/godziny?"
            />

            <label className="label" htmlFor="safePlaces">Miejsca, w których czuję się bezpiecznie</label>
            <textarea
              id="safePlaces"
              className="textarea"
              value={form.safePlaces}
              onChange={update('safePlaces')}
              placeholder="Np. dom, pokój, biblioteka, park…"
            />

            <label className="label" htmlFor="limit">Jak ograniczyć dostęp do rzeczy, którymi mógłbym/mogłabym zrobić sobie krzywdę</label>
            <textarea
              id="limit"
              className="textarea"
              value={form.limitAccessToMeans}
              onChange={update('limitAccessToMeans')}
              placeholder="Np. odsunąć poza zasięg, poprosić kogoś o schowanie…"
            />

            <div className="row mt12">
              <button type="button" className="btn btnPrimary" disabled={saving} onClick={onSave}>
                {saving ? 'Zapisuję…' : 'Zapisz plan'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card cardMuted">
        <p className="p">
          Jeśli jesteś w bezpośrednim zagrożeniu życia, wybierz 112.
        </p>
      </div>
    </div>
  )
}
