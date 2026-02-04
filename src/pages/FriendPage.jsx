import { FRIEND_GUIDE } from '../data/friendGuide'

export default function FriendPage() {
  const tellAdult = FRIEND_GUIDE.sections.find((s) => s.title.toLowerCase().includes('kiedy powiedzieć dorosłemu'))
  const otherSections = FRIEND_GUIDE.sections.filter((s) => s !== tellAdult)

  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">{FRIEND_GUIDE.title}</h1>
        <p className="p">Jeśli boisz się o bezpieczeństwo kogoś bliskiego, poproś dorosłego o pomoc.</p>
      </div>

      {tellAdult ? (
        <div className="card" style={{ border: '1px solid var(--danger)', background: 'rgba(220, 38, 38, 0.06)' }}>
          <h1 className="h1" style={{ color: 'var(--danger)' }}>
            {tellAdult.title}
          </h1>
          <div className="stackSm mt12">
            {tellAdult.bullets.map((b) => (
              <div
                key={b}
                className="cardInset"
                style={{ borderLeft: '4px solid var(--danger)', background: 'rgba(220, 38, 38, 0.06)' }}
              >
                {b}
              </div>
            ))}
          </div>
          <div className="cardInset" style={{ marginTop: 12, borderLeft: '4px solid var(--danger)' }}>
            Jeśli jest bezpośrednie zagrożenie życia lub zdrowia — zadzwoń na <b>112</b>.
          </div>
        </div>
      ) : null}

      {otherSections.map((s) => (
        <div key={s.title} className="card">
          <h1 className="h1">{s.title}</h1>
          <div className="stackSm mt12">
            {s.bullets.map((b) => (
              <div key={b} className="cardInset">
                {b}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card cardMuted">
        <h1 className="h1">W razie kryzysu</h1>
        <p className="p">Przejdź do zakładki „Kryzys” — są tam kroki i numery pomocy.</p>
      </div>
    </div>
  )
}
