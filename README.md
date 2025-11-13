👋 Hey! Welcome to MediMind 🧠

This is my university project, MediMind! It's an AI-powered website I built to show how we can use machine learning to help predict serious health conditions.

It's a complete full-stack application, which means it has a pretty frontend (what you see) and a really complex backend (what does all the work). The backend is a cool mix of Node.js for the website stuff and Python for all the heavy-duty AI "thinking."

✨ What Can It Do?

I'm glad you asked! The app is built around four main predictors:

Heart Disease: You can input a patient's data (like cholesterol, age, etc.), and it'll predict the likelihood of heart disease.

Diabetes: This one uses a Naive Bayes model (a classic AI algorithm) to predict diabetes from patient info.

Lung Cancer: This is one of the deep learning models. You can upload a CT scan image, and the AI (a TensorFlow/Keras model) will analyze it to detect signs of lung cancer.

Breast Cancer: Similar to the lung model, this one uses a deep learning model to analyze histological images (microscope slides) for breast cancer.

On top of that, I've also built in:

Full User Accounts: You can sign up and log in securely.

Your Own PDF Reports: After you get a prediction, you can download a personalized PDF report. I even made it add our "MediMind" logo and the current date to the report!

Custom Branding: I fully rebranded the original project with our new "MediMind" logo, colors, and our team page.

Works on Mobile: The whole site is responsive, so it looks good on your phone, too.

🛠️ How It's Built (The Tech Stack)

This was the tricky part! It's not just one website; it's two separate applications working together.

The Frontend (What You See)

React.js: This is what makes the website feel fast and modern without reloading all the time.

React Router: Handles switching between pages (like Home, About, Predictors).

pdf-lib: A neat little library I used to build the PDF reports right in your browser.

CSS: All the custom styling, animations, and branding you see.

The Backend (The "Kitchen")

Node.js & Express.js: This is the main server. It handles things like user logins, file uploads, and talking to the frontend.

Python: This is the "brain" where the actual AI lives.

child_process (The "Magic" Part): This is the bridge. When you ask for a prediction, the Node.js server uses this to "call up" a Python script, send it your data, get the AI's answer, and then send that answer back to you.

The "Brain" Itself (The Python ML)

TensorFlow & Keras: For the big, complex deep learning models that look at images (Lung and Breast Cancer).

Scikit-learn: For the more "classic" AI models like Naive Bayes (which we used for Diabetes).

Pandas & NumPy: The workhorses for organizing all the data before feeding it to the models.

Joblib: This is how I saved and loaded the trained models so they're ready to make predictions instantly.

🚀 How to Run This Project Yourself

If you want to run this on your own computer, you have to set up both the backend and frontend. It's like starting a car engine and turning on the radio—they're two separate things.

What You'll Need

Node.js (v18 or later)

Python (v3.11 or later)

Git (for downloading the code)

The Setup Guide

1. Download the Code

git clone [https://github.com/your-username/MediMind.git](https://github.com/your-username/MediMind.git)
cd MediMind


2. Set Up the Backend (Do this in Terminal 1)
This is the most important part. Get this working first.

# 1. Go into the backend folder
cd Backend

# 2. Install all the Node.js parts
npm install

# 3. Create a fresh Python "toolbox" (a virtual environment)
python -m venv venv

# 4. Activate that toolbox
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# 5. Install all the Python magic
# (You must see (venv) in your terminal for this to work!)
pip install -r requirements.txt


3. Set Up the Frontend (Do this in Terminal 2)
Open a brand new, second terminal for this.

# 1. From the main "MediMind" folder, go to the frontend
cd Frontend

# 2. Install all the React parts
npm install


🏃‍♂️ Let's Run It!

You need to keep both terminals open at the same time.

Terminal 1 (Your Backend):

Make sure you're in the Backend folder and (venv) is active.

# This starts the "brain"
npm run dev


You'll see a message that it's running on http://localhost:8080.

Terminal 2 (Your Frontend):

Make sure you're in the Frontend folder.

# This starts the website
npm run dev


Your browser will automatically open to http://localhost:5173.

And that's it! You can now use the full website on your local machine.

🧑‍💻 The Team

This project was fixed, rebranded, and put together by:

Sudhanshu Kunwar
