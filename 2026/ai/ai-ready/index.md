# The AI-Ready Software Developer: Conclusion – Same Game, Different Dice

Minęły ponad cztery lata od pojawienia się pierwszego „AI” asystenta do kodowania, **GitHub Copilot**, i dziś dowody są jasne. Twierdzenia o zespołach osiągających 2x, 5x, a nawet 10x wzrost produktywności po prostu nie wytrzymują konfrontacji z faktami. Nie brakuje anegdot, ale twardych danych – ani śladu. Gdy tylko zaczynamy to mierzyć, zyski w tajemniczy sposób znikają.

Rzeczywisty zakres, gdy mierzymy efekty na poziomie zespołu – takie jak _lead time_ dostarczenia czy stabilność wydań – to około **0,8x–1,2x**, przy czym negatywne skutki są wyraźnie częstsze niż pozytywne.

I wiemy dlaczego. **Szybsze samochody ≠ szybszy ruch uliczny.** Zyski w generowaniu kodu, według najnowszego raportu **DORA State of AI-Assisted Software Development**, w większości zespołów giną w „chaosie downstream”.

Kodowanie nigdy nie było wąskim gardłem w wytwarzaniu oprogramowania, a optymalizowanie elementu, który nie jest wąskim gardłem, w systemie posiadającym realne ograniczenia, tylko pogarsza sytuację w tych faktycznych wąskich gardłach.

Zamiast zwiększać produktywność zespołu, dla większości użytkowników „AI” narzędzie to w praktyce ich **spowalnia**, a przy tym negatywnie wpływa na niezawodność i utrzymywalność produktu lub systemu. Tworzą gorsze oprogramowanie, później.

Większość z tych zespołów oczywiście nie jest tego świadoma. Podłączyli do swojej „instalacji developerskiej” hydrant generujący kod. Biznes pyta, dlaczego nie ma obiecanego „power shower”, a zespoły mierzą ciśnienie wody wychodzącej z węża (linie kodu, commity, Pull Requesty), zamiast mierzyć to, co wypływa z prysznica (wyniki biznesowe) – bo tamte liczby wyglądają znacznie bardziej imponująco.

Zespoły, które widzą poprawę _lead time_ o 5%, 10%, 15%, bez pogorszenia niezawodności i bez zwiększania kosztu zmian, robią to tak, jak robiły zawsze:

- **Pracują w małych partiach**, rozwiązując jeden problem naraz
- **Iterują szybko**, z ciągłym testowaniem, code review, refaktoryzacją i integracją
- **Projektują silnie modularne architektury**, ograniczające „promień rażenia” zmian
- **Organizują się wokół efektów end-to-end**, a nie wokół ról czy specjalizacji technologicznych
- **Działają z dużą autonomią**, podejmując decyzje na miejscu zamiast eskalować je w górę hierarchii

Gdy obserwuję zespoły sklasyfikowane przez DORA jako „high-performing” i „elite”, używające narzędzi takich jak **Claude Code** czy **Cursor**, widzę skracanie pętli informacji zwrotnej. Partie pracy stają się jeszcze mniejsze, bramki jakości węższe, iteracje szybsze. Trzymają „AI” na bardzo krótkiej smyczy – i to samo w sobie może tłumaczyć poprawę wyników.

Tymczasem większość zespołów robi coś przeciwnego. Próbują szczegółowo specyfikować duże zakresy pracy z góry. Pozwalają „agentom AI” przegryzać się przez długie zadania o szerokim wpływie, generując lub modyfikując setki, a nawet tysiące linii kodu, podczas gdy developerzy idą – mówiąc obrazowo – do pubu.

A potem oczywiście testują i sprawdzają za późno, zbyt pobieżnie – „wygląda okej”. Pokładają zbyt duże zaufanie w technologii, polegając na „regułach” i „guardrailsach” zapisanych w plikach Markdown, o których wiemy, że LLM-y interpretują błędnie i losowo ignorują, trzymając ledwie jedną rękę na kierownicy.

