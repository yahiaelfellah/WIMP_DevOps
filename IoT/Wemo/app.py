from flask import Flask, request
from flask_restful import Api
from module.wemo import Wemo
from flask_wtf.csrf import CSRFProtect

from module.database import create_wemo_devices_table, create_wemo_device

app = Flask(__name__)
csrf = CSRFProtect()
csrf.init_app(app) # Compliant
api = Api(app)
api.add_resource(Wemo, '/wemo')

if __name__ == '__main__':
    # Create the database 
    create_wemo_devices_table()
    create_wemo_device('Concordia', 'Switch')
    # running the application 
    app.run()