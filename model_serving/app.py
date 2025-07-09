from flask import Flask, make_response, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Load trained model
model = joblib.load("models/temperature_model.joblib")
app = Flask(__name__)
CORS(app, resources={r"/predict*": {"origins": "http://localhost:3000"}})


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        # must still go through after_request to get the CORS headers
        return make_response("", 204)
    data = request.get_json()
    year = data.get("year")
    month = data.get("month")
    if year is None or month is None:
        return jsonify({"error": "year and month required"}), 400
    df = pd.DataFrame([[year, month]], columns=["year", "month"])
    pred = model.predict(df)[0]
    return jsonify({"predicted_avg_temp": float(pred)})


@app.route("/predict_year", methods=["POST", "OPTIONS"])
def predict_year():
    """Return predictions for all months of a given year."""
    if request.method == "OPTIONS":
        return make_response("", 204)
    data = request.get_json()
    year = data.get("year")
    if year is None:
        return jsonify({"error": "year required"}), 400
    months = list(range(1, 13))
    df = pd.DataFrame([[year, m] for m in months], columns=["year", "month"])
    preds = model.predict(df)
    return jsonify({"year": year, "predictions": [float(p) for p in preds]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
