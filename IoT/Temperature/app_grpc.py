import grpc
import time
from concurrent import futures
import proto.temperature_pb2 as temperature_pb2
import proto.temperature_pb2_grpc as temperature_pb2_grpc
from module.temperature import Read
from dotenv import load_dotenv
import os
load_dotenv()


grpc_link = os.getenv("GRPC_LINK")

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

class TemperatureServicer(temperature_pb2_grpc.TemperatureServiceServicer):
    def GetTemperature(self, request, context):
        try:
            read = Read()
            if request.unit == 'C':
                value = read.read_temp_c()
            else:
                value = read.read_temp_f()
            return temperature_pb2.TemperatureResponse(value=value)
        except Exception as ex:
            return temperature_pb2.TemperatureResponse(message='something went wrong' + str(ex))


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    temperature_pb2_grpc.add_TemperatureServiceServicer_to_server(TemperatureServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()
