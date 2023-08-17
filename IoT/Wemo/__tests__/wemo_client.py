import grpc
import proto.wemo_pb2 as wemo_pb2
import proto.wemo_pb2_grpc as wemo_pb2_grpc

def create_device(stub):
    name = input("Enter device name: ")
    device_type = input("Enter device type: ")
    request = wemo_pb2.CreateDeviceRequest(name=name, type=device_type)
    response = stub.CreateDevice(request)
    print(response.message)

def get_device_status(stub):
    name = input("Enter device name: ")
    request = wemo_pb2.GetDeviceStatusRequest(name=name)
    response = stub.GetDeviceStatus(request)
    print("Device status:", response.status)

def set_device_status(stub):
    name = input("Enter device name: ")
    action = input("Enter action (on or off): ")
    request = wemo_pb2.SetDeviceStatusRequest(name=name, action=action)
    response = stub.SetDeviceStatus(request)
    if response.error:
        print("Error:", response.error)
    else:
        print("Device status:", response.status)

def run():
    channel = grpc.insecure_channel('localhost:50051')
    stub = wemo_pb2_grpc.WemoServiceStub(channel)

    while True:
        print("1. Create Device")
        print("2. Get Device Status")
        print("3. Set Device Status")
        print("4. Exit")
        choice = input("Enter your choice: ")

        if choice == "1":
            create_device(stub)
        elif choice == "2":
            get_device_status(stub)
        elif choice == "3":
            set_device_status(stub)
        elif choice == "4":
            break
        else:
            print("Invalid choice")

if __name__ == '__main__':
    run()
