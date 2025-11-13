import os
import sys
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.utils import custom_object_scope

# Suppress TensorFlow INFO and WARNING logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# The "blueprint" for the custom layer, now with robust input handling
class CustomScaleLayer(tf.keras.layers.Layer):
    def __init__(self, scale=1./255, **kwargs):
        super(CustomScaleLayer, self).__init__(**kwargs)
        self.scale = scale

    def call(self, inputs):
        # This handles the model's complex, multi-input structure
        if isinstance(inputs, list):
            return [x * self.scale for x in inputs]
        return inputs * self.scale
    
    def get_config(self):
        config = super(CustomScaleLayer, self).get_config()
        config.update({'scale': self.scale})
        return config

def predict_image_class(image_path):
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'LCD.h5')
        
        if not os.path.exists(model_path):
            print(f"Error: Model file not found at {model_path}", file=sys.stderr)
            sys.exit(1)

        # This part is correct and now works with the updated layer
        with custom_object_scope({'Custom>CustomScaleLayer': CustomScaleLayer}):
            model = load_model(model_path, compile=False)

        # Preprocess the image
        img = image.load_img(image_path, target_size=(256, 256))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Get predictions
        predictions = model.predict(img_array)
        
        # Map prediction to label
        class_labels = ['squamous cell carcinoma', 'large cell carcinoma', 'normal', 'adenocarcinoma']
        predicted_class_index = np.argmax(predictions[0])
        predicted_label = class_labels[predicted_class_index]
        
        if predicted_label == 'normal':
            return 'non-cancerous'
        else:
            return 'cancerous'
            
    except Exception as e:
        print(f"An error occurred in Python script: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_file_path = sys.argv[1]
        final_prediction = predict_image_class(image_file_path)
        print(final_prediction) # This is the final output
    else:
        print("Usage: python predict.py <path_to_image>", file=sys.stderr)
        sys.exit(1)