import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="screen">
      <div className="heroCard">
        <div className="heroContent">
          <h1 className="heroTitle">Plan na kryzys</h1>
          <p className="heroSub">
            Bezpieczna, prosta przestrzeń na gorsze dni. Wszystko zostaje na Twoim urządzeniu.
          </p>
          <div className="row mt12">
            <Link className="btn btnPrimary" to="/mood">Dodaj nastrój</Link>
            <Link className="btn btnDanger" to="/crisis">Tryb kryzysowy</Link>
          </div>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="heroOrb heroOrbWarm" />
          <div className="heroOrb heroOrbSun" />
          <div className="heroOrb heroOrbLeaf" />
        </div>
      </div>

      <div className="featureGrid">
        <div className="featureCard featureCardMood">
          <div className="featureHeader">
            <div className="featureIcon">N</div>
            <div>
              <h2 className="featureTitle">Mój nastrój</h2>
              <p className="featureSub">Szybki wpis i czytelne podsumowanie z 14 dni.</p>
            </div>
          </div>
          <div className="row mt12">
            <Link className="btn btnPrimary" to="/mood">Przejdź</Link>
          </div>
        </div>

        <div className="featureCard featureCardCrisis">
          <div className="featureHeader">
            <div className="featureIcon">K</div>
            <div>
              <h2 className="featureTitle">Kryzys</h2>
              <p className="featureSub">Kroki tu i teraz, numery pomocy, plan bezpieczeństwa.</p>
            </div>
          </div>
          <div className="row mt12">
            <Link className="btn btnDanger" to="/crisis">Otwórz</Link>
          </div>
        </div>

        <div className="featureCard">
          <div className="featureHeader">
            <div className="featureIcon">W</div>
            <div>
              <h2 className="featureTitle">Wiedza</h2>
              <p className="featureSub">Krótkie, konkretne odpowiedzi w formie FAQ.</p>
            </div>
          </div>
          <div className="row mt12">
            <Link className="btn" to="/knowledge">Czytaj</Link>
          </div>
        </div>

        <div className="featureCard">
          <div className="featureHeader">
            <div className="featureIcon">P</div>
            <div>
              <h2 className="featureTitle">Dla przyjaciela</h2>
              <p className="featureSub">Jak rozmawiać i kiedy poprosić dorosłego o wsparcie.</p>
            </div>
          </div>
          <div className="row mt12">
            <Link className="btn" to="/friend">Otwórz</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
