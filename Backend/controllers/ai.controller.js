import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithAI = async (req, res) => {
    console.log("--- AI Chat Request Received ---");
    try {
        const { message } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // --- NEW: Added System Instructions for Personality ---
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: "You are MediBot, a specialized health assistant for the MediMind platform, developed by Sudhanshu Kunwar. Your tone is professional, empathetic, and clear. IMPORTANT: Do not use markdown formatting like asterisks (**) for bolding. Use plain text only. If someone asks what you can do, tell them you can predict Heart Disease, Diabetes, Lung Cancer, and Breast Cancer using MediMind's ML models, and answer general health questions."
        }); 

        console.log("Calling Gemini API with personality...");
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Optional: Extra safety to strip any accidental asterisks
        const cleanText = text.replace(/\*\*/g, "");

        console.log("Success! MediBot has responded.");
        res.status(200).json({ reply: cleanText });

    } catch (error) {
        console.error("DETAILED GEMINI ERROR:", error.message);
        res.status(500).json({ error: "MediBot Error: " + error.message });
    }
};