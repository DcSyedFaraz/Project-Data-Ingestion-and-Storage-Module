"""Batch processing of climate data without Spark."""
import argparse
import pandas as pd


def main(input_path: str, output_path: str) -> None:
    df = pd.read_json(input_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['year'] = df['timestamp'].dt.year
    df['month'] = df['timestamp'].dt.month
    result = (
        df.groupby(['year', 'month'])['temperature']
        .mean()
        .reset_index()
        .rename(columns={'temperature': 'avg_temp'})
    )
    result.to_parquet(output_path, index=False)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='Path to input JSON file')
    parser.add_argument('--output', required=True, help='Output Parquet file')
    args = parser.parse_args()
    main(args.input, args.output)
