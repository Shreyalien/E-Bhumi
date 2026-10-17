"""Optional CLI for the same synthetic terrain engine used by the website.

Requires Python 3 and Node.js. This does not read a measured DEM, assess site
safety, determine ownership or authorise earthworks.
"""
import argparse
import csv
import json
from pathlib import Path
import subprocess
import sys


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--preset', default='batali-hill')
    parser.add_argument('--benchmark', action='store_true')
    parser.add_argument('--geojson', type=Path)
    parser.add_argument('--out-csv', type=Path)
    parser.add_argument('--target-elevation', type=float)
    parser.add_argument('--resolution', type=float, default=15)
    args = parser.parse_args()
    request = {'presetId': 'benchmark-flat-100m' if args.benchmark else args.preset,
               'demResolution': args.resolution}
    if args.target_elevation is not None:
        request['targetElevation'] = args.target_elevation
    if args.geojson:
        data = json.loads(args.geojson.read_text(encoding='utf-8'))
        geometry = data.get('geometry', data)
        if geometry.get('type') != 'Polygon' or len(geometry.get('coordinates', [])) != 1:
            parser.error('Provide a WGS84 Polygon with one exterior ring and no holes.')
        request['polygon'] = [[lat, lon] for lon, lat in geometry['coordinates'][0]]
    engine = Path(__file__).resolve().parent / 'lib' / 'terrain-engine.cjs'
    code = "const fs=require('fs');try{console.log(JSON.stringify(require(process.argv[1]).analyzeTerrain(JSON.parse(fs.readFileSync(0,'utf8')))));}catch(e){console.error(e.message);process.exitCode=1;}"
    result = subprocess.run(['node', '-e', code, str(engine)], input=json.dumps(request),
                            text=True, encoding='utf-8', capture_output=True, timeout=15, check=False)
    if result.returncode:
        raise ValueError(result.stderr.strip())
    data = json.loads(result.stdout)
    if args.out_csv:
        with args.out_csv.open('w', newline='', encoding='utf-8') as output:
            writer = csv.writer(output)
            writer.writerow(['parameter', 'value'])
            writer.writerows((key, json.dumps(value, ensure_ascii=False) if isinstance(value, (list, dict)) else value)
                             for key, value in data.items())
    print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.TimeoutExpired) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
