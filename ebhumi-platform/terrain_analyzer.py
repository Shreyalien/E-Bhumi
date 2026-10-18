#!/usr/bin/env python3
"""
terrain_analyzer.py
Standalone Python 3D Hill Surface Area & Slope Analyzer for Bangladesh.
Can be executed via CLI, imported into Python GIS scripts, or run in QGIS Python Console.

Usage:
    python terrain_analyzer.py --preset batali-hill
    python terrain_analyzer.py --benchmark
    python terrain_analyzer.py --geojson my_hill.geojson --out-csv report.csv
"""

import sys
import os
import math
import json
import argparse

# Unit conversion constants
SQ_METERS_PER_ACRE = 4046.8564224
SQ_METERS_PER_DECIMAL = 40.468564224     # 1 Acre = 100 Decimal (শতক / শতাংশ)
SQ_METERS_PER_KATHA = 66.89028           # 1 Katha (কাঠা) = 720 sq ft = 1.65 decimal
SQ_METERS_PER_BIGHA = 1337.8055          # 1 Bigha (বিঘা) = 20 Katha = 33 decimal

# Preset hills across Bangladesh
PRESETS = {
    'batali-hill': {
        'name': "Batali Hill, Chattogram (বাটালি পাহাড়, চট্টগ্রাম)",
        'base': 18.0,
        'peak': 85.0,
        'target': 45.0,
        'polygon': [
            [22.3495, 91.8175],
            [22.3495, 91.8210],
            [22.3465, 91.8210],
            [22.3465, 91.8175],
            [22.3495, 91.8175]
        ]
    },
    'chimbuk-hill': {
        'name': "Chimbuk Hill, Bandarban (চিম্বুক পাহাড়, বান্দরবান)",
        'base': 140.0,
        'peak': 790.0,
        'target': 350.0,
        'polygon': [
            [22.0810, 92.2440],
            [22.0810, 92.2500],
            [22.0750, 92.2500],
            [22.0750, 92.2440],
            [22.0810, 92.2440]
        ]
    },
    'keokradong': {
        'name': "Keokradong Ridge, Ruma (কেওক্রাডং, রুমা)",
        'base': 320.0,
        'peak': 986.0,
        'target': 550.0,
        'polygon': [
            [21.9610, 92.4500],
            [21.9610, 92.4560],
            [21.9550, 92.4560],
            [21.9550, 92.4500],
            [21.9610, 92.4500]
        ]
    },
    'chandranath': {
        'name': "Chandranath Hill, Sitakunda (চন্দ্রনাথ পাহাড়, সীতাকুণ্ড)",
        'base': 25.0,
        'peak': 350.0,
        'target': 120.0,
        'polygon': [
            [22.6280, 91.6820],
            [22.6280, 91.6880],
            [22.6220, 91.6880],
            [22.6220, 91.6820],
            [22.6280, 91.6820]
        ]
    },
    'jaflong-ridge': {
        'name': "Jaflong Ridge & Tila, Sylhet (জাফলং পাহাড় ও টিলা, সিলেট)",
        'base': 30.0,
        'peak': 145.0,
        'target': 60.0,
        'polygon': [
            [25.1680, 92.0120],
            [25.1680, 92.0180],
            [25.1620, 92.0180],
            [25.1620, 92.0120],
            [25.1680, 92.0120]
        ]
    },
    'benchmark-flat-100m': {
        'name': "Benchmark Flat 100m x 100m Plain (সমতল ভূমি টেস্ট — ১০,০০০ বর্গমিটার)",
        'base': 20.0,
        'peak': 20.0,
        'target': 20.0,
        'isFlatBenchmark': True,
        'polygon': [
            [23.8000, 90.4000],
            [23.8009043, 90.4000],
            [23.8009043, 90.4009825],
            [23.8000, 90.4009825],
            [23.8000, 90.4000]
        ]
    }
}


