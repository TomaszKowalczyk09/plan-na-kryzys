import { useI18n } from '../i18n/index.jsx'

export default function PrivacyPage() {
  const { t, get } = useI18n()
  const sections = get('privacy.sections', [])

  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">{t('privacy.title')}</h1>
        <p className="p">{t('privacy.updated')}</p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="card">
          <h1 className="h1">{section.title}</h1>
          {(section.body ?? []).map((line) => (
            <p key={line} className="p">{line}</p>
          ))}
          {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
            <div className="stackSm mt10">
              {section.bullets.map((item) => (
                <div key={item} className="cardInset">{item}</div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
