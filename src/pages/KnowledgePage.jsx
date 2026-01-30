import { useState } from 'react'
import { KNOWLEDGE_ARTICLES } from '../data/knowledge'

export default function KnowledgePage() {
  const [activeId, setActiveId] = useState(KNOWLEDGE_ARTICLES[0]?.id)
  const active = KNOWLEDGE_ARTICLES.find((a) => a.id === activeId)

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card">
        <h1 className="h1">Artykuły</h1>
        <p className="p">Krótkie treści. Jeśli czujesz, że robi Ci się gorzej — przejdź do „Kryzys”.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {KNOWLEDGE_ARTICLES.map((a) => (
            <button
              key={a.id}
              type="button"
              className={a.id === activeId ? 'btn btnPrimary' : 'btn'}
              onClick={() => setActiveId(a.id)}
            >
              {a.title}
            </button>
          ))}
        </div>
      </div>

      {active ? (
        <div className="card">
          <h1 className="h1">{active.title}</h1>
          {active.warning ? (
            <p className="p" style={{ borderLeft: '3px solid rgba(239, 68, 68, 0.6)', paddingLeft: 10 }}>
              {active.warning}
            </p>
          ) : null}
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {active.body.map((p) => (
              <div key={p} style={{ color: 'var(--text)' }}>{p}</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
