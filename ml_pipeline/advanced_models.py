import argparse
import joblib
import os
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error


def load_data(path: str) -> pd.DataFrame:
    """Load parquet data and return a dataframe."""
    return pd.read_parquet(path)


def train_anomaly_detector(df: pd.DataFrame, model_path: str) -> None:
    """Train an IsolationForest model to detect anomalies."""
    model = IsolationForest(contamination=0.01, random_state=42)
    model.fit(df[["avg_temp"]])
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"Anomaly detector saved to {model_path}")


def train_trend_model(df: pd.DataFrame, model_path: str) -> None:
    """Train a simple trend prediction model."""
    X = df[["year", "month"]].values
    y = df["avg_temp"].values
    model = LinearRegression()
    model.fit(X, y)
    preds = model.predict(X)
    mse = mean_squared_error(y, preds)
    print(f"Trend model MSE: {mse:.4f}")
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"Trend model saved to {model_path}")


def compute_correlations(df: pd.DataFrame, output_path: str) -> None:
    """Compute and save feature correlations."""
    corr = df.corr()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    corr.to_csv(output_path)
    print(f"Correlation matrix saved to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train advanced climate models")
    parser.add_argument("--data", required=True, help="Clean training dataset")
    parser.add_argument("--out_dir", required=True, help="Directory to save models")
    args = parser.parse_args()

    df = load_data(args.data)
    train_anomaly_detector(df, os.path.join(args.out_dir, "anomaly_detector.joblib"))
    train_trend_model(df, os.path.join(args.out_dir, "trend_model.joblib"))
    compute_correlations(df, os.path.join(args.out_dir, "correlations.csv"))
