import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import multer from "multer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { History } from "../models/history.model.js";

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

const saveToHistory = async (userId, testType, result) => {
  try {
    if (!userId) return; 
    await History.create({
      owner: userId,
      testType,
      result
    });
    console.log(`History saved: ${testType} for user ${userId}`);
  } catch (error) {
    console.error("Database Save Failed (History):", error.message);
  }
};

// ==========================================
// Prediction Controllers (Cloud Connected)
// ==========================================

const heartpred = asyncHandler(async (req, res) => {
  const { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13 } = req.body;
  const transformedP2 = isNaN(p2) ? (p2.toLowerCase() === "male" ? 1 : 0) : p2;
  const transformedP6 = isNaN(p6) ? (p6.toLowerCase() === "yes" ? 1 : 0) : p6;

  try {
    // Convert strings to numbers for the model
    const inputArray = [Number(p1), transformedP2, Number(p3), Number(p4), Number(p5), transformedP6, Number(p7), Number(p8), Number(p9), Number(p10), Number(p11), Number(p12), Number(p13)];
    console.log("--- ACCURACY AUDIT --- Data being sent to AI:", inputArray);
    const response = await fetch(`${process.env.ML_API_URL}/predict/heart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: inputArray })
    });
    
    const data = await response.json();
    let finalResult = data.prediction == 1 ? "Suffering from Heart Disease" : "Not suffering from Heart Disease";
    
    await saveToHistory(req.user?._id, "Heart Disease", finalResult);
    return res.json({ prediction: data.prediction, result: finalResult });
  } catch (error) {
    console.error("Heart Cloud Engine Error:", error);
    return res.status(500).json({ message: "Cloud Prediction failed", details: error.message });
  }
});

const diabetespred = asyncHandler(async (req, res) => {
  const { pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age } = req.body;

  try {
    const inputArray = [Number(pregnancies), Number(glucose), Number(bloodPressure), Number(skinThickness), Number(insulin), Number(bmi), Number(diabetesPedigreeFunction), Number(age)];
    console.log("--- ACCURACY AUDIT --- Data being sent to AI:", inputArray);
    const response = await fetch(`${process.env.ML_API_URL}/predict/diabetes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: inputArray }) 
    });

    const data = await response.json();
    let finalResult = data.prediction == 1 ? "Suffering from Diabetes" : "Not suffering from Diabetes";

    await saveToHistory(req.user?._id, "Diabetes", finalResult);
    return res.json({ prediction: data.prediction, result: finalResult });
  } catch (error) {
    console.error("Diabetes Cloud Engine Error:", error);
    return res.status(500).json({ message: "Cloud Prediction failed", details: error.message });
  }
});

const lungpred = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file uploaded");
  const filePath = req.file.path;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype });
    const formData = new FormData();
    formData.append("file", blob, req.file.originalname);

    const response = await fetch(`${process.env.ML_API_URL}/predict/lung`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    let predictionData = data.prediction ? data.prediction.trim() : "";
    
    let finalResult = "";
    if (predictionData === "cancerous") {
        finalResult = "Suffering from Lung Cancer";
    } else if (predictionData === "non-cancerous") {
        finalResult = "Not suffering from Lung Cancer";
    } else {
        finalResult = predictionData; // Fallback
    }

    if (finalResult) {
        await saveToHistory(req.user?._id, "Lung Cancer", finalResult);
        deleteFile(filePath); 
        return res.status(200).json({ prediction: finalResult });
    }
    
    deleteFile(filePath);
    return res.status(500).json({ error: "Unexpected prediction result", details: predictionData });

  } catch (error) {
    deleteFile(filePath);
    console.error("Lung Cloud Engine Error:", error);
    return res.status(500).json({ error: "Cloud Prediction failed", details: error.message });
  }
});

const breastpred = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file uploaded");
  const filePath = req.file.path;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype });
    const formData = new FormData();
    formData.append("file", blob, req.file.originalname);

    const response = await fetch(`${process.env.ML_API_URL}/predict/breast`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    let finalResult = data.prediction ? data.prediction.trim() : "Prediction Error";
    
    await saveToHistory(req.user?._id, "Breast Cancer", finalResult);
    deleteFile(filePath);
    return res.status(200).json({ prediction: finalResult });

  } catch (error) {
    deleteFile(filePath);
    console.error("Breast Cloud Engine Error:", error);
    return res.status(500).json({ error: "Cloud Prediction failed", details: error.message });
  }
});

export { heartpred, diabetespred, lungpred, breastpred };