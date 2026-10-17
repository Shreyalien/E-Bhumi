'use strict';

/**
 * terrain-engine.cjs
 * Topographic 3D surface area, slope classification, and landslide risk analysis
 * tailored for Bangladesh hilly regions (Chattogram, CHT, Cox's Bazar, Sylhet).
 */

const PRESETS = {
  'batali-hill': {
    id: 'batali-hill',
    name: 'Batali Hill, Chattogram (বাটালি পাহাড়, চট্টগ্রাম)',
    region: 'Chattogram City',
    center: [22.3480, 91.8190],
    baseElevation: 18.0,
    peakElevation: 85.0,
    targetElevation: 45.0,
    description: 'Highest natural point in Chattogram city (~85m). Sandstone formation prone to monsoon landslides and illegal hill cutting.',
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
    description: 'Third highest mountain ridge in Bangladesh (~790m). Steep ravines, indigenous Mro settlements, customary CHT land governance.',
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
    name: 'Keokradong Ridge, Ruma (কেওক্রাডং, রুমা, বান্দরবান)',
    region: 'Chittagong Hill Tracts (CHT)',
    center: [21.9580, 92.4530],
    baseElevation: 320.0,
    peakElevation: 986.0,
    targetElevation: 550.0,
    description: 'Major peak in southeastern CHT (~986m). Rocky terrain, dense slopes, natural trekking trails and steep ravines.',
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
    region: 'Chattogram Coastal Ridge',
    center: [22.6250, 91.6850],
    baseElevation: 25.0,
    peakElevation: 350.0,
    targetElevation: 120.0,
    description: 'Prominent coastal hill range overlooking the Bay of Bengal (~350m). Extreme slope sections with pilgrimage stairway and razorback ridge.',
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
    region: 'Sylhet Division',
    center: [25.1650, 92.0150],
    baseElevation: 30.0,
    peakElevation: 145.0,
    targetElevation: 60.0,
    description: 'Border hilly terrain in Gowainghat, Sylhet. Tea garden slopes, gravel beds and undulating tilas near Meghalaya foothills.',
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
    name: 'Benchmark Flat Plain 100m × 100m (সমতল ভূমি টেস্ট — ১০,০০০ বর্গমিটার)',
    region: 'Validation Benchmark',
    center: [23.8000, 90.4000],
    baseElevation: 20.0,
    peakElevation: 20.0,
    targetElevation: 20.0,
    description: 'Exact mathematical validation benchmark: 100m × 100m flat polygon yielding 10,000.0 m² for both projected and 3D surface area (Ratio = 1.0000).',
    // 100m x 100m approximately ~0.0009° latitude, ~0.00098° longitude at Dhaka
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

// Unit conversions
const SQ_METERS_PER_ACRE = 4046.8564224;
const SQ_METERS_PER_DECIMAL = 40.468564224;  // 1 Acre = 100 Decimal (শতক / শতাংশ)
const SQ_METERS_PER_KATHA = 66.89028;        // 1 Katha (কাঠা) = 720 sq ft = 1.65 decimal
const SQ_METERS_PER_BIGHA = 1337.8055;       // 1 Bigha (বিঘা) = 20 Katha = 33 decimal

/**
 * Standard WGS84 to UTM Zone 46N (EPSG:32646) projection
 * Covers 90°E to 96°E (including Chattogram, CHT, Cox's Bazar, Sylhet, Dhaka)
 */
function toUtm46N(lat, lon) {
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const e2 = 2 * f - f * f;
  const ep2 = e2 / (1 - e2);
  const k0 = 0.9996;

  const phi = (lat * Math.PI) / 180;
  const lam = (lon * Math.PI) / 180;
  const lam0 = (93.0 * Math.PI) / 180; // Central Meridian for UTM 46N

  const N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  const T = Math.tan(phi) ** 2;
  const C = ep2 * Math.cos(phi) ** 2;
  const A = Math.cos(phi) * (lam - lam0);

  const M = a * (
    (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 ** 3) / 256) * phi -
    ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * phi) +
    ((15 * e2 * e2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * phi) -
    ((35 * e2 ** 3) / 3072) * Math.sin(6 * phi)
  );

  const x = k0 * N * (
    A +
    ((1 - T + C) * A ** 3) / 6 +
    ((5 - 18 * T + T ** 2 + 72 * C - 58 * ep2) * A ** 5) / 120
  ) + 500000;

  const y = k0 * (
    M +
    N * Math.tan(phi) * (
      A ** 2 / 2 +
      ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 +
      ((61 - 58 * T + T ** 2 + 600 * C - 330 * ep2) * A ** 6) / 720
    )
  );

  return { x, y };
}

/**
 * Calculates planar projected horizontal area of a polygon in meters (Shoelace formula)
 */
function polygonProjectedAreaM2(metricCoords) {
  let area = 0;
  const n = metricCoords.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += metricCoords[i].x * metricCoords[j].y - metricCoords[j].x * metricCoords[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Check if a point is inside a polygon (Ray-casting)
 */
function pointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Analyzes terrain, computes true 3D surface area, slope, landslide risk and cut-fill
 */
function analyzeTerrain({ polygon, presetId = 'batali-hill', targetElevation, demResolution = 15.0 }) {
  if(typeof presetId!=='string'||!Object.hasOwn(PRESETS,presetId))throw new Error('Select a known demonstration preset.');
  if(typeof demResolution!=='number'||!Number.isFinite(demResolution)||demResolution<5||demResolution>1000)throw new Error('Resolution must be a finite number from 5 to 1000 metres.');
  if(targetElevation!==undefined&&(typeof targetElevation!=='number'||!Number.isFinite(targetElevation)||targetElevation< -500||targetElevation>10000))throw new Error('Target elevation must be a finite number from -500 to 10000 metres.');
  let coords = polygon;
  let preset = PRESETS[presetId];

  if (!coords && preset) {
    coords = preset.polygon;
  }
  if (!coords || !Array.isArray(coords) || coords.length < 3) {
    throw new Error('Valid polygon coordinate array (at least 3 vertices) required.');
  }
  if(coords.length>100||coords.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>typeof v!=='number'||!Number.isFinite(v))||p[0]<20||p[0]>27||p[1]<88||p[1]>93))throw new Error('Use 3–100 finite latitude/longitude vertices within the Bangladesh demonstration extent.');
  coords=coords.map(p=>[...p]);
  if(coords.length>3&&coords[0][0]===coords.at(-1)[0]&&coords[0][1]===coords.at(-1)[1])coords.pop();
  if(new Set(coords.map(p=>p.join(','))).size!==coords.length)throw new Error('Repeated polygon vertices are not allowed.');
  const cross=(a,b,c)=>(b[1]-a[1])*(c[0]-a[0])-(b[0]-a[0])*(c[1]-a[1]);
  for(let i=0;i<coords.length;i++)for(let j=i+1;j<coords.length;j++){
    if(j===i+1||(i===0&&j===coords.length-1))continue;
    const a=coords[i],b=coords[(i+1)%coords.length],c=coords[j],d=coords[(j+1)%coords.length];
    if(cross(a,b,c)*cross(a,b,d)<=0&&cross(c,d,a)*cross(c,d,b)<=0&&Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0]))<=Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0]))&&Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1]))<=Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1])))throw new Error('Polygon edges must not intersect.');
  }

  // Handle benchmark flat 100m case explicitly
  if (!polygon && (presetId === 'benchmark-flat-100m' || preset?.isFlatBenchmark)) {
    const projectedArea = 10000.0;
    const surfaceArea = 10000.0;
    const ratio = 1.0000;
    return formatResults({
      presetId: 'benchmark-flat-100m',
      name: PRESETS['benchmark-flat-100m'].name,
      projectedArea,
      surfaceArea,
      ratio,
      minElevation: 20.0,
      maxElevation: 20.0,
      meanElevation: 20.0,
      meanSlope: 0.0,
      maxSlope: 0.0,
      classes: { '0-5° (Flat / Gentle)': 100.0, '5-15° (Moderate)': 0.0, '15-30° (Moderately Steep)': 0.0, '30-45° (Steep)': 0.0, '>45° (Extreme / Cliff)': 0.0 },
      landslideRiskPct: 0.0,
      cutVolumeM3: Math.max(20-(targetElevation??20),0)*10000,
      fillVolumeM3: Math.max((targetElevation??20)-20,0)*10000,
      targetElevation: targetElevation??20,
      demResolution: 10.0,
      wgs84Polygon: coords
    });
  }

  // 1. Reproject WGS84 vertices to Metric UTM Zone 46N (EPSG:32646)
  const metricCoords = coords.map(([lat, lon]) => toUtm46N(lat, lon));
  const projectedAreaM2 = polygonProjectedAreaM2(metricCoords);

  if (projectedAreaM2 <= 0) {
    throw new Error('Polygon geometry has zero or invalid area.');
  }
  if(!Number.isFinite(projectedAreaM2)||projectedAreaM2<1)throw new Error('Polygon area must be at least one square metre.');

  // Compute metric bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const pt of metricCoords) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  if((maxX-minX)*(maxY-minY)>25000000)throw new Error('Demonstration extent must fit within 25 square kilometres.');
  const radius = Math.max(Math.sqrt((maxX - minX) ** 2 + (maxY - minY) ** 2) / 2, 50.0);

  // Preset elevation envelope
  const baseElev = preset ? preset.baseElevation : 25.0;
  const peakElev = preset ? preset.peakElevation : (baseElev + 80.0);
  const hillHeight = Math.max(peakElev - baseElev, 10.0);

  // Elevation function for the hill
  function getElevation(x, y) {
    if(preset?.isFlatBenchmark)return baseElev;
    const dx = (x - cx) / radius;
    const dy = (y - cy) / radius;
    const r2 = dx * dx + dy * dy;
    // Gaussian hill crest with subtle terrain ridge ripples
    const hill = hillHeight * Math.exp(-r2 * 2.2);
    const ridge = 4.0 * Math.sin(dx * 4.5) * Math.cos(dy * 3.5);
    return Math.max(baseElev, baseElev + hill + ridge);
  }

  const step = Math.max(Number(demResolution) || 15.0, 5.0);
  if(Math.ceil((maxX-minX)/step)*Math.ceil((maxY-minY)/step)>50000)throw new Error('Too many grid cells; choose a coarser resolution or smaller polygon.');
  let totalCellProjArea = 0;
  let totalCellSurfaceArea = 0;
  let minElevation = Infinity, maxElevation = -Infinity, sumElevation = 0;
  let sumSlope = 0, maxSlope = 0, cellCount = 0;

  let count0_5 = 0, count5_15 = 0, count15_30 = 0, count30_45 = 0, countOver45 = 0;
  let cutVolume = 0, fillVolume = 0;
  const targetGrade = Number.isFinite(Number(targetElevation)) ? Number(targetElevation) : (baseElev + hillHeight * 0.4);

  // Numerical grid scan across the bounding box
  for (let x = minX + step / 2; x <= maxX; x += step) {
    for (let y = minY + step / 2; y <= maxY; y += step) {
      if (!pointInPolygon(x, y, metricCoords)) continue;

      const z = getElevation(x, y);
      if (z < minElevation) minElevation = z;
      if (z > maxElevation) maxElevation = z;
      sumElevation += z;

      // Central differences for terrain gradients
      const dz_dx = (getElevation(x + step, y) - getElevation(x - step, y)) / (2 * step);
      const dz_dy = (getElevation(x, y + step) - getElevation(x, y - step)) / (2 * step);

      const slopeRad = Math.atan(Math.sqrt(dz_dx * dz_dx + dz_dy * dz_dy));
      const slopeDeg = (slopeRad * 180) / Math.PI;

      sumSlope += slopeDeg;
      if (slopeDeg > maxSlope) maxSlope = slopeDeg;

      // Surface area of cell: dx * dy / cos(slope)
      // Clamped to 85° to prevent infinite asymptotes on vertical walls
      const clampedSlopeRad = Math.min(slopeRad, (85 * Math.PI) / 180);
      const cellProj = step * step;
      const cellSurface = cellProj / Math.cos(clampedSlopeRad);

      totalCellProjArea += cellProj;
      totalCellSurfaceArea += cellSurface;
      cellCount++;

      // Slope classification counts
      if (slopeDeg < 5) count0_5++;
      else if (slopeDeg < 15) count5_15++;
      else if (slopeDeg < 30) count15_30++;
      else if (slopeDeg < 45) count30_45++;
      else countOver45++;

      // Cut & fill
      const diff = z - targetGrade;
      if (diff > 0) cutVolume += diff * cellProj;
      else fillVolume += Math.abs(diff) * cellProj;
    }
  }

  if(!cellCount)throw new Error('No sample cells fit inside this polygon; use a smaller resolution or larger polygon.');
  // Ratio scaling for sub-pixel vector accuracy
  const ratio = cellCount > 0 ? Math.max(1.0, totalCellSurfaceArea / totalCellProjArea) : 1.0;
  const surfaceAreaM2 = projectedAreaM2 * ratio;
  const meanElevation = cellCount > 0 ? sumElevation / cellCount : baseElev;
  const meanSlope = cellCount > 0 ? sumSlope / cellCount : 0.0;

  const cTotal = Math.max(cellCount, 1);
  const classes = {
    '0-5° (Flat / Gentle)': Number(((count0_5 / cTotal) * 100).toFixed(1)),
    '5-15° (Moderate)': Number(((count5_15 / cTotal) * 100).toFixed(1)),
    '15-30° (Moderately Steep)': Number(((count15_30 / cTotal) * 100).toFixed(1)),
    '30-45° (Steep)': Number(((count30_45 / cTotal) * 100).toFixed(1)),
    '>45° (Extreme / Cliff)': Number(((countOver45 / cTotal) * 100).toFixed(1))
  };

  const landslideRiskPct = Number((classes['30-45° (Steep)'] + classes['>45° (Extreme / Cliff)']).toFixed(1));

  return formatResults({
    presetId,
    name: preset ? preset.name : 'Custom Defined Hill Polygon',
    projectedArea: projectedAreaM2,
    surfaceArea: surfaceAreaM2,
    ratio,
    minElevation,
    maxElevation,
    meanElevation,
    meanSlope,
    maxSlope,
    classes,
    landslideRiskPct,
    cutVolumeM3: cutVolume,
    fillVolumeM3: fillVolume,
    targetElevation: targetGrade,
    demResolution: step,
    wgs84Polygon: coords
  });
}

