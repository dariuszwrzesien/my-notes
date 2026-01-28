# Problemy w component-based pattern i ich rozwiązania

## 1. Zbyt silne powiązanie komponentów (tight coupling)

**Problem:** Komponenty zaczynają zależeć od siebie nawzajem na poziomie logiki biznesowej.

**Przykład:** Komponent `Button` zawiera logikę usuwania wiersza z `Table`. Ten sam przycisk chcemy później użyć np. do dodania produktu do koszyka.

W efekcie komponent jest:

- trudny do ponownego użycia
- kontekstowo „skażony” niepasującą logiką

**Skutki:**

- niska reużywalność
- kruchy kod (zmiana w jednym miejscu psuje inne)
- trudniejsze testowanie

**Rozwiązanie:** Komponent powinien zawierać wyłącznie logikę, która do niego naturalnie należy.

**Dobre praktyki:**

- przenosić logikę biznesową do:
  - komponentów nadrzędnych
  - custom hooks
  - serwisów / handlerów
- używać:
  - callbacków (`onClick`, `onRemove`)
  - eventów
  - dependency injection

---

## 2. Problemy ze skalowalnością (scalability issues)

**Problem:** Każdy komponent wykonuje własne zapytania do backendu.

**Przykład:**

- komponent `Post` pobiera dane po `postId`
- przy 2000 postów:
  - 2000 requestów na raz
  - brak paginacji
  - przeciążenie backendu i frontendu

**Skutki:**

- słaba wydajność
- wolne renderowanie
- problemy z UX i kosztami infrastruktury

**Rozwiązanie:** Oddziel pobieranie danych od komponentów prezentacyjnych.

**Dobre praktyki:**

- jeden request zbiorczy (np. lista postów)
- paginacja / infinite scroll
- cache (np. React Query / RTK Query)
- komponenty:
  - **prezentacyjne** → tylko renderują
  - **kontenerowe** → zarządzają danymi

> Komponent ≠ miejsce do ciężkich requestów

---

## 3. Rozrastające się i przeładowane komponenty (component bloating)

**Problem:** Jeden komponent:

- zawiera za dużo logiki
- obsługuje wiele odpowiedzialności
- staje się trudny do zrozumienia i utrzymania

**Częsty błąd:** „Nie dzielę komponentu, bo i tak nigdzie indziej go nie użyję”.

**Skutki:**

- spadek czytelności
- trudna refaktoryzacja
- problemy z testami
- gorsza wydajność

**Rozwiązanie:** Stosuj zasadę Single Responsibility Principle.

**Dobre praktyki:**

- dziel komponenty, gdy:
  - logika zaczyna „puchnąć”
  - komponent robi więcej niż jedną rzecz
- podział:
  - logika → hooki
  - UI → mniejsze komponenty
- reużywalność ≠ jedyny cel komponentów

> Małe komponenty = łatwiejsze utrzymanie

---

## Kluczowe wnioski końcowe

Component-based pattern **nie gwarantuje** dobrej architektury sam z siebie.

**Najczęstsze zagrożenia:**

- tight coupling
- niekontrolowane requesty
- łamanie single responsibility

**Rozwiązania:**

- separacja odpowiedzialności
- komponenty „głupie” + logika poza nimi
- wczesne refaktoryzacje
