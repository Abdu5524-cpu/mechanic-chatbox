const express = require ('express');
const OpenAI = require ('openai');
const router = express.Router();


router.post("/analyze_quote", async (req, res) => {
    const { formData } = req.body;

    const completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [{ role: "user", content: formData }],
    });

    res.json ({ reply: completion.choices[0].message.content });
});

module.exports = router;