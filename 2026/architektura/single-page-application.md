# Szkielet SPA w Vanilla JS

Prosty szkielet Single Page Application w czystym JavaScript (bez frameworków). Pokazuje typową strukturę i zalety SPA.

## Uruchomienie

Projekt używa **Vite** jako bundlera. W katalogu projektu:

```bash
npm install
npm run dev
```

Serwer deweloperski (z HMR) uruchomi się zwykle pod `http://localhost:5173`. Produkcyjna wersja:

```bash
npm run build    # wynik w katalogu dist/
npm run preview  # podgląd zbudowanej wersji
```

Nawigacja: **Home** | **O nas** | **Kontakt**. Adres zmienia się na `#/`, `#/about`, `#/contact` – bez przeładowania strony.

## Vite – zalety używania bundlera

| Zaleta                        | Opis                                                                                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Szybki cold start**         | Vite nie bundluje całej aplikacji przy starcie. Używa natywnego ESM w przeglądarce – serwer tylko serwuje pliki, a transformacja (np. TypeScript, JSX) odbywa się na żądanie. |
| **Natychmiastowe HMR**        | Hot Module Replacement aktualizuje zmodyfikowane moduły bez pełnego przeładowania strony; stan aplikacji można zachować.                                                      |
| **Optymalizacja produkcyjna** | `vite build` używa Rollupa: drzewo zależności, code splitting, minifikacja – mniejsze i szybsze paczki do wdrożenia.                                                          |
| **Konfiguracja „zero”**       | Działa od razu z ES modułami i `index.html` jako punktem wejścia; `vite.config.js` jest opcjonalny.                                                                           |
| **Środowisko deweloperskie**  | Wbudowany serwer z obsługą TypeScript, JSX, CSS (w tym preprocesorów), JSON, assetów – bez osobnych narzędzi.                                                                 |
| **Dobre DX**                  | Szybkie odświeżanie, czytelne stack trace’y, wsparcie dla zmiennych środowiskowych (`.env`) i trybu preview po buildzie.                                                      |

## Zalety SPA (pokazane w tym szkielecie)

| Zaleta                     | Jak to widać w projekcie                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Jedno ładowanie strony** | Jeden plik `index.html` – dalsza „nawigacja” to tylko zamiana treści w JS.                             |
| **Brak przeładowań**       | Klik w link zmienia tylko zawartość `<main>`, cała strona się nie odświeża.                            |
| **Współdzielony layout**   | Header z nawigacją jest jeden; przy każdej „stronie” tylko podmieniany jest fragment treści.           |
| **Szybsze odczucie**       | Przejście między widokami jest natychmiastowe, bez bielenia ekranu i ponownego ładowania zasobów.      |
| **Adres w URL**            | Hash (`#/about`) pozwala wracać do konkretnego widoku (np. zakładka, odświeżenie).                     |
| **Prosty stack**           | Vanilla JS + jeden HTML; Vite daje szybki dev server i zoptymalizowany build bez ciężkiego frameworka. |

## Wady SPA

| Wada                        | Opis                                                                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Początkowe ładowanie**    | Cały JS (i często framework) musi się załadować przed wyświetleniem treści – przy dużych aplikacjach pierwszy ekran może się opóźnić.                |
| **SEO**                     | Treść jest wstrzykiwana przez JS; roboty i sieci społecznościowe mogą nie „widzieć” pełnej strony bez renderowania JS (SSR/SSG to remedium).         |
| **Zależność od JavaScript** | Przy wyłączonym lub zablokowanym JS aplikacja często w ogóle nie działa – w klasycznym MPA podstawowa treść może być w HTML.                         |
| **Historia i zakładki**     | Trzeba dbać o sensowne URL-e, obsługę przycisku Wstecz i odświeżania; hash lub History API wymagają świadomej konfiguracji.                          |
| **Pamięć i stan**           | Stan trzymany w pamięci; odświeżenie strony może go zresetować – potrzeba persistence (localStorage, serwer) przy ważnych danych.                    |
| **Złożoność**               | Routing, stan, lifecycle widoków – to wszystko programista musi zorganizować sam lub przez framework; MPA z serwerem „dostarcza” nową stronę gotową. |

## Struktura

```
spa/
├── index.html          # Jedyny plik HTML – punkt wejścia (Vite go czyta z roota)
├── vite.config.js      # Opcjonalna konfiguracja Vite
├── styles.css          # Style globalne
└── src/
    ├── app.js          # Inicjalizacja, rejestracja widoków, obsługa routera
    ├── router.js       # Router hash-based (#/ścieżka)
    ├── components/
    │   └── header.js   # Współdzielony header z linkami
    └── views/
        ├── home.js     # Widok strony głównej
        ├── about.js    # Widok „O nas”
        └── contact.js  # Widok „Kontakt”
```

## Rozbudowa

- **Nowy widok:** dodaj plik w `src/views/`, eksportuj funkcję zwracającą element DOM, zarejestruj ścieżkę w `app.js` przez `register("/ścieżka", widok)`.
- **Router:** w `router.js` można dodać parametry ścieżki (np. `#/user/123`) i dopasowanie do wzorców.
- **Stan:** można dodać prosty obiekt stanu w `app.js` i przekazywać go do widoków, żeby zapamiętywać dane między „stronami”.
