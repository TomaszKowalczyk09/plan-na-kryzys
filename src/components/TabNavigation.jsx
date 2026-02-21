import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Start' },
  { path: '/mood', label: 'Nastrój' },
  { path: '/crisis', label: 'Kryzys' },
  { path: '/knowledge', label: 'Wiedza' },
  { path: '/addiction-config', label: 'Uzależnienie' },
  { path: '/friend', label: 'Dla przyjaciela' },
  { path: '/about', label: 'O aplikacji' },
];

export default function TabNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentIdx = tabs.findIndex(tab => tab.path === pathname);

  const handleBack = () => {
    if (currentIdx > 0) navigate(tabs[currentIdx - 1].path);
  };
  const handleNext = () => {
    if (currentIdx < tabs.length - 1) navigate(tabs[currentIdx + 1].path);
  };

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      bottom: 24,
      transform: 'translateX(-50%)',
      zIndex: 100,
      background: 'rgba(30, 30, 60, 0.85)',
      backdropFilter: 'blur(16px)',
      borderRadius: 24,
      boxShadow: '0 8px 32px #0004',
      padding: '12px 24px',
      display: 'flex',
      gap: 12,
      minWidth: 340,
      maxWidth: 480,
      width: 'calc(100vw - 32px)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <button onClick={handleBack} disabled={currentIdx <= 0} style={{ padding: '8px 16px', borderRadius: 12, fontWeight: 700, background: '#6a5cff', color: '#fff', border: 'none', cursor: currentIdx > 0 ? 'pointer' : 'not-allowed', opacity: currentIdx > 0 ? 1 : 0.5 }}>← Wstecz</button>
      <select value={pathname} onChange={e => navigate(e.target.value)} style={{ padding: '8px', borderRadius: 12, fontWeight: 700, fontSize: 16 }}>
        {tabs.map(tab => (
          <option key={tab.path} value={tab.path}>{tab.label}</option>
        ))}
      </select>
      <button onClick={handleNext} disabled={currentIdx >= tabs.length - 1} style={{ padding: '8px 16px', borderRadius: 12, fontWeight: 700, background: '#6a5cff', color: '#fff', border: 'none', cursor: currentIdx < tabs.length - 1 ? 'pointer' : 'not-allowed', opacity: currentIdx < tabs.length - 1 ? 1 : 0.5 }}>Dalej →</button>
    </div>
  );
}
