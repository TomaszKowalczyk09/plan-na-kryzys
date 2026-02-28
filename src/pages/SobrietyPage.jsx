import React, { useRef, useEffect } from 'react';
import { useSobrietyTimer, useAddictionConfig } from '../hooks/useIndexedDB';
import { useNavigate } from 'react-router-dom';
import KamienieMilowe from '../components/KamienieMilowe';

// Usunięto animację liczby dni

function SobrietyPage() {
  const { config, loading: configLoading } = useAddictionConfig();
  const { startDate, loading, setSobrietyStart, resetSobriety, getElapsed } = useSobrietyTimer();
  const navigate = useNavigate();
  const daysRef = useRef();
  const [seconds, setSeconds] = React.useState(0);
  const elapsed = getElapsed();
  // Kamienie milowe: dni czystości
  const milestones = [1, 7, 30, 90, 180, 365, 730, 1000];
  const achieved = elapsed ? milestones.filter(m => elapsed.days >= m) : [];
  const nextMilestone = milestones.find(m => elapsed && elapsed.days < m);
  const justReached = achieved.length > 0 && elapsed && milestones.includes(elapsed.days);
  // Motyw: jasny/ciemny
  const [isDark, setIsDark] = React.useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  React.useEffect(() => {
    const handler = (e) => setIsDark(e.matches);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  React.useEffect(() => {
    if (!startDate) return;
    const interval = setInterval(() => {
      setSeconds(Date.now()); // trigger update
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);
  useEffect(() => {
    if (!configLoading && (!config || !config.addiction)) {
      navigate('/addiction-config');
    }
  }, [config, configLoading, navigate]);
  // Usunięto animację liczby dni
  // Jeśli trwa ładowanie konfiguracji, pokaż loader
  // Zawsze wyświetlaj debug-info i komunikat
  const theme = isDark
    ? {
        background: 'linear-gradient(135deg, #181828 0%, #23234a 50%, #2e2e4d 100%)',
        color: '#f7f7ff',
        cardBg: '#23234a',
        accent: '#ffe082',
        accent2: '#6a5cff',
        shadow: '0 8px 32px #0006',
      }
    : {
        background: 'linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eac9 100%)',
        color: '#222',
        cardBg: '#fff',
        accent: '#6a5cff',
        accent2: '#a685ff',
        shadow: '0 8px 32px rgba(109,94,252,0.12)',
      };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.background,
      color: theme.color,
      borderRadius: 36,
      margin: '24px auto',
      boxShadow: theme.shadow,
      maxWidth: 480,
      padding: '38px 22px',
      animation: 'fadeIn 1s',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .sobriety-btn { background: linear-gradient(90deg,${theme.accent},${theme.accent2}); color: #fff; border-radius: 18px; font-weight: 700; font-size: 17px; padding: 13px 32px; margin-top: 28px; box-shadow: 0 2px 16px #a79cff33; transition: transform 0.2s, box-shadow 0.2s; border: none; cursor: pointer; letter-spacing: 0.5px; }
        .sobriety-btn:hover { transform: scale(1.07); box-shadow: 0 6px 24px #a79cff66; background: linear-gradient(90deg,${theme.accent2},${theme.accent}); }
        .sobriety-emoji { font-size: 54px; margin-bottom: 16px; animation: bounce 1.2s infinite alternate; }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }
        .sobriety-days { font-size: 44px; font-weight: 900; letter-spacing: 1px; margin: 16px 0; color: ${theme.accent}; text-shadow: 0 2px 8px #a79cff44; }
        .sobriety-motto { font-size: 20px; font-weight: 700; margin-bottom: 22px; color: ${theme.color}; text-shadow: 0 2px 8px #6d5efc22; }
        .milestone-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 14px; margin-top: 10px; }
        .milestone-card { padding: 10px 0; border-radius: 16px; background: ${theme.cardBg}; color: ${theme.accent}; font-weight: 900; font-size: 17px; box-shadow: 0 2px 12px #a79cff22; border: 2px solid #eee; text-align: center; transition: background 0.2s, color 0.2s; }
        .milestone-card.achieved { background: linear-gradient(90deg,${theme.accent},${theme.accent2}); color: ${isDark ? '#23234a' : '#222'}; border: 2px solid ${theme.accent}; animation: pop 0.5s; }
        @keyframes pop { 0% { transform: scale(1); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .milestone-next { margin-top: 10px; font-size: 16px; color: ${theme.accent}; font-weight: 700; }
        .milestone-section { background: ${isDark ? '#23234a' : '#f7f7ff'}; border-radius: 24px; box-shadow: 0 2px 12px #a79cff22; padding: 18px 12px; margin-top: 18px; width: 100%; }
        .milestone-section h3 { font-size: 19px; font-weight: 800; margin-bottom: 10px; color: ${theme.accent}; }
        .milestone-list { list-style: disc inside; margin: 0 0 10px 0; padding: 0; color: ${theme.color}; }
        .milestone-list li { font-size: 16px; margin-bottom: 4px; }
      `}</style>
      {/* GŁÓWNY WIDOK */}
      {!config || configLoading ? (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Nie skonfigurowano nałogu lub trwa ładowanie.</div>
          <div style={{ fontSize: 16, marginBottom: 24 }}>Przejdź do konfiguracji, aby uruchomić licznik czystości.</div>
          <button className="sobriety-btn" onClick={() => navigate('/addiction-config')}>Konfiguruj nałóg</button>
        </>
      ) : (
        <>
          <div className="sobriety-emoji">🌱</div>
          <div className="sobriety-motto">Każdy dzień to Twój sukces!</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10, color: theme.accent }}>Czystość od uzależnienia</h1>
          <p style={{ fontSize: 16, marginBottom: 20, color: theme.color }}>Ten ekran pozwala śledzić czas czystości od wybranego uzależnienia.</p>
          {/* Kamienie milowe */}
          {elapsed && (
            <div style={{ margin: '24px 0', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8, color: theme.accent }}>Kamienie milowe:</div>
              <div className="milestone-grid">
                {milestones.map(m => (
                  <div key={m} className={`milestone-card${achieved.includes(m) ? ' achieved' : ''}`}>
                    {m} dni {achieved.includes(m) && '🏆'}
                  </div>
                ))}
              </div>
              {nextMilestone && (
                <div className="milestone-next">
                  Kolejny kamień milowy: <span style={{ color: theme.accent2 }}>{nextMilestone} dni</span>
                </div>
              )}
              <div className="milestone-section">
                <h3>Kamienie milowe</h3>
                <KamienieMilowe />
              </div>
            </div>
          )}
          {/* Gratulacje */}
          {justReached && (
            <div style={{
              background: 'linear-gradient(90deg,#ffe082,#a685ff)',
              color: theme.accent2,
              borderRadius: 18,
              fontWeight: 900,
              fontSize: 20,
              padding: '16px 24px',
              margin: '18px 0',
              boxShadow: '0 4px 16px #a79cff44',
            }}>
              Gratulacje! Osiągnąłeś kamień milowy: {elapsed.days} dni czystości 🏆
            </div>
          )}
          {config && (config.addiction || config.addictionName) && (
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: theme.color }}>
              Zmagasz się z: <span style={{ color: theme.accent }}>{config.addiction || config.addictionName}</span>
            </div>
          )}
          {loading ? (
            <div style={{ fontSize: 16, color: theme.accent, margin: '18px 0' }}>Ładowanie...</div>
          ) : startDate ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: theme.color }}>
                Czystość od: <span style={{ color: theme.accent }}>{new Date(startDate).toLocaleDateString()}</span>
              </div>
              {elapsed && (
                <div className="sobriety-days">
                  {elapsed.days} dni
                  <span style={{ fontSize: 19, fontWeight: 500, marginLeft: 10, color: theme.color }}>
                    {elapsed.hours} h, {elapsed.minutes} min, {elapsed.seconds} sek
                  </span>
                </div>
              )}
              <button className="sobriety-btn" onClick={resetSobriety}>
                <span style={{ fontSize: 22, marginRight: 8 }}>🧼</span> Resetuj licznik
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <button className="sobriety-btn" onClick={() => setSobrietyStart(new Date().toISOString())}>Ustaw początek czystości</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SobrietyPage;
