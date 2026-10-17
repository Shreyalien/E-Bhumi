'use strict';

/**
 * hill-terrain.js
 * Frontend interface and client-side calculations for Bangladesh Hill & Mountain
 * 3D Topographic Surface Area, Slope Classification and Landslide Risk Analysis.
 */

const HILL_PRESETS = {
  'batali-hill': {
    id: 'batali-hill',
    name: 'Batali Hill, Chattogram (বাটালি পাহাড়, চট্টগ্রাম)',
    region: 'Chattogram City (বাটালি পাহাড় / লালখান বাজার)',
    center: [22.3480, 91.8190],
    baseElevation: 18.0,
    peakElevation: 85.0,
    targetElevation: 45.0,
    desc: 'Highest point in Chattogram metropolitan area (~85m). Dupi Tila sandstone formation vulnerable to monsoon landslides from human cutting.',
    polygon: [
      [22.3495, 91.8175],
      [22.3495, 91.8210],
      [22.3465, 91.8210],
      [22.3465, 91.8175],
      [22.3495, 91.8175]
    ]
  },
  'chimbuk-hill': {
    id: 'chimbuk-hill',
    name: 'Chimbuk Hill, Bandarban (চিম্বুক পাহাড়, বান্দরবান)',
    region: 'Chittagong Hill Tracts (CHT)',
    center: [22.0780, 92.2470],
    baseElevation: 140.0,
    peakElevation: 790.0,
    targetElevation: 350.0,
    desc: 'Major mountain range in Bandarban (~790m). Steep ravines, indigenous Mro communities, customary CHT circle administration.',
    polygon: [
      [22.0810, 92.2440],
      [22.0810, 92.2500],
      [22.0750, 92.2500],
      [22.0750, 92.2440],
      [22.0810, 92.2440]
    ]
  },
  'keokradong': {
    id: 'keokradong',
    name: 'Keokradong Ridge, Ruma (কেওক্রাডং, রুমা)',
    region: 'Chittagong Hill Tracts (CHT)',
    center: [21.9580, 92.4530],
    baseElevation: 320.0,
    peakElevation: 986.0,
    targetElevation: 550.0,
    desc: 'Famous high peak (~986m) in Ruma upazila. High relief, rocky escarpments, natural trekking routes and high slope variations.',
    polygon: [
      [21.9610, 92.4500],
      [21.9610, 92.4560],
      [21.9550, 92.4560],
      [21.9550, 92.4500],
      [21.9610, 92.4500]
    ]
  },
  'chandranath': {
    id: 'chandranath',
    name: 'Chandranath Hill, Sitakunda (চন্দ্রনাথ পাহাড়, সীতাকুণ্ড)',
    region: 'Chattogram Coastal Mountain Ridge',
    center: [22.6250, 91.6850],
    baseElevation: 25.0,
    peakElevation: 350.0,
    targetElevation: 120.0,
    desc: 'Razorback coastal ridge (~350m) rising abruptly from the coastal plains of Sitakunda. Sections exceed 40° slope.',
    polygon: [
      [22.6280, 91.6820],
      [22.6280, 91.6880],
      [22.6220, 91.6880],
      [22.6220, 91.6820],
      [22.6280, 91.6820]
    ]
  },
  'jaflong-ridge': {
    id: 'jaflong-ridge',
    name: 'Jaflong Ridge & Tila, Sylhet (জাফলং পাহাড় ও টিলা, সিলেট)',
    region: 'Sylhet Division (Gowainghat)',
    center: [25.1650, 92.0150],
    baseElevation: 30.0,
    peakElevation: 145.0,
    targetElevation: 60.0,
    desc: 'Border tea estate tilas and rocky hilly terrain near the Meghalaya foothills. Moderate to steep hillocks.',
    polygon: [
      [25.1680, 92.0120],
      [25.1680, 92.0180],
      [25.1620, 92.0180],
      [25.1620, 92.0120],
      [25.1680, 92.0120]
    ]
  },
  'benchmark-flat-100m': {
    id: 'benchmark-flat-100m',
    name: 'Benchmark Flat 100m × 100m Plain (সমতল ভূমি টেস্ট — ১০,০০০ বর্গমিটার)',
    region: 'Mathematical Calibration Standard',
    center: [23.8000, 90.4000],
    baseElevation: 20.0,
    peakElevation: 20.0,
    targetElevation: 20.0,
    desc: 'Deterministic test polygon: 100m × 100m planar ground yielding exactly 10,000.0 m² for both projected and surface areas.',
    isFlatBenchmark: true,
    polygon: [
      [23.8000, 90.4000],
      [23.8009043, 90.4000],
      [23.8009043, 90.4009825],
      [23.8000, 90.4009825],
      [23.8000, 90.4000]
    ]
  }
};

