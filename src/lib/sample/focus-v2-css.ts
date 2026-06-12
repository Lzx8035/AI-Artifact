export const focusV2Css = `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600&display=swap");

:root {
  color-scheme: light;
  --ink: #09090b;
  --muted: #71717a;
  --subtle: #a1a1aa;
  --line: #e4e4e7;
  --bg: #ffffff;
  --card: #ffffff;
  --accent: #18181b;
  --ring: rgba(24, 24, 27, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(60% 50% at 50% 0%, #f4f4f5 0%, rgba(244, 244, 245, 0) 70%),
    var(--bg);
  font-family: "Inter", "Noto Sans SC", sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: color 200ms ease, background-color 200ms ease;
}

.page {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding-bottom: 64px;
}

/* ---------- nav ---------- */
.nav {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 72px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--accent);
  color: var(--bg);
  font-size: 15px;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 28px;
  margin-right: auto;
}

.nav-links a {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms ease;
}

.nav-links a:hover {
  color: var(--ink);
}

/* ---------- buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 11px 18px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease,
    border-color 150ms ease, box-shadow 150ms ease;
}

.btn-sm {
  padding: 8px 14px;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  color: var(--bg);
  background: var(--accent);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-primary:hover {
  background: #2a2a2e;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  transform: translateY(-1px);
}

.btn-secondary {
  color: var(--ink);
  background: var(--card);
  border-color: var(--line);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.btn-secondary:hover {
  border-color: #d4d4d8;
  background: #fafafa;
  transform: translateY(-1px);
}

.btn-ghost {
  color: var(--muted);
  background: transparent;
}

.btn-ghost:hover {
  color: var(--ink);
  background: rgba(127, 127, 127, 0.12);
}

/* ---------- hero ---------- */
.hero {
  padding: 80px 0 88px;
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  padding: 6px 12px 6px 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
}

.badge .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.16);
}

h1 {
  margin: 0;
  font-size: clamp(40px, 6vw, 68px);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.045em;
}

.intro {
  max-width: 540px;
  margin: 24px auto 0;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.7;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
}

.hint {
  margin: 20px 0 0;
  color: var(--subtle);
  font-size: 13px;
}

/* ---------- features ---------- */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: transform 200ms ease, box-shadow 200ms ease,
    border-color 200ms ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: #d4d4d8;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
}

.card-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 18px;
  border-radius: 11px;
  background: #f4f4f5;
  color: var(--ink);
}

.card h2 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.card p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.65;
}

/* ---------- dark mode ---------- */
body.dark {
  --ink: #fafafa;
  --muted: #a1a1aa;
  --subtle: #71717a;
  --line: #27272a;
  --bg: #09090b;
  --card: #18181b;
  --accent: #fafafa;
  background:
    radial-gradient(60% 50% at 50% 0%, #18181b 0%, rgba(24, 24, 27, 0) 70%),
    var(--bg);
}

body.dark .badge {
  background: rgba(24, 24, 27, 0.7);
}

body.dark .btn-primary:hover {
  background: #e4e4e7;
}

body.dark .btn-secondary:hover {
  border-color: #3f3f46;
  background: #27272a;
}

body.dark .card:hover {
  border-color: #3f3f46;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
}

body.dark .card-icon {
  background: #27272a;
}

/* ---------- responsive ---------- */
@media (max-width: 720px) {
  .nav-links {
    display: none;
  }

  .hero {
    padding: 56px 0 64px;
  }

  .features {
    grid-template-columns: 1fr;
  }
}`;
