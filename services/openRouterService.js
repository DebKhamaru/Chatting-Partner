import openRouter from "../config/openRouter.js";

export const generateAIResponse = async ({ systemInstruction, history }) => {
    const response = await openRouter.interactions.create({
        model: "gemini-3.8-flash",
        system_instruction: systemInstruction,
        input: history,
        store: false,
    });

    if (!response) {
        throw new Error("AI response is empty");
    }

    return {
        aiReply: response.output_text,
        usage: response.usage || {},
    };
};