Z moich obserwacji wynika, że żaden zespół faktycznie odnoszący sukces z tą technologią tak nie pracuje. **Oni trzymają obie ręce na kierownicy. To oni prowadzą.** Jak ujął to Andrej Karpathy, „agentowe” rozwiązania budowane na LLM-ach nie są dziś wystarczająco niezawodne, by zostawić je samym sobie.

Może minąć wiele lat, zanim takie będą. A może nigdy. Mechanika statystyczna sugeruje, że osiągnięcie rzędu wielkości poprawy dokładności potrzebnej do realnej niezawodności (błąd 2% zamiast 20%) mogłoby wymagać **10²⁰ razy większej mocy obliczeniowej do treningu**. Aby zrobić to w podobnym czasie jak dzisiejsze modele hyperscale, potrzebne byłyby (w liczbie mnogiej) Sfery Dysona jako źródło energii.

Każdy autonomiczny programista – człowiek czy maszyna – wymaga **Prawdziwej Inteligencji**: zdolności rozumowania, uczenia się, planowania i rozumienia. Nie ma powodu sądzić, że technologia oparta wyłącznie na _deep learningu_ kiedykolwiek będzie w stanie to osiągnąć – niezależnie od tego, jak przekonująco potrafi to naśladować i jak bardzo ją skalujemy. LLM-y są niemal na pewno ślepą uliczką w drodze do AGI.

Z tego powodu powstrzymywałem się od spekulacji, jak dobra ta technologia może się stać w przyszłości, mimo że cała propozycja wartości płynąca z laboratoriów frontier koncentruje się na przyszłych możliwościach. Złoto zawsze wydaje się być za kolejnym wzgórzem.

Zamiast tego skupiłem się na eksperymentach i nauce w oparciu o dzisiejszą rzeczywistość. A ta rzeczywistość – z którą prawdopodobnie będziemy żyć jeszcze długo – jest taka, że **LLM-y są niewiarygodnymi narratorami. Kropka.** Każde podejście, które nie uwzględnia tego faktu, jest skazane na porażkę.

Nie znaczy to jednak, że nie możemy ograniczać „halucynacji” i konfabulacji, a tym samym chaosu downstream.

LLM-y działają lepiej – są mniej zawodne – gdy stawiamy im problemy dobrze reprezentowane w ich danych treningowych. Błędy zwykle wynikają z wyjścia poza rozkład danych: gdy zadania są zbyt złożone, zbyt nowe lub zbyt niszowe.

Poproś o jedną rzecz w typowej domenie problemowej – szansa na poprawny wynik rośnie. Poproś o 10 rzeczy albo coś z długiego ogona rzadkich przykładów – wchodzimy w strefę „halucynacji”.

**Doprecyzowanie za pomocą przykładów** (np. testów) zmniejsza niejednoznaczność semantyczną wejścia i redukuje ryzyko błędnej interpretacji. Jest to szczególnie pomocne przy pracy z kodem, bo próbki treningowe często są sparowane z takimi przykładami. Dają modelowi więcej punktów odniesienia.

**Kontekst powinien być mały i ściśle związany z aktualnym zadaniem.** Jak mały? Badania sugerują, że efektywnie użyteczny kontekst nawet w modelach frontier jest rzędy wielkości mniejszy niż deklarowany. Przekroczenie 1000 tokenów prawdopodobnie generuje błędy, ale nawet 100 tokenów może być problematyczne.

Rozmycie uwagi, dryf, „zapadanie się prawdopodobieństwa” (zagraj z modelem w szachy, a zobaczysz), czy efekt „lost in the middle” sprawiają, że szanse na przestrzeganie wszystkich zasad z pliku `CLAUDE.md` albo wszystkich wymagań dużej funkcji są znikome. Modele nie są w stanie dokładnie śledzić tak wielu rzeczy naraz.

A nawet gdyby mogły, dopasowywanie się jednocześnie do dziesiątek kryteriów niemal nieuchronnie wyprowadza je poza rozkład danych.

