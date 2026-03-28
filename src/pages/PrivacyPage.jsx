import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/index.jsx'

export default function PrivacyPage() {
  const { t, get, lang } = useI18n()
  const sections = get('privacy.sections', [])
  const title = t('privacy.title')
  const lastWordIndex = title.lastIndexOf(' ')
  const titleStart = lastWordIndex > 0 ? title.slice(0, lastWordIndex) : title
  const titleAccent = lastWordIndex > 0 ? title.slice(lastWordIndex + 1) : ''
  const iconCycle = ['🗂️', '📊', '🛰️', '🍪', '🧽', '📮', '📚', '🤝', '⏱️', '🧾', '🏛️', '🛡️']
  const cta =
    lang === 'de'
      ? {
          label: 'Verknuepfte Dokumente',
          title: 'Nutzungsbedingungen',
          body: 'Lies die Regeln zur Nutzung der App und deine wichtigsten Rechte.',
          action: 'Zum Dokument',
        }
      : {
          label: 'Powiazane dokumenty',
          title: 'Regulamin',
          body: 'Sprawdz zasady korzystania z aplikacji i najwazniejsze prawa uzytkownika.',
          action: 'Przejdz do dokumentu',
        }

  return (
    <div className="screen legalDocScreen pageAnim">
      <header className="legalTopBar pageAnimItem">
        <Link to="/about" className="legalBackBtn" aria-label={lang === 'de' ? 'Zurueck' : 'Wroc'}>
          <span aria-hidden="true">←</span>
        </Link>
        <div className="legalTopMeta">
          <p className="legalTopKicker">{lang === 'de' ? 'Recht und Datenschutz' : 'Prawo i prywatnosc'}</p>
          <strong className="legalTopTitle">{lang === 'de' ? 'Legal Center' : 'Centrum prawne'}</strong>
        </div>
      </header>

      <section className="card legalHero pageAnimItem">
        <p className="legalUpdated">{t('privacy.updated')}</p>
        <h1 className="legalHeroTitle">
          {titleStart}
          {titleAccent ? <span className="legalHeroTitleAccent"> {titleAccent}</span> : null}
        </h1>
      </section>

      {sections.map((section, idx) => (
        <section key={section.title} className="legalSection pageAnimItem">
          <div className="legalSectionHead">
            <span className="legalSectionIcon" aria-hidden="true">{iconCycle[idx % iconCycle.length]}</span>
            <h2 className="legalSectionTitle">{section.title}</h2>
          </div>
          <article className="legalSectionCard">
          {(section.body ?? []).map((line) => (
            <p key={line} className="legalSectionText">{line}</p>
          ))}
          {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
            <ul className="legalBullets">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          </article>
        </section>
      ))}

      <section className="legalDocFooter pageAnimItem">
        <p className="legalDocFooterLabel">{cta.label}</p>
        <article className="legalDocFooterCard">
          <h3>{cta.title}</h3>
          <p>{cta.body}</p>
          <Link to="/terms" className="btn btnPrimary legalDocFooterBtn">{cta.action}</Link>
        </article>
      </section>
    </div>
  )
}
