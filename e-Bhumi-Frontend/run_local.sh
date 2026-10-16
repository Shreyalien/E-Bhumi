#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"

if command -v node >/dev/null 2>&1; then
  echo "Starting e-Bhumi Frontend via Node.js..."
  exec node server.cjs
elif command -v python3 >/dev/null 2>&1; then
  echo "Starting e-Bhumi Frontend via Python..."
  exec python3 -m http.server 8080
elif command -v python >/dev/null 2>&1; then
  echo "Starting e-Bhumi Frontend via Python..."
  exec python -m http.server 8080
else
  echo "Neither Node.js nor Python was found. Please install Node.js 18+ to run e-Bhumi."
  exit 1
fi
