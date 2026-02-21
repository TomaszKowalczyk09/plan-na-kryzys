import React, { useState, useEffect } from 'react';
import { useAddictionConfig } from '../hooks/useIndexedDB';

const questions = [
  'Dlaczego chcesz wyjść z uzależnienia?',
  'Jakie korzyści przyniesie Ci zerwanie z nałogiem?',
  'Co motywuje Cię do zmiany?',
  'Jakie wsparcie możesz uzyskać?',
];

export default function AddictionConfigPage() {
  const { config, saveConfig, loading } = useAddictionConfig();
  const [addiction, setAddiction] = useState('');
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));

  useEffect(() => {
    if (config) {
      setAddiction(config.addiction || '');
      setAnswers(config.answers || Array(questions.length).fill(''));
    }
  }, [config]);

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
    alert('Konfiguracja uzależnienia zapisana!');
  };

  return (
      <div className="addiction-config-page" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'none' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 24, boxShadow: '0 4px 32px #0002', padding: '32px 24px', maxWidth: 420, width: '100%', margin: '32px 0' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 700, fontSize: 24 }}>Konfiguracja śledzenia uzależnienia</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Twoje uzależnienie:</label>
              <input
                type="text"
                value={addiction}
                onChange={(e) => setAddiction(e.target.value)}
                required
                style={{ padding: '8px', borderRadius: 8, border: '1px solid #444', background: '#181828', color: '#fff', fontSize: 16 }}
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
                  style={{ padding: '8px', borderRadius: 8, border: '1px solid #444', background: '#181828', color: '#fff', fontSize: 15, resize: 'vertical' }}
                />
              </div>
            ))}
            <button type="submit" style={{ marginTop: 12, padding: '12px 0', borderRadius: 12, background: 'linear-gradient(90deg,#6a5cff,#a685ff)', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', boxShadow: '0 2px 8px #0002', cursor: 'pointer', transition: 'background .2s' }}>
              Zapisz
            </button>
          </form>
        </div>
      </div>
  );
}
