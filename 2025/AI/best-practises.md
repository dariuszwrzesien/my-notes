Rozpoczynaj sesję eksploracyjną od jasnego zdefiniowania ram problemu, ale unikaj przedwczesnego zawężania opcji. Zamiast pytać "jak najlepiej zrefaktoryzować ten moduł?", zapytaj "jakie są różne sposoby uporania się z problemami tego modułu?".

Wykorzystuj AI do generowania różnorodnych perspektyw. Możesz poprosić model o spojrzenie na problem z punktu widzenia różnych ról: architekta systemu, testera, specjalisty od bezpieczeństwa, product managera czy osoby odpowiedzialnej za koszty. Każda z tych perspektyw może ujawnić aspekty, które wcześniej były niewidoczne.

Stawiaj na iteracyjną eksplorację. Rozpocznij od szerokiego przeglądu opcji, a następnie zagłębiaj się w najbardziej obiecujące kierunki. AI doskonale radzi sobie z tym rodzajem "drążenia" - może rozwijać każde podejście na coraz bardziej szczegółowe poziomy, od strategii biznesowej przez taktyki techniczne po konkretne narzędzia i biblioteki.

Dokumentuj proces eksploracji, najlepiej w formie notatki w pliku markdown. AI może pomóc w organizowaniu zebranych pomysłów, grupowaniu podobnych podejść czy identyfikowaniu zależności między różnymi opcjami. Ta dokumentacja będzie bezcenna podczas późniejszego podejmowania decyzji i może służyć jako punkt odniesienia dla podobnych wyzwań w przyszłości.

### Najczęstsze błędy

Jednym z najczęstszych błędów jest zbyt wczesne przejście do szczegółów implementacji. Gdy AI zaproponuje interesujące podejście, naturalne jest, że chcemy od razu dowiedzieć się "jak to dokładnie zrobić?". Problem polega na tym, że można przegapić inne, potencjalnie lepsze opcje, które model mógłby zaproponować, gdyby miał więcej czasu na eksplorację.

Kolejnym błędem jest przyjmowanie pierwszego rozwiązania, które "brzmi sensownie". AI ma tendencję do przedstawiania opcji w sposób przekonujący, ale to nie oznacza, że pierwsza propozycja jest optymalna. Warto zawsze poprosić o alternatywy lub kontrargumenty, szczególnie jeśli model wydaje się zbyt pewny swojej rekomendacji.

### Planowanie

Po udanej fazie eksploracji i wyborze konkretnego rozwiązania, wielu programistów popełnia kluczowy błąd - przechodzi bezpośrednio do implementacji z promptami w stylu "zaimplementuj ten pomysł" lub "napisz kod dla tej funkcjonalności". To podejście prowadzi do chaotycznego procesu, w którym AI generuje kod fragmentami, często tracąc z oczu szerszy kontekst i architekturę rozwiązania.

Prompt do planowania:
“Utwórz szczegółowy plan działania zawierający analizę wymagań, projekt architektury, obsługę edge case’ów, obsługę błędów, testy, decyzje do podjęcia, rabbit holes i listę zadań do zaimplementowania”.

Przejmij kontrolę nad rozmową

Kluczem do uniknięcia pochlebstw jest zmiana sposobu zadawania pytań. Zamiast szukać potwierdzenia (🛑 Czy to dobry pomysł?), korzystaj z analizy (✅ Jakie są wady i zalety tego pomysłu?) i unikaj sugerowania twoich preferencji.

Oto 5 przykładowych technik promptowania, które zmuszą model do krytycznego myślenia i dostarczą Ci znacznie bardziej wartościowych odpowiedzi.

1. Adwokat diabła

Ten prompt zmusza model do aktywnego szukania słabości w Twoim rozumowaniu.

Rozważam {{wprowadzenie etapu intensywnego testowania przed deploymentem, pracując w metodologii Agile}}.

Działaj jako skrajnie sceptyczny i doświadczony architekt oprogramowania. Bądź moim adwokatem diabła. Twoim jedynym zadaniem jest znalezienie wszystkich możliwych słabości, ukrytych kosztów, ryzyk technologicznych i powodów, dla których ten pomysł może się nie powieść w praktyce.

2. Porównanie alternatyw

Zamiast skupiać się na jednym rozwiązaniu, poproś o analizę konkurencyjnych opcji.

Rozważam {{wprowadzenie etapu intensywnego testowania przed deploymentem, pracując w metodologii Agile}}.

Zamiast oceniać mój wybór, przedstaw mi trzy najlepsze alternatywne podejścia. Dla każdego z nich stwórz tabelę porównawczą w formacie Markdown, uwzględniającą: koszt, skalowalność, krzywą uczenia się i kluczowe ograniczenia.

3. Analiza 'Pre-Mortem

To niezwykle skuteczna technika kreatywnego myślenia, która polega na wyobrażeniu sobie porażki projektu, zanim się jeszcze zaczął.

W moim zespole wdrożyliśmy {{etap intensywnego testowania przed deploymentem, pracując w metodologii Agile}}.

Niestety, pomysł okazał się on kompletną katastrofą. Napisz szczegółową analizę 'pre-mortem', wyjaśniając krok po kroku, jakie błędne założenia, decyzje technologiczne i niedocenione ryzyka doprowadziły do tej porażki.

4. Zmiana ról i perspektyw

Każdy problem wygląda inaczej z różnych punktów widzenia. Poproś AI, aby je zasymulowało.

Rozważam {{wprowadzenie etapu intensywnego testowania przed deploymentem, pracując w metodologii Agile}}.