Dlatego rozsądne podejście koncentruje się na jednym problemie naraz i jednej regule naraz, w szybkich iteracjach, z testowaniem i inspekcją po każdym kroku, aby upewnić się, że wszystko jest w porządku przed zatwierdzeniem zmiany (pojedynczej) i przejściem dalej.

Gdy coś nie jest w porządku – np. testy zaczynają się sypać – robi się twardy reset i próbuje ponownie, ewentualnie dzieląc zadanie na mniejsze, bardziej „in-distribution” kroki. A jeśli model zawiedzie 2–3 razy, pisze się kod samodzielnie, by wyjść z „doom loop”.

Będą momenty – i to liczne – gdy będziesz pisał, poprawiał lub naprawiał kod sam. Nadmierne poleganie na narzędziu może prowadzić do zaniku umiejętności, więc warto utrzymywać je w formie.

Trzeba też być na bieżąco z kodem. Gdy kod powstaje szybciej, niż jesteśmy w stanie go zrozumieć, szybko narasta „dług poznawczy”. A gdy przyjdzie go modyfikować ręcznie, zrozumienie go zajmie znacznie więcej czasu.

To wzmacnia też problem „wygląda dobrze”, w połączeniu z naszą własną wersją efektu amnezji Gell-Manna. Często słyszę: „Z <językiem, który znam dobrze> sobie nie radzi, ale w <języku, który ledwo znam> jest świetny”. Im mniej rozumiemy wynik, tym mniej widzimy brązowych M&M’sów w misce.

„Agentowe” asystenty kodowania rzekomo potrafią rozkładać złożone problemy na mniejsze kroki i planować duże fragmenty pracy. Nawet jeśli potrafią – a pamiętajmy, że LLM-y nie rozumują i nie planują, tylko generują wiarygodnie wyglądające rozumowanie i plany – nie oznacza to, że możemy kliknąć „Play” i odejść od komputera. Trzeba sprawdzać efekty na każdym kroku i być gotowym przejąć stery, gdy model nieuchronnie skręci w złą stronę.

Wielu developerów zauważa, że dokładność LLM-ów dramatycznie spada przy zmianach w kodzie bez separacji odpowiedzialności. Wiemy dlaczego. Modyfikowanie dużych modułów z wieloma zależnościami oznacza większy kontekst. A to znów wyprowadza model poza rozkład danych.

Najciekawsze jest to, że zespoły, które według DORA odnoszą sukces z „AI”, już wcześniej pracowały w ten sposób. Praktyki takie jak **TDD**, **refaktoryzacja**, **modularne projektowanie** i **Continuous Integration** są wysoce kompatybilne z asystentami „AI”. A właściwie – nie tylko kompatybilne, lecz wręcz niezbędne.

Nie powinno to dziwić. Wytwarzanie oprogramowania – z „AI” czy bez – jest z natury niepewne. Czy to naprawdę to, czego potrzebuje użytkownik? Czy ta architektura się skaluje? Jak użyć tej nowej biblioteki? Jak zmusić Javę, by zrobiła to czy tamto?

Jedna niewiadoma za drugą. Skuteczne zespoły nie pozwalają, by ta niepewność się kumulowała. Nie dokładają spekulacji do spekulacji. Odsłaniają karty w trakcie rozdania. Małe kroki, szybki feedback. Adaptacja do rzeczywistości, która właśnie się ujawnia.

Zamiast „zmieniać zasady gry”, probabilistyczne asystenty kodowania „AI” po prostu dodały kolejną warstwę niepewności. Ta sama gra, inne kości.

Ci z nas, którzy od dekad promują i uczą tych praktyk, mogą mieć ostatni śmiech – gdy coraz więcej zespołów odkryje, że to naprawdę jedyny skuteczny sposób, by pić z hydrantu.

Zródło:
https://codemanship.wordpress.com/2026/01/05/the-ai-ready-software-developer-conclusion-same-game-different-dice/?ref=dailydev
