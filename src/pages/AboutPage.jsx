import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clearAllLocalData, exportAllLocalDataJSON, exportMoodEntriesCSV, exportSafetyPlanText } from '../hooks/useIndexedDB'
import { useI18n } from '../i18n/index.jsx'

export default function AboutPage() {
  const { t, get } = useI18n()
  const [clearing, setClearing] = useState(false)
  const [done, setDone] = useState(false)

  const [exporting, setExporting] = useState(false)
  const [exportDone, setExportDone] = useState('')

  const onClear = async () => {
    setClearing(true)
    setDone(false)
    try {
      await clearAllLocalData()
      setDone(true)
    } finally {
      setClearing(false)
    }
  }

  const downloadTextFile = async ({ filename, mime, getText }) => {
    setExporting(true)
    setExportDone('')
    try {
      const text = await getText()
      const blob = new Blob([text], { type: mime })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()

      // cleanup
      setTimeout(() => URL.revokeObjectURL(url), 0)
      setExportDone(t('about.done'))
    } finally {
      setExporting(false)
    }
  }

  const sections = get('about.sections', {})
  const credits = sections.credits ?? {}
  const ui = get('about.ui', {})
  const versionText = sections.version?.body ?? 'MVP 1.0 (lokalne dane, offline-first)'

  return (
    <div className="screen creditsScreen pageAnim">
      <section className="creditsHero card pageAnimItem">
        <div className="creditsLogoWrap" aria-hidden="true">
          <img src="/unnamed-removebg-preview.png" alt="Logo" className="creditsLogo" />
        </div>
        <h1 className="creditsTitle">{ui.title}</h1>
        <p className="creditsVersion">{ui.versionPrefix} · {versionText}</p>
      </section>

      <section className="pageAnimItem">
        <h2 className="creditsSectionLabel"><span aria-hidden="true">👥</span> {ui.creatorsSection}</h2>
        <div className="creditsGrid">
          <article className="card creditsInfoCard">
            <div className="creditsIcon" aria-hidden="true">✏️</div>
            <h3>{ui.projectLabel}</h3>
            <p>Tomasz Kowalczyk</p>
          </article>

          <article className="card creditsInfoCard">
            <div className="creditsIcon" aria-hidden="true">⌘</div>
            <h3>{ui.developmentLabel}</h3>
            <p>{ui.developmentValue}</p>
          </article>
        </div>

        <article className="creditsThanksCard">
          <h3>{ui.specialThanksTitle}</h3>
          <p>{credits.initiative ?? 'Dziękujemy społeczności i osobom, które współtworzą tę aplikację.'}</p>
        </article>
      </section>

      <section className="pageAnimItem">
        <h2 className="creditsSectionLabel"><span aria-hidden="true">⚖️</span> {ui.legalSection}</h2>
        <div className="creditsLegalList">
          <Link to="/privacy" className="creditsLegalItem">
            <span className="creditsLegalIcon" aria-hidden="true">🛡️</span>
            <span>
              <strong>{sections.documents?.privacy ?? 'Polityka prywatności'}</strong>
              <small>{ui.privacyDescription}</small>
            </span>
            <span className="creditsChevron" aria-hidden="true">›</span>
          </Link>

          <Link to="/terms" className="creditsLegalItem">
            <span className="creditsLegalIcon" aria-hidden="true">⚖️</span>
            <span>
              <strong>{sections.documents?.terms ?? 'Regulamin'}</strong>
              <small>{ui.termsDescription}</small>
            </span>
            <span className="creditsChevron" aria-hidden="true">›</span>
          </Link>
        </div>

        <article className="card creditsSecurityCard">
          <h3>{ui.securityTitle}</h3>
          <p>
            {ui.securityBody}
          </p>
        </article>
      </section>

      <section className="pageAnimItem">
        <h2 className="creditsSectionLabel"><span aria-hidden="true">📄</span> {ui.licensesSection}</h2>
        <article className="card creditsLicensesCard">
          <h3>{ui.openSourceLibrariesTitle}</h3>
          <div className="creditsPills">
            <span>React</span>
            <span>Vite</span>
            <span>Dexie</span>
            <span>React Router</span>
          </div>
        </article>
      </section>

      <section className="pageAnimItem">
        <h2 className="creditsSectionLabel"><span aria-hidden="true">🧰</span> {ui.dataToolsSection}</h2>
        <article className="card creditsToolsCard">
          <p className="p">{sections.export?.body}</p>
          <div className="creditsToolsBtns">
            <button
              type="button"
              className="btn"
              onClick={() =>
                downloadTextFile({
                  filename: 'dane.json',
                  mime: 'application/json',
                  getText: exportAllLocalDataJSON,
                })
              }
              disabled={exporting}
            >
              📁 {t('about.exportJson')}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                downloadTextFile({
                  filename: 'wpisy-nastroju.csv',
                  mime: 'text/csv',
                  getText: exportMoodEntriesCSV,
                })
              }
              disabled={exporting}
            >
              📊 {t('about.exportMoodCsv')}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                downloadTextFile({
                  filename: 'plan-bezpieczenstwa.txt',
                  mime: 'text/plain',
                  getText: exportSafetyPlanText,
                })
              }
              disabled={exporting}
            >
              📝 {t('about.exportPlanTxt')}
            </button>
          </div>
          {exportDone ? <p className="creditsDoneText">{exportDone}</p> : null}
        </article>

        <article className="card creditsToolsCard">
          <p className="p">{sections.delete?.body}</p>
          <div className="creditsToolsBtns">
            <button type="button" className="btn btnDanger" onClick={onClear} disabled={clearing}>
              🗑️ {clearing ? t('about.deleting') : t('about.deleteData')}
            </button>
          </div>
          {done ? <p className="creditsDoneText">{t('about.done')}</p> : null}
        </article>
      </section>

      <p className="creditsFooter">{ui.footerCopyright}</p>
    </div>
  )
}
