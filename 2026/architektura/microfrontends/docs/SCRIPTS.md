# 🚀 Skrypty uruchamiające

Ten folder zawiera pomocnicze skrypty do zarządzania projektem microfrontendowym.

## 📦 install-all.sh

Instaluje zależności we wszystkich projektach (Design System, Host, Products MFE, Profile MFE).

```bash
chmod +x install-all.sh
./install-all.sh
```

**Uruchom najpierw ten skrypt** przed próbą uruchomienia aplikacji.

## ⚡ start-all.sh (Development Mode)

Uruchamia wszystkie 4 aplikacje jednocześnie w trybie development.

```bash
chmod +x start-all.sh
./start-all.sh
```

### Co robi ten skrypt?

1. ✅ Sprawdza czy `node_modules` są zainstalowane
2. ✅ Sprawdza dostępność `npx` i `concurrently`
3. ✅ Uruchamia wszystkie aplikacje równocześnie:
   - Design System (port 5001)
   - Products MFE (port 5002)
   - Profile MFE (port 5003)
   - Host Application (port 5000)
4. ✅ Wyświetla kolorowe logi z nazwami aplikacji
5. ✅ Zatrzymuje wszystkie aplikacje przy Ctrl+C

### Zalety

- ⚡ Szybkie - jedna komenda zamiast 4 terminali
- 🎨 Czytelne - kolorowe logi z nazwami aplikacji
- 🔄 Hot Module Replacement - zmiany widoczne natychmiast
- 🛑 Łatwe zatrzymanie - Ctrl+C kończy wszystkie procesy

### Wady

- ❌ Wszystkie logi w jednym miejscu (trudniej debugować)
- ❌ Wymaga `concurrently` (instalowane przez npx)

## 📦 start-preview.sh (Production Mode)

Buduje wszystkie aplikacje i uruchamia je w trybie preview (symulacja produkcji).

```bash
chmod +x start-preview.sh
./start-preview.sh
```

### Co robi ten skrypt?

1. ✅ Sprawdza czy `node_modules` są zainstalowane
2. ✅ Buduje wszystkie aplikacje (`npm run build`):
   - Design System
   - Products MFE
   - Profile MFE
   - Host Application
3. ✅ Uruchamia serwery preview na tych samych portach
4. ✅ Wyświetla kolorowe logi

### Kiedy używać?

- 🧪 Testowanie production buildu lokalnie
- 🐛 Debugowanie problemów produkcyjnych
- 📦 Sprawdzenie rozmiaru bundli
- ⚡ Testowanie optymalizacji

### Różnice między dev a preview

| Feature         | Development (dev) | Preview (production)     |
| --------------- | ----------------- | ------------------------ |
| Build           | ❌ Nie            | ✅ Tak (`npm run build`) |
| Minifikacja     | ❌ Nie            | ✅ Tak                   |
| Source maps     | ✅ Pełne          | ⚠️ Zminifikowane         |
| HMR             | ✅ Tak            | ❌ Nie                   |
| Szybkość startu | ⚡ Bardzo szybka  | 🐢 Wolniejsza (build)    |
| Rozmiar bundli  | 📦 Większy        | 📦 Mniejszy              |

## 🔧 Ręczne uruchomienie

Jeśli wolisz kontrolować każdą aplikację osobno:

```bash
# Terminal 1 - Design System
cd design-system && npm run dev

# Terminal 2 - Products MFE
cd mfe-products && npm run dev

# Terminal 3 - Profile MFE
cd mfe-profile && npm run dev

# Terminal 4 - Host Application
cd host && npm run dev
```

### Zalety ręcznego uruchomienia

- ✅ Pełna kontrola nad każdą aplikacją
- ✅ Oddzielne logi w każdym terminalu
- ✅ Łatwiejsze debugowanie
- ✅ Możliwość restartu pojedynczej aplikacji

### Wady

- ❌ Wymaga 4 osobnych terminali
- ❌ Trzeba pamiętać o kolejności
- ❌ Więcej ręcznej pracy

## ⚠️ Troubleshooting

### "❌ Brak node_modules!"

```bash
# Rozwiązanie: zainstaluj zależności
./install-all.sh
```

### "❌ npx nie jest dostępny!"

```bash
# Rozwiązanie: zainstaluj Node.js
# macOS
brew install node

# Sprawdź instalację
node --version
npm --version
```

### "Permission denied"

```bash
# Rozwiązanie: nadaj uprawnienia wykonywalne
chmod +x install-all.sh
chmod +x start-all.sh
chmod +x start-preview.sh
```

### Port już zajęty

```bash
# Sprawdź który proces używa portu
lsof -i :5000  # lub :5001, :5002, :5003

# Zabij proces
kill -9 <PID>
```

