from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app) # Allows your Node.js backend to talk to this Python server

# --- THE MISSING BLUEPRINT: CustomScaleLayer ---
class CustomScaleLayer(tf.keras.layers.Layer):
    def __init__(self, scale=1.0, **kwargs):
        super(CustomScaleLayer, self).__init__(**kwargs)
        self.scale = scale

    def call(self, inputs):
        return inputs * self.scale

    def get_config(self):
        config = super(CustomScaleLayer, self).get_config()
        config.update({"scale": self.scale})
        return config

# --- LOAD MODELS ---
# We now tell TensorFlow exactly how to load that custom layer!
lung_model = tf.keras.models.load_model(
    'Lung Cancer Prediction/LCD.h5',
    custom_objects={'Custom>CustomScaleLayer': CustomScaleLayer, 'CustomScaleLayer': CustomScaleLayer}
)
breast_model = tf.keras.models.load_model('Breast Cancer Prediction/bcd_model.h5')
diabetes_model = pickle.load(open('Diabetes Prediction/diabetes_model.pkl', 'rb'))
heart_model = pickle.load(open('Heart Disease Prediction/heart_disease.pkl', 'rb'))

# ... (Keep all your @app.route functions below exactly as they are) ...