import { FRIEND_GUIDE } from '../data/friendGuide'

export default function FriendPage() {
  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">{FRIEND_GUIDE.title}</h1>
        <p className="p">Jeśli boisz się o bezpieczeństwo kogoś bliskiego, poproś dorosłego o pomoc.</p>
      </div>

      {FRIEND_GUIDE.sections.map((s) => (
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
