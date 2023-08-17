import sqlite3

DB_NAME = 'output/mydatabase.db'

def create_tables():
    """
    Creates a wemo_status table in the database if it does not exist.

    Returns:
        None
    """
    conn = sqlite3.connect(DB_NAME)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS wemo_status (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT)")
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


def create_wemo_devices_table():
    """
    Creates a wemo_device table in the database if it does not exist.

    Returns:
        None
    """
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.execute(
            'CREATE TABLE IF NOT EXISTS wemo_device (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT)')
        conn.close()
    except sqlite3.Error as error:
        print('Error creating wemo_device table:', error)


def create_wemo_device(name, device_type):
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
        cursor.execute(
            'INSERT INTO wemo_device (name, type) VALUES (?, ?)', (name, device_type))
        device_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return device_id
    except sqlite3.Error as error:
        print('Error creating Wemo device:', error)


def get_wemo_device_by_name(name):
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
        cursor.execute('SELECT * FROM wemo_device WHERE name = ?', (name,))
        device = cursor.fetchone()
        conn.close()
        if device:
            return {
                'id': device[0],
                'name': device[1],
                'type': device[2]
            }
        else:
            return None
    except sqlite3.Error as error:
        print('Error getting Wemo device:', error)
