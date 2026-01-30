export default function TermsPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card">
        <h1 className="h1">Regulamin</h1>
        <p className="p">Ostatnia aktualizacja: 30 stycznia 2026</p>
      </div>

      <div className="card">
        <h1 className="h1">1. Informacje ogólne</h1>
        <p className="p">
          Aplikacja „Plan na kryzys” to narzędzie informacyjne i wspierające. Działa jako PWA
          (aplikacja webowa) i może funkcjonować offline.
        </p>
        <p className="p">
          Usługodawca: {`[UZUPEŁNIJ: nazwa/imię i nazwisko]`} • Kontakt: {`[UZUPEŁNIJ: e-mail]`}
        </p>
      </div>

      <div className="card">
        <h1 className="h1">2. Charakter usługi</h1>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          <div className="card" style={{ padding: 12 }}>
            Aplikacja nie jest usługą ratunkową. Nie dzwoni automatycznie na 112 i nie wzywa służb.
          </div>
          <div className="card" style={{ padding: 12 }}>
            Aplikacja nie stanowi diagnozy ani terapii i nie zastępuje kontaktu ze specjalistą.
          </div>
          <div className="card" style={{ padding: 12 }}>
            W bezpośrednim zagrożeniu życia lub zdrowia należy niezwłocznie zadzwonić na 112.
          </div>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">3. Zasady korzystania</h1>
        <p className="p">
          Korzystasz z aplikacji dobrowolnie i na własną odpowiedzialność. Zobowiązujesz się do
          korzystania z niej w sposób zgodny z prawem i niniejszym regulaminem.
        </p>
        <p className="p">
          Usługodawca może ograniczyć dostęp do aplikacji w razie nadużyć lub prac technicznych.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">4. Dane i prywatność</h1>
        <p className="p">
          Dane wpisane w aplikacji są przechowywane lokalnie na urządzeniu użytkownika.
          Szczegóły znajdują się w Polityce prywatności.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">5. Odpowiedzialność</h1>
        <p className="p">
          Dokładamy starań, aby treści były zrozumiałe i ostrożne, jednak mają one charakter ogólny.
          Aplikacja nie zapewnia stałego monitoringu, interwencji ani kontaktu z instytucjami.
        </p>
        <p className="p">
          Usługodawca nie ponosi odpowiedzialności za skutki decyzji podjętych na podstawie treści
          dostępnych w aplikacji.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">6. Prawa autorskie</h1>
        <p className="p">
          Treści i układ aplikacji są chronione prawem autorskim. Zabronione jest ich kopiowanie
          i rozpowszechnianie bez zgody usługodawcy, chyba że przepisy prawa stanowią inaczej.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">7. Zmiany regulaminu</h1>
        <p className="p">
          Regulamin może być aktualizowany. Przy istotnych zmianach aplikacja może poprosić o
          ponowne potwierdzenie.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">8. Kontakt</h1>
        <p className="p">Kontakt: {`[UZUPEŁNIJ: e-mail]`}</p>
      </div>
    </div>
  )
}
