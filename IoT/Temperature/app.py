from flask import Flask, request
from flask_restful import Api
from temperature import Temperature
from flask_wtf.csrf import CSRFProtect
from database import create_tables, create_temperature_feed
import time
import threading
import signal


app = Flask(__name__)
csrf = CSRFProtect()
csrf.init_app(app)  # Enable CSRF protection for the Flask app
api = Api(app)
api.add_resource(Temperature, '/temperature')  # Add a RESTful resource for temperature
running = True  # A global flag to signal the temperature loop to keep running


def temperature_loop():
    """
    A background loop that reads temperature from a sensor and stores it in the database.

    This function runs in a separate thread to allow the Flask app to keep running while the temperature
    is being monitored in the background.

    Returns:
        None
    """
    global running
    # Loop indefinitely until the running flag is set to False
    while running:
        # Read temperature in Celsius
        temp_c = 5  # TODO: Replace with code to read temperature from a sensor in Celsius
        print(f"Temperature in Celsius: {temp_c}°C")

        # Read temperature in Fahrenheit
        temp_f = 15  # TODO: Replace with code to read temperature from a sensor in Fahrenheit
        print(f"Temperature in Fahrenheit: {temp_f}°F")

        #store the temperature readings in the database
        create_temperature_feed(temp_c, temp_f)

        # Delay for some time before reading again
        time.sleep(1)


def signal_handler(signum, frame):
    """
    A signal handler to gracefully stop the application and the temperature loop.

    This function is called when the app receives a SIGINT signal (usually triggered by pressing Ctrl+C in the terminal).
    It sets the global running flag to False to signal the temperature loop to stop running, and calls the shutdown method
    to stop the Flask app.

    Args:
        signum (int): The signal number
        frame: The current stack frame when the signal was received

    Returns:
        str: A message indicating that the Flask app has stopped
    """
    print("Received signal {}, stopping background task...".format(signum))
    # Set the stop flag to exit the loop
    global running
    running = False

    # Call the shutdown method to stop the app
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug server')
    func()

    return 'Flask app stopped'


if __name__ == '__main__':
    # Create the database tables if they don't exist
    create_tables()

    # Register signal handler for SIGINT (Ctrl+C)
    signal.signal(signal.SIGINT, signal_handler)

    # Start the temperature loop in a separate thread  edge_thread = threading.Thread(target=temperature_loop)
    temperature_loop()
    # Start the Flask app
    app.run()