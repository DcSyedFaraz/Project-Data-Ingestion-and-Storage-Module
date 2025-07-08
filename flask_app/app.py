from flask import Flask, request, jsonify
import os
from hdfs import InsecureClient
from auth import auth_bp, jwt_required

app = Flask(__name__)
app.register_blueprint(auth_bp, url_prefix="/auth")

# Configure HDFS client
client = InsecureClient(
    os.getenv("NAMENODE_URL", "http://namenode:50070"),
    user=os.getenv("HDFS_USER", "hdfs"),
)


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
