4. Metoda Sokratejska

Kontekst to klucz do skutecznej współpracy z AI, ale nawet najlepsze modele AI nie potrafią pozyskać go w sposób automatyczny. Można to odczuć szczególnie mocno wtedy, kiedy opisujesz problem najlepiej, jak potrafisz, podajesz wszystkie znane Ci szczegóły, ale odpowiedź modelu wciąż jest zbyt ogólna, niepraktyczna lub po prostu nie trafia w sedno. Czujesz, że utknąłeś, bo nie masz pojęcia, jakie jeszcze informacje mogłyby pomóc AI w wygenerowaniu idealnego rozwiązania. To częsty problem – wiemy, jaki jest cel, ale nie jesteśmy pewni, jakie detale są kluczowe dla jego osiągnięcia.

W takich chwilach, zamiast samemu zgadywać, czego może potrzebować model, odwróć role i pozwól aby to on przejął inicjatywę. Właśnie na tym polega tzw. Metoda Sokratejska.

Metoda Sokratejska to prosta, ale niezwykle skuteczna technika polegająca na dodaniu do prompta polecenia, które zmusza model do zadawania pytań doprecyzowujących. Zamiast dostarczać gotową, ale potencjalnie niekompletną specyfikację, prosisz AI, aby samo zidentyfikowało luki w Twoim opisie.

Kluczowy zwrot, który odmieni Twoją rozmowę z AI:

Zanim rozpoczniesz pracę, zadaj mi [5-10] pytań, które pomogą Ci lepiej zrozumieć mój obecny kontekst, docelowe oczekiwania oraz wszystko to, o czym mogłem zapomnieć.

Zobaczmy, jak to działa w praktyce.

Scenariusz: Budowa silnika rekomendacji

Wyobraź sobie, że masz za zadanie stworzyć system rekomendacji dla platformy e-commerce.

🛑 Prompt standardowy (ryzyko ogólnikowej odpowiedzi):

Potrzebuję kodu w Pythonie do silnika rekomendacji produktowej dla sklepu internetowego. Użyj biblioteki scikit-learn.

Odpowiedź na taki prompt będzie prawdopodobnie poprawna technicznie, ale generyczna. Otrzymasz przykład oparty na losowych danych, który niewiele Ci powie o wdrożeniu go w Twoim konkretnym przypadku.

✅ Prompt z Metodą Sokratejską (gwarancja dopasowania):

Potrzebuję kodu w Pythonie do silnika rekomendacji produktowej dla sklepu internetowego. Użyj biblioteki scikit-learn.

Zanim rozpoczniesz, zadaj mi 10 pytań, które pomogą Ci lepiej zrozumieć specyfikę mojego biznesu i wymagania techniczne.

Nagle rozmowa nabiera zupełnie innej dynamiki. Model, zamiast generować kod, może zadać następujące pytania:

Jakie typy danych o użytkownikach i produktach posiadasz (np. historia zakupów, oceny, kliknięcia, atrybuty produktów)?

Czy rekomendacje mają być generowane w czasie rzeczywistym, czy mogą być obliczane wsadowo (np. raz na dobę)?

Jaki jest główny cel rekomendacji: zwiększenie sprzedaży (cross-selling), odkrywanie nowości czy personalizacja strony głównej?

Jak duży jest zbiór danych (liczba użytkowników, produktów, interakcji)?

Jakiego rodzaju rekomendacji potrzebujesz: opartej na współpracy (inni użytkownicy kupili...), na treści (podobne produkty) czy hybrydowej?

W jaki sposób planujesz mierzyć skuteczność silnika rekomendacji?

Jaka jest obecna architektura technologiczna (baza danych, język backendu)?

Czy system ma radzić sobie z problemem "zimnego startu" (nowi użytkownicy/produkty)?

Czy istnieją jakieś ograniczenia biznesowe (np. nie rekomenduj produktów z niskim marginesem)?

Jaki jest Twój poziom zaawansowania w temacie machine learningu, abym mógł dostosować złożoność kodu i wyjaśnień?

Odpowiadając na te pytania, dostarczasz modelowi niezwykle bogaty kontekst, który pozwala mu stworzyć rozwiązanie skrojone na miarę.

Metoda Sokratejska to Twoja tajna broń na sytuacje, w których czujesz, że Twój opis problemu jest niewystarczający. Zamiast biernie czekać na odpowiedź, aktywnie angażujesz AI w proces definiowania wymagań. Przenosisz ciężar identyfikacji kluczowych informacji z siebie na model, co pozwala odkryć "nieznane niewiadome" i drastycznie podnieść jakość końcowego rezultatu.

To zmiana myślenia: z wydawania poleceń na prowadzenie partnerskiego dialogu.
