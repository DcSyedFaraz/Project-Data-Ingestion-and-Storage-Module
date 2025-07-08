FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy and install dependencies
# COPY requirements.txt ./
# RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py ./

# Ensure model directory exists and copy trained model
# Make sure you've placed your trained model file (e.g., temperature_model.joblib)
# under model_serving/models/ before building.
COPY models ./models

# Start the service
CMD ["python", "app.py"]