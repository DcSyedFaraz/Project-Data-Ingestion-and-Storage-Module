#!/usr/bin/env bash
set -euo pipefail

mkdir -p datasets
DATA_CSV=datasets/global_temp.csv
DATA_JSON=datasets/global_temp.json

if [ ! -f "$DATA_CSV" ]; then
  echo "Downloading global temperature dataset..."
  curl -Ls -o "$DATA_CSV" https://datahub.io/core/global-temp/r/monthly.csv
fi

python <<'PY'
import csv, json
csv_path='$DATA_CSV'
json_path='$DATA_JSON'
rows=[]
with open(csv_path) as f:
    r=csv.DictReader(f)
    for row in r:
        year=row['Year']
        mean=row['Mean']
        if '-' in year:
            y, m = year.split('-')[:2]
            ts=f"{y}-{m}-01T00:00:00Z"
        else:
            ts=f"{year}-01-01T00:00:00Z"
        rows.append({'timestamp': ts, 'temperature': float(mean), 'station_id': 'GLOBAL'})
with open(json_path, 'w') as out:
    json.dump(rows, out)
PY

echo "Dataset prepared at $DATA_JSON"
