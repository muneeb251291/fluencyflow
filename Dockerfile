# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.13-slim

# Allow statements and log messages to immediately appear in the logs
ENV PYTHONUNBUFFERED True

# Set the working directory in the container
ENV APP_HOME /app
WORKDIR $APP_HOME

# Copy local code to the container image.
COPY . ./

# Install production dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Install gunicorn for production WSGI server
RUN pip install --no-cache-dir gunicorn

# Run the web service on container startup.
# Cloud Run sets the PORT environment variable automatically.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
