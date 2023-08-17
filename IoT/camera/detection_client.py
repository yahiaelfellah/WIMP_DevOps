import grpc
import proto.detection_pb2 as detection_pb2
import proto.detection_pb2_grpc as detection_pb2_grpc

def run():
    channel = grpc.insecure_channel('localhost:50051')
    stub = detection_pb2_grpc.PersonDetectionStub(channel)

    try:
        response = stub.DetectPersons(detection_pb2.Empty())
        print(f"Detected persons: {response.detected_persons}")
    
    except grpc.RpcError as e:
        print(f"An error occurred: {e.details()}")

if __name__ == '__main__':
    run()
