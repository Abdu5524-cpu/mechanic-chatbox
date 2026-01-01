import openai, { extractOutput } from "../../lib/openaiClient.js";

export async function quoteParser({ userText, userLocationHint = null }) {
  // Build the prompt for the AI model
    
    const response = await openai.responses.create({
    prompt: {
        id: "pmpt_6956f1e3a6b4819488fba4545c76e45c00a8089947c5bc2a",
        version: "1"
    },
    input: [
        {
        role: "user",
        content: userText + (userLocationHint ? `\n\nUser location hint: ${userLocationHint}` : "")
        }
    ]
    });

    return extractOutput(response);
}
