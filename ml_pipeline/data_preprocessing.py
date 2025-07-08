"""
Preprocess raw climate data from HDFS for model training.
"""

import argparse
import os
from pyspark.sql import SparkSession
from pyspark.sql.functions import col


def main(input_path: str, output_path: str):
    spark = SparkSession.builder.appName("DataPreprocessing").getOrCreate()
    df = spark.read.parquet(input_path)

    # Example: filter out nulls and select features
    df_clean = df.dropna(subset=["avg_temp"]).select(
        col("year"), col("month"), col("avg_temp")
    )

    df_clean.write.mode("overwrite").parquet(output_path)
    spark.stop()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    main(args.input, args.output)
