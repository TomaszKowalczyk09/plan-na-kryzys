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

  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">{sections.about?.title}</h1>
        {(sections.about?.body ?? []).map((line) => <p key={line} className="p">{line}</p>)}
      </div>

      <div className="card">
        <h1 className="h1">{sections.documents?.title}</h1>
        <div className="row mt12">
          <Link className="btn" to="/terms">{sections.documents?.terms}</Link>
          <Link className="btn" to="/privacy">{sections.documents?.privacy}</Link>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">{sections.disclaimers?.title}</h1>
        <div className="stackSm mt10">
          {(sections.disclaimers?.items ?? []).map((item) => (
            <div key={item} className="cardInset">{item}</div>
          ))}
        </div>
      </div>

      <div className="card">
        <h1 className="h1">{sections.privacyShort?.title}</h1>
        {(sections.privacyShort?.body ?? []).map((line) => <p key={line} className="p">{line}</p>)}
      </div>

      <div className="card">
        <h1 className="h1">{sections.delete?.title}</h1>
        <p className="p">{sections.delete?.body}</p>
        <div className="row mt12">
          <button type="button" className="btn btnDanger" onClick={onClear} disabled={clearing}>
            {clearing ? t('about.deleting') : t('about.deleteData')}
          </button>
          {done ? (
            <span className="textMuted textSm alignCenter">{t('about.done')}</span>
          ) : null}
        </div>
      </div>

      <div className="card">
        <h1 className="h1">{sections.export?.title}</h1>
        <p className="p">{sections.export?.body}</p>
        <div className="row mt12">
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
            {t('about.exportJson')}
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
            {t('about.exportMoodCsv')}
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
            {t('about.exportPlanTxt')}
          </button>
          {exportDone ? (
            <span className="textMuted textSm alignCenter">{exportDone}</span>
          ) : null}
        </div>
      </div>

      <div className="card">
        <h1 className="h1">{sections.reports?.title}</h1>
        <p className="p">{sections.reports?.body}</p>
      </div>

      <div className="card">
        <h1 className="h1">{credits.title}</h1>
        <div className="stackSm mt10">
          <div className="cardInset">{credits.initiative}</div>
          <div className="cardInset">
            {credits.adminLabel} <a href={`mailto:${credits.adminEmail}`}>{credits.adminName} ({credits.adminEmail})</a>
          </div>
          <div className="cardInset">
            {credits.discordLabel} <a href={credits.discordUrl} target="_blank" rel="noreferrer">{credits.discordAction}</a>
          </div>
          <div className="cardInset">
            {credits.discordOwnerLabel} <a href={`mailto:${credits.discordOwnerEmail}`}>{credits.discordOwnerName} ({credits.discordOwnerEmail})</a>.
          </div>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">{sections.version?.title}</h1>
        <p className="p">{sections.version?.body}</p>
      </div>
    </div>
  )
}
