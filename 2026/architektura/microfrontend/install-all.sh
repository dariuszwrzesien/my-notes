#!/bin/bash

# Instalacja wszystkich zależności w jednym skrypcie

echo "🚀 Instalacja zależności dla wszystkich projektów..."
echo ""

# Design System
echo "📦 Design System..."
cd design-system && npm install
cd ..

# Host
echo "📦 Host Application..."
cd host && npm install
cd ..

# Products MFE
echo "📦 Products MFE..."
cd mfe-products && npm install
cd ..

# Profile MFE
echo "📦 Profile MFE..."
cd mfe-profile && npm install
cd ..

echo ""
echo "✅ Wszystkie zależności zainstalowane!"
echo ""
echo "Aby uruchomić aplikację, otwórz 4 terminale i wykonaj:"
echo ""
echo "Terminal 1: cd design-system && npm run dev"
echo "Terminal 2: cd mfe-products && npm run dev"
echo "Terminal 3: cd mfe-profile && npm run dev"
echo "Terminal 4: cd host && npm run dev"
echo ""
echo "Następnie otwórz http://localhost:5000"
