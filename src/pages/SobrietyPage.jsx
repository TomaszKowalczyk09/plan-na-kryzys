import React, { useRef, useEffect } from 'react';
import { useSobrietyTimer, useAddictionConfig } from '../hooks/useIndexedDB';
import { useNavigate } from 'react-router-dom';

function animateNumber(ref, value) {
  if (!ref.current) return;
  let start = 0;
  const duration = 1200;
  const startTime = performance.now();
  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const current = Math.floor(progress * value);
    ref.current.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      ref.current.textContent = value;
    }
  }
  requestAnimationFrame(animate);
}

export default function SobrietyPage() {
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
  React.useEffect(() => {
    if (!startDate) return;
    const interval = setInterval(() => {
      setSeconds(Date.now()); // trigger update
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);
  // ...existing code...

  useEffect(() => {
    if (!configLoading && (!config || !config.addiction)) {
      navigate('/addiction-config');
    }
  }, [config, configLoading, navigate]);

  useEffect(() => {
    if (elapsed && daysRef.current) {
      animateNumber(daysRef, elapsed.days);
    }
  }, [elapsed]);

  // Jeśli trwa ładowanie konfiguracji, pokaż loader
  // Zawsze wyświetlaj debug-info i komunikat
  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6d5efc 0%, #a79cff 100%)',
      color: '#fff',
      borderRadius: 32,
      margin: '24px auto',
      boxShadow: '0 8px 32px rgba(109,94,252,0.18)',
      maxWidth: 540,
      padding: '32px 18px',
      animation: 'fadeIn 1s',
    }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .sobriety-btn { background: #fff; color: #6d5efc; border-radius: 16px; font-weight: 700; font-size: 16px; padding: 12px 28px; margin-top: 24px; box-shadow: 0 2px 12px #a79cff33; transition: transform 0.2s, box-shadow 0.2s; border: none; cursor: pointer; }
          .sobriety-btn:hover { transform: scale(1.07); box-shadow: 0 6px 24px #a79cff66; }
          .sobriety-emoji { font-size: 44px; margin-bottom: 12px; animation: bounce 1.2s infinite alternate; }
          @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }
          .sobriety-days { font-size: 38px; font-weight: 900; letter-spacing: 1px; margin: 12px 0; }
          .sobriety-motto { font-size: 18px; font-weight: 700; margin-bottom: 18px; color: #fff; text-shadow: 0 2px 8px #6d5efc44; }
        `}</style>
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
            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Czystość od uzależnienia</h1>
            <p style={{ fontSize: 15, marginBottom: 18 }}>Ten ekran pozwala śledzić czas czystości od wybranego uzależnienia.</p>
            {/* Kamienie milowe */}
            {elapsed && (
              <div style={{ margin: '24px 0', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Kamienie milowe:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                  {milestones.map(m => (
                    <div key={m} style={{
                      padding: '8px 18px',
                      borderRadius: 16,
                      background: achieved.includes(m) ? 'linear-gradient(90deg,#ffe082,#a685ff)' : '#eee',
                      color: achieved.includes(m) ? '#6a5cff' : '#888',
                      fontWeight: achieved.includes(m) ? 900 : 700,
                      fontSize: 16,
                      boxShadow: achieved.includes(m) ? '0 2px 12px #a79cff33' : 'none',
                      border: achieved.includes(m) ? '2px solid #ffe082' : 'none',
                      marginBottom: 4,
                    }}>
                      {m} dni {achieved.includes(m) && '🏆'}
                    </div>
                  ))}
                </div>
                {nextMilestone && (
                  <div style={{ marginTop: 10, fontSize: 15, color: '#fff', fontWeight: 700 }}>
                    Kolejny kamień milowy: <span style={{ color: '#ffe082' }}>{nextMilestone} dni</span>
                  </div>
                )}
              </div>
            )}
            {/* Gratulacje */}
            {justReached && (
              <div style={{
                background: 'linear-gradient(90deg,#ffe082,#a685ff)',
                color: '#6a5cff',
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
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
                Zmagasz się z: <span style={{ color: '#ffe082' }}>{config.addiction || config.addictionName}</span>
              </div>
            )}
            {loading ? (
              <div>Ładowanie...</div>
            ) : startDate ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                  Czystość od: {new Date(startDate).toLocaleDateString()}
                </div>
                {elapsed && (
                  <div className="sobriety-days">
                    <span ref={daysRef}></span> dni
                    <span style={{ fontSize: 18, fontWeight: 500, marginLeft: 8 }}>
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
