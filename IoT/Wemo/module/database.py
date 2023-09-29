from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
db_host = os.getenv("MARIADB_HOST")
db_user = os.getenv("MARIADB_USER")
db_password = os.getenv("MARIADB_PASSWORD")
db_name = os.getenv("MARIADB_DB_NAME")
table_name = os.getenv("MARIADB_TABLE_NAME")

print(f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}")
# Create a SQLAlchemy engine (replace 'mysql' with your database URL)
engine = create_engine(f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}")

# Create a SQLAlchemy session
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()

# Define a database model using SQLAlchemy
class MyModel(Base):
    __tablename__ = table_name

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    device_type = Column(String(255), nullable=False)

# Create the table in the database if it does not exist
Base.metadata.create_all(engine)

class MariaDBModule:
    def insert_record(self, record):
        try:
            new_record = MyModel(name=record["name"], device_type=record["device_type"])
            session.add(new_record)
            session.commit()
            return new_record.id
        except Exception as e:
            print(f"Error inserting record: {e}")
            return None

    def find_records(self, condition=None):
        try:
            if condition is None:
                records = session.query(MyModel).all()
            else:
                records = session.query(MyModel).filter_by(**condition).all()
            return records
        except Exception as e:
            print(f"Error fetching records: {e}")
            return []

    def update_record(self, condition, new_values):
        try:
            updated_count = (
                session.query(MyModel)
                .filter_by(**condition)
                .update(new_values, synchronize_session=False)
            )
            session.commit()
            return updated_count
        except Exception as e:
            print(f"Error updating record: {e}")
            return 0

    def delete_record(self, condition):
        try:
            deleted_count = (
                session.query(MyModel)
                .filter_by(**condition)
                .delete(synchronize_session=False)
            )
            session.commit()
            return deleted_count
        except Exception as e:
            print(f"Error deleting record: {e}")
            return 0

    def close_connection(self):
        session.close()

# Example usage of the MariaDBModule class
if __name__ == "__main__":
    db = MariaDBModule()
    record = {"name": "Device 1", "device_type": "Type A"}

    # Insert a record
    new_record_id = db.insert_record(record)
    print(f"Inserted record with ID: {new_record_id}")

    # Find records
    records = db.find_records({"device_type": "Type A"})
    print("Records found:")
    for rec in records:
        print(f"ID: {rec.id}, Name: {rec.name}, Device Type: {rec.device_type}")

    # Update a record
    update_condition = {"name": "Device 1"}
    new_values = {"name": "Updated Device 1", "device_type": "Type B"}
    updated_count = db.update_record(update_condition, new_values)
    print(f"Updated {updated_count} records")

    # Delete a record
    delete_condition = {"name": "Updated Device 1"}
    deleted_count = db.delete_record(delete_condition)
    print(f"Deleted {deleted_count} records")

    # Close the database connection
    db.close_connection()
