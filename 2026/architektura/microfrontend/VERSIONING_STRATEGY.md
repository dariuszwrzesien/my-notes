# Design System - Strategia Wersjonowania

## 🎯 Cel

Zapewnić stabilność i przewidywalność zmian w Design Systemie, który jest używany przez wszystkie MFE.

## 📦 Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH

Przykład: 2.3.1
```

### MAJOR (breaking changes)

**Kiedy:** Zmiany niekompatybilne wstecz

**Przykłady:**

```typescript
// ❌ BREAKING: zmiana nazwy prop
// Przed: <Button variant="primary" />
// Po: <Button color="primary" />

// ❌ BREAKING: usunięcie prop
// Przed: <Button size="sm" />
// Po: <Button /> // size removed

// ❌ BREAKING: zmiana typu
// Przed: spacing.md = "16px"
// Po: spacing.md = 16 // number zamiast string
```

**Proces:**

1. Announce 2-3 sprinty przed zmianą
2. Provide migration guide
3. Update wszystkich konsumentów PRZED release
4. Release new major

### MINOR (new features)

**Kiedy:** Nowe funkcjonalności, backward compatible

**Przykłady:**

```typescript
// ✅ OK: nowy komponent
export const Badge = () => { ... }

// ✅ OK: nowa prop (optional)
<Button variant="primary" loading={true} /> // loading is new

// ✅ OK: nowy token
colors.accent = '#ff6b6b'
```

**Proces:**

1. Dodaj feature
2. Update dokumentacji
3. Release
4. Communicate to teams

### PATCH (bug fixes)

**Kiedy:** Poprawki bugów, nie zmieniające API

**Przykłady:**

```typescript
// ✅ OK: fix CSS bug
// Przed: button padding: 8px 12px (za mało)
// Po: button padding: 10px 16px (poprawne)

// ✅ OK: fix TypeScript types
export interface ButtonProps {
  onClick?: () => void; // było: onClick: () => void (required)
}
```

## 🔄 Deprecation Path

Nigdy nie usuń czegoś bez deprecation!

```typescript
/**
 * @deprecated Use `color` prop instead. Will be removed in v3.0.0
 */
export interface ButtonProps {
  /** @deprecated Use color="primary" */
  variant?: "primary" | "secondary";

  /** New prop */
  color?: "primary" | "secondary";
}

export const Button = ({ variant, color, ...props }) => {
  // Support both during transition
  const finalColor = color || variant;

  if (variant) {
    console.warn(
      "Button: `variant` prop is deprecated. Use `color` instead. " +
        "Will be removed in v3.0.0",
    );
  }

  // ...
};
```

## 📊 Migration Guide Template

```markdown
# Migration Guide: v2.0.0 → v3.0.0

## Breaking Changes

### Button component

**Before:**
\`\`\`tsx
<Button variant="primary">Click</Button>
\`\`\`

**After:**
\`\`\`tsx
<Button color="primary">Click</Button>
\`\`\`

**Migration:**

1. Find/replace: `variant=` → `color=`
2. Test your components
3. No functional changes

### Removed spacing tokens

**Before:**
\`\`\`tsx
padding: spacing.tiny // "4px"
\`\`\`

**After:**
\`\`\`tsx
padding: spacing.xs // "4px" (renamed)
\`\`\`

## Timeline

- 2026-03-01: v3.0.0-beta.1 (test in staging)
- 2026-03-15: v3.0.0-rc.1 (final testing)
- 2026-04-01: v3.0.0 (production)
```

## 🚨 Co zrobić gdy MFE używa różnych wersji DS?

### Scenariusz: Module Federation (runtime)

```
Host:     DS v2.0.0
Products: DS v2.0.0
Profile:  DS v1.5.0 ⚠️
```

**Problem:** Profile renderuje button inaczej niż reszta

**Rozwiązania:**

1. **Idealne:** Update Profile do v2.0.0
2. **Tymczasowe:** Host może force version:
   ```typescript
   shared: {
     designSystem: {
       singleton: true,
       requiredVersion: '^2.0.0',
       strictVersion: true // wymusza v2.x.x
     }
   }
   ```
3. **Emergency:** Rollback Host do v1.5.0

### Scenariusz: NPM Package

```
Host:     @company/ds@2.0.0
Products: @company/ds@2.0.0
Profile:  @company/ds@1.5.0
```

**Problem:** Bundle zawiera DWA Design Systems! (duplication)

**Rozwiązania:**

1. **Idealne:** Update wszystkich do v2.0.0
2. **Peer Dependencies:**
   ```json
   {
     "peerDependencies": {
       "@company/ds": "^2.0.0"
     }
   }
   ```

## 📋 Checklist przed każdym release

### PATCH (x.x.X)

- [ ] Bug fix nie zmienia API
- [ ] Testy przechodzą
- [ ] Changelog updated
- [ ] Release notes

### MINOR (x.X.0)

- [ ] Nowe features są backward compatible
- [ ] Dokumentacja updated
- [ ] Storybook stories added
- [ ] Visual regression tests
- [ ] Changelog updated
- [ ] Release notes
- [ ] Notify teams

### MAJOR (X.0.0)

- [ ] Breaking changes udokumentowane
- [ ] Migration guide written
- [ ] Wszystkie konsumenci świadomi
- [ ] Beta period (2 weeks minimum)
- [ ] RC period (1 week minimum)
- [ ] Deprecation warnings w poprzedniej wersji
- [ ] Update timeline komunikowany
- [ ] Approval z tech leads
- [ ] Changelog updated
- [ ] Release notes
- [ ] Team training session

## 🎯 Rekomendacje

### Dla Design System team:

1. **Minimize breaking changes** - są drogie!
2. **Always provide deprecation path** - minimum 2 minor versions
3. **Version bump policy:**
   - Patch: co 1-2 tygodnie
   - Minor: co 1-2 miesiące
   - Major: co 6-12 miesięcy
4. **Communicate early** - surprises are bad

### Dla MFE teams:

1. **Stay up to date** - nie zostawaj więcej niż 1 minor behind
2. **Test updates w staging** before prod
3. **Subscribe to DS changelog** - be aware of upcoming changes
4. **Report issues immediately** - nie czekaj

## 🔗 Narzędzia

- **Lerna/Nx:** Multi-package management
- **Changesets:** Automated versioning & changelogs
- **Storybook:** Component documentation
- **Chromatic:** Visual regression testing
- **npm dist-tags:** Beta/RC releases

---

**Pamiętaj:** Design System to kontrakt. Łamanie kontraktu = łamanie zaufania zespołów.
