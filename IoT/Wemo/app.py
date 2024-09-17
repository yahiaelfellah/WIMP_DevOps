from flask import Flask, request
from flask_restful import Api
from module.wemo import Wemo
from flask_wtf.csrf import CSRFProtect


app = Flask(__name__)
csrf = CSRFProtect()
csrf.init_app(app) # Compliant
api = Api(app)
api.add_resource(Wemo, '/wemo')

if __name__ == '__main__':
    app.run()