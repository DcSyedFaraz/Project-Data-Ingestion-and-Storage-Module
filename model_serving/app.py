from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Load trained model
model = joblib.load("models/temperature_model.joblib")
app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    year = data.get("year")
    month = data.get("month")
    if year is None or month is None:
        return jsonify({"error": "year and month required"}), 400
    df = pd.DataFrame([[year, month]], columns=["year", "month"])
    pred = model.predict(df)[0]
    return jsonify({"predicted_avg_temp": float(pred)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000)
