#!/bin/bash

# 🚀 Skrypt pomocniczy do zarządzania projektem WebSocket

set -e  # Zatrzymaj przy błędzie

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcje pomocnicze
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Sprawdź czy Node.js jest zainstalowany
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js nie jest zainstalowany!"
        echo "Zainstaluj Node.js z: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v)
    print_success "Node.js zainstalowany: $NODE_VERSION"
}

# Sprawdź czy npm jest zainstalowany
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm nie jest zainstalowany!"
        exit 1
    fi
    
    NPM_VERSION=$(npm -v)
    print_success "npm zainstalowany: $NPM_VERSION"
}

# Instalacja zależności
install_deps() {
    print_header "Instalacja zależności"
    
    # Backend
    print_info "Instaluję zależności backend..."
    cd backend
    npm install
    cd ..
    print_success "Backend - zależności zainstalowane"
    
    # Frontend
    print_info "Instaluję zależności frontend..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend - zależności zainstalowane"
}

# Sprawdź porty
check_ports() {
    print_header "Sprawdzanie portów"
    
    # Port 8080 (backend)
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        print_warning "Port 8080 jest zajęty!"
        echo "Zabij proces: lsof -ti:8080 | xargs kill"
    else
        print_success "Port 8080 jest wolny"
    fi
    
    # Port 5173 (frontend)
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        print_warning "Port 5173 jest zajęty!"
        echo "Zabij proces: lsof -ti:5173 | xargs kill"
    else
        print_success "Port 5173 jest wolny"
    fi
}

# Start backend
start_backend() {
    print_header "Uruchamiam backend..."
    cd backend
    npm run dev
}

# Start frontend
start_frontend() {
    print_header "Uruchamiam frontend..."
    cd frontend
    npm run dev
}

# Clean (usuń node_modules)
clean() {
    print_header "Czyszczenie projektu"
    
    print_info "Usuwam node_modules..."
    rm -rf backend/node_modules
    rm -rf frontend/node_modules
    
    print_success "Wyczyszczono!"
}

# Test connection (prosty test)
test_connection() {
    print_header "Test połączenia"
    
    # Sprawdź czy backend działa
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        print_success "Backend działa na porcie 8080"
    else
        print_error "Backend nie działa! Uruchom: ./setup.sh backend"
        exit 1
    fi
}

# Menu pomocy
show_help() {
    echo "🔌 WebSocket - Skrypt pomocniczy"
    echo ""
    echo "Użycie: ./setup.sh [komenda]"
    echo ""
    echo "Komendy:"
    echo "  check       - Sprawdź wymagania (Node.js, npm)"
    echo "  install     - Zainstaluj wszystkie zależności"
    echo "  ports       - Sprawdź czy porty są wolne"
    echo "  backend     - Uruchom backend (port 8080)"
    echo "  frontend    - Uruchom frontend (port 5173)"
    echo "  clean       - Usuń node_modules"
    echo "  test        - Test czy backend działa"
    echo "  help        - Pokaż tę pomoc"
    echo ""
    echo "Przykłady:"
    echo "  ./setup.sh install    # Instaluj wszystko"
    echo "  ./setup.sh backend    # Start backend w tym terminalu"
    echo ""
    echo "Dla pełnej instrukcji zobacz: QUICK_START.md"
}

# Main
main() {
    case "${1:-help}" in
        check)
            print_header "Sprawdzanie wymagań"
            check_node
            check_npm
            ;;
        install)
            check_node
            check_npm
            install_deps
            print_success "Wszystko zainstalowane! ✨"
            print_info "Uruchom backend: ./setup.sh backend"
            print_info "Uruchom frontend: ./setup.sh frontend (w nowym terminalu)"
            ;;
        ports)
            check_ports
            ;;
        backend)
            start_backend
            ;;
        frontend)
            start_frontend
            ;;
        clean)
            clean
            ;;
        test)
            test_connection
            ;;
        help|*)
            show_help
            ;;
    esac
}

# Uruchom
main "$@"
