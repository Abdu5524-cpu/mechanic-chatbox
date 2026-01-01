import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? process.env.OpenAI_API_KEY,
});

router.post("/", async (req, res, next) => {
  try {
    const { formData, messages } = req.body ?? {};
    const resolvedMessages = Array.isArray(messages) && messages.length > 0
      ? messages
      : [
          {
            role: "user",
            content:
              typeof formData === "string"
                ? formData
                : JSON.stringify(formData ?? ""),
          },
        ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: resolvedMessages,
    });

    res.json({ reply: completion.choices[0]?.message?.content ?? "" });
  } catch (err) {
    next(err);
  }
});

export default router;
