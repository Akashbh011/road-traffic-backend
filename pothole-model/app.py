from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image

# Load the pre-trained model
model = tf.keras.models.load_model('pothole_mobnet_base.h5')

app = Flask(__name__)

def classify_image(img):
    # Preprocess the image
    img = img.convert("RGB")
    img = img.resize((224, 224))  # Resize the image
    img_array = np.array(img) / 255.0  # Convert to array and normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    pred = model.predict(img_array)
    
    return 'pothole' if pred[0] > 0.5 else 'no-pothole'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("Incoming request data:", request.data)  # Log request data for debugging
        print("Request files:", request.files)  # Log the files part of the request

        # Check if a file is in the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        # Read the image file from the request
        img_file = request.files['file']
        
        # Check if the file is valid
        if img_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        print(f"File received: {img_file.filename}")  # Log file name

        img = Image.open(img_file)  # Open the image directly from the file

        # Classify the image
        prediction = classify_image(img)

        return jsonify({'prediction': prediction}), 200

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3003)
