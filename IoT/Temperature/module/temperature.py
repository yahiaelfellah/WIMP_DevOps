import os
import glob
import time
from flask_restful import Resource
from flask import request, jsonify
from module.database import MongoDBModule as db
import datetime

instance = db()


class Temperature(Resource):
    def get(self):
        try:
            if(request.args.get('unit') == 'C'):
                return {'value': Read.get_latest_value['value_c']}
            else:
                return {'value': Read.read_temp_f['value_f']}
        except Exception as ex:
            return {'message': 'something went wrong' + ex}


class Read():
    def __init__(self) -> None:
        os.system('modprobe w1-gpio')
        os.system('modprobe w1-therm')
        self.base_dir = '/sys/bus/w1/devices/'
        self.device_folder = glob.glob(self.base_dir + '28*')[0]
        self.device_file = self.device_folder + '/w1_slave'

    def get_timestamp(self):
        # Get the current date and time
        current_datetime = datetime.datetime.now()
        # Format the datetime object as a string
        timestamp = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
        return timestamp

    def read_temp_raw(self):
        f = open(self.device_file, 'r')
        lines = f.readlines()
        f.close()
        return lines

    @staticmethod
    def read_temp_c(self):
        lines = self.read_temp_raw()
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = self.read_temp_raw()
        equals_pos = lines[1].find('t=')
        if equals_pos != -1:
            temp_string = lines[1][equals_pos+2:]
            # TEMP_STRING IS THE SENSOR OUTPUT, MAKE SURE IT'S AN INTEGER TO DO THE MATH
            temp_c = int(temp_string) / 1000.0
            # ROUND THE RESULT TO 1 PLACE AFTER THE DECIMAL, THEN CONVERT IT TO A STRING
            temp_c = str(round(temp_c, 1))
            instance.insert_document(
                {"timestamp": self.get_timestamp(), "value_c": temp_c, "value_f": None})
            return temp_c

    @staticmethod
    def read_temp_f(self):
        lines = self.read_temp_raw()
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = self.read_temp_raw()
        equals_pos = lines[1].find('t=')
        if equals_pos != -1:
            temp_string = lines[1][equals_pos+2:]
            # TEMP_STRING IS THE SENSOR OUTPUT, MAKE SURE IT'S AN INTEGER TO DO THE MATH
            temp_f = (int(temp_string) / 1000.0) * 9.0 / 5.0 + 32.0
            # ROUND THE RESULT TO 1 PLACE AFTER THE DECIMAL, THEN CONVERT IT TO A STRING
            temp_f = str(round(temp_f, 1))
            instance.insert_document(
                {"timestamp": self.get_timestamp(), "value_c": None, "value_f": temp_f})
            return temp_f
