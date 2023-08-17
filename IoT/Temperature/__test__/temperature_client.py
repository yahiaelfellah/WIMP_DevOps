import grpc
import temperature.proto.temperature_pb2 as temperature_pb2
import temperature.proto.temperature_pb2_grpc as temperature_pb2_grpc

def run():
    channel = grpc.insecure_channel('localhost:50051')
    stub = temperature_pb2_grpc.TemperatureServiceStub(channel)
    
    unit = input("Enter unit (C or F): ")
    request = temperature_pb2.TemperatureRequest(unit=unit)
    
    response = stub.GetTemperature(request)
    print("Temperature value:", response.value)

if __name__ == '__main__':
    run()
