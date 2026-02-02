# State Management Pattern – zalety, wady i wyzwania

State management w aplikacjach webowych może być przełomem, ale jednocześnie stawia przed developerami wyzwania, na które warto zwracać uwagę. W tym dokumencie omówiono zalety i wady wzorca oraz typowe problemy wraz ze strategiami ich łagodzenia.

## Czym jest State Management Pattern

Wzorzec zarządzania stanem polega na **centralizacji stanu aplikacji** w jednym miejscu (np. store) i propagowaniu zmian do komponentów przez subskrypcję. Zamiast rozsiewać stan po wielu widokach czy komponentach, mamy **jedno źródło prawdy** – wszystkie części aplikacji odczytują i aktualizują ten sam stan.

W projekcie przykładowym (`state-management-patttern`) stan licznika jest w `store.js`; widoki `counter` i `result` subskrybują zmiany i wyświetlają tę samą wartość bez przekazywania jej przez URL czy lokalne zmienne.

---

## Uruchomienie projektu przykładowego

Projekt używa **Vite**. W katalogu `state-management-patttern`:

```bash
npm install
npm run dev
```

Serwer deweloperski uruchomi się zwykle pod `http://localhost:5173`. Produkcyjna wersja:

```bash
npm run build    # wynik w katalogu dist/
npm run preview  # podgląd zbudowanej wersji
```

Widoki: **Licznik** (`#/`, `#/counter`) i **Rezultat** (`#/result`) – oba korzystają ze wspólnego stanu z store.

---

## Zalety State Management Pattern

| Zaleta                                 | Opis                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Jedno źródło prawdy**                | Stan jest w jednym miejscu; brak rozbieżności między komponentami czy widokami.                          |
| **Spójność danych**                    | Wszystkie części aplikacji odzwierciedlają ten sam, aktualny stan.                                       |
| **Przewidywalność**                    | Zmiany stanu odbywają się w określony sposób (np. przez akcje), co ułatwia zrozumienie przepływu danych. |
| **Łatwiejsze debugowanie**             | Można śledzić historię zmian i stan w jednym punkcie; biblioteki jak Redux oferują dedykowane dev tools. |
| **Niezależność od drzewa komponentów** | Komponenty głęboko zagnieżdżone nie muszą otrzymywać stanu przez długie łańcuchy propsów.                |
| **Testowalność**                       | Logikę store’u i akcji można testować w izolacji, bez montowania całego UI.                              |

---

## Wady State Management Pattern

| Wada                                      | Opis                                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Dodatkowa złożoność**                   | Trzeba zaprojektować store, akcje, subskrypcje; w małych aplikacjach może to być overkill.           |
| **Ryzyko spadku wydajności**              | Częste aktualizacje lub duże zmiany stanu mogą powodować wiele przerenderów i wolniejsze interakcje. |
| **Krzywa nauki**                          | Nowi członkowie zespołu muszą zrozumieć konwencje (immutability, akcje, middleware itd.).            |
| **Nadmierna ilość stanu w store**         | Łatwo wrzucić do store’u za dużo – część stanu lepiej trzymać lokalnie w komponentach.               |
| **Trudności z utrzymaniem przy wzroście** | Z czasem store może stać się duży i trudny w refaktoryzacji bez przemyślanej struktury.              |

---

## Typowe problemy i strategie łagodzenia

### 1. Spadek wydajności (performance degradation)

**Problem:** W miarę wzrostu aplikacji, zwłaszcza przy dużej liczbie aktualizacji stanu, może dochodzić do spadku wydajności i wolniejszych interakcji.

**Skutki:**

- częste przerenderowania
- zbędne przeliczenia
- gorsze odczucie responsywności

**Strategie łagodzenia:**

- **Optymalizacja aktualizacji stanu** – ograniczać niepotrzebne przerenderowania i przeliczenia; aktualizować tylko to, co się zmieniło.
- **Memoizacja** – cache’ować wyniki obliczeń (np. pochodne ze stanu), żeby unikać powtarzanych obliczeń przy tym samym wejściu.
- **Narzędzia do profilowania** – używać profilerów (np. React DevTools Profiler, Chrome Performance) do wykrywania wąskich gardeł w operacjach związanych ze stanem.

---

### 2. Spójność i synchronizacja stanu

**Problem:** Utrzymanie spójnego i zsynchronizowanego stanu w różnych komponentach lub warstwach aplikacji bywa trudne. Ważne jest, żeby każda część aplikacji odzwierciedlała aktualny stan.

**Strategie łagodzenia:**

