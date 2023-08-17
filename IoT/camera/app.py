from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

# Load YOLO model and its configuration
net = cv2.dnn.readNet('model/yolov3.weights', 'model/yolov3.cfg')
classes = open('model/coco.names').read().strip().split('\n')

@app.route('/detect_persons', methods=['GET'])
def detect_persons():
    try:
         # Access the camera (0 for default camera)
        camera = cv2.VideoCapture(0)
        _, frame = camera.read()

        # Save the captured image
        cv2.imwrite('output/captured_image.jpg', frame)

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
        return jsonify({'detected_persons': count})
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
