/* jshint esversion: 11, asi: true, module: true, jsx: true */
import { useEffect, useMemo, useState } from 'react';
import { HOTLINES, HOTLINES_META } from '../data/hotlines';
import { useSafetyPlan } from '../hooks/useIndexedDB';
import { CTAButton, CloudIcon, StoryCard, StoryScreen } from '../components/StoryUI';

const STEPS_NOW = [
  'Jeśli możesz, zostań w bezpiecznym miejscu.',
  'Jeśli jesteś sam/a, spróbuj napisać lub zadzwonić do kogoś teraz.',
  'Jeśli masz przy sobie rzeczy, którymi możesz zrobić sobie krzywdę — odsuń je poza zasięg.',
  'Skup się na następnym małym kroku. Nie musisz rozwiązać wszystkiego naraz.',
];

const STEPS_NOW_STORAGE_KEY = 'crisis_steps_now_checked_v1';

const LEGAL_BAR = 'To nie jest usługa ratunkowa. Jeśli jesteś w bezpośrednim zagrożeniu — zadzwoń pod 112.';

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
    <StoryScreen variant="dark" className="pageAnim">
      <StoryCard tone="dark" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="badgeDanger">Ważne</div>
            <h1 className="storyTitle" style={{ marginTop: 10, color: '#fff' }}>
              Moduł <span className="storyAccent">Kryzys</span>
            </h1>
            <p className="storyLead" style={{ color: 'rgba(255,255,255,0.72)' }}>{LEGAL_BAR}</p>
          </div>
          <CloudIcon mood="support" label="Wspierająca chmurka" />
        </div>
      </StoryCard>

      <StoryCard tone="dark" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="textStrong" style={{ color: '#fff' }}>Tu i teraz</div>
            <p className="storyLead" style={{ marginTop: 8, color: 'rgba(255,255,255,0.72)' }}>
              Zaznacz, co już zrobiłeś/aś. Skup się na jednym kroku.
            </p>
          </div>
          <CloudIcon mood="sad" label="Smutna chmurka" />
        </div>

        <div className="rowBetween mt12" style={{ gap: 10, alignItems: 'center' }}>
          <div className="textSm" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Checklist: {checkedCount}/{STEPS_NOW.length}
          </div>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <CTAButton as="button" type="button" tone="ghost" onClick={resetSteps}>
              Odznacz
            </CTAButton>
            <CTAButton as="button" type="button" tone="primary" onClick={markAllSteps}>
              Odhaczyłem/am
            </CTAButton>
          </div>
        </div>

        <div className="stackSm mt12">
          {STEPS_NOW.map((s, idx) => (
            <label
              key={s}
              className="cardInset"
              style={{
                display: 'flex',
                gap: 10,
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(255,255,255,0.14)',
                color: '#fff',
              }}
            >
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
      </StoryCard>

      <StoryCard tone="surface" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 className="sectionTitle" style={{ fontSize: 20 }}>Infolinie</h2>
            <p className="p" style={{ marginTop: 6 }}>Aplikacja nie dzwoni sama — Ty wybierasz.</p>
            <p className="textSm" style={{ marginTop: 6, color: 'var(--t-ink-muted)' }}>
              Aktualizacja listy: {HOTLINES_META.lastUpdated}. {HOTLINES_META.note}
            </p>
          </div>
          <CloudIcon mood="support" label="Wspierająca chmurka" />
        </div>

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
      </StoryCard>

      <StoryCard tone="surface" className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 className="sectionTitle" style={{ fontSize: 20 }}>Mój plan bezpieczeństwa</h2>
            <p className="p" style={{ marginTop: 6 }}>To jest tylko na Twoim telefonie. Offline.</p>
          </div>
          <CloudIcon mood="calm" label="Spokojna chmurka" />
        </div>

        {loading ? (
          <p className="p">Wczytuję…</p>
        ) : (
          <>
            {/* krok po kroku: sekcje jako story */}
            <div className="stackSm mt12">
              <div className="cardInset">
                <div className="textStrong">1) Moje sygnały ostrzegawcze</div>
                <textarea
                  id="warningSignals"
                  className="textarea"
                  value={form.warningSignals}
                  onChange={update('warningSignals')}
                  placeholder="Co u mnie oznacza, że jest gorzej?"
                />
              </div>

              <div className="cardInset">
                <div className="textStrong">2) Co pomaga mi, gdy jest bardzo trudno</div>
                <textarea
                  id="copingStrategies"
                  className="textarea"
                  value={form.copingStrategies}
                  onChange={update('copingStrategies')}
                  placeholder="Co mogę zrobić sam/a, żeby przetrwać najbliższe minuty/godziny?"
                />
              </div>

              <div className="cardInset">
                <div className="textStrong">3) Miejsca, w których czuję się bezpiecznie</div>
                <textarea
                  id="safePlaces"
                  className="textarea"
                  value={form.safePlaces}
                  onChange={update('safePlaces')}
                  placeholder="Np. dom, pokój, biblioteka, park…"
                />
              </div>

              <div className="cardInset">
                <div className="textStrong">4) Jak ograniczyć dostęp do rzeczy, którymi mógłbym/mogłabym zrobić sobie krzywdę</div>
                <textarea
                  id="limit"
                  className="textarea"
                  value={form.limitAccessToMeans}
                  onChange={update('limitAccessToMeans')}
                  placeholder="Np. odsunąć poza zasięg, poprosić kogoś o schowanie…"
                />
              </div>

              <div className="cardInset">
                <div className="textStrong">5) Osoby, z którymi mogę porozmawiać</div>
                <div className="textSm" style={{ marginTop: 6, color: 'var(--muted)' }}>
                  Imię + sposób kontaktu (np. telefon, messenger). To prywatne i lokalne.
                </div>

                <div className="stackSm mt12">
                  {(form.supportPeople ?? []).length === 0 ? (
                    <div className="cardInset cardMuted">Brak dodanych osób. Dodaj przynajmniej jedną, jeśli możesz.</div>
                  ) : null}

                  {(form.supportPeople ?? []).map((sp, idx) => (
                    <div key={`${idx}`} className="cardInset cardMuted">
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

                        <CTAButton as="button" type="button" tone="ghost" onClick={() => removeSupportPerson(idx)}>
                          Usuń
                        </CTAButton>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row mt12">
                  <CTAButton as="button" type="button" tone="ghost" onClick={addSupportPerson}>
                    Dodaj osobę
                  </CTAButton>
                </div>
              </div>

              <CTAButton as="button" type="button" tone="primary" disabled={saving} onClick={onSave}>
                {saving ? 'Zapisuję…' : 'Zapisz plan'}
              </CTAButton>
            </div>
          </>
        )}
      </StoryCard>

      <StoryCard tone="dark" className="pageAnimItem">
        <p className="storyLead" style={{ margin: 0, color: 'rgba(255,255,255,0.72)' }}>
          Jeśli jesteś w bezpośrednim zagrożeniu — zadzwoń pod 112.
        </p>
      </StoryCard>
    </StoryScreen>
  );
}
