import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="grid">
      <div className="card">
        <h1 className="h1">Mój nastrój</h1>
        <p className="p">Szybki wpis i historia z 14 dni.</p>
        <div style={{ marginTop: 12 }}>
          <Link className="btn btnPrimary" to="/mood">Przejdź</Link>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Kryzys</h1>
        <p className="p">Kroki „tu i teraz”, numery pomocy, plan bezpieczeństwa.</p>
        <div style={{ marginTop: 12 }}>
          <Link className="btn btnDanger" to="/crisis">Otwórz</Link>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Wiedza</h1>
        <p className="p">Krótkie teksty o emocjach i kryzysie.</p>
        <div style={{ marginTop: 12 }}>
          <Link className="btn" to="/knowledge">Czytaj</Link>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Dla przyjaciela</h1>
        <p className="p">Jak rozmawiać i kiedy poprosić dorosłego.</p>
        <div style={{ marginTop: 12 }}>
          <Link className="btn" to="/friend">Otwórz</Link>
        </div>
      </div>
    </div>
  )
}
