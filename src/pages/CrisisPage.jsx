/* jshint esversion: 11, asi: true, module: true, jsx: true */
import { useEffect, useMemo, useState } from 'react';
import { HOTLINES, HOTLINES_META } from '../data/hotlines';
import { useSafetyPlan } from '../hooks/useIndexedDB';

const STEPS_NOW = [
  'Jeśli możesz, zostań w bezpiecznym miejscu.',
  'Jeśli jesteś sam/a, spróbuj napisać lub zadzwonić do kogoś teraz.',
  'Jeśli masz przy sobie rzeczy, którymi możesz zrobić sobie krzywdę — odsuń je poza zasięg.',
  'Skup się na następnym małym kroku. Nie musisz rozwiązać wszystkiego naraz.',
];

const STEPS_NOW_STORAGE_KEY = 'crisis_steps_now_checked_v1';

const LEGAL_BAR = 'To nie jest usługa ratunkowa. W bezpośrednim zagrożeniu życia lub zdrowia: 112.';

export default function CrisisPage() {
  const { plan, loading, savePlan } = useSafetyPlan();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    warningSignals: '',
    copingStrategies: '',
    safePlaces: '',
    limitAccessToMeans: '',
    supportPeople: [],
  });

  const [stepsChecked, setStepsChecked] = useState(() => {
    try {
      const raw = localStorage.getItem(STEPS_NOW_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed.map(Boolean) : STEPS_NOW.map(() => false);
    } catch {
      return STEPS_NOW.map(() => false);
    }
  });

  useEffect(() => {
    if (!plan) return;
    setForm({
      warningSignals: plan.warningSignals ?? '',
      copingStrategies: plan.copingStrategies ?? '',
      safePlaces: plan.safePlaces ?? '',
      limitAccessToMeans: plan.limitAccessToMeans ?? '',
      supportPeople: Array.isArray(plan.supportPeople) ? plan.supportPeople : [],
    });
  }, [plan]);

  useEffect(() => {
    try {
      localStorage.setItem(STEPS_NOW_STORAGE_KEY, JSON.stringify(stepsChecked));
    } catch {
      // brak akcji: offline/local-only
    }
  }, [stepsChecked]);

  const update = (key) => (ev) => setForm((p) => ({ ...p, [key]: ev.target.value }));

  const addSupportPerson = () => {
    setForm((p) => ({
      ...p,
      supportPeople: [...(p.supportPeople ?? []), { name: '', contact: '' }],
    }));
  };

  const removeSupportPerson = (idx) => {
    setForm((p) => ({
      ...p,
      supportPeople: (p.supportPeople ?? []).filter((_, i) => i !== idx),
    }));
  };

  const updateSupportPerson = (idx, key) => (ev) => {
    const value = ev.target.value;
    setForm((p) => ({
      ...p,
      supportPeople: (p.supportPeople ?? []).map((sp, i) => (i === idx ? { ...sp, [key]: value } : sp)),
    }));
  };

  const toggleStep = (idx) => (ev) => {
    const checked = ev.target.checked;
    setStepsChecked((prev) => prev.map((v, i) => (i === idx ? checked : v)));
  };

  const resetSteps = () => setStepsChecked(STEPS_NOW.map(() => false));
  const markAllSteps = () => setStepsChecked(STEPS_NOW.map(() => true));

  const normalizedSupportPeople = useMemo(() => {
    return (form.supportPeople ?? [])
      .map((p) => ({
        name: String(p?.name ?? '').trim(),
        contact: String(p?.contact ?? '').trim(),
      }))
      .filter((p) => p.name || p.contact);
  }, [form.supportPeople]);

  const checkedCount = useMemo(() => stepsChecked.filter(Boolean).length, [stepsChecked]);

  const onSave = async () => {
    setSaving(true);
    try {
      await savePlan({
        ...plan,
        ...form,
        supportPeople: normalizedSupportPeople,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card" style={{ borderColor: 'rgba(220, 38, 38, 0.20)' }}>
        <div style={{ fontWeight: 800, color: 'var(--danger)' }}>Ważne</div>
        <p className="p">{LEGAL_BAR}</p>
      </div>

      <div className="screen">
        <div className="card cardSoft">
          <div className="badgeDanger">Wysokie ryzyko</div>
          <h1 className="h1 mt10">
            Jeśli masz myśli o zrobieniu sobie krzywdy — spróbuj nie być z tym sam/a.
          </h1>
          <p className="p">To poważna sytuacja. Pomoc jest możliwa teraz.</p>

          <div className="rowBetween mt12" style={{ gap: 10, alignItems: 'center' }}>
            <div className="p" style={{ margin: 0 }}>
              Checklist: {checkedCount}/{STEPS_NOW.length}
            </div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button type="button" className="btn" onClick={resetSteps}>
                Odznacz wszystko
              </button>
              <button type="button" className="btn btnPrimary" onClick={markAllSteps}>
                Odhaczyłem/am
              </button>
            </div>
          </div>

          <div className="stackSm mt12">
            {STEPS_NOW.map((s, idx) => (
              <label key={s} className="cardInset" style={{ display: 'flex', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(stepsChecked?.[idx])}
                  onChange={toggleStep(idx)}
                  aria-label={s}
                  style={{ marginTop: 2 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>{s}</div>
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <h1 className="h1">Infolinie</h1>
          <p className="p">Aplikacja nie dzwoni sama — Ty wybierasz.</p>
          <p className="p">Aktualizacja listy: {HOTLINES_META.lastUpdated}. {HOTLINES_META.note}</p>

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

              <div className="card" style={{ padding: 12, marginTop: 12 }}>
                <h1 className="h1">Osoby, z którymi mogę porozmawiać</h1>
                <p className="p">Imię + sposób kontaktu (np. telefon, messenger). To prywatne i lokalne.</p>

                <div className="stackSm mt12">
                  {(form.supportPeople ?? []).length === 0 ? (
                    <div className="cardInset">Brak dodanych osób. Dodaj przynajmniej jedną, jeśli możesz.</div>
                  ) : null}

                  {(form.supportPeople ?? []).map((sp, idx) => (
                    <div key={`${idx}`} className="cardInset">
                      <div className="rowBetween" style={{ gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <label className="label" htmlFor={`sp-name-${idx}`}>Imię</label>
                          <input
                            id={`sp-name-${idx}`}
                            className="input"
                            value={sp?.name ?? ''}
                            onChange={updateSupportPerson(idx, 'name')}
                            placeholder="Np. mama, tata, Ola…"
                          />

                          <label className="label" htmlFor={`sp-contact-${idx}`}>Kontakt</label>
                          <input
                            id={`sp-contact-${idx}`}
                            className="input"
                            value={sp?.contact ?? ''}
                            onChange={updateSupportPerson(idx, 'contact')}
                            placeholder="Np. 123 456 789 / @nick / Messenger"
                          />
                        </div>

                        <button type="button" className="btn btnDanger" onClick={() => removeSupportPerson(idx)}>
                          Usuń
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row mt12">
                  <button type="button" className="btn" onClick={addSupportPerson}>Dodaj osobę</button>
                </div>
              </div>

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
    </div>
  );
}
