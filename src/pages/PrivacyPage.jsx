import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/index.jsx'

export default function PrivacyPage() {
  const { t, get } = useI18n()
  const sections = get('privacy.sections', [])
  const ui = get('privacy.ui', {})
  const title = t('privacy.title')
  const lastWordIndex = title.lastIndexOf(' ')
  const titleStart = lastWordIndex > 0 ? title.slice(0, lastWordIndex) : title
  const titleAccent = lastWordIndex > 0 ? title.slice(lastWordIndex + 1) : ''
  const iconCycle = ['🗂️', '📊', '🛰️', '🍪', '🧽', '📮', '📚', '🤝', '⏱️', '🧾', '🏛️', '🛡️']

  return (
    <div className="screen legalDocScreen pageAnim">
      <header className="legalTopBar pageAnimItem">
        <Link to="/about" className="legalBackBtn" aria-label={ui.backAria ?? 'Back'}>
          <span aria-hidden="true">←</span>
        </Link>
        <div className="legalTopMeta">
          <p className="legalTopKicker">{ui.topKicker}</p>
          <strong className="legalTopTitle">{ui.topTitle}</strong>
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
        <p className="legalDocFooterLabel">{ui.linkedDocsLabel}</p>
        <article className="legalDocFooterCard">
          <h3>{ui.ctaTitle}</h3>
          <p>{ui.ctaBody}</p>
          <Link to="/terms" className="btn btnPrimary legalDocFooterBtn">{ui.ctaAction}</Link>
        </article>
      </section>
    </div>
  )
}
