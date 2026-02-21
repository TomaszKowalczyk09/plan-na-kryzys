import React, { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleMenuClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTabClick = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
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
        minWidth: 80,
        maxWidth: 120,
        width: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <button
          aria-label="Menu"
          onClick={handleMenuClick}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 32,
            color: '#fff',
            cursor: 'pointer',
            padding: 0,
            borderRadius: 16,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span role="img" aria-label="menu">☰</span>
        </button>
      </div>
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,10,20,0.85)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <button
            onClick={handleClose}
            aria-label="Zamknij menu"
            style={{
              position: 'absolute',
              top: 32,
              right: 32,
              fontSize: 32,
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >✕</button>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {tabs.map(tab => (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                style={{
                  fontSize: 28,
                  fontWeight: pathname === tab.path ? 800 : 500,
                  color: pathname === tab.path ? '#a685ff' : '#fff',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 32px',
                  borderRadius: 18,
                  transition: 'color .2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
