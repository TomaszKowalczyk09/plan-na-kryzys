import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clearAllLocalData } from '../hooks/useIndexedDB'

export default function AboutPage() {
  const [clearing, setClearing] = useState(false)
  const [done, setDone] = useState(false)

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

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card">
        <h1 className="h1">O aplikacji</h1>
        <p className="p">
          Kompakt Wsparcia to aplikacja PWA wspierająca w trudnych emocjach.
          Nie zastępuje profesjonalnej pomocy.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">Dokumenty</h1>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <Link className="btn" to="/terms">Regulamin</Link>
          <Link className="btn" to="/privacy">Polityka prywatności</Link>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Ważne zastrzeżenia</h1>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          <div className="card" style={{ padding: 12 }}>
            To nie jest usługa ratunkowa. Aplikacja nie dzwoni automatycznie na 112 i nie wzywa służb.
          </div>
          <div className="card" style={{ padding: 12 }}>
            Jeśli jesteś w bezpośrednim zagrożeniu życia lub zdrowia, zadzwoń na 112.
          </div>
          <div className="card" style={{ padding: 12 }}>
            Treści są ogólne i informacyjne. Jeśli czujesz, że sytuacja Cię przerasta, poproś o pomoc zaufaną osobę dorosłą lub specjalistę.
          </div>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Prywatność (w skrócie)</h1>
        <p className="p">
          Aplikacja działa offline-first. Twoje wpisy nastroju i plan bezpieczeństwa są zapisywane lokalnie na Twoim urządzeniu (IndexedDB).
          Nie wysyłamy tych danych na serwer.
        </p>
        <p className="p">
          Jeśli korzystasz z tego samego telefonu z innymi osobami, pamiętaj że one mogą mieć dostęp do danych w tej przeglądarce.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">Usuń moje dane</h1>
        <p className="p">Usuwa lokalnie: wpisy nastroju, plan bezpieczeństwa i ustawienia tej aplikacji w tej przeglądarce.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button type="button" className="btn btnDanger" onClick={onClear} disabled={clearing}>
            {clearing ? 'Usuwam…' : 'Usuń dane'}
          </button>
          {done ? <span style={{ alignSelf: 'center', color: 'var(--muted)', fontWeight: 700 }}>Gotowe</span> : null}
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Wersja</h1>
        <p className="p">MVP 1.0 (lokalne dane, offline-first)</p>
      </div>
    </div>
  )
}