Twoim zadaniem jest wyczucie odbioru tego pomysłu przez poszczególnych członków mojego zespołu, tj.:

a) frontend developera
b) specjalisty ds. bezpieczeństwa
c) Chief Revenue Officera

Rozważ jak mój pomysł wpłynie na ich codzienną pracę oraz priorytety i motywację do efektywnej pracy w dłuższej perspektywie. Przedstaw uwagi każdej z tych osób w osobnych sekcjach. W przypadku negatywnego odbioru pomysłu przez conajmniej jedną z tych ról, zaproponuj bardziej korzystną alternatywę zgodną z dobrymi praktykami.

5. Poszukiwanie 'nieznanych niewiadomych'

Ten prompt jest idealny do odkrywania rzeczy, o których nawet nie wiesz, że powinieneś o nie zapytać.

Rozważam {{wprowadzenie etapu intensywnego testowania przed deploymentem, pracując w metodologii Agile}}.

Jakie są 'nieznane niewiadome' w tym podejściu, o których powinienem wiedzieć przed rozpoczęciem pracy?

### Ratowanie problematycznych konwersacji

Gdy stwierdzimy, że konwersacja zeszła na manowce, najlepszym rozwiązaniem jest poproszenie modelu o podsumowanie dotychczasowych wniosków i rozpoczęcie nowego wątku z odświeżonym kontekstem

PROMPT:

Zatrzymajmy się na chwilę i przeanalizujmy dotychczasową konwersację. Czuję, że zamiast zbliżać się do rozwiązania, zaczynamy kręcić się w kółko i wprowadzać więcej problemów niż rozwiązujemy.

Potrzebuję od Ciebie szczegółowego, obiektywnego podsumowania naszej dotychczasowej pracy, które pomoże mi rozpocząć nową konwersację z czystym kontekstem. Skup się na konkretach, nie na ogólnikach.

**Co działa i powinno zostać zachowane:**
Opisz wszystkie elementy, które zostały poprawnie zaimplementowane i nie wymagają zmian. Dla każdego elementu wyjaśnij dlaczego działa dobrze i jakie konkretnie wymaganie spełnia.

**Gdzie nasze podejście zawiodło:**
Zidentyfikuj momenty w tej konwersacji, w których zaczęliśmy schodzić na manowce. Jakie decyzje implementacyjne okazały się błędne? Które próby naprawy pogarszały sytuację zamiast ją poprawiać? Bądź szczegółowy - zamiast "kod nie działa", opisz precyzyjnie jakie zachowanie obserwujemy, czego oczekujemy, oraz jakie konkretne błędy występują.

**Czego się nauczyliśmy:**
Jakie nowe informacje odkryliśmy w trakcie eksperymentów? Które z pierwotnych założeń okazały się niepełne lub nieprecyzyjne? Czy pojawiły się dodatkowe wymagania lub ograniczenia, których nie uwzględniliśmy na początku?

**Zaktualizowany kontekst problemu:**
Na podstawie wszystkich powyższych wniosków sformułuj kompletny opis problemu, jaki powinienem przekazać w nowej konwersacji. Ten opis powinien być na tyle szczegółowy, że niezależny programista mógłby zrozumieć co dokładnie próbujemy osiągnąć, bez dostępu do tej konwersacji.

Zapisz podsumowanie w conversation-summary-{timestamp}.md

### Diagramy i schematy

Zamiast na pórbować wygenerować obrazek, możemy skorzystać z możliwości napisania przez AI strony internetowej z jakimś diagamem, wtedy jako output mozemy wpisać HTML/CSS, możemy poeksperymetować także z formatem ASCII ART warto również zaintereoswac się formatem Mermaid. Format LateX pomoze nam z generowaniem funckji matematycznych lub warto też opeksperymetować z SVG który także opiera sie na tekscie.

PROMPTY:

HTML/CSS Three.js
Utwórz aplikację HTML + JavaScript + CSS z wykorzystaniem Three.js, która zawiera schemat uproszczonej architektury trójwarstwowej (klient, serwer aplikacji, baza danych), pokazując przepływ zapytania od klienta do bazy i z powrotem. Do każdej warstwy dodaj etykiety w języku polskim wyjaśniające znaczenie danych elementó

ASCII ART
Utwórz wizualizację uproszczonej architektury trójwarstwowej (klient, serwer aplikacji, baza danych), pokazując przepływ zapytania od klienta do bazy i z powrotem. Do każdej warstwy dodaj etykiety w języku polskim wyjaśniające znaczenie danych elementów.. Zastosuj format ASCII ART

Diagramy Mermaid (https://mermaid.js.org/)

Przedstaw cykl życia zapytania HTTP z formularza na serwer, z zachowaniem produkcyjnych elementów aplikacji webowej (Load Balancer, Web Server, API, Baza Danych). Zastosuj format Mermaid jako diagram sekwencji.

SVG
Wygeneruj kod SVG dla ikony 'usuń'. Ikona powinna przedstawiać kosz na śmieci w minimalistycznym stylu, w kolorze #FF5252, o wymiarach 24x24 piksele, z zaokrąglonymi rogami.

LateX

Wyjaśnij działanie funkcji aktywacji Sigmoid używanej w sieciach neuronowych i przedstaw jej wzór matematyczny w formacie LaTeX.

Tabele Markdown

Mam listę zależności w projekcie: react, react-dom, typescript, eslint, prettier. Stwórz tabelę w formacie Markdown, która będzie zawierać nazwę biblioteki, jej typ (np. 'production', 'development') i krótki opis przeznaczenia.
