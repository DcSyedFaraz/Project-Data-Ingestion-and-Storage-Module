"""Utility to retrain models with the latest data."""
import argparse
import os
from datetime import datetime
from advanced_models import (
    load_data,
    train_anomaly_detector,
    train_trend_model,
    compute_correlations,
)


def main(data_path: str, output_dir: str) -> None:
    df = load_data(data_path)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    model_dir = os.path.join(output_dir, timestamp)
    os.makedirs(model_dir, exist_ok=True)

    train_anomaly_detector(df, os.path.join(model_dir, "anomaly_detector.joblib"))
    train_trend_model(df, os.path.join(model_dir, "trend_model.joblib"))
    compute_correlations(df, os.path.join(model_dir, "correlations.csv"))

    print(f"Models updated in {model_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Clean dataset path")
    parser.add_argument(
        "--output", required=True, help="Directory where models will be stored"
    )
    args = parser.parse_args()
    main(args.data, args.output)
