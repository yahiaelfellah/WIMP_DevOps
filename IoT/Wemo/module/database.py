import mysql.connector
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
db_host = os.getenv("MARIADB_URL")
db_user = os.getenv("MARIADB_USER")
db_password = os.getenv("MARIADB_PASSWORD")
db_name = os.getenv("DB_NAME")
table_name = os.getenv("TABLE_NAME")

class MariaDBModule:
    def __init__(self):
        self.connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        self.cursor = self.connection.cursor()

    def insert_record(self, record):
        sql = f"INSERT INTO {table_name} (name, device_type) VALUES (%s, %s)"
        values = (record["name"], record["device_type"])

        self.cursor.execute(sql, values)
        self.connection.commit()
        return self.cursor.lastrowid

    def find_records(self, condition=None):
        if condition is None:
            sql = f"SELECT * FROM {table_name}"
        else:
            sql = f"SELECT * FROM {table_name} WHERE {condition}"

        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def update_record(self, condition, new_values):
        sql = f"UPDATE {table_name} SET name=%s, device_type=%s WHERE {condition}"
        values = (new_values["name"], new_values["device_type"])

        self.cursor.execute(sql, values)
        self.connection.commit()
        return self.cursor.rowcount

    def delete_record(self, condition):
        sql = f"DELETE FROM {table_name} WHERE {condition}"

        self.cursor.execute(sql)
        self.connection.commit()
        return self.cursor.rowcount

    def close_connection(self):
        self.cursor.close()
        self.connection.close()
