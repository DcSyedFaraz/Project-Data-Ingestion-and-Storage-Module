FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py ./

# Copy trained model directory (ensure this exists before build)
COPY models ./models

# Expose port
EXPOSE 6000

# Start the service
CMD ["python", "app.py"]