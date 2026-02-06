import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// @ts-ignore - Module Federation type
import { Button } from "designSystem/Button";
// @ts-ignore
import { colors, spacing } from "designSystem/tokens";

/**
 * Lazy load MFE - ładowane dopiero gdy użytkownik nawiguje do route
 */
const Products = lazy(() => import("products/App"));
const Profile = lazy(() => import("profile/App"));

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
      color: colors.textSecondary,
    }}
  >
    <div>
      <div style={{ fontSize: "24px", marginBottom: spacing.md }}>⏳</div>
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
            padding: spacing.xl,
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            margin: spacing.lg,
          }}
        >
          <h2 style={{ color: colors.error, marginTop: 0 }}>
            ❌ Błąd ładowania microfrontendu
          </h2>
          <p style={{ color: colors.textSecondary }}>
            {this.state.error?.message || "Nieznany błąd"}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Odśwież stronę
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
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
            <div style={{ padding: spacing.xl, textAlign: "center" }}>
              <h1>404 - Nie znaleziono strony</h1>
              <Button onClick={() => (window.location.href = "/")}>
                Wróć do strony głównej
              </Button>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
