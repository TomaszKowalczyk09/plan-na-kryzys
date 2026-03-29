import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx'

const MAIN_TABS = [
  { path: '/dashboard', label: 'Nastrój', labelKey: 'nav.bottomTabs.dashboard', icon: '😌' },
  { path: '/mood', label: 'Dziennik', labelKey: 'nav.bottomTabs.journal', icon: '📝' },
  { path: '/crisis', label: 'Kryzys', labelKey: 'nav.bottomTabs.crisis', icon: '⚠️' },
  { path: '/knowledge', label: 'Wiedza', labelKey: 'nav.bottomTabs.knowledge', icon: '💡' },
];

export default function TabNavigation() {
  const { t } = useI18n()
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Determine active tab
  let activeIndex = 0;
  if (pathname === '/mood' || pathname.startsWith('/mood/')) activeIndex = 1;
  else if (pathname === '/crisis' || pathname.startsWith('/crisis/')) activeIndex = 2;
  else if (pathname === '/knowledge' || pathname.startsWith('/knowledge/')) activeIndex = 3;
  else activeIndex = 0; // Dashboard/Start (includes '/', '/dashboard')

  return (
    <nav className="nav">
      <div className="navInner" style={{ '--active': activeIndex }}>
        <div className="navHighlight"></div>
        {MAIN_TABS.map((tab, index) => {
          const label = t(tab.labelKey, tab.label)

          return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`navLink ${activeIndex === index ? 'navLinkActive' : ''}`}
            data-ico={tab.icon}
            title={label}
            aria-current={activeIndex === index ? 'page' : undefined}
          >
            {label}
          </button>
          )
        })}
      </div>
    </nav>
  );
}
