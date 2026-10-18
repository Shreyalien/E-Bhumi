# e-Bhumi UI Improvement & Design System Plan

> **Governing Standards:** `/improve-ui` · `/frontend-design` · `/improve-animations` · `/improve-react` · `ui-skills-root`  
> **Target Platform:** e-Bhumi Land Services Platform (`ebhumi-platform`)  
> **Scope:** Citizen Workspace, Role Desk, Landing Experience, Typography, Color Palette Engine, Motion Architecture

---

## 1. Executive Summary & Design Vision

e-Bhumi is an end-to-end digital land-services platform for Bangladesh covering 33 civic workflows (mutation, e-porcha, land development tax/dakhila, survey objections, khatian verifications, and hearings).

While the application possesses rich administrative logic and role coverage, the current interface exhibits key usability and design-system friction points:
1. **Bengali Typography Fallback Gaps:** No webfonts are imported or declared via `@font-face` or Google Fonts. System fallbacks on Windows render complex conjuncts (*juktakkhors*) and Bengali numerals with awkward kerning and diacritic clipping.
2. **Monolithic Theming:** Only a single hardcoded dark-mode toggle exists with rigid green tones; no theme color variants are available for citizen customization or accessibility preference.
3. **Cognitive Load in Navigation:** 21+ flat menu items are crammed into an unsegmented sidebar without functional categorization.
4. **Motion Craft:** Transitions use generic `all .2s` declarations with sudden snapping, lacking cohesive cubic-bezier easing or micro-interactions.

### Design Principles (Grounded in Subject Matter)
* **Civic Dignity & Trust:** Grounded in Bangladesh's geographic, administrative, and riverine identity. It feels official and dependable, avoiding generic SaaS startup clichés.
* **Minimalist & Legible:** Clean typography with ample line-height, crystal-clear numeral representation, and uncluttered cards.
* **Empowering & User-Friendly:** Clear progressive disclosure, intuitive search, friendly guidance banners, and high-contrast color choices.

---

## 2. Minimal Bangla Typography System

### 2.1 The Typographic Problem
* Currently: `font-family: 'DM Sans', 'Hind Siliguri', sans-serif;` with **no embedded font stylesheet**.
* When viewed on machines without local fonts, browsers default to system serif/cluttered typefaces (`Vrinda`, `Nirmala UI`, or standard `Arial`).
* Bengali script requires larger vertical clearance (ascender and matra clearance) and proportional spacing for numbers (`১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯, ০`).

### 2.2 Selected Font Stack: Hind Siliguri + Plus Jakarta Sans
* **Bengali Primary:** **Hind Siliguri** (Google Fonts)
  * Clean humanist sans-serif designed specifically for Bengali screen legibility.
  * Low contrast, open counters, uncluttered loops, exceptional rendering at 12px–16px UI sizes.
* **Latin / Code / UI Primary:** **Plus Jakarta Sans** (paired with Hind Siliguri)
  * Geometric precision, balanced x-height, harmonious weight distribution matching Hind Siliguri.
* **Monospace (Plot/Khatian/Dag Numbers):** **JetBrains Mono** / **Roboto Mono**

