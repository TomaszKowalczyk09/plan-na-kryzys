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
  const versionText = sections.version?.body ?? 'MVP 1.0 (lokalne dane, offline-first)'

  return (
    <div className="screen creditsScreen pageAnim">
      <section className="creditsHero card pageAnimItem">
        <div className="creditsLogoWrap" aria-hidden="true">
          <img src="/unnamed-removebg-preview.png" alt="Logo" className="creditsLogo" />
        </div>
        <h1 className="creditsTitle">O aplikacji</h1>
        <p className="creditsVersion">Wersja aplikacji · {versionText}</p>
      </section>

      <section className="pageAnimItem">
        <h2 className="creditsSectionLabel"><span aria-hidden="true">👥</span> Twórcy aplikacji</h2>
        <div className="creditsGrid">
          <article className="card creditsInfoCard">
            <div className="creditsIcon" aria-hidden="true">✏️</div>
            <h3>Projekt</h3>
            <p>Tomasz Kowalczyk</p>
          </article>

          <article className="card creditsInfoCard">
            <div className="creditsIcon" aria-hidden="true">⌘</div>
            <h3>Rozwój</h3>
            <p>Tomasz Kowalczyk i Łukasz Majka</p>
          </article>
        </div>

        <article className="creditsThanksCard">
          <h3>Specjalne podziękowania</h3>
          <p>{credits.initiative ?? 'Dziękujemy społeczności i osobom, które współtworzą tę aplikację.'}</p>
        </article>
      </section>

      <section className="pageAnimItem">
        <h2 className="creditsSectionLabel"><span aria-hidden="true">⚖️</span> Informacje prawne</h2>
        <div className="creditsLegalList">
          <Link to="/privacy" className="creditsLegalItem">
            <span className="creditsLegalIcon" aria-hidden="true">🛡️</span>
            <span>
              <strong>{sections.documents?.privacy ?? 'Polityka prywatności'}</strong>
              <small>Jak przetwarzamy i chronimy Twoje dane</small>
            </span>
            <span className="creditsChevron" aria-hidden="true">›</span>
          </Link>

          <Link to="/terms" className="creditsLegalItem">
            <span className="creditsLegalIcon" aria-hidden="true">⚖️</span>
            <span>
              <strong>{sections.documents?.terms ?? 'Regulamin'}</strong>
              <small>Zasady i warunki korzystania z aplikacji</small>
            </span>
            <span className="creditsChevron" aria-hidden="true">›</span>
          </Link>
        </div>

        <article className="card creditsSecurityCard">
          <h3>Bezpieczeństwo danych i szyfrowanie</h3>
          <p>
            Aplikacja działa offline-first, a dane są przechowywane lokalnie na urządzeniu
            (IndexedDB). Nie wysyłamy wpisów nastroju ani planu bezpieczeństwa na serwer.
          </p>
        </article>
      </section>

      <section className="pageAnimItem">
        <h2 className="creditsSectionLabel"><span aria-hidden="true">📄</span> Licencje zewnętrzne</h2>
        <article className="card creditsLicensesCard">
          <h3>Biblioteki open source</h3>
          <div className="creditsPills">
            <span>React</span>
            <span>Vite</span>
            <span>Dexie</span>
            <span>React Router</span>
          </div>
        </article>
      </section>

      <section className="pageAnimItem">
        <h2 className="creditsSectionLabel"><span aria-hidden="true">🧰</span> Narzędzia danych</h2>
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

      <p className="creditsFooter">© 2026 Plan na kryzys. Wszelkie prawa zastrzeżone.</p>
    </div>
  )
}
