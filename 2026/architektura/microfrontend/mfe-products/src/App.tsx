import React, { useState } from "react";
// @ts-ignore - Module Federation
import { Button } from "designSystem/Button";
// @ts-ignore
import { Card } from "designSystem/Card";
// @ts-ignore
import { colors, spacing } from "designSystem/tokens";

/**
 * Products MFE - Lista produktów
 *
 * DEMONSTRACJA:
 * - Własny stan (products)
 * - Użycie Design System (Button, Card, tokens)
 * - Niezależny lifecycle
 */

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro 15"',
    price: 5999,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    price: 149,
    category: "Accessories",
    inStock: true,
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 499,
    category: "Accessories",
    inStock: false,
  },
  {
    id: 4,
    name: "USB-C Hub",
    price: 199,
    category: "Accessories",
    inStock: true,
  },
  {
    id: 5,
    name: 'Monitor 27" 4K',
    price: 2499,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 6,
    name: "Desk Lamp LED",
    price: 299,
    category: "Furniture",
    inStock: false,
  },
];

function App() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "inStock">("all");

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.inStock);

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
    console.log("🛒 Produkt dodany do koszyka:", productId);
  };

  const isInCart = (productId: number) => cart.includes(productId);

  return (
    <div style={{ padding: spacing.xl, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: spacing.xl }}>
        <h1
          style={{
            margin: 0,
            marginBottom: spacing.sm,
            color: colors.textPrimary,
            fontSize: "2rem",
          }}
        >
          🛍️ Produkty
        </h1>
        <p
          style={{
            margin: 0,
            color: colors.textSecondary,
            fontSize: "0.875rem",
          }}
        >
          Microfrontend: Products (Port 5002) | Używa Design System z portu 5001
        </p>
      </div>

      {/* Filters & Cart */}
      <Card padding="md" style={{ marginBottom: spacing.lg }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: spacing.sm }}>
            <Button
              variant={filter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Wszystkie ({products.length})
            </Button>
            <Button
              variant={filter === "inStock" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("inStock")}
            >
              Dostępne ({products.filter((p) => p.inStock).length})
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.sm,
              padding: `${spacing.xs} ${spacing.md}`,
              backgroundColor: colors.primaryLight,
              borderRadius: "8px",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>🛒</span>
            <span style={{ fontWeight: 600, color: colors.primary }}>
              {cart.length}
            </span>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: spacing.lg,
        }}
      >
        {filteredProducts.map((product) => (
          <Card key={product.id} title={product.name} padding="md">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.md,
              }}
            >
              {/* Category badge */}
              <div
                style={{
                  display: "inline-block",
                  alignSelf: "flex-start",
                  padding: `${spacing.xs} ${spacing.sm}`,
                  backgroundColor: colors.gray100,
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: colors.textSecondary,
                }}
              >
                {product.category}
              </div>

              {/* Price */}
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: colors.primary,
                }}
              >
                {product.price} zł
              </div>

              {/* Stock status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.xs,
                  fontSize: "0.875rem",
                  color: product.inStock ? colors.success : colors.error,
                }}
              >
                <span>{product.inStock ? "✓" : "✗"}</span>
                <span>{product.inStock ? "Dostępny" : "Niedostępny"}</span>
              </div>

              {/* Actions */}
              <Button
                variant={isInCart(product.id) ? "secondary" : "primary"}
                fullWidth
                disabled={!product.inStock || isInCart(product.id)}
                onClick={() => addToCart(product.id)}
              >
                {isInCart(product.id) ? "✓ W koszyku" : "Dodaj do koszyka"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card
        padding="md"
        style={{
          marginTop: spacing.xl,
          backgroundColor: colors.primaryLight,
          border: "none",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: colors.textSecondary,
          }}
        >
          💡 <strong>Demonstracja:</strong> Ten MFE ma własny stan (cart), używa
          komponentów z Design System (Button, Card) i jest ładowany lazy przez
          Host.
        </p>
      </Card>
    </div>
  );
}

export default App;
