# Proces onboardingu z użyciem Ai

Jak wykorzystać potencjał Ai (Gemini 2.5 Pro) do analizy dużych projektów brownfield, na przykładzie Excalidraw - aplikacji open-source liczącej ponad 150 tysięcy linii kodu TypeScript i React.

## Wdrażanie się w duże projekty - jak to zrobić szybko i z głową?

Historia Git to nieocenione źródło wiedzy o projekcie, które często pozostaje niewykorzystane. Zapisana w niej ewolucja kodu stanowi mapę dla każdego, kto chce zrozumieć rzeczywistą strukturę i dynamikę rozwoju aplikacji.

W kontekście wprowadzania nowych deweloperów do projektu, analiza historii repozytorium pozwala w praktyczny sposób zastosować zasadę Pareto - zrozumienie 20% kluczowego kodu może dać nam 80% wiedzy o całym systemie, której potrzebujemy wdrażając się w codebase.

#### Skrypty git do analizy hotspotów

1. **Skrypt do analizy plików**

Ten skrypt identyfikuje najczęściej modyfikowane pliki w repozytorium w ciągu ostatniego roku, co pozwala określić hot spoty kodu - miejsca, gdzie zachodzi najwięcej zmian i które mogą wymagać szczególnej uwagi.

_Dla systemów Unix/Linux:_

```
git log --since="1 year ago" --pretty=format:"" --name-only --no-merges | \
  grep -vE "${EXCLUDE_PATTERN_GREP:-^$}" | \
  grep '.' | \
  sort | \
  uniq -c | \
  sort -nr | \
  head -n 10 | \
  awk '{count=$1; $1=""; sub(/^[ \t]+/, ""); print $0 ": " count " changes"}' | cat
```

Omówienie skryptu krok po kroku

```
git log --since="1 year ago" - pobiera historię commitów z ostatniego roku
--pretty=format:"" - usuwa opis commitów, zostawiając tylko nazwy plików
--name-only - wyświetla tylko nazwy zmienionych plików
--no-merges - wyklucza merge commity, co daje czystszy obraz zmian

grep -vE "${EXCLUDE_PATTERN_GREP:-^$}" - filtruje niechciane pliki według wzorca regex
grep '.' - usuwa puste linie

sort | uniq -c - zlicza wystąpienia każdego pliku
sort -nr - sortuje malejąco według liczby zmian

head -n 10 - wybiera 10 najczęściej modyfikowanych plików

awk '{...}' - formatuje wynik do czytelnej postaci "nazwa_pliku: X changes"
```

**Ustawianie EXCLUDE_PATTERN_GREP**

Zmienna EXCLUDE_PATTERN_GREP pozwala wykluczyć pliki według wzorca regex. Przykłady użycia:

- Wykluczenie plików konfiguracyjnych
  EXCLUDE_PATTERN_GREP='(\.yml$|\.yaml$|\.config\.js$)'

- Wykluczenie testów i dokumentacji
  EXCLUDE_PATTERN_GREP='(test|spec|docs?/)'

- Wykluczenie plików z node_modules i build
  EXCLUDE_PATTERN_GREP='(node_modules|dist|build|\.gitignore)'

- Złożony wzorzec - wyklucza wiele typów plików
  EXCLUDE_PATTERN_GREP='(\.svg$|\.png$|\.jpg$|package-lock\.json|yarn\.lock|\.md$)'

- Użycie w skrypcie

```
EXCLUDE_PATTERN_GREP='(test|spec)'
git log --since="1 year ago" --pretty=format:"" --name-only --no-merges | \
  grep -vE "${EXCLUDE_PATTERN_GREP:-^$}" | \
  grep '.' | \
  sort | \
  uniq -c | \
  sort -nr | \
  head -n 10 | \
  awk '{count=$1; $1=""; sub(/^[ \t]+/, ""); print $0 ": " count " changes"}' | cat
```

Właściwe EXCLUDE_PATTERN_GREP najłatwiej ustalić poprzez uruchomienie skryptu. Jeżeli rzucą nam się w oczy jakieś pliki, które trafią do top10 a niewiele wniosą do analizy hot spotów (np. package.json, pliki i18n, fonty) to warto dodać je do ścieżki wykluczeń.

_Dla Windows:_

Rekomendowanym sposobem jest wykorzystanie tego samego skryptów przez Git Bash lub Windows Subsystem for Linux (WSL). Alternatywnie przygotowaliśmy skrypt PowerShell:

```
git log --since="1 year ago" --pretty=format:"" --name-only --no-merges |
  Where-Object { $_ -match '\S' } |
  Where-Object { $_ -notmatch "" } |
  Group-Object |
  Sort-Object -Property Count -Descending |
  Select-Object -First 10 |
  ForEach-Object { "$($_.Name): $($_.Count) changes" }
```

2. **Skrypt do analizy modułów**

Kolejny skrypt analizuje, które moduły (katalogi) są najczęściej modyfikowane, dostarczając informacji o ogólnej strukturze projektu i kluczowych obszarach rozwoju.

_Dla systemów Unix/Linux:_

```
git log --since="1 year ago" --pretty=format:"" --name-only --no-merges | \
  grep -vE "${EXCLUDE_PATTERN_GREP:-^$}" | \
  grep '.' | \
  awk -F/ -v OFS=/ 'NF > 1 {$NF = ""; print $0 } NF <= 1 { print "." }' | \
  sed 's|/*$||' | \
  sed 's|^\\.$|project root|' | \
  sort | \
  uniq -c | \
  sort -nr | \
  head -n 10 | \
  awk '{count=$1; $1=""; sub(/^[ \t]+/, ""); print $0 ": " count " changes"}' | cat
```

_Dla Windows (PowerShell):_

```
git log --since="1 year ago" --pretty=format:"" --name-only --no-merges |
  Where-Object { $_ -match '\S' } |
  Where-Object { $_ -notmatch "(package\.json$|package-lock\.json$|yarn\.lock$|^node_modules/|^dist/|^build/|\.log$|\.svg$|\.png$|\.ico$|\.map$|\.d\.ts$|README\.md$|\.gitignore$|CHANGELOG\.md$|LICENSE$)" } |
  ForEach-Object {
    if ($_ -match "/") {
      $parts = $_ -split "/"
      $parts[0..($parts.Length-2)] -join "/"
    } else {
      "project root"
    }
  } |
  Group-Object |
  Sort-Object -Property Count -Descending |
  Select-Object -First 10 |
  ForEach-Object { "$($_.Name): $($_.Count) changes" }
```

3. **Skrypt do Analizy Kontrybutorów**

Ten skrypt identyfikuje najaktywniejszych kontrybutorów projektu, dostarczając informacji o tym, kto najlepiej zna repozytorium i poszczególne jego obszary.

_Dla systemów Unix/Linux:_

```
git log --since="1 year ago" --pretty=format:"%an <%ae>" --no-merges |\
  sort |\
  uniq -c |\
  sort -nr |\
  head -n 5 |\
  awk '{count=$1; $1=""; sub(/^[ \t]+/, ""); print $0 ": " count " commits"}'
```

_Dla Windows (PowerShell):_

```
git log --since="1 year ago" --pretty=format:"%an <%ae>" --no-merges |
  Group-Object |
  Sort-Object -Property Count -Descending |
  Select-Object -First 5 |
  ForEach-Object { "$($_.Name): $($_.Count) commits" }
```
