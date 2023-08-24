import sqlite3
from datetime import datetime

DB_NAME= 'output/temperature.db'
def create_tables():
    """
    Creates a temperature_status table in the database if it does not exist.

    Returns:
        None
    """
    conn = sqlite3.connect(DB_NAME)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS temperature_status (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATE, value_c FLOAT, value_f FLOAT)")
    conn.close()


def drop_table(table_name):
    """
    Drops a table with the given name from the database.

    Args:
        table_name (str): The name of the table to drop.

    Returns:
        None
    """
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute(f"DROP TABLE IF EXISTS {table_name}")
    conn.commit()
    cur.close()
    conn.close()


def create_temperature_feed(value_c,value_f):
    """
    Inserts a new Wemo device with the given name and type into the database.

    Args:
        name (str): The name of the new device.
        device_type (str): The type of the new device.

    Returns:
        int: The ID of the new device.
    """
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        # Getting the current date and time
        dt = datetime.now()
        # getting the timestamp
        timestamp = datetime.timestamp(dt)
        cursor.execute(
            'INSERT INTO temperature_status (timestamp, value_c,value_f) VALUES (?, ?, ?)', (timestamp, value_c,value_f))
        temperature_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return temperature_id
    except sqlite3.Error as error:
        print('Error creating temperature value:', error)


def get_lastest_temperature():
    # Execute the query to retrieve the latest value
    try: 
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM temperature_status ORDER BY timestamp DESC LIMIT 1')
        latest_value = cursor.fetchone()
        conn.close()
        if latest_value : 
            return {
                'id': latest_value[0],
                'timestamp': latest_value[1],
                'value_c': latest_value[2],
                'value_f':latest_value[3]
            }
    except sqlite3.Error as error : 
        print('Error getting Temperature device:', error)


def get_temperature_by_timestamp(timestamp):
    """
    Retrieves a Wemo device from the database by its name.

    Args:
        name (str): The name of the device to retrieve.

    Returns:
        dict: A dictionary containing the ID, name, and type of the device.
    """
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM temperature_status WHERE timestamp = ?', (timestamp,))
        temperature = cursor.fetchone()
        conn.close()
        if temperature:
            return {
                'id': temperature[0],
                'timestamp': temperature[1],
                'value': temperature[2]
            }
        else:
            return None
    except sqlite3.Error as error:
        print('Error getting Wemo device:', error)