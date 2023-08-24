import grpc
from concurrent import futures
import proto.wemo_pb2 as wemo_pb2
import proto.wemo_pb2_grpc as wemo_pb2_grpc
from module.database import  MongoDBModule as db
import pywemo
import time
from dotenv import load_dotenv
import os


# Load env for the process
load_dotenv()

# Access environment variables
grpc_link = os.getenv("GRPC_LINK")

instance = db()

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

class WemoServicer(wemo_pb2_grpc.WemoServiceServicer):
    def CreateDevice(self, request, context):
        document = {
            "name" : request.name,
            "device_type" : request.type
        }


        # Check if the data exists 
        res = db.find_documents(query={"name": request.name})
        if len(res)== 0:
            # Add the data in the db 
            instance.insert_document(document=document)
        else: 
            print('Wemo Device already exitst')

        return wemo_pb2.CreateDeviceResponse(message=f'Wemo device {request.name} ({request.type}) created successfully')

    def GetDeviceStatus(self, request, context):
        devices = pywemo.discover_devices()
        target = instance.find_documents(query={"name": request.name})
        if target is None:
            return wemo_pb2.GetDeviceStatusResponse(error='Wemo device not found')
        
        wemo = None
        for device in devices:
            if device.name == target['name']:
                wemo = device
                break
        if wemo is None:
            return wemo_pb2.GetDeviceStatusResponse(error='Wemo device not found')

        try:
            state = wemo.get_state()
            instance.update_document(query={"name": request.name},update={"state":state})

        except pywemo.exceptions.ActionException as e:
            return wemo_pb2.GetDeviceStatusResponse(error=f'Error getting WeMo device status: {str(e)}')
        
        return wemo_pb2.GetDeviceStatusResponse(status='on' if state == 1 else 'off')

    def SetDeviceStatus(self, request, context):
        devices = pywemo.discover_devices()
        target = instance.find_documents(query={"name": request.name})
        if target is None:
            return wemo_pb2.SetDeviceStatusResponse(error='Wemo device not found')

        wemo = None
        for device in devices:
            if device.name == target['name']:
                wemo = device
                break
        if wemo is None:
            return wemo_pb2.SetDeviceStatusResponse(error='Wemo device not found')

        if request.action == 'on':
            wemo.on()
            return wemo_pb2.SetDeviceStatusResponse(status='on')
        elif request.action == 'off':
            wemo.off()
            return wemo_pb2.SetDeviceStatusResponse(status='off')
        else:
            return wemo_pb2.SetDeviceStatusResponse(error='Invalid action')

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    wemo_pb2_grpc.add_WemoServiceServicer_to_server(WemoServicer(), server)
    server.add_insecure_port(grpc_link)
    print('running on '+ grpc_link )
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()