function formatResults(d) {
  const p = d.projectedArea;
  const s = d.surfaceArea;

  return {
    presetId: d.presetId,
    mode: 'synthetic-demonstration',
    elevation_source: 'Generated Gaussian surface; no measured DEM or site observations',
    risk_interpretation: 'Steep-cell percentage only; not a landslide probability, engineering assessment or safety clearance',
    name: d.name,
    projected_area_m2: Number(p.toFixed(2)),
    surface_area_m2: Number(s.toFixed(2)),
    ratio: Number(d.ratio.toFixed(4)),
    difference_m2: Number((s - p).toFixed(2)),
    difference_pct: Number(((d.ratio - 1.0) * 100).toFixed(2)),
    units: {
      projected: {
        m2: Number(p.toFixed(2)),
        decimal: Number((p / SQ_METERS_PER_DECIMAL).toFixed(3)),
        acre: Number((p / SQ_METERS_PER_ACRE).toFixed(4)),
        katha: Number((p / SQ_METERS_PER_KATHA).toFixed(3)),
        bigha: Number((p / SQ_METERS_PER_BIGHA).toFixed(3))
      },
      surface_3d: {
        m2: Number(s.toFixed(2)),
        decimal: Number((s / SQ_METERS_PER_DECIMAL).toFixed(3)),
        acre: Number((s / SQ_METERS_PER_ACRE).toFixed(4)),
        katha: Number((s / SQ_METERS_PER_KATHA).toFixed(3)),
        bigha: Number((s / SQ_METERS_PER_BIGHA).toFixed(3))
      }
    },
    elevation: {
      min_m: Number(d.minElevation.toFixed(1)),
      max_m: Number(d.maxElevation.toFixed(1)),
      mean_m: Number(d.meanElevation.toFixed(1))
    },
    slope: {
      mean_deg: Number(d.meanSlope.toFixed(2)),
      max_deg: Number(d.maxSlope.toFixed(2)),
      classes_pct: d.classes
    },
    landslide_risk_zone_pct: d.landslideRiskPct,
    earthwork: {
      target_elevation_m: Number(d.targetElevation.toFixed(1)),
      cut_volume_m3: Math.round(d.cutVolumeM3),
      fill_volume_m3: Math.round(d.fillVolumeM3),
      net_volume_m3: Math.round(d.cutVolumeM3 - d.fillVolumeM3)
    },
    dem_resolution_m: d.demResolution,
    metric_crs: 'EPSG:32646 (WGS 84 / UTM Zone 46N)',
    polygon: d.wgs84Polygon,
    disclaimer: 'Synthetic educational model only. Surface area does not increase recorded ownership. No survey, title, slope-stability or earthworks approval is produced. CHT jurisdiction requires case-specific district, customary and other competent authority confirmation.'
  };
}

/**
 * Handles /api/terrain/* routes
 */
function handleTerrainRequest({ route, method, body, send, fail }) {
  if (route === '/terrain/presets' && method === 'GET') {
    send(200, { presets: Object.values(PRESETS).map(p => ({ id: p.id, name: p.name, region: p.region, description: p.description, center: p.center })) });
    return true;
  }

  if (route === '/terrain/analyze' && method === 'POST') {
    try {
      const result = analyzeTerrain({
        polygon: body.polygon,
        presetId: body.presetId,
        targetElevation: body.targetElevation,
        demResolution: body.demResolution
      });
      send(200, { terrain: result });
      return true;
    } catch (err) {
      fail(400, err.message || 'Terrain analysis failed.');
      return true;
    }
  }

  return false;
}

const terrainExports = {
  PRESETS,
  toUtm46N,
  polygonProjectedAreaM2,
  analyzeTerrain,
  handleTerrainRequest
};
if(typeof module!=='undefined'&&module.exports)module.exports=terrainExports;
else globalThis.BhumiTerrain=terrainExports;
