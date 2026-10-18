# UI Audit: Emoji Elimination & Visual Defect Remediation Plan

> **Governing Surface:** e-Bhumi Land Services Platform (`ebhumi-platform`)  
> **Standards:** `improve-ui` · `frontend-design` · `improve-animations`  
> **Status:** Ready for Review & Execution  

---

## 1. Executive Summary & Problem Scope

During local runtime auditing across the landing page, login portal, citizen workspace dashboard, GIS cadastral view, and the 3D Hill Terrain analyzer, multiple informal emojis, ad-hoc Unicode character substitutions, and visual rendering bugs were identified.

In a sovereign digital government platform handling real estate titles, mutation records, cadastral surveys, and revenue collection, informal emojis and raw unicode glyphs undermine civic gravitas, institutional trust, and visual consistency across different devices and platforms.

---

## 2. Catalog of Identified Emojis & Ad-Hoc Glyphs

### 2.1 Explicit Emojis (Unprofessional for Institutional Land Registry)
| # | Emoji | Location in Code | Visual Context & Purpose | Proposed Replacement |
|---|---|---|---|---|
| 1 | `⛰️` | `portal.js:194`, `app.js:434`, `hill-terrain.js:324` | "⛰️ Hill 3D Area" button & modal title | Bespoke 16px/20px Contour Mountain SVG Icon |
| 2 | `📄` | `hill-terrain.js:330` | "📄 CSV ডাউনলোড" export button | Crisp 14px Table / Document CSV SVG Icon |
| 3 | `🗺️` | `hill-terrain.js:331` | "🗺️ GeoJSON" spatial export button | Precise 14px Polygon Cadastral Boundary SVG Icon |
| 4 | `🖨️` | `hill-terrain.js:332` | "🖨️ প্রিন্ট সামারি" print summary button | Clean 14px Printer SVG Icon |
| 5 | `⚠️` | `hill-terrain.js:447` | "⚠️ উচ্চ ভূমিধস ও পাহাড় ধস ঝুঁকি জোন" | Institutional Warning Triangle SVG with badge |
| 6 | `⚡` | `app.js:277` | Service Directory hero icon | Refined Institutional Shield / Spark Vector Icon |
| 7 | `♡` | `app.js:436`, `citizen.js:34` | "♡ Watch this parcel", "♡ Save view" | Bookmark / Pin SVG ("নজরদারিতে রাখুন / Add to Watchlist") |
| 8 | `★` / `☆` | `citizen.js:22,152`, `lawbook.js:12` | Saved notes & rating placeholders | Formal star rating SVG or Tag badge |
| 9 | `✓` | `app.js`, `citizen.js`, `portal.js` (25+ places) | Status cards, workflow steps | Consistent `svg-icon check` vector icon |

### 2.2 Ad-hoc Raw Unicode Glyphs (Platform-Inconsistent Render)
| Glyph | Usage Area | Problem | Solution |
|---|---|---|---|
| `⌂`, `⌕`, `⌁`, `⌖`, `✳`, `⚑`, `◭`, `▦`, `▤`, `▣`, `▧`, `⚙`, `♧` | Sidebar menu items, dashboard stat widgets, and service cards | Render as varying font fallbacks across Windows, Linux, Android, and macOS; lacks vertical alignment and stroke balance. | Replace with unified SVG icon sprite / helper `<svg class="icon"><use href="#icon-..."></svg>` or inline SVG template helpers. |
| `<span>⌄</span>` | `workspace.html:42`, `portal.html:20` | Language toggle and workspace dropdown carats | Replace with crisp SVG Chevron Down `<svg width="12" height="12">...`. |

---

## 3. Catalog of Identified UI Bugs & Layout Defects

### Bug 1: OpenStreetMap Tile Access Block ("Access blocked")
- **Observed Behavior:** On `#gis` (GIS & Parcel Map), map background tiles display:
  > *"Access blocked - App is not following the tile usage policy of OpenStreetMap's volunteer-run servers (osm.wiki/Blocked)"*
