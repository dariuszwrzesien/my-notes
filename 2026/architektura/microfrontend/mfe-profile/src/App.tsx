import React, { useState } from "react";
// @ts-ignore - Module Federation
import { Button } from "designSystem/Button";
// @ts-ignore
import { Card } from "designSystem/Card";
// @ts-ignore
import { colors, spacing } from "designSystem/tokens";

/**
 * Profile MFE - Profil użytkownika
 *
 * DEMONSTRACJA:
 * - Własny stan (user data, edit mode)
 * - Użycie Design System (Button, Card, tokens)
 * - Niezależny lifecycle
 * - Formularz edycji
 */

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    darkMode: boolean;
  };
}

const MOCK_USER: UserProfile = {
  firstName: "Jan",
  lastName: "Kowalski",
  email: "jan.kowalski@example.com",
  phone: "+48 123 456 789",
  bio: "Senior Frontend Developer z pasją do microfrontendów i architektury.",
  preferences: {
    newsletter: true,
    notifications: true,
    darkMode: false,
  },
};

function App() {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(MOCK_USER);

  const handleEdit = () => {
    setEditedUser(user);
    setEditMode(true);
  };

  const handleSave = () => {
    setUser(editedUser);
    setEditMode(false);
    console.log("💾 Profil zapisany:", editedUser);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditMode(false);
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handlePreferenceChange = (pref: keyof UserProfile["preferences"]) => {
    setEditedUser({
      ...editedUser,
      preferences: {
        ...editedUser.preferences,
        [pref]: !editedUser.preferences[pref],
      },
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: spacing.sm,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    fontSize: "1rem",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: spacing.xs,
    fontSize: "0.875rem",
    fontWeight: 600,
    color: colors.textPrimary,
  };

  const currentUser = editMode ? editedUser : user;

  return (
    <div style={{ padding: spacing.xl, maxWidth: "800px", margin: "0 auto" }}>
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
          👤 Profil użytkownika
        </h1>
        <p
          style={{
            margin: 0,
            color: colors.textSecondary,
            fontSize: "0.875rem",
          }}
        >
          Microfrontend: Profile (Port 5003) | Używa Design System z portu 5001
        </p>
      </div>

      {/* Avatar & Basic Info */}
      <Card padding="lg" style={{ marginBottom: spacing.lg }}>
        <div
          style={{ display: "flex", gap: spacing.lg, alignItems: "flex-start" }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              flexShrink: 0,
            }}
          >
            👤
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            {editMode ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.md,
                }}
              >
                <div>
                  <label style={labelStyle}>Imię</label>
                  <input
                    type="text"
                    value={currentUser.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nazwisko</label>
                  <input
                    type="text"
                    value={currentUser.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: spacing.xs,
                    color: colors.textPrimary,
                  }}
                >
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p style={{ margin: 0, color: colors.textSecondary }}>
                  {currentUser.email}
                </p>
              </>
            )}
          </div>

          {/* Actions */}
          {!editMode && (
            <Button variant="outline" onClick={handleEdit}>
              ✏️ Edytuj
            </Button>
          )}
        </div>
      </Card>

      {/* Contact Info */}
      <Card
        title="Informacje kontaktowe"
        padding="lg"
        style={{ marginBottom: spacing.lg }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: spacing.md }}
        >
          <div>
            <label style={labelStyle}>Email</label>
            {editMode ? (
              <input
                type="email"
                value={currentUser.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={inputStyle}
              />
            ) : (
              <p style={{ margin: 0, color: colors.textSecondary }}>
                {currentUser.email}
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Telefon</label>
            {editMode ? (
              <input
                type="tel"
                value={currentUser.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                style={inputStyle}
              />
            ) : (
              <p style={{ margin: 0, color: colors.textSecondary }}>
                {currentUser.phone}
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Bio</label>
            {editMode ? (
              <textarea
                value={currentUser.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            ) : (
              <p style={{ margin: 0, color: colors.textSecondary }}>
                {currentUser.bio}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card
        title="Preferencje"
        padding="lg"
        style={{ marginBottom: spacing.lg }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: spacing.md }}
        >
          {Object.entries(currentUser.preferences).map(([key, value]) => (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
                cursor: editMode ? "pointer" : "default",
              }}
            >
              <input
                type="checkbox"
                checked={value}
                onChange={() =>
                  editMode &&
                  handlePreferenceChange(
                    key as keyof UserProfile["preferences"],
                  )
                }
                disabled={!editMode}
                style={{ width: "20px", height: "20px" }}
              />
              <span style={{ color: colors.textPrimary }}>
                {key === "newsletter" && "Newsletter email"}
                {key === "notifications" && "Powiadomienia push"}
                {key === "darkMode" && "Tryb ciemny"}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Edit Actions */}
      {editMode && (
        <Card padding="md">
          <div
            style={{
              display: "flex",
              gap: spacing.md,
              justifyContent: "flex-end",
            }}
          >
            <Button variant="ghost" onClick={handleCancel}>
              Anuluj
            </Button>
            <Button variant="primary" onClick={handleSave}>
              💾 Zapisz zmiany
            </Button>
          </div>
        </Card>
      )}

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
          💡 <strong>Demonstracja:</strong> Ten MFE ma własny stan (user
          profile, edit mode), używa komponentów z Design System i działa
          niezależnie od innych MFE.
        </p>
      </Card>
    </div>
  );
}

export default App;
