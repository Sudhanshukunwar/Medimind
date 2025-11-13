import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import path from "path";
import fs from "fs";
import multer from "multer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// --- Multer Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
export const upload = multer({ storage: storage });

// --- Helper for Deleting Files ---
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    }
  });
};

// --- Define the absolute path to the Python in your venv ---
const pythonExecutable = resolve(__dirname, "..", "venv", "Scripts", "python.exe");

// --- Prediction Controllers ---

const heartpred = asyncHandler(async (req, res) => {
  const { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13 } = req.body;
  const transformedP2 = isNaN(p2) ? (p2.toLowerCase() === "male" ? 1 : 0) : p2;
  const transformedP6 = isNaN(p6) ? (p6.toLowerCase() === "yes" ? 1 : 0) : p6;

  const scriptPath = resolve(__dirname, "../ML/Heart Disease Prediction/heartpredict.py");
  const inputData = [p1, transformedP2, p3, p4, p5, transformedP6, p7, p8, p9, p10, p11, p12, p13];

  const pythonProcess = spawn(pythonExecutable, [scriptPath, ...inputData]);

  let predictionVal = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => (predictionVal += data.toString()));
  pythonProcess.stderr.on("data", (data) => (errorData += data.toString()));

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Heart prediction stderr:", errorData);
      return res.status(500).json({ message: "Prediction script failed", details: errorData });
    }
    predictionVal = predictionVal.trim();
    if (predictionVal === "1") {
      return res.json({ prediction: predictionVal, result: "The person is suffering from Heart Disease" });
    }
    return res.json({ prediction: predictionVal, result: "The person is not suffering from Heart Disease" });
  });
});

const diabetespred = asyncHandler(async (req, res) => {
  const { pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age } = req.body;

  const scriptPath = resolve(__dirname, "../ML/Diabetes Prediction/diabetespredict.py");
  const inputData = [pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age];

  if (!inputData.every((value) => typeof value !== "undefined")) {
    throw new ApiError(400, "All inputData fields must be provided");
  }

  const pythonProcess = spawn(pythonExecutable, [scriptPath, ...inputData]);

  let predictionVal = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => (predictionVal += data.toString()));
  pythonProcess.stderr.on("data", (data) => (errorData += data.toString()));

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Diabetes prediction stderr:", errorData);
      return res.status(500).json({ message: "Prediction script failed", details: errorData });
    }
    predictionVal = predictionVal.trim();
    if (predictionVal === "1") {
      return res.json({ prediction: predictionVal, result: "The person is suffering from Diabetes" });
    }
    return res.json({ prediction: predictionVal, result: "The person is not suffering from Diabetes" });
  });
});

const lungpred = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file uploaded");
  const filePath = req.file.path;
  const scriptPath = resolve(__dirname, "../ML/Lung Cancer Prediction/predict.py");

  const pythonProcess = spawn(pythonExecutable, [scriptPath, filePath]);

  let predictionData = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => (predictionData += data.toString()));
  pythonProcess.stderr.on("data", (data) => (errorData += data.toString()));

  pythonProcess.on("close", (code) => {
    deleteFile(filePath); // Always delete the file
    if (code !== 0) {
      console.error("Lung prediction stderr:", errorData);
      return res.status(500).json({ error: "Prediction script failed", details: errorData });
    }
    predictionData = predictionData.trim();

    console.log("Raw output from Python script (Lung):", predictionData);

    // --- THIS IS THE FIX: Check the *end* of the string, not the whole thing ---
    if (predictionData.endsWith("cancerous")) {
      return res.status(200).json({ prediction: "Person is suffering from Lung Cancer" });
    } else if (predictionData.endsWith("non-cancerous")) {
      return res.status(200).json({ prediction: "Person is not suffering from Lung Cancer" });
    }
    
    // This is the fallback if the output is unexpected
    return res.status(500).json({ error: "Unexpected prediction result", details: predictionData });
  });
});

const breastpred = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file uploaded");
  const filePath = req.file.path;
  const scriptPath = resolve(__dirname, "../ML/Breast Cancer Prediction/breast_cancer_prediction.py");

  const pythonProcess = spawn(pythonExecutable, [scriptPath, filePath]);

  let predictionData = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => (predictionData += data.toString()));
  pythonProcess.stderr.on("data", (data) => (errorData += data.toString()));

  pythonProcess.on("close", (code) => {
    deleteFile(filePath); // Always delete the file
    if (code !== 0) {
      console.error("Breast prediction stderr:", errorData);
      return res.status(500).json({ error: "Prediction script failed", details: errorData });
    }

    console.log("Raw output from Python script (Breast):", predictionData.trim());

    return res.status(200).json({ prediction: predictionData.trim() });
  });
});

export { heartpred, diabetespred, lungpred, breastpred };
