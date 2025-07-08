"""
PySpark job to process ingested climate data in HDFS.
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import year, month, avg


def main(hdfs_input_path: str, hdfs_output_path: str):
    spark = (
        SparkSession.builder.appName("ClimateDataBatchProcessor")
        .config("spark.sql.shuffle.partitions", "200")
        .getOrCreate()
    )

    df = spark.read.json(hdfs_input_path)
    df = df.withColumn("year", year("timestamp")).withColumn(
        "month", month("timestamp")
    )
    result = df.groupBy("year", "month").agg(avg("temperature").alias("avg_temp"))
    result.write.mode("overwrite").parquet(hdfs_output_path)
    spark.stop()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    main(args.input, args.output)