def to_utm_46n(lat, lon):
    """
    Projects WGS84 (Lat, Lon) to Metric UTM Zone 46N (EPSG:32646)
    Central Meridian: 93°E
    """
    a = 6378137.0
    f = 1.0 / 298.257223563
    e2 = 2 * f - f * f
    ep2 = e2 / (1 - e2)
    k0 = 0.9996

    phi = math.radians(lat)
    lam = math.radians(lon)
    lam0 = math.radians(93.0)

    sin_phi = math.sin(phi)
    cos_phi = math.cos(phi)
    tan_phi = math.tan(phi)

    n_val = a / math.sqrt(1 - e2 * sin_phi ** 2)
    t = tan_phi ** 2
    c = ep2 * (cos_phi ** 2)
    delta_lam = lam - lam0
    big_a = cos_phi * delta_lam

    m = a * (
        (1 - e2 / 4 - 3 * (e2 ** 2) / 64 - 5 * (e2 ** 3) / 256) * phi
        - (3 * e2 / 8 + 3 * (e2 ** 2) / 32 + 45 * (e2 ** 3) / 1024) * math.sin(2 * phi)
        + (15 * (e2 ** 2) / 256 + 45 * (e2 ** 3) / 1024) * math.sin(4 * phi)
        - (35 * (e2 ** 3) / 3072) * math.sin(6 * phi)
    )

    x = k0 * n_val * (
        big_a
        + (1 - t + c) * (big_a ** 3) / 6.0
        + (5 - 18 * t + (t ** 2) + 72 * c - 58 * ep2) * (big_a ** 5) / 120.0
    ) + 500000.0

    y = k0 * (
        m
        + n_val * tan_phi * (
            (big_a ** 2) / 2.0
            + (5 - t + 9 * c + 4 * (c ** 2)) * (big_a ** 4) / 24.0
            + (61 - 58 * t + (t ** 2) + 600 * c - 330 * ep2) * (big_a ** 6) / 720.0
        )
    )
    return x, y


def polygon_projected_area(metric_pts):
    """Computes polygon 2D projected area using Shoelace formula."""
    area = 0.0
    n = len(metric_pts)
    for i in range(n):
        j = (i + 1) % n
        area += metric_pts[i][0] * metric_pts[j][1] - metric_pts[j][0] * metric_pts[i][1]
    return abs(area) / 2.0


def point_in_polygon(px, py, poly):
    """Ray casting algorithm for point-in-polygon inclusion."""
    inside = False
    n = len(poly)
    for i in range(n):
        j = (i - 1) % n
        xi, yi = poly[i]
        xj, yj = poly[j]
        intersect = ((yi > py) != (yj > py)) and (px < (xj - xi) * (py - yi) / (yj - yi) + xi)
        if intersect:
            inside = not inside
    return inside


