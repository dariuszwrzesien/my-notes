#!/bin/bash

# Start wszystkich aplikacji w trybie development
# Wymaga zainstalowanych zależności (uruchom install-all.sh)

echo "🚀 Uruchamianie wszystkich aplikacji w trybie development..."
echo ""

# Sprawdź czy node_modules istnieją
if [ ! -d "design-system/node_modules" ] || [ ! -d "host/node_modules" ] || [ ! -d "mfe-products/node_modules" ] || [ ! -d "mfe-profile/node_modules" ]; then
    echo "❌ Brak node_modules! Najpierw uruchom: ./install-all.sh"
    exit 1
fi

# Sprawdź czy npx jest dostępny
if ! command -v npx &> /dev/null; then
    echo "❌ npx nie jest dostępny! Zainstaluj Node.js."
    exit 1
fi

# Sprawdź czy concurrently jest zainstalowane globalnie lub można je użyć przez npx
echo "📦 Sprawdzanie dostępności concurrently..."

# Funkcja do uruchamiania aplikacji
run_apps() {
    npx concurrently \
        --names "DS,HOST,PRODUCTS,PROFILE" \
        --prefix "[{name}]" \
        --prefix-colors "cyan,green,yellow,magenta" \
        --kill-others \
        "cd design-system && npm run dev" \
        "cd host && npm run dev" \
        "cd mfe-products && npm run dev" \
        "cd mfe-profile && npm run dev"
}

echo ""
echo "🎨 Design System  → http://localhost:5001"
echo "🏠 Host           → http://localhost:5000"
echo "🛍️  Products MFE   → http://localhost:5002"
echo "👤 Profile MFE    → http://localhost:5003"
echo ""
echo "⏳ Czekaj na 'ready in' w każdym serwisie..."
echo "🌐 Potem otwórz: http://localhost:5000"
echo ""
echo "💡 Aby zatrzymać wszystkie serwisy: Ctrl+C"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Uruchom aplikacje
run_apps

# Jeśli concurrently zostanie zatrzymane (Ctrl+C)
echo ""
echo "👋 Wszystkie serwisy zatrzymane!"
