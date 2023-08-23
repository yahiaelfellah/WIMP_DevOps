from flask import request,jsonify
from flask_restful import Resource
from module.database import MongoDBModule as db 
import pywemo

instance = db()


class Wemo(Resource):
    def post(self):
        name = request.json['name']
        device_type = request.json['type']
        res = instance.find_documents({"name":name})
        if(len(res) == 0) :  
            instance.insert_document({ "name":name, "device_type": device_type})
            return jsonify({'message': f'Wemo device {name} ({device_type}) created successfully'})
        else : 
            return jsonify({'message': f'Wemo device {name} ({device_type}) exists'})


    def get(self):
        devices = pywemo.discover_devices()
        target =  instance.find_documents({"name":request.args.get('name') or 'Concordia'})
        if target is None :     
            return {'error': 'Wemo device not found'}
        for device in devices:
            if device.name == target['name']:
                wemo = device
                break
        else:
            return {'error': 'Wemo device not found'}

        # Check the current state of the WeMo device
        try:
            state = wemo.get_state()
            instance.update_document({"name":request.args.get('name') or 'Concordia'},{"state":state})

        except pywemo.exceptions.ActionException as e:
            return {'error': f'Error getting WeMo device status: {str(e)}'}

        return {'status': 'on' if state == 1 else 'off'}   



        action = request.args.get('action')
        if action == 'on':
            wemo.on()
            return {'status': 'on'}
        elif action == 'off':
            wemo.off()
            return {'status': 'off'}
        else:
            return {'error': 'Invalid action'}

