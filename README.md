MediMind

Welcome to MediMind

This is my project, MediMind. It is an AI-powered healthcare application built to demonstrate how machine learning and artificial intelligence can be used to help predict serious health conditions.

It is a complete full-stack application consisting of a modern frontend and a powerful backend. The backend combines Node.js for web functionality and Python for machine learning and artificial intelligence processing.

What Can It Do?

The application includes four main prediction modules:

Heart Disease Prediction

Users can enter patient information such as age, cholesterol levels, and other medical parameters to predict the likelihood of heart disease.

Diabetes Prediction

This module uses a Naive Bayes machine learning model to predict diabetes based on patient data.

Lung Cancer Detection

Users can upload CT scan images, which are analyzed by a TensorFlow/Keras deep learning model to detect possible signs of lung cancer.

Breast Cancer Detection

This module uses a deep learning model to analyze histopathological images and identify indications of breast cancer.

Additional Features

User Authentication

Secure user registration and login functionality.

PDF Report Generation

After receiving a prediction, users can download a personalized PDF report containing the MediMind logo and the current date.

Custom Branding

The project has been fully customized with the MediMind logo, color scheme, and user interface design.

Responsive Design

The application is fully responsive and optimized for desktop and mobile devices.

Technology Stack

Frontend

• React.js – Creates a fast and interactive user interface.

• React Router – Handles navigation between pages.

• pdf-lib – Generates personalized PDF reports directly in the browser.

• CSS – Provides custom styling, animations, and responsive layouts.

Backend

• Node.js and Express.js – Handle user authentication, file uploads, API requests, and communication with the frontend.

• Python – Performs machine learning and artificial intelligence processing.

• child_process – Acts as a bridge between Node.js and Python, allowing the server to execute Python scripts and retrieve prediction results.

Machine Learning Technologies

• TensorFlow and Keras – Used for deep learning models that analyze medical images for lung and breast cancer detection.

• Scikit-learn – Used for traditional machine learning models such as the Naive Bayes classifier for diabetes prediction.

• Pandas and NumPy – Used for data preprocessing and data manipulation.

• Joblib – Used to save and load trained machine learning models efficiently.

Project Setup and Installation

Requirements

• Node.js (Version 18 or later)

• Python (Version 3.11 or later)

• Git

Clone the Repository

git clone https://github.com/your-username/MediMind.git

cd MediMind

Backend Setup

cd Backend

npm install

python -m venv venv

Activate the virtual environment:

Windows:

.\venv\Scripts\activate

macOS/Linux:

source venv/bin/activate

Install Python dependencies:

pip install -r requirements.txt

Frontend Setup

cd Frontend

npm install

Running the Project

Backend Server:

npm run dev

Frontend Server:

npm run dev

The application will be available at:

http://localhost:5173
https://medimind-three.vercel.app/
