export default function PrivacyPage() {
  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">Polityka prywatności</h1>
        <p className="p">Ostatnia aktualizacja: 4 lutego 2026</p>
      </div>

      <div className="card">
        <h1 className="h1">1. Administrator danych</h1>
        <p className="p">
          Administratorem danych i osobą odpowiedzialną jest Tomasz Kowalczyk (tomasz.kowalczyk@gminagryfino.pl).
        </p>
        <p className="p">
          Aplikacja jest wynikiem działań Młodzieżowej Rady Miejskiej w Gryfinie.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">2. Jakie dane przetwarzamy?</h1>
        <p className="p">
          Aplikacja może zapisywać lokalnie na Twoim urządzeniu dane, które sam/a wpiszesz, np.:
        </p>
        <div className="stackSm mt10">
          <div className="cardInset">wpisy nastroju (data/godzina, wybrane emocje, opcjonalna notatka)</div>
          <div className="cardInset">plan bezpieczeństwa (treści pól formularza)</div>
          <div className="cardInset">ustawienia (np. potwierdzenie zapoznania się z informacjami prawnymi)</div>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">3. Gdzie są przechowywane dane?</h1>
        <p className="p">
          Dane są przechowywane lokalnie w Twojej przeglądarce (IndexedDB) na Twoim urządzeniu.
          Nie wysyłamy tych danych na serwer i nie udostępniamy ich osobom trzecim.
        </p>
        <p className="p">
          Jeśli korzystasz z tego samego urządzenia i tej samej przeglądarki z innymi osobami, mogą one potencjalnie
          uzyskać dostęp do danych zapisanych lokalnie.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">4. Cookies/analityka</h1>
        <p className="p">
          W tej wersji MVP nie używamy analityki zewnętrznej ani narzędzi śledzących.
          Aplikacja może korzystać z mechanizmów pamięci przeglądarki potrzebnych do działania offline
          (cache zasobów PWA) oraz do zapisu danych, które wprowadzasz.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">5. Jak usunąć dane?</h1>
        <p className="p">
          Możesz usunąć dane z poziomu aplikacji w ekranie „O aplikacji” → „Usuń dane”.
          Możesz też wyczyścić dane strony w ustawieniach przeglądarki.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">6. Kontakt</h1>
        <p className="p">Kontakt: tomasz.kowalczyk@gminagryfino.pl</p>
      </div>

      <div className="card">
        <h1 className="h1">7. Podstawa prawna (RODO)</h1>
        <p className="p">
          Wpisy i plan bezpieczeństwa są zapisywane lokalnie na Twoim urządzeniu na Twoje żądanie, aby Aplikacja mogła działać.
          Aplikacja nie posiada kont użytkowników i nie przesyła treści wpisów na serwer.
        </p>
        <p className="p">
          Jeśli w przyszłości zostaną dodane funkcje wymagające przetwarzania danych na serwerze lub analityka, ta polityka zostanie zaktualizowana.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">8. Odbiorcy danych</h1>
        <p className="p">
          Nie udostępniamy treści wpisów użytkownika osobom trzecim, ponieważ nie są one przesyłane na serwer.
        </p>
        <p className="p">
          Dostawca hostingu (serwowania plików aplikacji) może przetwarzać standardowe dane techniczne połączenia, takie jak adres IP w logach serwera.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">9. Okres przechowywania</h1>
        <p className="p">
          Dane zapisane w Aplikacji są przechowywane lokalnie do czasu ich usunięcia przez użytkownika (funkcja „Usuń dane”) albo wyczyszczenia danych strony w przeglądarce.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">10. Twoje prawa</h1>
        <p className="p">
          Masz prawo do informacji o zasadach prywatności oraz do usunięcia danych przechowywanych lokalnie w Aplikacji.
          W tej wersji Aplikacji nie mamy dostępu do treści Twoich wpisów (nie są one wysyłane na serwer).
        </p>
      </div>

      <div className="card">
        <h1 className="h1">11. Skarga do organu nadzorczego</h1>
        <p className="p">
          Jeśli uważasz, że przetwarzanie danych narusza przepisy, możesz złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO).
        </p>
      </div>

      <div className="card">
        <h1 className="h1">12. Dane wrażliwe i bezpieczeństwo</h1>
        <p className="p">
          Treści wpisów mogą dotyczyć zdrowia psychicznego, co może stanowić dane wrażliwe. Z tego powodu Aplikacja nie przesyła tych treści na serwer.
        </p>
        <p className="p">
          Pamiętaj, że jeśli urządzenie jest współdzielone, inne osoby korzystające z tej samej przeglądarki mogą uzyskać dostęp do danych zapisanych lokalnie.
        </p>
      </div>
    </div>
  )
}
