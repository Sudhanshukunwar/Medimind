import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import path from "path";
import fs from "fs";
import multer from "multer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { History } from "../models/history.model.js"; // Import the new model

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

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    }
  });
};

const pythonExecutable = resolve(__dirname, "..", "venv", "Scripts", "python.exe");

// --- NEW HELPER: Safe Save to Database ---
const saveToHistory = async (userId, testType, result) => {
  try {
    if (!userId) return; // Skip if no user logged in (guest mode)
    await History.create({
      owner: userId,
      testType,
      result
    });
    console.log(`History saved: ${testType} for user ${userId}`);
  } catch (error) {
    console.error("Database Save Failed (History):", error.message);
    // We don't throw error here so the user still gets their prediction
  }
};

// Prediction Controllers 

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

  pythonProcess.on("close", async (code) => {
    if (code !== 0) {
      console.error("Heart prediction stderr:", errorData);
      return res.status(500).json({ message: "Prediction script failed", details: errorData });
    }
    predictionVal = predictionVal.trim();
    let finalResult = predictionVal === "1" ? "Suffering from Heart Disease" : "Not suffering from Heart Disease";
    
    // Save to History
    await saveToHistory(req.user?._id, "Heart Disease", finalResult);

    return res.json({ prediction: predictionVal, result: finalResult });
  });
});

const diabetespred = asyncHandler(async (req, res) => {
  const { pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age } = req.body;

  const scriptPath = resolve(__dirname, "../ML/Diabetes Prediction/diabetespredict.py");
  const inputData = [pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age];

  const pythonProcess = spawn(pythonExecutable, [scriptPath, ...inputData]);

  let predictionVal = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => (predictionVal += data.toString()));
  pythonProcess.stderr.on("data", (data) => (errorData += data.toString()));

  pythonProcess.on("close", async (code) => {
    if (code !== 0) {
      console.error("Diabetes prediction stderr:", errorData);
      return res.status(500).json({ message: "Prediction script failed", details: errorData });
    }
    predictionVal = predictionVal.trim();
    let finalResult = predictionVal === "1" ? "Suffering from Diabetes" : "Not suffering from Diabetes";

    // Save to History
    await saveToHistory(req.user?._id, "Diabetes", finalResult);

    return res.json({ prediction: predictionVal, result: finalResult });
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

  pythonProcess.on("close", async (code) => {
    deleteFile(filePath); 
    if (code !== 0) {
      console.error("Lung prediction stderr:", errorData);
      return res.status(500).json({ error: "Prediction script failed", details: errorData });
    }
    predictionData = predictionData.trim();

    let finalResult = "";
    if (predictionData.endsWith("cancerous") && !predictionData.endsWith("non-cancerous")) {
        finalResult = "Suffering from Lung Cancer";
    } else if (predictionData.endsWith("non-cancerous")) {
        finalResult = "Not suffering from Lung Cancer";
    }

    if (finalResult) {
        // Save to History
        await saveToHistory(req.user?._id, "Lung Cancer", finalResult);
        return res.status(200).json({ prediction: finalResult });
    }

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

  pythonProcess.on("close", async (code) => {
    deleteFile(filePath);
    if (code !== 0) {
      console.error("Breast prediction stderr:", errorData);
      return res.status(500).json({ error: "Prediction script failed", details: errorData });
    }

    let finalResult = predictionData.trim();
    
    // Save to History
    await saveToHistory(req.user?._id, "Breast Cancer", finalResult);

    return res.status(200).json({ prediction: finalResult });
  });
});

export { heartpred, diabetespred, lungpred, breastpred };