- **Centralne zarządzanie stanem** – stosować biblioteki lub wzorce (Redux, Zustand, własny store jak w przykładzie), które dają **single source of truth**.
- **Immutability** – nie mutować stanu w miejscu; zwracać nowe obiekty/tablice, co ułatwia śledzenie zmian i unikanie przypadkowych mutacji.
- **Przewidywalny przepływ danych** – ustalić jasne mechanizmy propagacji zmian (subskrypcje, akcje), żeby zmiany docierały wszędzie tam, gdzie trzeba.

---

### 3. Debugowanie błędów związanych ze stanem

**Problem:** Gdy pojawiają się błędy lub nieoczekiwane zachowanie związane ze stanem, znalezienie przyczyny bywa skomplikowane, szczególnie w dużym kodzie i przy złożonych zależnościach.

**Strategie łagodzenia:**

- **Dev tools do stanu** – korzystać z rozszerzeń przeglądarki lub wbudowanych narzędzi bibliotek (np. Redux DevTools): podgląd stanu, time-travel, logowanie akcji.
- **Logowanie i error handling** – stosować logowanie w kluczowych miejscach (akcje, aktualizacje store’u) oraz error boundaries i obsługę błędów, żeby wychwytywać i śledzić problemy ze stanem.

---

### 4. Utrzymanie i skalowalność

**Problem:** W miarę ewolucji aplikacji i dodawania funkcji obecne rozwiązanie state management może stać się trudne w utrzymaniu lub niewystarczające przy skali.

**Strategie łagodzenia:**

- **Przeglądy i refaktoryzacja** – regularnie przeglądać kod i refaktoryzować implementację state management, tak aby była zgodna z aktualnymi wymaganiami.
- **Architektura pod skalę** – w razie potrzeby dzielić stan na mniejsze moduły (slice’y, domeny) lub wprowadzać middleware do skomplikowanych transformacji stanu.

---

### 5. Testowanie i integracja nowych funkcji

**Problem:** Testowanie oraz wdrażanie nowych funkcji przy już istniejącym state management może być kłopotliwe – ryzyko problemów z kompatybilnością lub niepełnego pokrycia testami.

**Strategie łagodzenia:**

- **Strategia testowa** – opracować plan testów skupiony na logice stanu: akcje, reducery/store, wyliczenia pochodne.
- **Mockowanie i izolacja** – w testach jednostkowych używać mocków/stubów, żeby izolować komponenty i logikę zależną od stanu.
- **Testy integracyjne** – sprawdzać, czy nowe funkcje poprawnie współpracują z istniejącym store’em i przepływem danych.

Dobrze zaprojektowane biblioteki state management (Redux, MobX itd.) często dostarczają narzędzi ułatwiających takie testy.

---

## Kluczowe wnioski końcowe

State management **nie rozwiązuje sam z siebie** wszystkich problemów aplikacji – może je uporządkować, ale wymaga świadomego stosowania.

**Typowe zagrożenia:**

- spadek wydajności przy zbyt częstych lub zbyt dużych aktualizacjach
- niespójny stan przy rozproszeniu lub mutacjach
- trudne debugowanie bez dobrych narzędzi i konwencji
- rosnąca złożoność przy braku refaktoryzacji i podziału stanu

**Skuteczne podejście:**

- jedno źródło prawdy i immutability
- optymalizacja (memoizacja, mniej zbędnych przerenderów)
- dev tools i dobre praktyki debugowania
- regularne przeglądy, refaktoryzacja i testy ukierunkowane na stan

Dzięki rozpoznaniu tych problemów i stosowaniu odpowiednich strategii można budować aplikacje z czytelnym, wydajnym i utrzymywalnym state managementem.

---

## Struktura projektu przykładowego

```
state-management-patttern/
├── index.html
├── package.json
├── vite.config.js
├── styles.css
└── src/
    ├── app.js          # Inicjalizacja, rejestracja widoków, router
    ├── router.js       # Router hash-based
    ├── store.js        # Centralny stan (count), setState, subscribe, akcje increment/decrement
    ├── components/
    │   └── header.js   # Współdzielony header
    └── views/
        ├── counter.js  # Widok licznika – subskrybuje store, wywołuje increment/decrement
        └── result.js   # Widok rezultatu – odczytuje ten sam stan
```

## Rozbudowa

- **Nowy widok:** dodaj plik w `src/views/`, zaimportuj `getState` / `subscribe` z `store.js`, zarejestruj ścieżkę w `app.js`.
- **Nowe pole w stanie:** rozszerz obiekt w `store.js`, dodaj akcje (np. `setName`) i ewentualnie nowe subskrypcje w widokach.
- **Teardown:** przy opuszczaniu widoku odsubskrybuj listener (jak w `counter.js` – `view-teardown` + `unsubscribe`), żeby uniknąć wycieków pamięci.
