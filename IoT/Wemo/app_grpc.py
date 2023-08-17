import grpc
from concurrent import futures
import proto.wemo_pb2 as wemo_pb2
import proto.wemo_pb2_grpc as wemo_pb2_grpc
from database import get_wemo_device_by_name, create_wemo_device
import pywemo
import time

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

class WemoServicer(wemo_pb2_grpc.WemoServiceServicer):
    def CreateDevice(self, request, context):
        name = request.name
        device_type = request.type
        create_wemo_device(name, device_type)
        return wemo_pb2.CreateDeviceResponse(message=f'Wemo device {name} ({device_type}) created successfully')

    def GetDeviceStatus(self, request, context):
        devices = pywemo.discover_devices()
        target = get_wemo_device_by_name(request.name or 'Concordia')
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
        except pywemo.exceptions.ActionException as e:
            return wemo_pb2.GetDeviceStatusResponse(error=f'Error getting WeMo device status: {str(e)}')
        
        return wemo_pb2.GetDeviceStatusResponse(status='on' if state == 1 else 'off')

    def SetDeviceStatus(self, request, context):
        devices = pywemo.discover_devices()
        target = get_wemo_device_by_name(request.name)
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
    server.add_insecure_port('[::]:50051')
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()
