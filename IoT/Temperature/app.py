from flask import Flask, request
from flask_restful import Api
from module.temperature import Temperature, Read
from flask_wtf.csrf import CSRFProtect
import time
import signal


app = Flask(__name__)
csrf = CSRFProtect()
csrf.init_app(app)  # Enable CSRF protection for the Flask app
api = Api(app)
# Add a RESTful resource for temperature
api.add_resource(Temperature, '/temperature')
running = True  # A global flag to signal the temperature loop to keep running


def generate_temperature():
    import random
    # Generate a random temperature in Celsius between -10°C and 40°C
    min_temperature_celsius = -10
    max_temperature_celsius = 40
    random_temperature_celsius = round(random.uniform(
        min_temperature_celsius, max_temperature_celsius), 2)
    # Convert Celsius to Fahrenheit
    random_temperature_fahrenheit = round(
        (random_temperature_celsius * 9/5) + 32, 2)
    return (random_temperature_celsius, random_temperature_fahrenheit)


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

        try:
            temp_c = Read.read_temp_c()
            print(f"Temperature in Celsius: {temp_c}°C")

            temp_f = Read.read_temp_f()
            print(f"Temperature in Fahrenheit: {temp_f}°F")

        except:
            print("it seems we cant access to the sensor")
            (temp_c, temp_f) = generate_temperature()
            # Read temperature in Celsius
            temp_c = 5  # TODO: Replace with code to read temperature from a sensor in Celsius
            print(f"Temperature in Celsius: {temp_c}°C")

            # Read temperature in Fahrenheit
            temp_f = 15  # TODO: Replace with code to read temperature from a sensor in Fahrenheit
            print(f"Temperature in Fahrenheit: {temp_f}°F")

            # Delay for some time before reading again
        time.sleep(10)


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
    # Register signal handler for SIGINT (Ctrl+C)
    signal.signal(signal.SIGINT, signal_handler)

    # Start the temperature loop in a separate thread  edge_thread = threading.Thread(target=temperature_loop)
    temperature_loop()
    # Start the Flask app
    app.run()