### Aplikacja nie ładuje się

1. ✅ Sprawdź czy wszystkie 4 aplikacje są uruchomione
2. ✅ Sprawdź kolejność (Design System → MFEs → Host)
3. ✅ Sprawdź konsole przeglądarki (F12)
4. ✅ Sprawdź czy porty są dostępne

## 📊 Porty aplikacji

| Aplikacja            | Port     | URL                       |
| -------------------- | -------- | ------------------------- |
| 🎨 Design System     | 5001     | http://localhost:5001     |
| 🛍️ Products MFE      | 5002     | http://localhost:5002     |
| 👤 Profile MFE       | 5003     | http://localhost:5003     |
| 🏠 **Host (główna)** | **5000** | **http://localhost:5000** |

**Uwaga:** Otwórz tylko Host (5000) w przeglądarce. Pozostałe aplikacje są ładowane automatycznie.

## 🎓 Najlepsze praktyki

### Development

```bash
# Start: użyj start-all.sh
./start-all.sh

# Pracuj normalnie...
# (kod jest automatycznie przeładowywany)

# Stop: Ctrl+C
```

### Testowanie przed deploym

```bash
# 1. Build i preview
./start-preview.sh

# 2. Otwórz http://localhost:5000

# 3. Przetestuj funkcjonalność

# 4. Sprawdź Network tab (rozmiary bundli)

# 5. Zatrzymaj: Ctrl+C
```

### Debugowanie

```bash
# Uruchom ręcznie w 4 terminalach
# (łatwiej śledzić logi)

# Terminal 1
cd design-system && npm run dev

# Terminal 2
cd mfe-products && npm run dev

# Terminal 3
cd mfe-profile && npm run dev

# Terminal 4
cd host && npm run dev
```

## 🚀 Next Steps

Po uruchomieniu aplikacji:

1. ✅ Otwórz http://localhost:5000
2. ✅ Otwórz DevTools (F12) → Network tab
3. ✅ Zobacz jak ładują się `remoteEntry.js`
4. ✅ Kliknij po różnych stronach (Products, Profile)
5. ✅ Zmień coś w Design System i zobacz hot reload

Więcej informacji w:

- 📖 `README.md` - ogólny opis projektu
- 🚀 `GETTING_STARTED.md` - szczegółowy quick start
- ❓ `FAQ.md` - najczęstsze problemy i rozwiązania
- 🏗️ `ARCHITECTURE_DEEP_DIVE.md` - głęboka analiza architektury

## 📊 Porównanie skryptów

| Feature         | install-all.sh     | start-all.sh   | start-preview.sh | Ręczne               |
| --------------- | ------------------ | -------------- | ---------------- | -------------------- |
| Instalacja deps | ✅ Tak             | ❌ Nie         | ❌ Nie           | ❌ Nie               |
| Build           | ❌ Nie             | ❌ Nie         | ✅ Tak           | Ręcznie              |
| Dev mode        | N/A                | ✅ Tak         | ❌ Nie           | ✅ Tak               |
| Preview mode    | N/A                | ❌ Nie         | ✅ Tak           | Ręcznie              |
| HMR             | N/A                | ✅ Tak         | ❌ Nie           | ✅ Tak               |
| Jedna komenda   | ✅ Tak             | ✅ Tak         | ✅ Tak           | ❌ Nie (4 terminale) |
| Szybki start    | N/A                | ⚡ Najszybszy  | 🐢 Wolny (build) | 🐢 Ręczny            |
| Debugowanie     | N/A                | 🟡 Trudniejsze | 🟡 Trudniejsze   | ✅ Łatwe             |
| Rekomendacja    | 🥇 Zawsze pierwszy | 🥇 Development | 🥈 Testing prod  | 🥉 Debugging         |

### Kiedy którego użyć?

| Sytuacja                        | Użyj                              |
| ------------------------------- | --------------------------------- |
| 🆕 Pierwszy raz                 | `install-all.sh` → `start-all.sh` |
| 💻 Codzienne development        | `start-all.sh`                    |
| 🧪 Test production buildu       | `start-preview.sh`                |
| 🐛 Debugowanie jednej aplikacji | Ręczne uruchomienie               |
| 📦 Sprawdzenie rozmiarów bundli | `start-preview.sh`                |
| ⚡ Szybka iteracja              | `start-all.sh`                    |
| 🔍 Badanie logów                | Ręczne uruchomienie               |

---

**TIP:** Możesz też utworzyć aliasy w `.bashrc` lub `.zshrc`:

```bash
alias mfe-start='cd /path/to/microfrontend && ./start-all.sh'
alias mfe-preview='cd /path/to/microfrontend && ./start-preview.sh'
alias mfe-install='cd /path/to/microfrontend && ./install-all.sh'
```
