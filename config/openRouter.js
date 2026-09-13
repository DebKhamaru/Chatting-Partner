import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing");
}

const openRouter = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default openRouter;