# 1. Tell Hugging Face to use a standard Python computer
FROM python:3.10

# 2. Create a folder inside the computer called /app
WORKDIR /app

# 3. Copy all your files (app.py, requirements.txt, and the models) into the /app folder
COPY . /app

# 4. Install your Python libraries
RUN pip install --no-cache-dir -r requirements.txt

# 5. Hugging Face REQUIRES apps to run on port 7860
EXPOSE 7860

# 6. Start the server using Gunicorn, giving it plenty of time to load the heavy models
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:7860", "--timeout", "120"]