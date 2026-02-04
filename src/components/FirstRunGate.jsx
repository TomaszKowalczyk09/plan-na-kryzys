/* jshint esversion: 11, asi: true, module: true, jsx: true */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useIndexedDB'

export default function FirstRunGate({ children }) {
  const { value: accepted, set: setAccepted, loading } = useSettings('legal_ack_v1_2026-02-04', false)
  const [checked, setChecked] = useState(false)
  const [saving, setSaving] = useState(false)

  const onContinue = async () => {
    if (!checked) return
    setSaving(true)
    try {
      await setAccepted(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return children
  if (accepted) return children

  return (
    <div className="app">
      <header className="header">
        <div className="headerInner">
          <div className="brandRow">
            <img className="brandLogo" src="/logo.svg" alt="Plan na kryzys" />
            <div className="brand">Plan na kryzys</div>
          </div>
        </div>
        <div className="headerDescription">Krótko i jasno — dla Twojego bezpieczeństwa.</div>
      </header>

      <main className="main">
        <div className="container" style={{ display: 'grid', gap: 12 }}>
          <div className="card">
            <h1 className="h1">To nie jest usługa ratunkowa</h1>
            <p className="p">Aplikacja nie dzwoni automatycznie na 112 i nie wzywa służb.</p>
          </div>

          <div className="card">
            <h1 className="h1">W nagłym zagrożeniu</h1>
            <p className="p">Jeśli jest bezpośrednie zagrożenie życia lub zdrowia — zadzwoń na 112.</p>
          </div>

          <div className="card">
            <h1 className="h1">Prywatność</h1>
            <p className="p">
              Dane (np. wpisy nastroju, plan bezpieczeństwa) są przechowywane lokalnie na Twoim urządzeniu.
              Nie wysyłamy ich na serwer.
            </p>
          </div>

          <div className="card">
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span style={{ fontWeight: 700 }}>
                Rozumiem i chcę korzystać z aplikacji.
              </span>
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                type="button"
                className="btn btnPrimary"
                onClick={onContinue}
                disabled={!checked || saving}
              >
                {saving ? 'Zapisuję…' : 'Kontynuuj'}
              </button>
            </div>
          </div>

          <div className="card">
            <p className="p">Administrator: Tomasz Kowalczyk (tomasz.kowalczyk@gminagryfino.pl)</p>
            <p className="p">Kontynuując, potwierdzasz zapoznanie się z dokumentami:</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <Link className="btn" to="/terms">Regulamin</Link>
              <Link className="btn" to="/privacy">Polityka prywatności</Link>
            </div>
          </div>

          <div className="card">
            <p className="p">
              Jeśli chcesz wrócić do tych informacji później, znajdziesz je w: O aplikacji.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