### 2.3 Webfont Loading Implementation
Add to the `<head>` of all HTML documents (`index.html`, `portal.html`, `login.html`, `workspace.html`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 2.4 Typographic Scale & Spacing Rules
```css
:root {
  --font-sans: 'Plus Jakarta Sans', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Typography Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.8125rem;  /* 13px */
  --text-base: 0.875rem; /* 14px */
  --text-md: 1rem;       /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */

  /* Bengali vertical rhythm adjustments */
  --leading-tight: 1.35;
  --leading-normal: 1.6;
  --leading-relaxed: 1.8;
}

body, button, input, select, textarea {
  font-family: var(--font-sans);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Dag, Khatian, JL and Survey reference badges */
.reference-code, .dag-tag, .khatian-number {
  font-family: var(--font-mono);
  font-feature-settings: "tnum" 1;
  letter-spacing: 0.5px;
}
```

---

## 3. Dynamic Color Variant System (Theme Palette Engine)

To give users personalization and accessibility options while honoring Bangladesh's regional context, we introduce **4 thematic color variants**, each supporting both **Light Mode** and **Dark Mode**.

### 3.1 The Four Color Variants

#### Variant A: "Padma Green" (পদ্মা সবুজ — Default)
* **Concept:** Fertile alluvial soil, lush greenery, and the official colorway of land revenue administration.
* **Primary:** `#1b5e48` (Emerald Deep)
* **Accent:** `#2e8b6b` (Fresh Leaf)
* **Subtle Tint:** `#eaf4ef` (Pale Mint)
* **Dark Canvas:** `#0b1a15` / `#132d24`

#### Variant B: "Meghna Indigo" (মেঘনা নীল — Civic & Judicial)
* **Concept:** The mighty Meghna river, legal integrity, and formal municipal governance.
* **Primary:** `#1a4971` (Riverine Navy)
* **Accent:** `#2570ab` (Active Blue)
* **Subtle Tint:** `#e8f1f8` (Glacier Tint)
* **Dark Canvas:** `#0a1622` / `#13263a`

#### Variant C: "Sundarban Clay" (সুন্দরবন মৃত্তিকা — Earth & Heritage)
* **Concept:** Cadastral survey maps, historical parchment deeds (*dalil*), and warm terracotta soil.
* **Primary:** `#7d4323` (Warm Terracotta)
* **Accent:** `#a35b32` (Earthen Amber)
* **Subtle Tint:** `#f9f2ec` (Parchment Mist)
* **Dark Canvas:** `#1c130d` / `#2b1d14`

#### Variant D: "Surma Slate" (সুরমা স্লেট — Modern Civic Tech)
* **Concept:** Modern high-density digital workspace, neutral, high-contrast, distraction-free.
* **Primary:** `#334155` (Deep Slate)
* **Accent:** `#0ea5e9` (Sky Cyan)
* **Subtle Tint:** `#f1f5f9` (Cool Grey)
* **Dark Canvas:** `#0f172a` / `#1e293b`

### 3.2 CSS Variables Token Architecture
Controlled via HTML attributes:
`data-theme="light|dark"` and `data-color-variant="padma|meghna|sundarban|surma"`

```css
/* Core Structural Tokens */
:root,
[data-color-variant="padma"] {
  --theme-primary: #1b5e48;
  --theme-primary-hover: #134736;
  --theme-primary-active: #0d3326;
  --theme-primary-subtle: #eaf4ef;
  --theme-primary-border: #bcd9cb;
  --theme-accent: #2e8b6b;
  --theme-focus-ring: rgba(27, 94, 72, 0.35);
}

[data-color-variant="meghna"] {
  --theme-primary: #1a4971;
  --theme-primary-hover: #123554;
  --theme-primary-active: #0b2236;
  --theme-primary-subtle: #e8f1f8;
  --theme-primary-border: #b8d4ea;
  --theme-accent: #2570ab;
  --theme-focus-ring: rgba(26, 73, 113, 0.35);
}

[data-color-variant="sundarban"] {
  --theme-primary: #7d4323;
  --theme-primary-hover: #5f3117;
  --theme-primary-active: #42200d;
  --theme-primary-subtle: #f9f2ec;
  --theme-primary-border: #e6cdbd;
  --theme-accent: #a35b32;
  --theme-focus-ring: rgba(125, 67, 35, 0.35);
}

[data-color-variant="surma"] {
  --theme-primary: #334155;
  --theme-primary-hover: #1e293b;
  --theme-primary-active: #0f172a;
  --theme-primary-subtle: #f1f5f9;
  --theme-primary-border: #cbd5e1;
  --theme-accent: #0284c7;
  --theme-focus-ring: rgba(51, 65, 85, 0.35);
}

/* Light Mode Surface Tokens */
:root {
  --bg-canvas: #f6f8f5;
  --bg-paper: #ffffff;
  --bg-subtle: #f0f4f1;
  --bg-sidebar: #0f2c23;
  --text-main: #13241d;
  --text-muted: #597064;
  --text-subtle: #879b90;
  --border-light: #e0e8e2;
  --border-strong: #cad8ce;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 14px rgba(0,0,0,0.08);
  --shadow-lg: 0 10px 28px rgba(0,0,0,0.12);
}

/* Dark Mode Overrides */
[data-theme="dark"] {
  --bg-canvas: #091511;
  --bg-paper: #11221b;
  --bg-subtle: #172d24;
  --bg-sidebar: #07120e;
  --text-main: #e2ede6;
  --text-muted: #8ea99c;
  --text-subtle: #5e7a6d;
  --border-light: #1c362c;
  --border-strong: #284b3e;
}
```

### 3.3 Interactive Color Variant Selector Component
A non-intrusive, accessible dropdown in the top bar next to `#themeToggle`:
* Visual swatches showing the active hue and label in Bengali/English.
* Fully keyboard navigable (`role="listbox"`, `aria-label="রঙের থিম পরিবর্তন করুন / Change color variant"`).
* Automatic persistence to `localStorage.setItem('ebhumi_color_variant', variant)`.

---

## 4. User-Friendliness & Information Architecture Overhaul

### 4.1 Categorized Sidebar Navigation
Instead of an unsegmented list of 21 navigation items, group items into intuitive logical sections:
1. **মূল কার্যক্রম (Core Services):**
   * Overview (ড্যাশবোর্ড)
   * All Land Services (সকল ভূমি সেবা)
   * My Applications (আমার আবেদনসমূহ)
2. **রেকর্ড ও যাচাই (Records & Ledger):**
   * My Land & Timeline (আমার খতিয়ান ও জমি)
   * Parcel Map & GIS (মৌজা ও দাগের মানচিত্র)
   * Truth Card & Ownership (মালিকানা যাচাই ও ট্রুথ কার্ড)
3. **পেমেন্ট ও নথি (Finance & Vault):**
   * Payments & Dakhila (খাজনা ও দাখিলা)
   * Documents & Vault (দলিল ও খসড়া প্রমাণপত্র)
4. **সহায়তা ও সরঞ্জাম (Tools & Help):**
   * Tax & Fee Calculator (ফি ক্যালকুলেটর)
   * Hearing & Appointments (শুনানি ও শিডিউল)
   * Assisted Help & Grievance (সহায়তা কেন্দ্র)

### 4.2 Friendly Search & Command Palette
* Highlight active search query matches in Bengali and English.
* Quick category filter chips directly below the search input (e.g. `[নামজারি]`, `[ই-পর্চা]`, `[খাজনা]`, `[দাগ সূচি]`).
* Keyboard shortcut indicator `<kbd>Ctrl+K</kbd>` / `<kbd>⌘K</kbd>` with immediate modal filter.

### 4.3 Action Hierarchy & Button Design
* **Primary Action (`btn-primary`):** Bold, prominent background with subtle elevation shadow (e.g. "আবেদন জমা দিন / Submit Application").
* **Secondary Action (`btn-secondary`):** Bordered with primary theme border, transparent background.
* **Danger Action (`btn-danger`):** Warm terracotta/rose tint for destructive actions (e.g. "আবেদন প্রত্যাহার / Withdraw").
* **Ghost Action (`btn-ghost`):** Subtle icon-only or plain link buttons for secondary utilities.

### 4.4 Citizen Onboarding & Contextual Guidance
* **Collapsible Sandbox Notice:** Allow users to dismiss or collapse the `#sandboxBanner` into a tiny discreet pill to preserve vertical viewport space.
* **Empty State Illustrations & Next-Step Prompts:** Replace raw "No applications here yet" with friendly contextual guidance and a direct primary button to start an e-Porcha or Mutation application.

---

## 5. Motion & Animation System (`improve-animations`)

### 5.1 Motion Principles
* **Functional, Not Decorative:** Motion should explain spatial origin (e.g. modals scale up from center, drawers slide from side, toasts float up from bottom).
* **Physically Grounded Spring Curves:** Replace linear and ease-in jumps with responsive cubic-bezier physics.

### 5.2 Standard Motion Tokens
```css
:root {
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-instant: 100ms;
  --duration-fast: 180ms;
  --duration-normal: 260ms;
  --duration-relaxed: 380ms;
}

/* Card hover micro-interaction */
.card, .panel-clickable {
  transition: transform var(--duration-fast) var(--ease-spring),
              box-shadow var(--duration-fast) var(--ease-spring),
              border-color var(--duration-fast) ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--theme-accent);
}

/* Modal and Drawer Transitions */
dialog[open] {
  animation: modal-enter var(--duration-normal) var(--ease-spring) forwards;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Toast Notification Entrance */
.toast:not([hidden]) {
  animation: toast-float var(--duration-normal) var(--ease-spring) forwards;
}

@keyframes toast-float {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Theme Switching Smoothness */
body, .sidebar, .topbar, .panel, .card {
  transition: background-color var(--duration-fast) ease,
              border-color var(--duration-fast) ease,
              color var(--duration-fast) ease;
}

/* Accessibility: Full reduced-motion respect */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. Architectural & React/JS Implementation Plan (`improve-react`)

To ensure clean execution without regression of existing tests (e.g. `tests/land-dossiers-browser.cjs`):

### 6.1 Theme & Variant Manager (`theme-manager.js`)
Create a lightweight, robust utility handling theme and color variants:
```javascript
// Lightweight Theme & Variant Controller
const ThemeManager = {
  variants: ['padma', 'meghna', 'sundarban', 'surma'],
  
  init() {
    const savedTheme = localStorage.getItem('ebhumi_theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const savedVariant = localStorage.getItem('ebhumi_color_variant') || 'padma';
    
    this.applyTheme(savedTheme);
    this.applyVariant(savedVariant);
  },

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('ebhumi_theme', theme);
    this.updateToggleUI(theme);
  },

  applyVariant(variant) {
    if (!this.variants.includes(variant)) variant = 'padma';
    document.documentElement.setAttribute('data-color-variant', variant);
    localStorage.setItem('ebhumi_color_variant', variant);
    this.updateVariantUI(variant);
  },

  updateToggleUI(theme) {
    const b = document.getElementById('themeToggle');
    if (b) {
      b.textContent = theme === 'dark' ? '☀️' : '🌙';
      b.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  },

  updateVariantUI(variant) {
    const selector = document.getElementById('variantSelector');
    if (selector) selector.value = variant;
  }
};
```

### 6.2 Backward Compatibility Safeguards
* Preserve all existing element IDs (`#themeToggle`, `#languageToggle`, `#globalSearch`, `#navigation`, `#breadcrumb`).
* Retain full compatibility with `data-theme="dark"` selector so existing tests continue to pass 100%.

---

## 7. Phased Implementation Roadmap

| Phase | Milestone | Deliverables | Risk / Verification |
|---|---|---|---|
| **Phase 1** | **Typography & Font Stack** | Link Google Fonts (`Hind Siliguri` & `Plus Jakarta Sans`) across all HTML files. Update CSS root font stack and line-heights. | Zero risk. Verify ligature rendering and numeral clarity in both English and Bengali. |
| **Phase 2** | **Color Variant CSS Engine** | Introduce CSS variables for the 4 variants (`padma`, `meghna`, `sundarban`, `surma`) in `portal.css` and `preserved.css`. | Ensure contrast ratios meet WCAG AA (4.5:1 for text, 3:1 for UI borders). |
| **Phase 3** | **Variant Switcher UI & State** | Add variant picker selector next to `#themeToggle` in the topbar. Add `ThemeManager.applyVariant` in `portal.js`. | Verify `localStorage` persistence and instant style switching. |
| **Phase 4** | **Information Architecture & Sidebar** | Organize the 21 navigation items into grouped sections with collapsible headers. | Verify all existing hash routes (`#dashboard`, `#services`, `#applications`, `#land`) work unchanged. |
| **Phase 5** | **Motion & Micro-interactions** | Add standardized cubic-bezier transitions for dialogs, cards, sidebar drawer, and theme toggling. | Verify `prefers-reduced-motion` compliance and smooth 60fps performance. |

---

## 8. Success Criteria
* **Bangla Typography:** Clear, legible, crisp Bengali characters and numbers with no clipping across mobile, tablet, and desktop.
* **Palette Switcher:** Instant switching between Padma Green, Meghna Indigo, Sundarban Clay, and Surma Slate with persistent preference.
* **User-Friendliness:** Reduced clutter, clear action hierarchy, accessible contrast, and organized navigation.
* **Preservation:** All 33 service workflows, automated test suites, and demo roles function seamlessly.
