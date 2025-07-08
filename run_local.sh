#!/usr/bin/env bash
set -euo pipefail

# 1. Bring up all services
echo "Starting Docker Compose services..."
docker-compose up --build -d

# 2. Wait for HDFS namenode to be healthy
echo "Waiting for HDFS namenode..."
until curl -sf http://localhost:9870/ >/dev/null; do
  echo -n "."; sleep 2
done

echo "HDFS namenode is up."

# 3. Format HDFS (first-run only)
if [ ! -f ./.hdfs_formatted ]; then
  echo "Formatting HDFS namenode..."
  docker exec namenode hdfs namenode -format -force
  touch ./.hdfs_formatted
else
  echo "HDFS already formatted."
fi

# 4. Create Kafka topic if not exists
echo "Creating Kafka topic climate_data..."
if ! docker exec kafka kafka-topics.sh --list --bootstrap-server kafka:9092 | grep -q climate_data; then
  docker exec kafka kafka-topics.sh --create --topic climate_data --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1
else
  echo "Kafka topic climate_data already exists."
fi

# 5. Build ML model (if not exists)
echo "Building ML model..."
# Ensure host directory models/ exists
mkdir -p model_serving/models
# Run preprocessing and training inside a temporary container
docker run --rm \
  --network host \
  -v $(pwd)/model_serving/models:/app/models \
  yourrepo/ml_pipeline:latest \
  python data_preprocessing.py --input hdfs://localhost:9000/data/processed --output /tmp/ml_ready && \
  python model_training.py --data /tmp/ml_ready --model /app/models/temperature_model.joblib

echo "ML model built and saved to model_serving/models/temperature_model.joblib"

# 6. Ingest sample data
echo "Ingesting sample data..."
echo '[{"timestamp":"2025-07-01T00:00:00Z","temperature":22.5,"station_id":"S1"}]' > sample.json
TOKEN=$(curl -s -X POST http://localhost:5000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"password"}' | jq -r .token)
curl -s -X POST http://localhost:5000/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F file=@sample.json > /dev/null

echo "Sample data ingested."

# 7. Run batch job
echo "Running batch processing..."
docker exec -i namenode spark-submit \
  --master local[*] /app/batch_processing/run_batch_jobs.py \
  --input hdfs://localhost:9000/data/raw \
  --output hdfs://localhost:9000/data/processed

echo "Batch processing complete."

# 8. Run streaming job (background)
echo "Starting streaming job..."
docker exec -d namenode spark-submit \
  --master local[*] /app/streaming/spark_streaming/run_streaming_job.py \
  --broker localhost:9092 \
  --topic climate_data \
  --output hdfs://localhost:9000/data/streaming

# 9. Smoke test endpoints
echo "Testing prediction endpoint..."
PRED=$(curl -s -X POST http://localhost:6000/predict \
  -H 'Content-Type: application/json' \
  -d '{"year":2025,"month":7}')
echo "Prediction response: $PRED"

echo "Local environment setup and validation complete."