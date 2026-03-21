/* jshint esversion: 11, asi: true, module: true, jsx: true */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHotlines, getHotlinesMeta } from '../data/hotlines';
import { useSafetyPlan } from '../hooks/useIndexedDB';
import { CTAButton, CloudIcon, StoryCard, StoryScreen } from '../components/StoryUI';
import { useI18n } from '../i18n/index.jsx'

const STEPS_NOW = [
  'Jeśli możesz, zostań w bezpiecznym miejscu.',
  'Jeśli jesteś sam/a, spróbuj napisać lub zadzwonić do kogoś teraz.',
  'Jeśli masz przy sobie rzeczy, którymi możesz zrobić sobie krzywdę — odsuń je poza zasięg.',
  'Skup się na następnym małym kroku. Nie musisz rozwiązać wszystkiego naraz.',
];

const STEPS_NOW_STORAGE_KEY = 'crisis_steps_now_checked_v1';

const LEGAL_BAR = 'To nie jest usługa ratunkowa. Jeśli jesteś w bezpośrednim zagrożeniu — zadzwoń pod 112.';

export default function CrisisPage() {
  const { lang, t, get } = useI18n()
  const { plan, loading, savePlan } = useSafetyPlan();
  const [saving, setSaving] = useState(false);
  const isDarkTheme = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark';
  const HOTLINES = useMemo(() => getHotlines(lang), [lang])
  const HOTLINES_META = useMemo(() => getHotlinesMeta(lang), [lang])

  const stepsNow = get('crisis.stepsNow', STEPS_NOW)
  const legalBar = t('crisis.legalBar', LEGAL_BAR)

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
      return Array.isArray(parsed) ? parsed.map(Boolean) : stepsNow.map(() => false);
    } catch {
      return stepsNow.map(() => false);
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

  const resetSteps = () => setStepsChecked(stepsNow.map(() => false));
  const markAllSteps = () => setStepsChecked(stepsNow.map(() => true));

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
    <StoryScreen variant={isDarkTheme ? 'dark' : 'light'} className="pageAnim">
      <StoryCard tone={isDarkTheme ? 'dark' : 'surface'} className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="badgeDanger">{t('crisis.important', 'Ważne')}</div>
            <h1 className="storyTitle" style={{ marginTop: 10, color: isDarkTheme ? '#fff' : 'var(--t-ink)' }}>
              {t('crisis.module', 'Moduł')} <span className="storyAccent">{t('crisis.moduleAccent', 'Kryzys')}</span>
            </h1>
            <p className="storyLead" style={{ color: isDarkTheme ? 'rgba(255,255,255,0.72)' : 'var(--t-ink-muted)' }}>{legalBar}</p>
            <div className="row mt12" style={{ gap: 8, flexWrap: 'wrap' }}>
              <CTAButton as={Link} to="/crisis/cssrs" tone="primary">
                {t('crisis.cssrsButton', 'Zrób test C-SSRS')}
              </CTAButton>
            </div>
          </div>
          <CloudIcon mood="support" label="Wspierająca chmurka" />
        </div>
      </StoryCard>

      <StoryCard tone={isDarkTheme ? 'dark' : 'surface'} className="pageAnimItem">
        <div className="rowBetween" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="textStrong" style={{ color: isDarkTheme ? '#fff' : 'var(--t-ink)' }}>{t('crisis.hereNow', 'Tu i teraz')}</div>
            <p className="storyLead" style={{ marginTop: 8, color: isDarkTheme ? 'rgba(255,255,255,0.72)' : 'var(--t-ink-muted)' }}>
              {t('crisis.hereNowLead', 'Zaznacz, co już zrobiłeś/aś. Skup się na jednym kroku.')}
            </p>
          </div>
          <CloudIcon mood="sad" label="Smutna chmurka" />
        </div>

        <div className="rowBetween mt12" style={{ gap: 10, alignItems: 'center' }}>
          <div className="textSm" style={{ color: isDarkTheme ? 'rgba(255,255,255,0.72)' : 'var(--t-ink-muted)' }}>
            {t('crisis.checklist', 'Checklist')}: {checkedCount}/{stepsNow.length}
          </div>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <CTAButton as="button" type="button" tone="ghost" onClick={resetSteps}>
              {t('crisis.uncheck', 'Odznacz')}
            </CTAButton>
            <CTAButton as="button" type="button" tone="primary" onClick={markAllSteps}>
              {t('crisis.doneAll', 'Odhaczyłem/am')}
            </CTAButton>
          </div>
        </div>

        <div className="stackSm mt12">
          {stepsNow.map((s, idx) => (
            <label
              key={s}
              className="cardInset"
              style={{
                display: 'flex',
                gap: 10,
                cursor: 'pointer',
                background: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'var(--t-surface)',
                borderColor: isDarkTheme ? 'rgba(255,255,255,0.14)' : 'color-mix(in srgb, var(--t-ink) 10%, transparent)',
                color: isDarkTheme ? '#fff' : 'var(--t-ink)',
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
            <p className="p" style={{ marginTop: 6 }}>{t('crisis.hotlinesLead', 'Aplikacja nie dzwoni sama — Ty wybierasz.')}</p>
            <p className="textSm" style={{ marginTop: 6, color: 'var(--t-ink-muted)' }}>
              {t('crisis.hotlinesUpdate', 'Aktualizacja listy')}: {HOTLINES_META.lastUpdated}. {HOTLINES_META.note}
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
            <h2 className="sectionTitle" style={{ fontSize: 20 }}>{t('crisis.planTitle', 'Mój plan bezpieczeństwa')}</h2>
            <p className="p" style={{ marginTop: 6 }}>{t('crisis.planLead', 'To jest tylko na Twoim telefonie. Offline.')}</p>
          </div>
          <CloudIcon mood="calm" label="Spokojna chmurka" />
        </div>

        {loading ? (
          <p className="p">{t('crisis.loading', 'Wczytuję…')}</p>
        ) : (
          <>
            {/* krok po kroku: sekcje jako story */}
            <div className="stackSm mt12">
              <div className="cardInset">
                <div className="textStrong">{t('crisis.form.warningSignals', '1) Moje sygnały ostrzegawcze')}</div>
                <textarea
                  id="warningSignals"
                  className="textarea"
                  value={form.warningSignals}
                  onChange={update('warningSignals')}
                  placeholder={t('crisis.form.warningSignalsPlaceholder', 'Co u mnie oznacza, że jest gorzej?')}
                />
              </div>

              <div className="cardInset">
                <div className="textStrong">{t('crisis.form.copingStrategies', '2) Co pomaga mi, gdy jest bardzo trudno')}</div>
                <textarea
                  id="copingStrategies"
                  className="textarea"
                  value={form.copingStrategies}
                  onChange={update('copingStrategies')}
                  placeholder={t('crisis.form.copingStrategiesPlaceholder', 'Co mogę zrobić sam/a, żeby przetrwać najbliższe minuty/godziny?')}
                />
              </div>

              <div className="cardInset">
                <div className="textStrong">{t('crisis.form.safePlaces', '3) Miejsca, w których czuję się bezpiecznie')}</div>
                <textarea
                  id="safePlaces"
                  className="textarea"
                  value={form.safePlaces}
                  onChange={update('safePlaces')}
                  placeholder={t('crisis.form.safePlacesPlaceholder', 'Np. dom, pokój, biblioteka, park…')}
                />
              </div>

              <div className="cardInset">
                <div className="textStrong">{t('crisis.form.limitAccess', '4) Jak ograniczyć dostęp do rzeczy, którymi mógłbym/mogłabym zrobić sobie krzywdę')}</div>
                <textarea
                  id="limit"
                  className="textarea"
                  value={form.limitAccessToMeans}
                  onChange={update('limitAccessToMeans')}
                  placeholder={t('crisis.form.limitAccessPlaceholder', 'Np. odsunąć poza zasięg, poprosić kogoś o schowanie…')}
                />
              </div>

              <div className="cardInset">
                <div className="textStrong">{t('crisis.form.supportPeople', '5) Osoby, z którymi mogę porozmawiać')}</div>
                <div className="textSm" style={{ marginTop: 6, color: 'var(--muted)' }}>
                  {t('crisis.form.supportPeopleLead', 'Imię + sposób kontaktu (np. telefon, messenger). To prywatne i lokalne.')}
                </div>

                <div className="stackSm mt12">
                  {(form.supportPeople ?? []).length === 0 ? (
                    <div className="cardInset cardMuted">{t('crisis.form.noPeople', 'Brak dodanych osób. Dodaj przynajmniej jedną, jeśli możesz.')}</div>
                  ) : null}

                  {(form.supportPeople ?? []).map((sp, idx) => (
                    <div key={`${idx}`} className="cardInset cardMuted">
                      <div className="rowBetween" style={{ gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <label className="label" htmlFor={`sp-name-${idx}`}>{t('crisis.form.name', 'Imię')}</label>
                          <input
                            id={`sp-name-${idx}`}
                            className="input"
                            value={sp?.name ?? ''}
                            onChange={updateSupportPerson(idx, 'name')}
                            placeholder={t('crisis.form.namePlaceholder', 'Np. mama, tata, Ola…')}
                          />

                          <label className="label" htmlFor={`sp-contact-${idx}`}>{t('crisis.form.contact', 'Kontakt')}</label>
                          <input
                            id={`sp-contact-${idx}`}
                            className="input"
                            value={sp?.contact ?? ''}
                            onChange={updateSupportPerson(idx, 'contact')}
                            placeholder={t('crisis.form.contactPlaceholder', 'Np. 123 456 789 / @nick / Messenger')}
                          />
                        </div>

                        <CTAButton as="button" type="button" tone="ghost" onClick={() => removeSupportPerson(idx)}>
                          {t('crisis.form.remove', 'Usuń')}
                        </CTAButton>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row mt12">
                  <CTAButton as="button" type="button" tone="ghost" onClick={addSupportPerson}>
                    {t('crisis.form.addPerson', 'Dodaj osobę')}
                  </CTAButton>
                </div>
              </div>

              <CTAButton as="button" type="button" tone="primary" disabled={saving} onClick={onSave}>
                {saving ? t('crisis.saving', 'Zapisuję…') : t('crisis.save', 'Zapisz plan')}
              </CTAButton>
            </div>
          </>
        )}
      </StoryCard>

      <StoryCard tone={isDarkTheme ? 'dark' : 'surface'} className="pageAnimItem">
        <p className="storyLead" style={{ margin: 0, color: isDarkTheme ? 'rgba(255,255,255,0.72)' : 'var(--t-ink-muted)' }}>
          {t('crisis.footerWarning', 'Jeśli jesteś w bezpośrednim zagrożeniu — zadzwoń pod 112.')}
        </p>
      </StoryCard>
    </StoryScreen>
  );
}
