import { useState } from 'react';
import { KNOWLEDGE_ARTICLES } from '../data/knowledge';

export default function KnowledgePage() {
  const [activeId, setActiveId] = useState(KNOWLEDGE_ARTICLES[0]?.id);
  const active = KNOWLEDGE_ARTICLES.find((a) => a.id === activeId);

  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">Artykuły</h1>
        <p className="p">Krótkie treści. Jeśli czujesz, że robi Ci się gorzej — przejdź do „Kryzys”.</p>
        <div className="row mt12">
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
            <p className="p warningNote">{active.warning}</p>
          ) : null}
          <div className="stackSm mt12">
            {active.body.map((p) => (
              <div key={p} className="textBody">
                {p}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
