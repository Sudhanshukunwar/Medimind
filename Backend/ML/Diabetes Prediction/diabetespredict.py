import sys
import pickle
import numpy as np
import os
import warnings
import sklearn
import numpy

# Silence the version warnings so the logs stay clean
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')
warnings.filterwarnings("ignore", category=FutureWarning, module='sklearn')

script_dir = os.path.dirname(os.path.realpath(__file__))
model_file = os.path.join(script_dir, 'diabetes_model.pkl')
scaler_file = os.path.join(script_dir, 'scaler.pkl')

with open(model_file, 'rb') as file:
    classifier = pickle.load(file)
with open(scaler_file, 'rb') as file:
    scaler = pickle.load(file)

# 1. DATA AUDIT: See exactly what Node.js is sending
input_data = list(map(float, sys.argv[1:]))
print(f"--- DATA AUDIT ---")
print(f"RAW INPUT FROM NODE: {input_data}")

input_data_reshaped = np.asarray(input_data).reshape(1, -1)

# 2. SCALING AUDIT: See how the AI "sees" these numbers
std_data = scaler.transform(input_data_reshaped)
print(f"SCALED DATA (Internal Math): {std_data}")

prediction = classifier.predict(std_data)

# 3. FINAL OUTPUT (Keep this for Node.js to read)
print(prediction[0])