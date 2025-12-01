:root {
  --bg: #020617;
  --bg-card: #020817;
  --border: #1f2937;
  --accent: #4f46e5;
  --accent-soft: #0ea5e9;
  --text: #e5e7eb;
  --muted: #9ca3af;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: radial-gradient(circle at top, #1e293b, #020617);
  color: var(--text);
}

.page {
  min-height: 100vh;
  padding: 24px 12px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.header {
  width: 100%;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.logo {
  max-height: 64px;
  object-fit: contain;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid var(--border);
  font-size: 14px;
}

.lang-switch label {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.lang-switch input {
  margin: 0;
}

.card {
  width: 100%;
  max-width: 900px;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 20px;
  padding: 20px 18px 28px;
  border: 1px solid var(--border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

h1 {
  margin: 0 0 14px;
  font-size: 26px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

fieldset {
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 12px 14px 10px;
  margin: 0;
}

legend {
  padding: 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #a5b4fc;
}

label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
}

label span {
  display: block;
  margin-bottom: 4px;
}

input,
textarea {
  width: 100%;
  padding: 7px 9px;
  border-radius: 8px;
  border: 1px solid #4b5563;
  background: #020617;
  color: var(--text);
  font-size: 14px;
}

input:focus,
textarea:focus {
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
  border-color: transparent;
}

textarea {
  resize: vertical;
  min-height: 44px;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 10px;
}

.checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
}

.checkbox input[type="checkbox"] {
  width: auto;
  margin-top: 4px;
}

.primary-btn {
  margin-top: 4px;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: linear-gradient(90deg, var(--accent), var(--accent-soft));
  color: #f9fafb;
  font-weight: 600;
  font-size: 14px;
  align-self: flex-start;
}

.primary-btn:hover {
  opacity: 0.97;
  transform: translateY(-1px);
}

.small {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card {
    padding: 16px 12px 22px;
  }
}

