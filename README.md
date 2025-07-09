# Climate Data Ingestion and Processing Pipeline

This project provides a small end-to-end example of ingesting climate data, processing it with Hadoop and Spark, and training a simple machine learning model. The stack includes Hadoop HDFS, Kafka, Spark for batch and streaming, and Flask services for data ingestion and model serving.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- `jq` command line tool for JSON parsing (used by `run_local.sh`)

## Quick Start

1. **Build the ML pipeline image**

   ```bash
   docker build -t yourrepo/ml_pipeline:latest ./ml_pipeline
   ```

2. **Run the pipeline locally**
   ```bash
   ./run_local.sh
   ```
   The script will start all required services, ingest example data, run a Spark batch job, train a model and launch a streaming job. A prediction example is printed at the end.

## Components

- **HDFS** – namenode and datanode containers for distributed storage
- **Kafka** – message broker used for streaming
- **Flask ingestion API** – uploads JSON data into HDFS
- **Model serving API** – serves a trained `LinearRegression` model
- **Next.js frontend** – minimal UI for interaction

The `run_local.sh` script orchestrates these services and demonstrates a basic workflow. Adjust the script or compose file as needed for your environment.

## Downloading sample data

To experiment with real data, a helper script fetches the [public global temperature dataset](https://datahub.io/core/global-temp). Run:

```bash
./scripts/download_sample_data.sh
```

This creates `datasets/global_temp.json` which is automatically uploaded to HDFS when running `run_local.sh`. You can also upload it manually:

```bash
python ingestion/upload_to_hdfs.py \
  --namenode http://localhost:9870 \
  --local datasets/global_temp.json \
  --dest /data/raw/global_temp.json
```

Processed output is written to `hdfs://localhost:9000/data/processed`.

## Windows-compatible processing without Spark

If you cannot run Spark (for example on Windows without a full Java setup), this
repository provides lightweight alternatives that rely only on `pandas` and
`pyarrow`.

- `batch_processing/pandas_batch_job.py` reads the raw JSON data and produces
  monthly averages as a Parquet file.
- `ml_pipeline/pandas_preprocessing.py` cleans that Parquet output for model
  training.

Example usage:

```bash
python batch_processing/pandas_batch_job.py \
  --input datasets/global_temp.json \
  --output datasets/processed.parquet
python ml_pipeline/pandas_preprocessing.py \
  --input datasets/processed.parquet \
  --output datasets/ml_ready.parquet
```

You can then train the model with `ml_pipeline/model_training.py` using the
`--data datasets/ml_ready.parquet` argument.

## Advanced Machine Learning

Additional scripts under `ml_pipeline` provide more sophisticated analytics:

- `advanced_models.py` trains anomaly detection and trend prediction models and
  outputs feature correlations.
- `update_models.py` retrains those models whenever new data becomes available.

Models are stored in timestamped directories so historical versions remain
accessible.

Example training commands:

```bash
# Train anomaly detection and trend models
python ml_pipeline/advanced_models.py \
  --data datasets/ml_ready.parquet \
  --out_dir models/latest

# Re-train models whenever new data arrives
python ml_pipeline/update_models.py \
  --data datasets/ml_ready.parquet \
  --output models
```

## Interactive Dashboard

The frontend includes a `/dashboard` page visualizing climate trends with
`chart.js`. Data comes from the Flask `/dashboard` endpoint, which reads
monthly averages from `datasets/processed.parquet` (or the path specified by
the `DASHBOARD_DATA` environment variable).

Run the Flask API:

```bash
python flask_app/app.py
```

In another terminal start the frontend:

```bash
cd frontend && npm run dev
```

Then open <http://localhost:3000/dashboard> to view the dashboard.

## Model Browser

The Flask API also exposes `/models`, returning a list of trained model
directories and the files contained in each. The frontend page `/models`
fetches this data so you can inspect what was produced by `advanced_models.py`
or `update_models.py`.

Open <http://localhost:3000/models> to view the available model files.

## Prediction Chart

The homepage can also visualize predictions for an entire year. Enter a year and
click **Year Chart** to fetch monthly temperature predictions from the model
serving API and display them using `chart.js`.

## Notifications and Support

The ingestion service exposes `/alert` for posting real-time alerts and
`/support` for submitting user feedback. Alerts are printed to configured email
recipients via the `ALERT_EMAILS` environment variable, while support messages
are stored in `SUPPORT_LOG`.

Example usage:

```bash
# Send an alert (requires valid JWT token in Authorization header)
curl -X POST http://localhost:5000/alert \
  -H 'Content-Type: application/json' \
  -d '{"message": "Temperature anomaly"}'

# Submit a support request
curl -X POST http://localhost:5000/support \
  -H 'Content-Type: application/json' \
  -d '{"message": "Need help with the dashboard"}'
```
