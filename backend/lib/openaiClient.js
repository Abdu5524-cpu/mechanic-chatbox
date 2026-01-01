import OpenAI from "openai";

// Initialize the OpenAI client with the API key from the environment.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function extractOutput(response) {
  const firstContent = response?.output?.[0]?.content?.[0];
  if (firstContent?.type === "output_text" && firstContent.text?.value) {
    return firstContent.text.value;
  }
  if (firstContent?.type === "output_text" && typeof firstContent.text === "string") {
    return firstContent.text;
  }
  if (firstContent?.type === "json_object" && firstContent.json_object) {
    return JSON.stringify(firstContent.json_object);
  }
  return response?.output_text ?? null;
}

// Send a prompt to the model and return a string best-effort from any response type.
export async function generateText(systemInput, userInput, responseFormatType) {
  const response = await openai.responses.create({
    model: "gpt-4.1-nano",
    input: [
        {role: "system", content: systemInput},
        {role: "user", content: userInput},
  ],
    response_format: { type: responseFormatType },
  });

  return extractOutput(response);
}

export default openai;
