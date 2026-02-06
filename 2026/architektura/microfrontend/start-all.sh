#!/bin/bash

# Skrypt do uruchamiania wszystkich aplikacji równocześnie
# UWAGA: wymaga zainstalowanego 'concurrently'

echo "🚀 Uruchamianie wszystkich aplikacji..."
echo ""

# Sprawdź czy concurrently jest zainstalowane
if ! command -v concurrently &> /dev/null
then
    echo "❌ 'concurrently' nie jest zainstalowane"
    echo "Zainstaluj globalnie: npm install -g concurrently"
    echo ""
    echo "Lub uruchom aplikacje ręcznie w 4 terminalach:"
    echo ""
    echo "Terminal 1: cd design-system && npm run dev"
    echo "Terminal 2: cd mfe-products && npm run dev"
    echo "Terminal 3: cd mfe-profile && npm run dev"
    echo "Terminal 4: cd host && npm run dev"
    exit 1
fi

# Uruchom wszystkie aplikacje
concurrently \
  --names "DS,PRODUCTS,PROFILE,HOST" \
  --prefix-colors "cyan,green,yellow,magenta" \
  "cd design-system && npm run dev" \
  "cd mfe-products && npm run dev" \
  "cd mfe-profile && npm run dev" \
  "cd host && npm run dev"
