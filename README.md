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

