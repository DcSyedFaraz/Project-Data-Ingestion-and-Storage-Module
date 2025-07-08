"""
Spark Structured Streaming job to consume climate data from Kafka, compute real-time metrics, and store to HDFS.
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, window, avg
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    DoubleType,
    TimestampType,
)


def main(broker: str, topic: str, hdfs_output: str):
    spark = SparkSession.builder.appName("ClimateDataStreamingProcessor").getOrCreate()

    schema = StructType(
        [
            StructField("timestamp", TimestampType()),
            StructField("temperature", DoubleType()),
            StructField("station_id", StringType()),
        ]
    )

    df = (
        spark.readStream.format("kafka")
        .option("kafka.bootstrap.servers", broker)
        .option("subscribe", topic)
        .load()
    )

    json_df = (
        df.selectExpr("CAST(value AS STRING) as json")
        .select(from_json(col("json"), schema).alias("data"))
        .select("data.*")
    )

    agg_df = (
        json_df.withWatermark("timestamp", "1 minute")
        .groupBy(window(col("timestamp"), "2 minutes", "1 minute"), col("station_id"))
        .agg(avg("temperature").alias("avg_temp"))
    )

    query = (
        agg_df.writeStream.outputMode("update")
        .format("parquet")
        .option("path", hdfs_output)
        .option("checkpointLocation", "/tmp/spark_checkpoints")
        .start()
    )

    query.awaitTermination()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--broker", required=True)
    parser.add_argument("--topic", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    main(args.broker, args.topic, args.output)
