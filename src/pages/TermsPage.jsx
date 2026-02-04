export default function TermsPage() {
  return (
    <div className="screen">
      <div className="card">
        <h1 className="h1">Regulamin</h1>
        <p className="p">Ostatnia aktualizacja: 4 lutego 2026</p>
      </div>

      <div className="card">
        <h1 className="h1">1. Informacje ogólne</h1>
        <p className="p">
          Aplikacja „Plan na kryzys” (dalej: „Aplikacja”) to narzędzie informacyjne i wspierające. Działa jako PWA
          (aplikacja webowa) i może funkcjonować offline.
        </p>
        <p className="p">
          Aplikacja jest wynikiem działań Młodzieżowej Rady Miejskiej w Gryfinie.
        </p>
        <p className="p">
          Administrator i osoba odpowiedzialna: Tomasz Kowalczyk • Kontakt: tomasz.kowalczyk@gminagryfino.pl
        </p>
      </div>

      <div className="card">
        <h1 className="h1">2. Charakter usługi</h1>
        <div className="stackSm mt10">
          <div className="cardInset">
            Aplikacja nie jest usługą ratunkową. Nie dzwoni automatycznie na 112 i nie wzywa służb.
          </div>
          <div className="cardInset">
            Aplikacja nie stanowi diagnozy ani terapii i nie zastępuje kontaktu ze specjalistą.
          </div>
          <div className="cardInset">
            W bezpośrednim zagrożeniu życia lub zdrowia należy niezwłocznie zadzwonić na 112.
          </div>
        </div>
      </div>

      <div className="card">
        <h1 className="h1">3. Zakres działania Aplikacji</h1>
        <p className="p">
          Aplikacja udostępnia m.in. dziennik nastroju, plan bezpieczeństwa, listę numerów wsparcia oraz treści
          edukacyjne. Dane wpisywane przez użytkownika są przechowywane lokalnie na urządzeniu użytkownika.
        </p>
        <p className="p">
          Aplikacja nie zapewnia stałego monitoringu, interwencji ani kontaktu z instytucjami. Decyzję o kontakcie
          z numerami wsparcia podejmuje użytkownik.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">4. Zasady korzystania</h1>
        <p className="p">
          Korzystasz z Aplikacji dobrowolnie i na własną odpowiedzialność. Zobowiązujesz się do korzystania z niej
          w sposób zgodny z prawem i niniejszym regulaminem.
        </p>
        <p className="p">
          Administrator może czasowo ograniczyć dostęp do Aplikacji w razie nadużyć lub prac technicznych.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">5. Dane i prywatność</h1>
        <p className="p">
          Dane wpisane w Aplikacji są przechowywane lokalnie na urządzeniu użytkownika.
          Szczegóły znajdują się w Polityce prywatności.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">6. Odpowiedzialność</h1>
        <p className="p">
          Dokładamy starań, aby treści były zrozumiałe i ostrożne, jednak mają one charakter ogólny.
          Aplikacja nie zapewnia stałego monitoringu, interwencji ani kontaktu z instytucjami.
        </p>
        <p className="p">
          Administrator nie ponosi odpowiedzialności za skutki decyzji podjętych na podstawie treści dostępnych w Aplikacji.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">7. Prawa autorskie</h1>
        <p className="p">
          Treści i układ Aplikacji są chronione prawem autorskim. Zabronione jest ich kopiowanie i rozpowszechnianie
          bez zgody Administratora, chyba że przepisy prawa stanowią inaczej.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">8. Zmiany regulaminu</h1>
        <p className="p">
          Regulamin może być aktualizowany. Przy istotnych zmianach Aplikacja może poprosić o ponowne potwierdzenie.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">9. Kontakt</h1>
        <p className="p">Kontakt: tomasz.kowalczyk@gminagryfino.pl</p>
      </div>

      <div className="card">
        <h1 className="h1">10. Wymagania techniczne</h1>
        <p className="p">
          Do korzystania z Aplikacji potrzebujesz urządzenia z nowoczesną przeglądarką internetową.
          Aplikacja może być instalowana jako PWA. Niektóre funkcje (np. instalacja lub aktualizacja) mogą wymagać połączenia z Internetem.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">11. Zgłoszenia i kontakt</h1>
        <p className="p">
          Jeśli zauważysz błąd, nieaktualny numer telefonu lub treść wymagającą korekty, możesz napisać na: tomasz.kowalczyk@gminagryfino.pl.
        </p>
      </div>

      <div className="card">
        <h1 className="h1">12. Dokumenty</h1>
        <p className="p">
          Zasady prywatności opisuje Polityka prywatności. Dokumenty są dostępne w Aplikacji w sekcji „O aplikacji”.
        </p>
      </div>
    </div>
  )
}
