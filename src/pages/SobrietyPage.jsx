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
  const elapsed = getElapsed();
  const daysRef = useRef();
  const [seconds, setSeconds] = React.useState(0);
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
    }}>
      {/* ...existing code... */}
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
          {config && config.addiction && (
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
              Zmagasz się z: <span style={{ color: '#ffe082' }}>{config.addiction}</span>
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
              <button className="sobriety-btn" onClick={resetSobriety}>Resetuj licznik</button>
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

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6d5efc 0%, #a79cff 100%)',
      color: '#fff',
      animation: 'fadeIn 1s',
      borderRadius: 32,
      margin: '24px auto',
      boxShadow: '0 8px 32px rgba(109,94,252,0.18)',
      maxWidth: 540,
      padding: '32px 18px',
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
      <div className="sobriety-emoji">🌱</div>
      <div className="sobriety-motto">Każdy dzień to Twój sukces!</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Czystość od uzależnienia</h1>
      <p style={{ fontSize: 15, marginBottom: 18 }}>Ten ekran pozwala śledzić czas czystości od wybranego uzależnienia.</p>
      {config && config.addictionName && (
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
          Zmagasz się z: <span style={{ color: '#ffe082' }}>{config.addictionName}</span>
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
          <button
            onClick={resetSobriety}
            style={{
              background: 'linear-gradient(90deg,#6a5cff,#a685ff)',
              color: '#fff',
              border: 'none',
              borderRadius: '18px',
              fontWeight: 700,
              fontSize: '18px',
              padding: '14px 36px',
              marginTop: '24px',
              boxShadow: '0 4px 16px #a79cff44',
              cursor: 'pointer',
              transition: 'transform .2s, box-shadow .2s',
              letterSpacing: '0.5px',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 8px 32px #a79cff66';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px #a79cff44';
            }}
          >
            <span style={{ fontSize: 22, marginRight: 8 }}>🧼</span> Resetuj licznik
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <button className="sobriety-btn" onClick={() => setSobrietyStart(new Date().toISOString())}>Ustaw początek czystości</button>
        </div>
      )}
    </div>
  );
}
