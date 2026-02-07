#!/bin/bash

# Start wszystkich aplikacji w trybie preview (production build)
# Najpierw buduje wszystkie aplikacje, potem uruchamia serwery preview

echo "🏗️  Budowanie i uruchamianie wszystkich aplikacji w trybie preview..."
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

# Build wszystkich aplikacji
echo "📦 Krok 1/5: Budowanie Design System..."
cd design-system && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build Design System nie powiódł się!"
    exit 1
fi
cd ..

echo ""
echo "📦 Krok 2/5: Budowanie Products MFE..."
cd mfe-products && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build Products MFE nie powiódł się!"
    exit 1
fi
cd ..

echo ""
echo "📦 Krok 3/5: Budowanie Profile MFE..."
cd mfe-profile && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build Profile MFE nie powiódł się!"
    exit 1
fi
cd ..

echo ""
echo "📦 Krok 4/5: Budowanie Host Application..."
cd host && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build Host nie powiódł się!"
    exit 1
fi
cd ..

echo ""
echo "✅ Krok 5/5: Wszystkie buildy zakończone sukcesem!"
echo ""
echo "🚀 Uruchamianie serwerów preview..."
echo ""

# Funkcja do uruchamiania preview
run_preview() {
    npx concurrently \
        --names "DS,HOST,PRODUCTS,PROFILE" \
        --prefix "[{name}]" \
        --prefix-colors "cyan,green,yellow,magenta" \
        --kill-others \
        "cd design-system && npm run preview -- --host" \
        "cd host && npm run preview -- --host" \
        "cd mfe-products && npm run preview -- --host" \
        "cd mfe-profile && npm run preview -- --host"
}

echo "🎨 Design System  → http://localhost:5001"
echo "🏠 Host           → http://localhost:5000"
echo "🛍️  Products MFE   → http://localhost:5002"
echo "👤 Profile MFE    → http://localhost:5003"
echo ""
echo "🌐 Otwórz: http://localhost:5000"
echo ""
echo "💡 Aby zatrzymać wszystkie serwisy: Ctrl+C"
echo ""
echo "ℹ️  To jest tryb preview (production build):"
echo "   - Kod jest zminifikowany"
echo "   - Brak Hot Module Replacement"
echo "   - Podobne do produkcji"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Uruchom preview
run_preview

# Jeśli concurrently zostanie zatrzymane (Ctrl+C)
echo ""
echo "👋 Wszystkie serwisy zatrzymane!"
