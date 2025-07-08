"""
Train a regression model to predict average monthly temperature.
"""

import argparse
import joblib
import os
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error


def load_data(path: str):
    df = pd.read_parquet(path)
    X = df[["year", "month"]].values
    y = df["avg_temp"].values
    return X, y


def main(train_path: str, model_path: str):
    X, y = load_data(train_path)

    model = LinearRegression()
    model.fit(X, y)

    preds = model.predict(X)
    mse = mean_squared_error(y, preds)
    print(f"Training MSE: {mse:.4f}")

    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Preprocessed data path")
    parser.add_argument("--model", required=True, help="Output model file path")
    args = parser.parse_args()
    main(args.data, args.model)
