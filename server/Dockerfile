# Use an official Python runtime as a parent image
FROM python:3.9

# Set environment variables
ENV POSTGRES_HOST="localhost" \
    POSTGRES_DB="nsrentals" \
    POSTGRES_USER="blackholes" \
    POSTGRES_PORT="5432" \
    POSTGRES_PASSWORD="Blackholes@7007"

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8070 available to the world outside this container
EXPOSE 8070

# Run app.py when the container launches
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8070"]
