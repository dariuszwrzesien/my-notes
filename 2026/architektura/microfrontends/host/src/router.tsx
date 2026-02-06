import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/**
 * Lazy load MFE - ładowane dopiero gdy użytkownik nawiguje do route
 */
const Products = lazy(() => import("products/App"));
const Profile = lazy(() => import("profile/App"));

/**
 * Lazy load Design System components
 */
const Button = lazy(() =>
  import("designSystem/Button").then((module) => ({ default: module.Button })),
);

// Default fallback tokens
const defaultTokens = {
  colors: {
    textSecondary: "#666666",
    error: "#dc2626",
    textPrimary: "#000000",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
};

/**
 * Loading fallback - pokazywany podczas ładowania MFE
 */
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "400px",
      color: defaultTokens.colors.textSecondary,
    }}
  >
    <div>
      <div style={{ fontSize: "24px", marginBottom: defaultTokens.spacing.md }}>
        ⏳
      </div>
      <div>Ładowanie microfrontendu...</div>
    </div>
  </div>
);

/**
 * Error Boundary dla MFE
 */
class MFEErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: defaultTokens.spacing.xl,
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            margin: defaultTokens.spacing.lg,
          }}
        >
          <h2 style={{ color: defaultTokens.colors.error, marginTop: 0 }}>
            ❌ Błąd ładowania microfrontendu
          </h2>
          <p style={{ color: defaultTokens.colors.textSecondary }}>
            {this.state.error?.message || "Nieznany błąd"}
          </p>
          <Suspense
            fallback={
              <button onClick={() => window.location.reload()}>
                Odśwież stronę
              </button>
            }
          >
            <Button variant="outline" onClick={() => window.location.reload()}>
              Odśwież stronę
            </Button>
          </Suspense>
        </div>
      );
    }

    return this.props.children;
  }
}

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Home - redirect do products */}
      <Route path="/" element={<Navigate to="/products" replace />} />

      {/* Products MFE */}
      <Route
        path="/products"
        element={
          <MFEErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Products />
            </Suspense>
          </MFEErrorBoundary>
        }
      />

      {/* Profile MFE */}
      <Route
        path="/profile"
        element={
          <MFEErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Profile />
            </Suspense>
          </MFEErrorBoundary>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div
            style={{ padding: defaultTokens.spacing.xl, textAlign: "center" }}
          >
            <h1>404 - Nie znaleziono strony</h1>
            <Suspense
              fallback={
                <button onClick={() => (window.location.href = "/")}>
                  Wróć do strony głównej
                </button>
              }
            >
              <Button onClick={() => (window.location.href = "/")}>
                Wróć do strony głównej
              </Button>
            </Suspense>
          </div>
        }
      />
    </Routes>
  );
};
