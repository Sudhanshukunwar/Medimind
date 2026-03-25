from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import pickle
import numpy as np

app = Flask(__name__)
CORS(app) # Allows your Node.js backend to talk to this Python server

# --- LOAD MODELS ---
# Adjust paths to match your folder structure
lung_model = tf.keras.models.load_path('Lung Cancer Prediction/LCD.h5')
breast_model = tf.keras.models.load_path('Breast Cancer Prediction/bcd_model.h5')
diabetes_model = pickle.load(open('Diabetes Prediction/diabetes_model.pkl', 'rb'))
heart_model = pickle.load(open('Heart Disease Prediction/heart_disease.pkl', 'rb'))

@app.route('/', methods=['GET'])
def home():
    return "MediMind AI Engine is Online!"

@app.route('/predict/lung', methods=['POST'])
def predict_lung():
    data = request.json['data']
    prediction = lung_model.predict(np.array([data]))
    return jsonify({'prediction': int(np.argmax(prediction))})

# ... (Add similar routes for Heart, Diabetes, and Breast) ...

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)