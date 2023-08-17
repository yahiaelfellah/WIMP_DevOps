import grpc
from concurrent import futures
import cv2
import numpy as np
import proto.detection_pb2 as detection_pb2
import proto.detection_pb2_grpc as detection_pb2_grpc
import time

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

class PersonDetectionServicer(detection_pb2_grpc.PersonDetectionServicer):
    def DetectPersons(self, request, context):
        try:
            # Access the camera (0 for default camera)
            camera = cv2.VideoCapture(0)
            _, frame = camera.read()

            # Prepare image for object detection
            blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)

            # Set input and get output layers
            net.setInput(blob)
            outs = net.forward(net.getUnconnectedOutLayersNames())

            # Process the output to count detected persons
            count = 0
            for out in outs:
                for detection in out:
                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    if confidence > 0.5 and class_id == 0:  # Class 0 corresponds to 'person'
                        count += 1

            # Release the camera
            camera.release()
            
            return detection_pb2.PersonCount(detected_persons=count)
        
        except Exception as e:
            context.set_details(str(e))
            context.set_code(grpc.StatusCode.INTERNAL)
            return detection_pb2.PersonCount()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    detection_pb2_grpc.add_PersonDetectionServicer_to_server(PersonDetectionServicer(), server)
    print('service running')
    server.add_insecure_port('[::]:50051')
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    # Load YOLO model and its configuration
    net = cv2.dnn.readNet('model/yolov3.weights', 'model/yolov3.cfg')
    
    serve()
