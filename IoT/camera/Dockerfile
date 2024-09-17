# Use an official Python runtime as a parent image
FROM python:3.8-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install build essentials and system libraries (needed for some Python packages)
# RUN apk add --no-cache build-essential libssl-dev libffi-dev

# RUN apt-get update && apt-get install -y build-essential libssl-dev libffi-dev

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 3006 available to the world outside this container
EXPOSE 3006

# Run app_grpc.py when the container launches
CMD ["python", "app_grpc.py"]
