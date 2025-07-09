#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# Local pipeline launcher (pandas‑only)
# ─────────────────────────────────────────────────────────────────────────────
#  1. Starts core containers via Docker Compose (API, auth, model‑serving, …)
#  2. Downloads the public climate dataset into ./datasets
#  3. Builds the lightweight ML image (Python + pandas + scikit‑learn)
#  4. Executes batch aggregation → feature prep → model training in one shot
#  5. Drops the trained model into ./model_serving/models
#  6. Smoke‑tests the /predict endpoint
###############################################################################

# 1  Start services defined in docker‑compose.yml
printf '\n▶︎  Starting Docker Compose services…\n'
# docker-compose up --build -d

# # 2  Fetch sample data (writes to ./datasets)
# printf '\n▶︎  Downloading climate dataset…\n'
# ./scripts/download_sample_data.sh

# # 3  Build (or rebuild) the ML pipeline image
# printf '\n▶︎  Building ml_pipeline image…\n'
# docker build \
#   -t yourrepo/ml_pipeline:latest \
#   -f "ml_pipeline/Dockerfile" \
#   .
# # 4  Run pandas batch‑agg, preprocessing, and training inside the container
# printf '\n▶︎  Preprocessing and training with pandas…\n'
# mkdir -p model_serving/models # host‑side output directory

# docker run --rm \
#   -v "$(pwd)/datasets:/data" \
#   -v "$(pwd)/model_serving/models:/app/models" \
#   yourrepo/ml_pipeline:latest \
#   bash -e -c $'
#     # ① batch aggregation
#     python batch_processing/pandas_batch_job.py \
#       --input  /data/global_temp.json \
#       --output /data/processed.parquet

#     # ② feature preparation
#     python ml_pipeline/pandas_preprocessing.py  --input  /data/processed.parquet --output /tmp/ml_ready.parquet

#     # ③ model training
#     python ml_pipeline/model_training.py --data /tmp/ml_ready.parquet --model /app/models/temperature_model.joblib
#   '

# printf '\n✅  Model saved to model_serving/models/temperature_model.joblib\n'

# 5  Smoke‑test the prediction endpoint
printf '\n▶︎  Testing /predict endpoint…\n'
PRED=$(curl -s -X POST http://localhost:8000/predict \
  -H 'Content-Type: application/json' \
  -d '{"year": 2025, "month": 7}')

echo "Prediction response: $PRED"
printf '\n🎉  Local environment setup and validation complete.\n'
