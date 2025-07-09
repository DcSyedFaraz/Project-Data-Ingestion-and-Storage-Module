from flask import Flask, request, jsonify
import os
from hdfs import InsecureClient
from auth import auth_bp, jwt_required
from datetime import datetime
import pandas as pd

app = Flask(__name__)
app.register_blueprint(auth_bp, url_prefix="/auth")

# Configure HDFS client
client = InsecureClient(
    os.getenv("NAMENODE_URL", "http://namenode:50070"),
    user=os.getenv("HDFS_USER", "hdfs"),
)

# Simple alert function
def send_alert(message: str) -> None:
    emails = os.getenv("ALERT_EMAILS", "").split(",")
    if emails == [""]:
        emails = []
    print(f"Sending alert to {emails}: {message}")


@app.route("/alert", methods=["POST"])
@jwt_required
def alert():
    payload = request.get_json()
    msg = payload.get("message") if payload else None
    if not msg:
        return jsonify({"error": "message required"}), 400
    send_alert(msg)
    return jsonify({"status": "alert sent"})


@app.route("/support", methods=["POST"])
def support():
    data = request.get_json()
    msg = data.get("message") if data else None
    if not msg:
        return jsonify({"error": "message required"}), 400
    log_path = os.path.join(os.getenv("SUPPORT_LOG", "/tmp/support.log"))
    with open(log_path, "a") as fh:
        fh.write(f"{datetime.utcnow().isoformat()} {msg}\n")
    return jsonify({"status": "received"})


@app.route("/dashboard", methods=["GET"])
def dashboard():
    """Return average monthly temperatures."""
    data_path = os.getenv("DASHBOARD_DATA", "datasets/processed.parquet")
    if not os.path.exists(data_path):
        return jsonify({"error": "data not found"}), 404

    df = pd.read_parquet(data_path)
    monthly = (
        df.groupby("month")["avg_temp"]
        .mean()
        .reindex(range(1, 13), fill_value=0)
    )
    payload = {"labels": monthly.index.tolist(), "values": monthly.values.tolist()}
    return jsonify(payload)


@app.route("/upload", methods=["POST"])
@jwt_required
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    tmp_path = os.path.join("/tmp", f.filename)
    f.save(tmp_path)
    hdfs_path = f"/data/{f.filename}"
    try:
        client.upload(hdfs_path, tmp_path, overwrite=True)
        os.remove(tmp_path)
        return jsonify({"status": "success", "hdfs_path": hdfs_path}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