const UNITS = {
  acre: 4046.8564224,
  decimal: 40.468564224,
  katha: 66.89028,
  bigha: 1337.8055
};

function wgs84ToUtm46N(lat, lon) {
  const a = 6378137.0, f = 1 / 298.257223563, e2 = 2 * f - f * f, ep2 = e2 / (1 - e2), k0 = 0.9996;
  const phi = (lat * Math.PI) / 180, lam = (lon * Math.PI) / 180, lam0 = (93.0 * Math.PI) / 180;
  const N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2), T = Math.tan(phi) ** 2, C = ep2 * Math.cos(phi) ** 2;
  const A = Math.cos(phi) * (lam - lam0);
  const M = a * (
    (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 ** 3 / 256) * phi -
    (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * phi) +
    (15 * e2 * e2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * phi) -
    (35 * e2 ** 3 / 3072) * Math.sin(6 * phi)
  );
  const x = k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T ** 2 + 72 * C - 58 * ep2) * A ** 5 / 120) + 500000;
  const y = k0 * (M + N * Math.tan(phi) * (A ** 2 / 2 + (5 - T + 9 * C + 4 * C ** 2) * A ** 4 / 24 + (61 - 58 * T + T ** 2 + 600 * C - 330 * ep2) * A ** 6 / 720));
  return { x, y };
}

function calcProjectedAreaM2(pts) {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  return Math.abs(area) / 2;
}

function isInsidePoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function runClientTerrainAnalysis(presetId,customCoords=null,targetGradeInput=null){
 const target=targetGradeInput===null||targetGradeInput===''?undefined:Number(targetGradeInput);
 const d=BhumiTerrain.analyzeTerrain({presetId,...(customCoords?{polygon:customCoords}:{}),...(target===undefined?{}:{targetElevation:target})});
 return {presetId:d.presetId,name:d.name,projected_m2:d.projected_area_m2,surface_m2:d.surface_area_m2,ratio:d.ratio,diff_m2:d.difference_m2,diff_pct:d.difference_pct,units:{projected:d.units.projected,surface:d.units.surface_3d},elevation:{min:d.elevation.min_m,max:d.elevation.max_m,mean:d.elevation.mean_m},slope:{mean:d.slope.mean_deg,max:d.slope.max_deg,classes:d.slope.classes_pct},landslide_pct:d.landslide_risk_zone_pct,earthwork:{cut:d.earthwork.cut_volume_m3,fill:d.earthwork.fill_volume_m3,target:d.earthwork.target_elevation_m},coords:d.polygon,mode:d.mode};
}

function buildReport(d) {
  const p = d.projected, s = d.surface;
  return {
    name: d.name,
    projected_m2: p,
    surface_m2: s,
    ratio: d.ratio,
    diff_m2: s - p,
    diff_pct: (d.ratio - 1.0) * 100,
    units: {
      projected: {
        m2: p,
        decimal: p / UNITS.decimal,
        acre: p / UNITS.acre,
        katha: p / UNITS.katha,
        bigha: p / UNITS.bigha
      },
      surface: {
        m2: s,
        decimal: s / UNITS.decimal,
        acre: s / UNITS.acre,
        katha: s / UNITS.katha,
        bigha: s / UNITS.bigha
      }
    },
    elevation: { min: d.minZ, max: d.maxZ, mean: d.meanZ },
    slope: { mean: d.meanSlope, max: d.maxSlope, classes: d.classes },
    landslide_pct: d.landslidePct,
    earthwork: { cut: Math.round(d.cutVol), fill: Math.round(d.fillVol), target: d.targetZ },
    coords: d.coords
  };
}

