Meta-prompting w praktyce: Uniwersalny szablon

Poniżej znajduje się szablon, który możesz wykorzystać za każdym razem, gdy Twój prompt nie przynosi oczekiwanych rezultatów. Składa się on z dwóch części: polecenia dla AI, aby ulepszyło Twój prompt, oraz miejsca na wklejenie Twojego oryginalnego, "słabego" polecenia.

Jesteś światowej klasy ekspertem od inżynierii promptów (prompt engineering). Twoim zadaniem jest przeanalizowanie i przepisanie poniższego, niedziałającego lub nieefektywnego polecenia, aby stało się ono precyzyjne, bogate w kontekst i w pełni zrozumiałe dla modelu językowego.

Obecne problemy, które musimy zaadresować:

- Model nie trzyma się zadanej w poleceniu długości odpowiedzi
- Model halucynuje i losowo przypisuje wersję frameworka X

Ulepszając prompt, skup się na następujących elementach:

1.  **Nadanie Roli:** Zaproponuj konkretną rolę lub personę dla AI (np. "Jesteś seniorem programistą Pythona", "Działaj jak ekspert od marketingu").
2.  **Dodanie Kontekstu:** Wzbogać prompt o niezbędne informacje, które pomogą modelowi zrozumieć cel i tło zadania.
3.  **Sprecyzowanie Celu:** Wyostrz cel polecenia, aby był jednoznaczny.
4.  **Zdefiniowanie Formatu:** Określ dokładny format wyjściowy odpowiedzi (np. tabela Markdown, lista JSON, fragment kodu).
5.  **Dodanie Ograniczeń:** Wprowadź zasady i ograniczenia, które ukierunkują odpowiedź (np. "Nie używaj biblioteki X", "Odpowiedź ma być zwięzła").

Po przepisaniu promptu, w osobnej sekcji zatytułowanej "Wyjaśnienie Zmian", krótko opisz, dlaczego wprowadziłeś dane modyfikacje i jak wpłyną one na jakość odpowiedzi.

Oto polecenie do poprawy:
[--- TUTAJ WKLEJ SWÓJ ORYGINALNY, SŁABY PROMPT ---]

PRZYKLAD:
Przykład ulepszonego prompta z Claude 4.1 Opus:

Prompt bazowy:

Wygeneruj serwis do walidacji formularzy w najnowszej dostępnej wersji frameworka Angular

Prompt ulepszony:

Jesteś doświadczonym architektem aplikacji Angular z 10-letnim doświadczeniem w budowaniu skalowalnych rozwiązań enterprise. Specjalizujesz się w najnowszych wzorcach projektowych i najlepszych praktykach Angular.

**Zadanie:** Zaprojektuj i zaimplementuj kompletny serwis do walidacji formularzy w Angular.

**Kontekst:** Serwis będzie wykorzystywany w aplikacji e-commerce obsługującej tysiące użytkowników dziennie. Musi wspierać zarówno walidację synchroniczną, jak i asynchroniczną (np. sprawdzanie unikalności emaila w bazie danych). Aplikacja będzie rozwijana przez zespół 5 programistów, więc kod musi być czytelny i łatwy w utrzymaniu.

**Wymagania techniczne:**

1. PRZED rozpoczęciem implementacji, użyj narzędzia web_search aby sprawdzić najnowszą stabilną wersję Angular (sprawdź oficjalną stronę angular.io lub npm)
2. Wykorzystaj Reactive Forms API
3. Zaimplementuj następujące walidatory:
   - Standardowe (required, email, min/max length, pattern)
   - Własne (PESEL, NIP, numer telefonu PL)
   - Asynchroniczne (sprawdzanie unikalności w API)
4. Obsłuż wielojęzyczne komunikaty błędów (i18n ready)
5. Zastosuj TypeScript strict mode
6. Dodaj obsługę walidacji cross-field (np. potwierdzenie hasła)

**Format odpowiedzi:**

1. Najpierw podaj informację o użytej wersji Angular (po sprawdzeniu aktualnej wersji)
2. Struktura plików (tree view)
3. Kod serwisu głównego z komentarzami
4. Przykładowe walidatory (2-3 najważniejsze)
5. Przykład użycia w komponencie
6. Testy jednostkowe dla kluczowych funkcjonalności

**Ograniczenia:**

- Używaj tylko wbudowanych możliwości Angular (bez zewnętrznych bibliotek walidacji)
- Kod ma być zgodny z Angular Style Guide
- Maksymalna złożoność cyklomatyczna metod: 10
- Wszystkie publiczne metody muszą mieć JSDoc
- Użyj standalone components (jeśli wersja >= 14)

**Dodatkowe wytyczne:**

- Priorytetyzuj wydajność - walidatory nie mogą blokować UI
- Zastosuj memoizację gdzie to możliwe
- Uwzględnij debouncing dla walidatorów asynchronicznych
