from sqlalchemy import create_engine, Column, Integer, String, DateTime, Binary
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Access environment variables
db_host = os.getenv("MARIADB_HOST")
db_user = os.getenv("MARIADB_USER")
db_password = os.getenv("MARIADB_PASSWORD")
db_name = os.getenv("MARIADB_DB_NAME")
table_name = os.getenv("MARIADB_TABLE_NAME")

# Create a SQLAlchemy engine (replace 'mysql' with your database URL)
engine = create_engine(f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}")

# Create a SQLAlchemy session
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()

# Define a database model using SQLAlchemy
class CameraImage(Base):
    __tablename__ = table_name

    id = Column(Integer, primary_key=True, autoincrement=True)
    camera_id = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    image_data = Column(Binary, nullable=False)

# Create the table in the database if it does not exist
Base.metadata.create_all(engine)

class MariaDBModule:
    def insert_image(self, camera_id, image_data):
        try:
            new_image = CameraImage(camera_id=camera_id, image_data=image_data)
            session.add(new_image)
            session.commit()
            return new_image.id
        except Exception as e:
            print(f"Error inserting image: {e}")
            return None

    def find_images_by_camera(self, camera_id):
        try:
            images = (
                session.query(CameraImage)
                .filter_by(camera_id=camera_id)
                .order_by(CameraImage.timestamp.desc())
                .all()
            )
            return images
        except Exception as e:
            print(f"Error fetching images: {e}")
            return []

    def close_connection(self):
        session.close()

# Example usage of the MariaDBModule class
if __name__ == "__main__":
    db = MariaDBModule()
    camera_id = 1
    image_data = b'\x89PNG\r\n...binary image data...'  # Replace with actual image binary data

    # Insert an image
    new_image_id = db.insert_image(camera_id, image_data)
    print(f"Inserted image with ID: {new_image_id}")

    # Find images by camera ID
    images = db.find_images_by_camera(camera_id)
    print("Images found:")
    for img in images:
        print(f"ID: {img.id}, Timestamp: {img.timestamp}, Camera ID: {img.camera_id}")

    # Close the database connection
    db.close_connection()
