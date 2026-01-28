**Node.js** jest działającym po stronie serwera, wieloplatformowym ***środowiskiem uruchomieniowym JavaScript***.

* Asynchroniczność i sterowanie zdarzeniami – oznacza to, że wywołanie funkcji API nie czeka na wyniki, dzięki czemu
nie blokujemy wątku wykonawczego. Po zakończonym wywołaniu uruchomiona zostaje funkcja zwrotna lub ogłoszone zostaje
zdarzenie w poszczególnych częściach wykonawczych. Pomimo, że Node.js działa na jednym wątku z pętlą zdarzeń, potrafi
on obsłużyć więcej zapytań niż np. serwer HTTP Apache. Spowodowane jest to asynchroniczną obsługą wywołań kodu,
która nie powoduje blokowania wątku.

* NPM (Node Package Manager) - menadżer zależności, które obsługuje instalację i aktualizację modułów wielokrotnego użytku
ze zbioru online. Zajmuje się również rozwiązywaniem zależności pomiędzy modułami.

Jak działa Node.js

1. Jednowątkowość

   Podstawą działania Node.js jest to, że działa na jednym wątku. Może wydawać się , że jest to wąskie gardło,
   jest jednakże podejściem wartym rozważenia - przykładowo, dzięki niemu unikniemy niepotrzebnego przełączania
   między kontekstami procesora.

2. Pętla zdarzeń

   Zapętlanie zdarzeń oparte jest na bibliotece `libuv`, która obsługuje ich kolejkowanie i ansychroniczne przetwarzanie.
   Pętla obsługuje kolejkę zdarzeń, która zawiera ich listę wraz z wywołaniami.
   Przykładowo, gdy klient wysyła zapytanie do serwera Node.js, funkcja obsługi zdarzeń umieszczona zostaje w kolejce zdarzeń
   i przetwarzana zostaje przez pętlę zdarzeń.

3. Nie blokujące Wejście/Wyjście

   Pętla zdarzeń działa na pojedynczym wątku, lecz wszystkie długoterminowe zadania
   (Wejście/Wyjście sieciowe czy dostęp do danych) są zawsze wykonywane asynchronicznie jako wątki robocze,
   które przekazują wyniki poprzez funkcję zwrotną do pętli zdarzeń. Daje nam to asynchroniczny, nieblokujący pracy sposób
   na wykonywanie kodu.