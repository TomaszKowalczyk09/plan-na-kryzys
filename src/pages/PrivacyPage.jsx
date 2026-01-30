export default function PrivacyPage() {
  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">Polityka prywatności</h1>
        <p className="p">Ostatnia aktualizacja: 23 stycznia 2026</p>
      </div>

      <div className="card">
        <h1 className="h1">1. Kto jest administratorem?</h1>
        <p className="p">
          Ta wersja aplikacji działa jako PWA bez kont i bez serwera aplikacyjnego.
          Administrator danych: {`{UZUPEŁNIJ: nazwa/imię i nazwisko, e-mail kontaktowy}`}
        </p>
      </div>

      <div className="card">
        <h1 className="h1">2. Jakie dane przetwarzamy?</h1>
        <p className="p">
          Aplikacja może zapisywać lokalnie na Twoim urządzeniu dane, które sam/a wpiszesz, np.:
        </p>
        <div className="stackSm mt10">
          <div className="cardInset">
            wpisy nastroju (data/godzina, wybrane emocje, opcjonalna notatka)
          </div>
          <div className="cardInset">
            plan bezpieczeństwa (treści pól formularza)
          </div>
          <div className="cardInset">
            ustawienia (np. potwierdzenie zapoznania się z informacjami prawnymi)
          </div>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">3. Gdzie są przechowywane dane?</h1>
        <p className="p">
          Dane są przechowywane lokalnie w Twojej przeglądarce (IndexedDB) na Twoim urządzeniu.
          Nie wysyłamy tych danych na serwer i nie udostępniamy ich osobom trzecim.
        </p>
        <p className="p">
          Jeśli korzystasz z tego samego urządzenia i tej samej przeglądarki z innymi osobami,
          mogą one potencjalnie uzyskać dostęp do danych zapisanych lokalnie.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">4. Czy używamy cookies/analityki?</h1>
        <p className="p">
          W tej wersji MVP nie używamy analityki zewnętrznej ani narzędzi śledzących.
          Aplikacja może korzystać z mechanizmów pamięci przeglądarki potrzebnych do działania offline
          (cache zasobów PWA) oraz do zapisu danych, które wprowadzasz.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">5. Jak usunąć dane?</h1>
        <p className="p">
          Możesz usunąć dane z poziomu aplikacji w ekranie „O aplikacji” → „Usuń moje dane”.
          Możesz też wyczyścić dane strony w ustawieniach przeglądarki.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">6. Kontakt</h1>
        <p className="p">Kontakt: {`{UZUPEŁNIJ: e-mail}`}</p>
      </div>
    </div>
  )
}
