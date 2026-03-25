from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app) 

# --- THE BULLETPROOF BLUEPRINT ---
# Register the layer globally so TensorFlow cannot miss it
@tf.keras.saving.register_keras_serializable(package="Custom")
class CustomScaleLayer(tf.keras.layers.Layer):
    def __init__(self, scale=1.0, **kwargs):
        super(CustomScaleLayer, self).__init__(**kwargs)
        self.scale = scale

    def call(self, inputs):
        # FIX: Safely handles single tensors, lists, or tuples of tensors
        return tf.nest.map_structure(lambda x: x * self.scale, inputs)

    def get_config(self):
        config = super(CustomScaleLayer, self).get_config()
        config.update({"scale": self.scale})
        return config

# --- LOAD MODELS ---
# Wrap the loading process in the exact scope requested by the error
with tf.keras.utils.custom_object_scope({'Custom>CustomScaleLayer': CustomScaleLayer, 'CustomScaleLayer': CustomScaleLayer}):
    lung_model = tf.keras.models.load_model('Lung Cancer Prediction/LCD.h5')

breast_model = tf.keras.models.load_model('Breast Cancer Prediction/bcd_model.h5')
diabetes_model = pickle.load(open('Diabetes Prediction/diabetes_model.pkl', 'rb'))
heart_model = pickle.load(open('Heart Disease Prediction/heart_disease.pkl', 'rb'))

@app.route('/', methods=['GET'])
def home():
    return "MediMind AI Engine is Online!"

@app.route('/predict/lung', methods=['POST'])
def predict_lung():
    try:
        data = request.json['data']
        prediction = lung_model.predict(np.array([data]))
        return jsonify({'prediction': int(np.argmax(prediction))})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/breast', methods=['POST'])
def predict_breast():
    try:
        data = request.json['data']
        prediction = breast_model.predict(np.array([data]))
        return jsonify({'prediction': int(np.argmax(prediction))})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    try:
        data = request.json['data']
        # Sklearn models usually need data reshaped for a single prediction
        prediction = diabetes_model.predict(np.array(data).reshape(1, -1))
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    try:
        data = request.json['data']
        prediction = heart_model.predict(np.array(data).reshape(1, -1))
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)          