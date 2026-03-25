import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("--- AVAILABLE MODELS FOR YOUR KEY ---");
    data.models.forEach(m => console.log("- " + m.name));
  } catch (e) {
    console.error("Error listing models:", e);
  }
}

listModels();