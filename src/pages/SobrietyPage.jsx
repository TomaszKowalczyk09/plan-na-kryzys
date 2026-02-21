import React, { useRef, useEffect } from 'react';
import { useSobrietyTimer } from '../hooks/useIndexedDB';

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
  const {
    startDate,
    loading,
    setSobrietyStart,
    resetSobriety,
    getElapsed,
  } = useSobrietyTimer();
  const elapsed = getElapsed();
  const daysRef = useRef();

  useEffect(() => {
    if (elapsed && daysRef.current) {
      animateNumber(daysRef, elapsed.days);
    }
  }, [elapsed]);

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
                {elapsed.hours} h, {elapsed.minutes} min
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
    </div>
  );
}
