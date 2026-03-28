import React, { useRef, useEffect, useState } from 'react';
import { useSobrietyTimer, useAddictionConfig } from '../hooks/useIndexedDB';
import { useNavigate, Link } from 'react-router-dom';
import KamienieMilowe from '../components/KamienieMilowe';
import { useI18n } from '../i18n';

function SobrietyPage() {
  const { t } = useI18n();
  const { config, loading: configLoading } = useAddictionConfig();
  const { startDate, loading, setSobrietyStart, resetSobriety, getElapsed } = useSobrietyTimer();
  const navigate = useNavigate();
  const elapsed = getElapsed();
  const [seconds, setSeconds] = useState(0);
  
  // Kamienie milowe: dni czystości
  const milestones = [1, 7, 30, 90, 180, 365, 730, 1000];
  const achieved = elapsed ? milestones.filter(m => elapsed.days >= m) : [];
  const nextMilestone = milestones.find(m => elapsed && elapsed.days < m);
  const nextMilestonePercentage = nextMilestone && elapsed 
    ? Math.round((elapsed.days / nextMilestone) * 100) 
    : 0;
  
  React.useEffect(() => {
    if (!startDate) return;
    const interval = setInterval(() => {
      setSeconds(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);
  
  useEffect(() => {
    if (!configLoading && (!config || !config.addiction)) {
      navigate('/addiction-config');
    }
  }, [config, configLoading, navigate]);

  return (
    <main className="min-h-[calc(100vh-120px)] pb-32">
      <style>{`
        .sobrietyVioletContainer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .sobrietyVioletHero {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        @media (min-width: 768px) {
          .sobrietyVioletHero {
            flex-direction: column;
            align-items: flex-start;
            gap: 2rem;
          }
        }
        .sobrietyVioletCounter {
          flex: 1;
        }
        .sobrietyVioletCounterLabel {
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--on-surface-variant);
          margin-bottom: 0.5rem;
          display: block;
        }
        .sobrietyVioletDays {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }
        .sobrietyVioletDaysNumber {
          font-family: 'Manrope', sans-serif;
          font-size: 7rem;
          line-height: 1;
          font-weight: 900;
          color: var(--primary);
          letter-spacing: -0.02em;
        }
        .sobrietyVioletDaysText {
          font-family: 'Manrope', sans-serif;
          font-size: 2rem;
          font-weight: 600;
          color: var(--secondary);
        }
        .sobrietyVioletTimeDetails {
          font-size: 0.875rem;
          color: var(--on-surface-variant);
          margin-top: 0.5rem;
          font-weight: 500;
        }
        .sobrietyVioletTimeDetails span {
          margin-right: 1.5rem;
        }
        .sobrietyVioletTimeDetails strong {
          color: var(--primary);
          font-weight: 700;
        }
        .sobrietyVioletActionButtons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .sobrietyVioletResetButton {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(to right, var(--secondary), #8E66D1);
          color: white;
          padding: 0.875rem 1.5rem;
          border-radius: 99rem;
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 15px 30px -10px rgba(96, 91, 113, 0.15);
        }
        .sobrietyVioletResetButton:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 40px -10px rgba(96, 91, 113, 0.25);
        }
        .sobrietyVioletPanicButton {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(to right, var(--error), #d32f2f);
          color: white;
          padding: 0.875rem 1.5rem;
          border-radius: 99rem;
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 15px 30px -10px rgba(186, 26, 26, 0.2);
        }
        .sobrietyVioletPanicButton:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 40px -10px rgba(186, 26, 26, 0.3);
        }
        .sobrietyVioletQuote {
          max-width: 28rem;
        }
        .sobrietyVioletQuoteText {
          font-style: italic;
          font-size: 1.125rem;
          border-left: 4px solid var(--primary-container);
          padding: 1rem;
          color: var(--on-surface-variant);
          font-family: 'Manrope', sans-serif;
        }
        .sobrietyVioletCTA {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(to right, var(--primary), #8E66D1);
          color: var(--on-primary);
          padding: 1rem 2rem;
          border-radius: 99rem;
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          font-size: 1.125rem;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0px 40px 60px -20px rgba(108, 67, 185, 0.08);
          margin-top: 2rem;
        }
        .sobrietyVioletCTA:hover {
          transform: scale(1.05);
          box-shadow: 0px 60px 80px -20px rgba(108, 67, 185, 0.15);
        }
        .sobrietyVioletMilestone {
          background: var(--surface-container-low);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 3rem;
          border: 1px solid var(--surface-variant);
          box-shadow: 0px 40px 60px -20px rgba(108, 67, 185, 0.08);
        }
        .sobrietyVioletMilestoneHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1rem;
        }
        .sobrietyVioletMilestoneTitle {
          font-family: 'Manrope', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--on-surface);
        }
        .sobrietyVioletMilestonePercent {
          font-family: 'Manrope', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }
        .sobrietyVioletProgress {
          width: 100%;
          height: 1rem;
          background: var(--secondary-container);
          border-radius: 99rem;
          overflow: hidden;
        }
        .sobrietyVioletProgressBar {
          height: 100%;
          background: var(--primary);
          border-radius: 99rem;
          transition: width 0.3s ease;
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
        }
        .sobrietyVioletAchievements {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .sobrietyVioletAchievementCard {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 12rem;
          border: 1px solid var(--surface-variant);
          box-shadow: 0px 40px 60px -20px rgba(108, 67, 185, 0.08);
        }
        .sobrietyVioletAchievementIcon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: var(--primary-container);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--primary);
        }
        .sobrietyVioletAchievementMeta {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .sobrietyVioletAchievementLabel {
          font-family: 'Manrope', sans-serif;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--outline);
        }
        .sobrietyVioletAchievementCardTitle {
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--on-surface);
          margin-bottom: 0.25rem;
        }
        .sobrietyVioletAchievementCardText {
          font-size: 0.875rem;
          color: var(--on-surface-variant);
        }
        .sobrietyVioletImageCard {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          min-height: 12rem;
          group: 'image';
        }
        .sobrietyVioletImageCard img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1s;
        }
        .sobrietyVioletImageCard:hover img {
          transform: scale(1.1);
        }
        .sobrietyVioletImageOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(108, 67, 185, 0.8), transparent);
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
        }
        .sobrietyVioletImageText {
          color: white;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
        }
        .sobrietyVioletBreathingSection {
          background: linear-gradient(135deg, var(--primary-container) 0%, rgba(233, 221, 255, 0.5) 100%);
          border-radius: 1rem;
          padding: 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--primary-container);
          margin-bottom: 3rem;
        }
        .sobrietyVioletBreathingSection::before {
          content: '';
          position: absolute;
          top: -3rem;
          right: -3rem;
          width: 12rem;
          height: 12rem;
          background: var(--primary-container);
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
        }
        .sobrietyVioletBreathingSection::after {
          content: '';
          position: absolute;
          bottom: -3rem;
          left: -2rem;
          width: 8rem;
          height: 8rem;
          background: #8E66D1;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.2;
        }
        .sobrietyVioletBreathingContent {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sobrietyVioletBreathingIcon {
          width: 3rem;
          height: 3rem;
          font-size: 3rem;
          margin-bottom: 1.5rem;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .sobrietyVioletBreathingTitle {
          font-family: 'Manrope', sans-serif;
          font-size: 1.875rem;
          font-weight: 900;
          margin-bottom: 1rem;
          color: var(--on-surface);
        }
        .sobrietyVioletBreathingText {
          max-width: 28rem;
          margin-bottom: 2rem;
          color: var(--on-surface-variant);
          font-weight: 500;
        }
        .sobrietyVioletBreathingBtn {
          background: white;
          color: var(--primary);
          padding: 0.75rem 2rem;
          border-radius: 99rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
          box-shadow: 0px 40px 60px -20px rgba(108, 67, 185, 0.08);
        }
        .sobrietyVioletBreathingBtn:hover {
          background: var(--primary);
          color: white;
        }
        .sobrietyVioletAchievementsSection h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          font-family: 'Manrope', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .sobrietyVioletAchievementsSection img {
          width: 1.25rem;
          height: 1.25rem;
          opacity: 0.4;
        }
      `}</style>

      <div className="sobrietyVioletContainer">
        {!config || configLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.125rem', color: 'var(--on-surface)' }}>
              {t('sobriety.notConfigured', 'Nie skonfigurowano nałogu lub trwa ładowanie.')}
            </div>
            <div style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--on-surface-variant)' }}>
              {t('sobriety.goToConfig', 'Przejdź do konfiguracji, aby uruchomić licznik czystości.')}
            </div>
            <button className="sobrietyVioletCTA" onClick={() => navigate('/addiction-config')}>
              <span>⚙️</span>
              {t('sobriety.configure', 'Konfiguruj nałóg')}
            </button>
          </div>
        ) : !startDate ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--on-surface)' }}>
              {t('sobriety.startTitle', 'Rozpocznij licznik czystości')}
            </div>
            <div style={{ fontSize: '1rem', marginBottom: '2rem', maxWidth: '28rem', margin: '0 auto 2rem' }}>
              {t('sobriety.startDescription', 'Każdy dzień znaczy. Zacznij liczyć swoją czystość od dzisiaj.')}
            </div>
            <button className="sobrietyVioletCTA" onClick={() => setSobrietyStart(new Date().toISOString())}>
              <span>✨</span>
              {t('sobriety.setStart', 'Ustaw początek czystości')}
            </button>
          </div>
        ) : (
          <>
            {/* HERO SECTION */}
            <section className="sobrietyVioletHero">
              <div className="sobrietyVioletCounter">
                <span className="sobrietyVioletCounterLabel">{t('sobriety.currentStreak', 'Aktualny ciąg')}</span>
                <div className="sobrietyVioletDays">
                  <span className="sobrietyVioletDaysNumber">{elapsed?.days || 0}</span>
                  <span className="sobrietyVioletDaysText">{t('sobriety.days', 'dni')}</span>
                </div>
                <div className="sobrietyVioletTimeDetails">
                  <span><strong>{elapsed?.hours || 0}</strong> {t('sobriety.hours', 'h')}</span>
                  <span><strong>{elapsed?.minutes || 0}</strong> {t('sobriety.minutes', 'min')}</span>
                  <span><strong>{elapsed?.seconds || 0}</strong> {t('sobriety.seconds', 'sek')}</span>
                </div>

                {/* Action Buttons */}
                <div className="sobrietyVioletActionButtons">
                  <button className="sobrietyVioletResetButton" onClick={resetSobriety}>
                    <span>🧼</span> {t('sobriety.reset', 'Resetuj licznik')}
                  </button>
                  <button className="sobrietyVioletPanicButton" onClick={() => navigate('/crisis')}>
                    <span>🆘</span> {t('sobriety.panicButton', 'Panic Button')}
                  </button>
                </div>
              </div>

              {/* Quote Below */}
              <div className="sobrietyVioletQuote">
                <blockquote className="sobrietyVioletQuoteText">
                  {t('sobriety.heroQuote', '"Odzyskiwanie to nie wyścig. To seria małych, świadomych kroków w stronę osoby, którą się stajesz."')}
                </blockquote>
              </div>
            </section>

            {/* MILESTONE PROGRESS */}
            {nextMilestone && (
              <section className="sobrietyVioletMilestone">
                <div className="sobrietyVioletMilestoneHeader">
                  <div>
                    <div className="sobrietyVioletMilestoneTitle">{t('sobriety.nextMilestoneTitle', 'Następny kamień milowy')}</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>
                      {nextMilestone - (elapsed?.days || 0)} {t('sobriety.daysUntil', 'dni do kamienia milowego')}{' '}
                      <strong>{nextMilestone} {t('sobriety.daysShort', 'dni')}</strong>
                    </p>
                  </div>
                  <span className="sobrietyVioletMilestonePercent">{nextMilestonePercentage}%</span>
                </div>
                <div className="sobrietyVioletProgress">
                  <div className="sobrietyVioletProgressBar" style={{ width: `${nextMilestonePercentage}%` }} />
                </div>
              </section>
            )}

            {/* RECENT ACHIEVEMENTS */}
            <section className="sobrietyVioletAchievementsSection" style={{ marginBottom: '3rem' }}>
              <h3>
                <span>🏆</span>
                {t('sobriety.recentAchievements', 'Ostatnie osiągnięcia')}
              </h3>
              <div className="sobrietyVioletAchievements">
                {/* Achievement 1: Century */}
                {achieved.length > 0 && achieved.includes(100) && (
                  <div className="sobrietyVioletAchievementCard">
                    <div className="sobrietyVioletAchievementMeta">
                      <div className="sobrietyVioletAchievementIcon">✨</div>
                      <span className="sobrietyVioletAchievementLabel">{t('sobriety.unlockedYesterday', 'Odblokowany wczoraj')}</span>
                    </div>
                    <div>
                      <div className="sobrietyVioletAchievementCardTitle">{t('sobriety.achievementCentury', '100 dni czystości')}</div>
                      <div className="sobrietyVioletAchievementCardText">{t('sobriety.achievementCenturyDesc', 'Konsekwencja to Twoja supersiła.')}</div>
                    </div>
                  </div>
                )}

                {/* Achievement 2: Savings */}
                <div className="sobrietyVioletAchievementCard">
                  <div className="sobrietyVioletAchievementMeta">
                    <div className="sobrietyVioletAchievementIcon">💰</div>
                    <span className="sobrietyVioletAchievementLabel">{t('sobriety.impact', 'Wpływ')}</span>
                  </div>
                  <div>
                    <div className="sobrietyVioletAchievementCardTitle">
                      ${((elapsed?.days || 0) * 20).toLocaleString()} {t('sobriety.saved', 'oszczędzono')}
                    </div>
                    <div className="sobrietyVioletAchievementCardText">{t('sobriety.redirectingResources', 'Kierunek zasobów na wzrost.')}</div>
                  </div>
                </div>

                {/* Image Card */}
                <div className="sobrietyVioletImageCard">
                  <img 
                    alt="Nature scenery" 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2391eac9;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238E66D1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3Ctext x='200' y='150' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3EYour health is blooming%3C/text%3E%3C/svg%3E"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="sobrietyVioletImageOverlay">
                    <p className="sobrietyVioletImageText">{t('sobriety.healthBlooming', 'Twoje zdrowie kwitnie.')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* BREATHING GUIDE */}
            <section className="sobrietyVioletBreathingSection">
              <div className="sobrietyVioletBreathingContent">
                <div className="sobrietyVioletBreathingIcon">🫁</div>
                <h2 className="sobrietyVioletBreathingTitle">{t('sobriety.patienceIsPractice', 'Cierpliwość to ćwiczenie')}</h2>
                <p className="sobrietyVioletBreathingText">
                  {t('sobriety.breathingGuideText', 'Zawsze, gdy czujesz pragnienie, poświęć chwilę na oddychanie z przewodnikiem. Jedna minuta to wszystko, co potrzeba, aby zresetować.')}
                </p>
                <Link to="/crisis" style={{ textDecoration: 'none' }}>
                  <button className="sobrietyVioletBreathingBtn">
                    {t('sobriety.startBreathingExercise', 'Rozpocznij ćwiczenie oddechowe')}
                  </button>
                </Link>
              </div>
            </section>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button 
                className="sobrietyVioletCTA" 
                onClick={resetSobriety}
                style={{ background: 'linear-gradient(to right, #BA1A1A, #D32F2F)', marginTop: 0 }}
              >
                <span>🧼</span> {t('sobriety.reset', 'Resetuj licznik')}
              </button>
              <button 
                className="sobrietyVioletCTA"
                onClick={() => navigate('/addiction-config')}
                style={{ marginTop: 0 }}
              >
                <span>⚙️</span> {t('sobriety.configure', 'Zmień konfigurację')}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default SobrietyPage;

