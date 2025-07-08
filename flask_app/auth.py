import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, Blueprint
import jwt

auth_bp = Blueprint("auth", __name__)
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_HOURS = 2


@auth_bp.route("/login", methods=["POST"])
def login():
    creds = request.get_json()
    username = creds.get("username")
    password = creds.get("password")
    # TODO: replace with real user validation
    if username == os.getenv("ADMIN_USER", "admin") and password == os.getenv(
        "ADMIN_PASS", "password"
    ):
        payload = {
            "user": username,
            "exp": datetime.utcnow() + timedelta(hours=JWT_EXP_DELTA_HOURS),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 401


# Decorator to protect routes
def jwt_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401
        parts = auth_header.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            return jsonify({"error": "Invalid Authorization header"}), 401
        token = parts[1]
        try:
            jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)

    return wrapper