/**
 * Generates the HTML UI for the Hill 3D Area Calculator
 */
function renderHillTerrainHTML(results = null) {
  const r = results || runClientTerrainAnalysis('batali-hill');
  const fmt = (n, dec = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  return `
  <section class="panel hill-terrain-panel" id="hillTerrainPanel" data-preset="${r.presetId}" data-target="${r.earthwork.target}" style="margin-top:20px; border-top: 3px solid #2d6a4f;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
      <div>
        <span class="eyebrow" style="color:#2d6a4f;">GEOSPATIAL TERRAIN ENGINE · METRIC UTM 46N (EPSG:32646)</span>
        <h2 style="margin:4px 0 6px 0;">⛰️ পাহাড় ও ভূমির ৩ডি পৃষ্ঠতল ক্ষেত্রফল ও ঢাল বিশ্লেষক</h2>
        <p role="note"><b>শুধু কৃত্রিম নমুনা / Synthetic demonstration.</b> বাস্তব DEM, মাঠজরিপ বা ভূমিধসের পূর্বাভাস ব্যবহার করা হয়নি। পৃষ্ঠতলের ক্ষেত্রফল মালিকানার আয়তন বাড়ায় না।</p><p class="muted" style="margin:0; font-size:13.5px; line-height:1.6; max-width:820px;">
          বাংলাদেশে খতিয়ান ও মৌজা ম্যাপে কেবল দ্বিমাত্রিক আনুভূমিক (Projected) জমি নথিভুক্ত থাকে। কিন্তু পাহাড় ও টিলায় বাস্তব ভূমি পৃষ্ঠতল (True 3D Ground Surface) অনেক বড়। স্থানগুলোর নাম দিয়ে তৈরি কৃত্রিম পৃষ্ঠের ক্ষেত্রফল ও ঢাল তুলনা করুন; এটি বাস্তব পাহাড়ের মাপ বা ঝুঁকির মূল্যায়ন নয়।
        </p>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn" id="btnExportTerrainCsv" style="font-size:12px;">📄 CSV ডাউনলোড</button>
        <button class="btn" id="btnExportTerrainGeoJson" style="font-size:12px;">🗺️ GeoJSON</button>
        <button class="btn primary" id="btnPrintTerrainSummary" style="font-size:12px;">🖨️ প্রিন্ট সামারি</button>
      </div>
    </div>

    <div class="toolbar" style="margin-top:16px; background:#f4f7f5; padding:12px; border-radius:8px;">
      <label style="font-weight:600; font-size:13px; display:flex; align-items:center; gap:8px;">
        পাহাড় সাইট নির্বাচন:
        <select id="hillPresetSelect" style="padding:6px 10px; border-radius:6px; border:1px solid #c9d8d0; font-family:inherit;">
          ${Object.values(HILL_PRESETS).map(p => `<option value="${p.id}" ${p.name === r.name ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
      </label>
      <label style="font-weight:600; font-size:13px; display:flex; align-items:center; gap:8px;">
        কাট-এন্ড-ফিল টার্গেট উচ্চতা (m):
        <input type="number" id="hillTargetElev" value="${r.earthwork.target}" style="width:90px; padding:6px 8px; border-radius:6px; border:1px solid #c9d8d0;" step="5">
      </label>
      <button class="btn primary" id="btnCalculateTerrain" style="padding:7px 16px;">পুনরায় হিসাব করুন ➔</button>
    </div>

    <!-- 4 High Level Summary Metric Cards -->
    <div class="grid four" style="margin-top:16px;">
      <div class="panel metric" style="border-left:4px solid #4a5568;">
        <span>আনুভূমিক রেকর্ড (Projected)</span>
        <strong>${fmt(r.projected_m2, 1)} m²</strong>
        <small>${fmt(r.units.projected.decimal, 2)} শতক / ${fmt(r.units.projected.acre, 3)} একর</small>
      </div>
      <div class="panel metric" style="border-left:4px solid #2d6a4f; background:#f0fff4;">
        <span style="color:#22543d;">বাস্তব ৩ডি পৃষ্ঠতল (True 3D Surface)</span>
        <strong style="color:#22543d;">${fmt(r.surface_m2, 1)} m²</strong>
        <small style="color:#22543d; font-weight:600;">${fmt(r.units.surface.decimal, 2)} শতক / ${fmt(r.units.surface.acre, 3)} একর</small>
      </div>
      <div class="panel metric" style="border-left:4px solid #b7791f; background:#fffaf0;">
        <span style="color:#7b341e;">কৃত্রিম পৃষ্ঠের পার্থক্য (Surface difference)</span>
        <strong style="color:#7b341e;">+${fmt(r.diff_m2, 1)} m²</strong>
        <small style="color:#7b341e; font-weight:600;">+${fmt(r.diff_pct, 1)}% পৃষ্ঠতল বৃদ্ধি (+${fmt(r.units.surface.decimal - r.units.projected.decimal, 2)} শতক)</small>
      </div>
      <div class="panel metric" style="border-left:4px solid #3182ce;">
        <span>অনুপাত ও গড় ঢাল (Ratio & Slope)</span>
        <strong>${fmt(r.ratio, 3)}x</strong>
        <small>গড় ঢাল: ${fmt(r.slope.mean, 1)}° (সর্বোচ্চ: ${fmt(r.slope.max, 1)}°)</small>
      </div>
    </div>

    <!-- Detailed Comparison & Analysis Grid -->
    <div class="grid two" style="margin-top:16px;">
      <!-- Area Units Table -->
      <div class="panel">
        <h3 style="margin-top:0;">১. প্রচলিত ভূমি পরিমাপে ক্ষেত্রফল তুলনা</h3><p class="help">কাঠা/বিঘার মান অঞ্চলভেদে ভিন্ন। নিচে শুধু ৭২০ বর্গফুট/কাঠা ও ২০ কাঠা/বিঘা convention ব্যবহৃত; নিজের এলাকার মান মূল calculator-এ লিখুন।</p><h3 hidden></h3>
        <div class="table-wrap">
          <table class="data-table" style="font-size:12.5px;">
            <thead>
              <tr>
                <th>পরিমাপের একক</th>
                <th>কৃত্রিম আনুভূমিক ক্ষেত্রফল</th>
                <th>কৃত্রিম ৩ডি পৃষ্ঠতল</th>
                <th>পাহাড়ের অতিরিক্ত জমি</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>বর্গমিটার (m²)</b></td>
                <td>${fmt(r.units.projected.m2, 2)}</td>
                <td><b style="color:#2d6a4f;">${fmt(r.units.surface.m2, 2)}</b></td>
                <td>+${fmt(r.units.surface.m2 - r.units.projected.m2, 2)}</td>
              </tr>
              <tr>
                <td><b>শতক / শতাংশ (Decimal)</b></td>
                <td>${fmt(r.units.projected.decimal, 3)}</td>
                <td><b style="color:#2d6a4f;">${fmt(r.units.surface.decimal, 3)}</b></td>
                <td>+${fmt(r.units.surface.decimal - r.units.projected.decimal, 3)}</td>
              </tr>
              <tr>
                <td><b>একর (Acre)</b></td>
                <td>${fmt(r.units.projected.acre, 4)}</td>
                <td><b style="color:#2d6a4f;">${fmt(r.units.surface.acre, 4)}</b></td>
                <td>+${fmt(r.units.surface.acre - r.units.projected.acre, 4)}</td>
              </tr>
              <tr>
                <td><b>কাঠা (Katha)</b></td>
                <td>${fmt(r.units.projected.katha, 2)}</td>
                <td><b style="color:#2d6a4f;">${fmt(r.units.surface.katha, 2)}</b></td>
                <td>+${fmt(r.units.surface.katha - r.units.projected.katha, 2)}</td>
              </tr>
              <tr>
                <td><b>বিঘা (Bigha)</b></td>
                <td>${fmt(r.units.projected.bigha, 3)}</td>
                <td><b style="color:#2d6a4f;">${fmt(r.units.surface.bigha, 3)}</b></td>
                <td>+${fmt(r.units.surface.bigha - r.units.projected.bigha, 3)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="help" style="margin-top:8px;">১ একর = ১০০ শতক = ৪,০৪৬.৮৬ বর্গমিটার। ১ কাঠা = ৭২০ বর্গফুট (১.৬৫ শতক)। ১ বিঘা = ২০ কাঠা = ৩৩ শতক।</p>
      </div>

      <!-- Slope & Landslide Risk Breakdown -->
      <div class="panel">
        <h3 style="margin-top:0;">২. পাহাড়ি ঢাল ও ভূমিধস সংবেদনশীলতা</h3>
        <p style="font-size:12.5px; color:#527367; margin-bottom:12px;">উচ্চতা সীমা: সর্বনিম্ন <b>${fmt(r.elevation.min, 1)} m</b> · গড় <b>${fmt(r.elevation.mean, 1)} m</b> · সর্বোচ্চ <b>${fmt(r.elevation.max, 1)} m</b></p>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${Object.entries(r.slope.classes).map(([className, pct]) => `
            <div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:3px;">
                <span>${className}</span>
                <b>${pct}%</b>
              </div>
              <div style="height:7px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
                <div style="width:${pct}%; height:100%; background:${className.includes('Cliff') ? '#e53e3e' : className.includes('Steep') ? '#dd6b20' : className.includes('Moderately') ? '#d69e2e' : '#38a169'}; border-radius:4px;"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:14px; padding:10px 12px; border-radius:6px; background:${r.landslide_pct > 25 ? '#fff5f5' : '#f0fff4'}; border-left:4px solid ${r.landslide_pct > 25 ? '#e53e3e' : '#38a169'};">
          <b style="color:${r.landslide_pct > 25 ? '#9b2c2c' : '#22543d'}; font-size:13px;">
            ${r.landslide_pct > 25 ? 'কৃত্রিম খাড়া ঢালের অংশ বেশি / Steep synthetic surface' : 'কৃত্রিম ঢালের তুলনা / Synthetic slope comparison'}
          </b>
          <p style="margin:4px 0 0 0; font-size:12px; color:#4a5568;">
            এই কৃত্রিম মডেলের <b>${r.landslide_pct}%</b> cell-এ ঢাল ৩০ ডিগ্রির বেশি। এই শতাংশ ভূমিধসের সম্ভাবনা বা কোনো আইনি নিষেধাজ্ঞার পরীক্ষা নয়। পাহাড় কাটা বা নির্মাণের আগে প্রযোজ্য পরিবেশ আইন, অনুমোদন এবং সক্ষম কর্তৃপক্ষের শর্ত যাচাই করতে হবে।
          </p>
        </div>

        <div style="margin-top:12px; display:flex; justify-content:space-between; font-size:12px; background:#f7fafc; padding:8px 10px; border-radius:6px;">
          <span>টার্গেট গ্রুমিং মাটি কাটা (Cut): <b>${r.earthwork.cut.toLocaleString()} m³</b></span>
          <span>ভরাট (Fill): <b>${r.earthwork.fill.toLocaleString()} m³</b></span>
        </div>
      </div>
    </div>

    <!-- Official Notice -->
    <div style="margin-top:14px; padding:10px 14px; background:#fffaf0; border-left:4px solid #dd6b20; border-radius:4px; font-size:12px; color:#7b341e;">
      <b>সার্ভে ও আইনি তথ্য সতর্কতা:</b> এই হিসেবটি টপোগ্রাফিক ও কারিগরি বিশ্লেষণের সাহায্যকারী টুল। এটি কোনো আইনি দলিলের প্রমাণ নয়। মালিকানা নির্ধারণে প্রযোজ্য আইন, নথি ও সক্ষম কর্তৃপক্ষের সিদ্ধান্ত প্রয়োজন। পার্বত্য চট্টগ্রামে জেলা প্রশাসন, প্রথাগত কর্তৃপক্ষ ও অন্যান্য প্রযোজ্য প্রতিষ্ঠানের এখতিয়ার যাচাই করুন। এই টুল পাহাড় কাটার অনুমতি বা নিরাপত্তা সনদ দেয় না।
    </div>
  </section>
  `;
}

/**
 * Attaches interactive event handlers for the Hill Terrain Panel
 */
function attachHillTerrainListeners() {
  const select = document.getElementById('hillPresetSelect');
  const btnCalc = document.getElementById('btnCalculateTerrain');
  const btnCsv = document.getElementById('btnExportTerrainCsv');
  const btnGeoJson = document.getElementById('btnExportTerrainGeoJson');
  const btnPrint = document.getElementById('btnPrintTerrainSummary');

  const panelResult=document.getElementById('hillTerrainPanel');
  if(panelResult?.dataset.preset&&select)select.value=panelResult.dataset.preset;
  if(panelResult?.dataset.target)document.getElementById('hillTargetElev').value=panelResult.dataset.target;
  if (btnCalc && select) {
    btnCalc.onclick = () => {
      try{
      const presetId = select.value;
      const targetZ = document.getElementById('hillTargetElev')?.value;
      const res = runClientTerrainAnalysis(presetId, null, targetZ);
      const panel = document.getElementById('hillTerrainPanel');
      if (panel) {
        panel.outerHTML = renderHillTerrainHTML(res);
        attachHillTerrainListeners();
        if (typeof toast === 'function') {
          toast(`কৃত্রিম পৃষ্ঠের হিসাব সম্পন্ন: ${res.name} (${res.ratio.toFixed(3)}x)`);
        }
      }
      }catch(error){if(typeof toast==='function')toast(error.message);}
    };
  }

  if (select) {
    select.onchange = () => {
      if (btnCalc) btnCalc.click();
    };
  }

  if (btnCsv) {
    btnCsv.onclick = () => {
      const selectVal = document.getElementById('hillPresetSelect')?.value || 'batali-hill';
      const r = runClientTerrainAnalysis(selectVal,null,document.getElementById('hillTargetElev')?.value);
      const csv = `Parameter,Value\nMode,Synthetic demonstration - not measured DEM\nTarget Elevation (m),${r.earthwork.target}\nCut Volume (m3),${r.earthwork.cut}\nFill Volume (m3),${r.earthwork.fill}\nSite Name,"${r.name}"\nProjected Area (m2),${r.projected_m2}\nSynthetic 3D Surface Area (m2),${r.surface_m2}\nArea Ratio,${r.ratio}\nAdditional Surface (%),${r.diff_pct}\nProjected Decimal,${r.units.projected.decimal}\nSurface Decimal,${r.units.surface.decimal}\nProjected Acre,${r.units.projected.acre}\nSurface Acre,${r.units.surface.acre}\nMean Elevation (m),${r.elevation.mean}\nMean Slope (deg),${r.slope.mean}\nSynthetic Steep-Slope Share (%),${r.landslide_pct}\nMetric CRS,"EPSG:32646 (UTM Zone 46N)"\n`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hill-terrain-${selectVal}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
  }

  if (btnGeoJson) {
    btnGeoJson.onclick = () => {
      const selectVal = document.getElementById('hillPresetSelect')?.value || 'batali-hill';
      const r = runClientTerrainAnalysis(selectVal,null,document.getElementById('hillTargetElev')?.value);
      const geojson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {
            name: r.name,
            projected_area_m2: r.projected_m2,
            surface_3d_area_m2: r.surface_m2,
            area_ratio: r.ratio,
            mean_slope_deg: r.slope.mean,
            synthetic_steep_slope_pct: r.landslide_pct,
            mode: 'synthetic-demonstration',
            geometry_crs: 'WGS84 longitude/latitude',
            calculation_crs: 'EPSG:32646 (UTM 46N)'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[...r.coords,r.coords[0]].map(([lat, lon]) => [lon, lat])]
          }
        }]
      };
      const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hill-boundary-${selectVal}.geojson`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
  }

  if (btnPrint) {
    btnPrint.onclick = () => {
      window.print();
    };
  }
}

if (typeof globalThis !== 'undefined') {
  globalThis.HILL_PRESETS = HILL_PRESETS;
  globalThis.runClientTerrainAnalysis = runClientTerrainAnalysis;
  globalThis.renderHillTerrainHTML = renderHillTerrainHTML;
  globalThis.attachHillTerrainListeners = attachHillTerrainListeners;
}
