import React, { useState, useEffect } from 'react';
import { useAddictionConfig } from '../hooks/useIndexedDB';
import { useNavigate } from 'react-router-dom';
import KamienieMilowe from '../components/KamienieMilowe';
import { useI18n } from '../i18n';

const defaultQuestions = [
  'Dlaczego chcesz wyjść z uzależnienia?',
  'Jakie korzyści przyniesie Ci zerwanie z nałogiem?',
  'Co motywuje Cię do zmiany?',
  'Jakie wsparcie możesz uzyskać?',
];

export default function AddictionConfigPage() {
  const { t, get } = useI18n();
  const { config, saveConfig, loading } = useAddictionConfig();
  const navigate = useNavigate();
  const [addiction, setAddiction] = useState('');
  const questions = get('addictionConfig.questions', defaultQuestions);
  const [answers, setAnswers] = useState(Array(defaultQuestions.length).fill(''));

  useEffect(() => {
    if (config) {
      setAddiction(config.addiction || '');
      setAnswers(config.answers || Array(questions.length).fill(''));
    }
  }, [config, questions.length]);

  const handleAnswerChange = (idx, value) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveConfig({ addiction, answers });
    alert(t('addictionConfig.saved', 'Konfiguracja uzależnienia zapisana!'));
    navigate('/sobriety');
  };

  return (
      <div className="addiction-config-page" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--t-bg)' }}>
        <div style={{ background: 'var(--t-surface)', borderRadius: 24, boxShadow: 'var(--t-shadow)', border: '1px solid color-mix(in srgb, var(--t-ink) 10%, transparent)', padding: '32px 24px', maxWidth: 420, width: '100%', margin: '32px 0', color: 'var(--t-ink)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 700, fontSize: 24 }}>{t('addictionConfig.title', 'Konfiguracja śledzenia uzależnienia')}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>{t('addictionConfig.addictionLabel', 'Twoje uzależnienie:')}</label>
              <input
                type="text"
                value={addiction}
                onChange={(e) => setAddiction(e.target.value)}
                required
                placeholder={t('addictionConfig.addictionPlaceholder', 'Np. alkohol, nikotyna, hazard')}
                style={{ padding: '8px', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--t-ink) 14%, transparent)', background: 'var(--t-surface)', color: 'var(--t-ink)', fontSize: 16 }}
              />
            </div>
            {questions.map((q, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 600 }}>{q}</label>
                <textarea
                  value={answers[idx]}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  required
                  rows={2}
                  style={{ padding: '8px', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--t-ink) 14%, transparent)', background: 'var(--t-surface)', color: 'var(--t-ink)', fontSize: 15, resize: 'vertical' }}
                />
              </div>
            ))}
            <button type="submit" style={{ marginTop: 12, padding: '12px 0', borderRadius: 12, background: 'linear-gradient(90deg,#6a5cff,#a685ff)', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', boxShadow: '0 2px 8px rgba(7,7,22,0.16)', cursor: 'pointer', transition: 'background .2s' }}>
              {loading ? t('addictionConfig.saving', 'Zapisywanie...') : t('addictionConfig.save', 'Zapisz')}
            </button>
          </form>
          <div style={{ marginTop: 32 }}>
            <KamienieMilowe />
          </div>
        </div>
      </div>
  );
}
