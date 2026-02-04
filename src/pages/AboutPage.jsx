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
    <div className="screen">
      <div className="card">
        <h1 className="h1">O aplikacji</h1>
        <p className="p">
          Plan na kryzys to aplikacja PWA wspierająca w trudnych emocjach. Nie zastępuje profesjonalnej pomocy.
        </p>
        <p className="p">Inicjatywa: Młodzieżowa Rada Miejska w Gryfinie.</p>
        <p className="p">Administrator i osoba odpowiedzialna: Tomasz Kowalczyk (tomasz.kowalczyk@gminagryfino.pl).</p>
      </div>

      <div className="card">
        <h1 className="h1">Dokumenty</h1>
        <div className="row mt12">
          <Link className="btn" to="/terms">Regulamin</Link>
          <Link className="btn" to="/privacy">Polityka prywatności</Link>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Ważne zastrzeżenia</h1>
        <div className="stackSm mt10">
          <div className="cardInset">
            To nie jest usługa ratunkowa. Aplikacja nie dzwoni automatycznie na 112 i nie wzywa służb.
          </div>
          <div className="cardInset">
            Jeśli jesteś w bezpośrednim zagrożeniu życia lub zdrowia, zadzwoń na 112.
          </div>
          <div className="cardInset">
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
        <div className="row mt12">
          <button type="button" className="btn btnDanger" onClick={onClear} disabled={clearing}>
            {clearing ? 'Usuwam…' : 'Usuń dane'}
          </button>
          {done ? (
            <span className="textMuted textSm alignCenter">Gotowe</span>
          ) : null}
        </div>
      </div>

      <div className="card">
        <h1 className="h1">Zgłoszenia</h1>
        <p className="p">
          Błędy, sugestie oraz nieaktualne numery telefonów możesz zgłaszać na: tomasz.kowalczyk@gminagryfino.pl.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">Wersja</h1>
        <p className="p">MVP 1.0 (lokalne dane, offline-first)</p>
      </div>
    </div>
  )
}
