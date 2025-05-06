import os
import cv2
import numpy as np
import tensorflow as tf
import sys
import json

def load_model():
    try:
        model_path = os.path.join(os.path.dirname(__file__), "cnn_model.keras")
        model = tf.keras.models.load_model(model_path)
        return model
    except Exception as e:
        print(json.dumps({"error": f"Model loading failed: {str(e)}"}))
        sys.exit(1)

def preprocess_image_cv2(img_path):
    try:
        img = cv2.imread(img_path)
        if img is None:
            raise ValueError("Could not read image")
            
        img = cv2.resize(img, (250, 250))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img / 255.0
        img = np.expand_dims(img, axis=0)
        return img
    except Exception as e:
        print(json.dumps({"error": f"Image processing failed: {str(e)}"}))
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Image path not provided"}))
        sys.exit(1)

    img_path = sys.argv[1]
    model = load_model()

    try:
        img = preprocess_image_cv2(img_path)
        prediction = model.predict(img)
        
        if prediction[0][0] > 0.5:
            print("Down Syndrome")  
        else: print("Healthy"),
         # Add confidence score
        
        
        
        
    except Exception as e:
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()