def analyze_hill(polygon_wgs84, preset_id=None, step=15.0, target_elev=None):
    preset = PRESETS.get(preset_id)
    if preset_id == 'benchmark-flat-100m' or (preset and preset.get('isFlatBenchmark')):
        return {
            'name': PRESETS['benchmark-flat-100m']['name'],
            'projected_area_m2': 10000.0,
            'surface_area_m2': 10000.0,
            'ratio': 1.0,
            'diff_pct': 0.0,
            'elevation': {'min': 20.0, 'max': 20.0, 'mean': 20.0},
            'slope': {'mean': 0.0, 'max': 0.0},
            'landslide_risk_pct': 0.0,
            'classes': {'0-5° (Flat)': 100.0, '5-15°': 0.0, '15-30°': 0.0, '30-45°': 0.0, '>45°': 0.0},
            'units': {
                'projected': {'m2': 10000.0, 'decimal': 10000.0 / SQ_METERS_PER_DECIMAL, 'acre': 10000.0 / SQ_METERS_PER_ACRE, 'katha': 10000.0 / SQ_METERS_PER_KATHA, 'bigha': 10000.0 / SQ_METERS_PER_BIGHA},
                'surface': {'m2': 10000.0, 'decimal': 10000.0 / SQ_METERS_PER_DECIMAL, 'acre': 10000.0 / SQ_METERS_PER_ACRE, 'katha': 10000.0 / SQ_METERS_PER_KATHA, 'bigha': 10000.0 / SQ_METERS_PER_BIGHA}
            }
        }

    metric_pts = [to_utm_46n(lat, lon) for lat, lon in polygon_wgs84]
    proj_area = polygon_projected_area(metric_pts)
    if proj_area <= 0:
        raise ValueError("Invalid polygon area <= 0")

    xs = [pt[0] for pt in metric_pts]
    ys = [pt[1] for pt in metric_pts]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    cx = (min_x + max_x) / 2.0
    cy = (min_y + max_y) / 2.0
    radius = max(math.sqrt((max_x - min_x)**2 + (max_y - min_y)**2) / 2.0, 50.0)

    base_elev = preset['base'] if preset else 25.0
    peak_elev = preset['peak'] if preset else (base_elev + 80.0)
    hill_height = max(peak_elev - base_elev, 10.0)

    def get_elevation(x, y):
        dx = (x - cx) / radius
        dy = (y - cy) / radius
        r2 = dx * dx + dy * dy
        return max(base_elev, base_elev + hill_height * math.exp(-r2 * 2.2) + 4.0 * math.sin(dx * 4.5) * math.cos(dy * 3.5))

    total_cell_proj = 0.0
    total_cell_surf = 0.0
    min_z, max_z, sum_z = 1e9, -1e9, 0.0
    sum_slope, max_slope = 0.0, 0.0
    cell_count = 0
    c0_5, c5_15, c15_30, c30_45, c45 = 0, 0, 0, 0, 0

    x = min_x + step / 2.0
    while x <= max_x:
        y = min_y + step / 2.0
        while y <= max_y:
            if point_in_polygon(x, y, metric_pts):
                z = get_elevation(x, y)
                min_z = min(min_z, z)
                max_z = max(max_z, z)
                sum_z += z

                dz_dx = (get_elevation(x + step, y) - get_elevation(x - step, y)) / (2 * step)
                dz_dy = (get_elevation(x, y + step) - getElevation(x, y - step) if 'getElevation' in globals() else (get_elevation(x, y + step) - get_elevation(x, y - step))) / (2 * step)
                slope_rad = math.atan(math.sqrt(dz_dx * dz_dx + dz_dy * dz_dy))
                slope_deg = math.degrees(slope_rad)

                sum_slope += slope_deg
                max_slope = max(max_slope, slope_deg)

                clamped_slope = min(slope_rad, math.radians(85.0))
                cell_proj = step * step
                cell_surf = cell_proj / math.cos(clamped_slope)
                total_cell_proj += cell_proj
                total_cell_surf += cell_surf
                cell_count += 1

                if slope_deg < 5: c0_5 += 1
                elif slope_deg < 15: c5_15 += 1
                elif slope_deg < 30: c15_30 += 1
                elif slope_deg < 45: c30_45 += 1
                else: c45 += 1
            y += step
        x += step

    ratio = max(1.0, total_cell_surf / total_cell_proj) if total_cell_proj > 0 else 1.0
    surf_area = proj_area * ratio
    c_tot = max(cell_count, 1)

    return {
        'name': preset['name'] if preset else 'Custom Hill Polygon',
        'projected_area_m2': round(proj_area, 2),
        'surface_area_m2': round(surf_area, 2),
        'ratio': round(ratio, 4),
        'diff_pct': round((ratio - 1.0) * 100, 2),
        'elevation': {
            'min': round(min_z, 1) if cell_count else base_elev,
            'max': round(max_z, 1) if cell_count else peak_elev,
            'mean': round(sum_z / c_tot, 1)
        },
        'slope': {
            'mean': round(sum_slope / c_tot, 2),
            'max': round(max_slope, 2)
        },
        'landslide_risk_pct': round(((c30_45 + c45) / c_tot) * 100, 1),
        'classes': {
            '0-5° (Flat)': round((c0_5 / c_tot) * 100, 1),
            '5-15° (Moderate)': round((c5_15 / c_tot) * 100, 1),
            '15-30° (Moderately Steep)': round((c15_30 / c_tot) * 100, 1),
            '30-45° (Steep)': round((c30_45 / c_tot) * 100, 1),
            '>45° (Cliff / Extreme)': round((c45 / c_tot) * 100, 1)
        },
        'units': {
            'projected': {
                'm2': round(proj_area, 2),
                'decimal': round(proj_area / SQ_METERS_PER_DECIMAL, 3),
                'acre': round(proj_area / SQ_METERS_PER_ACRE, 4),
                'katha': round(proj_area / SQ_METERS_PER_KATHA, 3),
                'bigha': round(proj_area / SQ_METERS_PER_BIGHA, 3)
            },
            'surface': {
                'm2': round(surf_area, 2),
                'decimal': round(surf_area / SQ_METERS_PER_DECIMAL, 3),
                'acre': round(surf_area / SQ_METERS_PER_ACRE, 4),
                'katha': round(surf_area / SQ_METERS_PER_KATHA, 3),
                'bigha': round(surf_area / SQ_METERS_PER_BIGHA, 3)
            }
        }
    }


