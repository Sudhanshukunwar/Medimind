import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithAI = async (req, res) => {
    console.log("--- AI Chat Request Received ---");
    try {
        const { message } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

       
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

        console.log("Calling Gemini API with gemini-2.5-flash...");
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        console.log("Success! MediBot has responded.");
        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("DETAILED GEMINI ERROR:", error.message);
        res.status(500).json({ error: "MediBot Error: " + error.message });
    }
};