import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import path from "path";
import fs from "fs";

// --- Helper for Deleting Files ---
const deleteFile = (filePath, message) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    } else {
      console.log(`${message}: ${filePath}`);
    }
  });
};

// --- THIS IS THE FIX: Define the absolute path to the Python in your venv ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pythonExecutable = resolve(__dirname, "..", "venv", "Scripts", "python.exe");

const createScraper = (scriptName) => {
  return (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }
    const pdfPath = req.file.path;
    const scriptPath = resolve(__dirname, "../DataScrapingScripts", scriptName);

    const pythonProcess = spawn(pythonExecutable, [scriptPath, pdfPath]);

    let extractedData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      extractedData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
      console.error(`Scraping script stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      deleteFile(pdfPath, "File deleted successfully");
      if (code !== 0) {
        return res.status(500).json({ error: "Error processing PDF", details: errorData });
      }
      try {
        const jsonData = JSON.parse(extractedData);
        return res.status(200).json(jsonData);
      } catch (error) {
        console.error("Error parsing JSON from Python:", error);
        return res.status(500).json({ error: "Failed to parse data from PDF", details: extractedData });
      }
    });
  };
};

export const heartScraper = createScraper("scrapHeart.py");
export const diabetesScraper = createScraper("scrapDiabetes.py");