- **Root Cause:** Standard OpenStreetMap tile servers block direct localhost/unidentified referrers under high query frequency or lack of custom attribution headers.
- **Remediation:** 
  1. Add CartoDB Positron (`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`) as primary high-legibility base layer.
  2. Implement an offline SVG cadastral grid fallback overlay when network tile requests fail, ensuring plot polygons (`DAG-1842`, `DAG-1843`, etc.) remain fully functional and interactive.

### Bug 2: Bengali Typography Fallback & Numeral Kerning Gaps
- **Observed Behavior:** Bengali conjuncts (*juktakkhors*) and numerals (`১, ২, ৩`) render with inconsistent ascender clearances and diacritic clipping on machines without local fonts.
- **Root Cause:** Missing webfont link for `Hind Siliguri` (Google Fonts) in HTML heads.
- **Remediation:** Embed Google Fonts `Hind Siliguri` (Bengali) + `Plus Jakarta Sans` (Latin/UI) across `index.html`, `portal.html`, `login.html`, and `workspace.html`.

### Bug 3: Button Baseline Misalignment in Hill 3D Modal
- **Observed Behavior:** Buttons `📄 CSV ডাউনলোড`, `🗺️ GeoJSON`, `🖨️ প্রিন্ট সামারি`, and `পুনরায় হিসাব করুন ➔` in the 3D Hill Terrain analyzer modal have uneven vertical heights, inline padding discrepancies (`padding:7px 16px`), and baseline text shifts caused by emoji height.
- **Remediation:** Apply `.btn-group` flex layout with `align-items: center; gap: 8px;` and standard 14px SVG icons aligned with the text cap-height.

### Bug 4: Social Media Tropes on Land Records ("♡ Watch this parcel")
- **Observed Behavior:** Heart icon `♡` is used for parcel tracking and view bookmarking. In a government land revenue context, heart icons are colloquial and unsuited for legal properties.
- **Remediation:** Replace with institutional terminology ("নজরদারি তালিকায় যুক্ত করুন / Track Parcel", "ভিউ বুকমার্ক করুন / Bookmark View") and an SVG bookmark ribbon icon.

---

## 4. Implementation Plan & Execution Phases

### Phase 1: Shared SVG Icon Utility & Favicon
1. Create a lightweight, zero-dependency SVG icon helper in `lib/icons.cjs` or as an inline helper in `portal.js` / `citizen.js`:
   - `mountain`, `document-csv`, `polygon-map`, `printer`, `alert-triangle`, `bookmark`, `search`, `home`, `scale-justice`, `chevron-down`.
2. Link the high-contrast geometric land badge SVG favicon across all pages.

### Phase 2: Hill 3D Terrain Analyzer Cleanup (`hill-terrain.js` & `portal.js`)
1. Remove all emojis (`⛰️`, `📄`, `🗺️`, `🖨️`, `⚠️`, `➔`) from `hill-terrain.js`.
2. Embed sharp SVG vector icons into each button with proper `aria-hidden="true"`.
3. Standardize modal button styling and flex alignment.

### Phase 3: Geospatial Map Reliability (`portal.js` & `app.js`)
1. Update Leaflet tile layer URL to CartoDB Positron / OSM Humanitarian with proper attribution and fallback tiles.
2. Provide a clean vector cadastral grid so the parcel geometries are visually distinct and interactive even if tile servers are unreachable.

### Phase 4: Citizen Workspace & Navigation Polish (`app.js`, `citizen.js`, `i18n.js`)
1. Replace `♡ Watch this parcel` and `♡ Save view` with institutional bookmark terms and SVGs.
2. Replace `⚡` and `<span>⌄</span>` with vector graphics.
3. Replace raw unicode `✓` checkmarks with SVG checkmark badges.
4. Verify all tests in `npm test` and `tests/interface-browser.cjs` continue to pass with zero regressions.

---

## 5. Verification & Regression Checklist

- [ ] `npm run check` passes with 0 syntax errors across all files.
- [ ] `npm test` passes all 101 unit/integration test suites.
- [ ] Mobile viewport (390px, 480px, 985px) renders without horizontal scroll overflow.
- [ ] Bilingual translation integrity preserved (Bangla and English switches).
- [ ] Visual inspection confirms total elimination of informal emojis.
