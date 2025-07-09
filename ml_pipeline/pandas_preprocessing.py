"""Preprocess parquet batch data using pandas."""
import argparse
import pandas as pd


def main(input_path: str, output_path: str) -> None:
    df = pd.read_parquet(input_path)
    df_clean = df.dropna(subset=['avg_temp'])[['year', 'month', 'avg_temp']]
    df_clean.to_parquet(output_path, index=False)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='Batch parquet file')
    parser.add_argument('--output', required=True, help='Output path for cleaned data')
    args = parser.parse_args()
    main(args.input, args.output)
