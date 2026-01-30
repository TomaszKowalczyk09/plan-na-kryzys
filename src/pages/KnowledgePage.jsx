import { KNOWLEDGE_ARTICLES } from '../data/knowledge'

export default function KnowledgePage() {
  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">Wiedza — FAQ</h1>
        <p className="p">Krótkie treści. Jeśli czujesz, że robi Ci się gorzej — przejdź do „Kryzys”.</p>
      </div>

      <div className="stackSm">
        {KNOWLEDGE_ARTICLES.map((a) => (
          <details key={a.id} className="faqItem">
            <summary className="faqSummary">
              <span className="textStrong">{a.title}</span>
              <span className="faqChevron" aria-hidden="true">▾</span>
            </summary>
            <div className="faqBody">
              {a.warning ? <p className="p warningNote">{a.warning}</p> : null}
              <div className="stackSm mt12">
                {a.body.map((p) => (
                  <div key={p} className="textBody">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
