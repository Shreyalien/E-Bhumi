'use strict';
// Retain legacy landing hash links without an inline script (CSP is self-only).
const route=location.hash.slice(1);
if(/^(dashboard|land-search|my-land|applications|land-lease|ctg-zone|gis|documents|payments|due-diligence|ai-assistant|casebook|appointments|notifications|analytics|feature-catalog|admin)$/.test(route))location.replace('/workspace.html#'+route);
