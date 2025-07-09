FROM python:3.9-slim

# 1) Install Java so pyspark can run
RUN apt-get update \
    && apt-get install -y --no-install-recommends default-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2) Copy in your full requirements (including pyspark)
COPY requirements.txt ./

# 3) Install everything, now including pyspark + its Spark binaries
RUN pip install --no-cache-dir -r requirements.txt

# 4) Copy your preprocessing & training scripts
COPY data_preprocessing.py model_training.py ./

ENTRYPOINT ["python", "model_training.py"]