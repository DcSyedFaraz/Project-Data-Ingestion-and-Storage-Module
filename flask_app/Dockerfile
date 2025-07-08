FROM python:3.9-slim

# Create app directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . ./

# Expose port and run
ENV NAMENODE_URL=http://namenode:50070
ENV HDFS_USER=hdfs
ENV JWT_SECRET=supersecretkey
EXPOSE 5000
CMD ["python", "app.py"]