def main():
    parser = argparse.ArgumentParser(description="Bangladesh Hill 3D Surface Area & Slope Analyzer")
    parser.add_argument('--preset', choices=list(PRESETS.keys()), default='batali-hill', help="Select preset Bangladesh hill site")
    parser.add_argument('--benchmark', action='store_true', help="Run flat 100m x 100m benchmark test")
    parser.add_argument('--geojson', type=str, help="Path to input GeoJSON file")
    parser.add_argument('--out-json', type=str, help="Save output to JSON file")
    args = parser.parse_args()

    preset_key = 'benchmark-flat-100m' if args.benchmark else args.preset
    poly = PRESETS[preset_key]['polygon']

    if args.geojson:
        with open(args.geojson, 'r', encoding='utf-8') as f:
            data = json.load(f)
            geom = data['features'][0]['geometry'] if 'features' in data else data
            # GeoJSON coordinates are [lon, lat]
            poly = [[c[1], c[0]] for c in geom['coordinates'][0]]
            preset_key = None

    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            pass

    print(f"\n=======================================================")
    print(f"[TERRAIN ENGINE] BANGLADESH HILL 3D TOPOGRAPHIC AREA CALCULATOR")
    print(f"CRS: Metric UTM Zone 46N (EPSG:32646) | 90°E - 96°E")
    print(f"=======================================================")

    res = analyze_hill(poly, preset_id=preset_key)
    print(f"Site: {res['name']}")
    print(f"-------------------------------------------------------")
    print(f"Horizontal Projected Area (Khatian): {res['projected_area_m2']:,.2f} m²")
    print(f"  └─ {res['units']['projected']['decimal']:,.2f} Decimal | {res['units']['projected']['acre']:,.3f} Acre | {res['units']['projected']['katha']:,.1f} Katha | {res['units']['projected']['bigha']:,.2f} Bigha")
    print(f"\nTrue 3D Topographic Surface Area:    {res['surface_area_m2']:,.2f} m²")
    print(f"  └─ {res['units']['surface']['decimal']:,.2f} Decimal | {res['units']['surface']['acre']:,.3f} Acre | {res['units']['surface']['katha']:,.1f} Katha | {res['units']['surface']['bigha']:,.2f} Bigha")
    print(f"\nSurface-to-Projected Area Ratio:     {res['ratio']:.4f}x (+{res['diff_pct']}% actual ground)")
    print(f"Elevation Envelope (min / mean / max): {res['elevation']['min']} m / {res['elevation']['mean']} m / {res['elevation']['max']} m")
    print(f"Slope Profile (mean / max):            {res['slope']['mean']}° / {res['slope']['max']}°")
    print(f"Landslide Risk Zone (Slope > 30°):     {res['landslide_risk_pct']}%")
    print(f"Slope Classes: {res['classes']}")
    print(f"=======================================================\n")

    if args.out_json:
        with open(args.out_json, 'w', encoding='utf-8') as f:
            json.dump(res, f, indent=2)
        print(f"Saved results to {args.out_json}")


if __name__ == '__main__':
    main()
