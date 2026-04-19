const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/ask', async (req, res) => {
    try {
        const { message } = req.body;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are a professional health assistant. Provide short and clear answers." 
                },
                { 
                    role: "user", 
                    content: message 
                }
            ],
            model: "llama-3.1-8b-instant", // Latest Groq model
        });

        res.json({ 
            reply: chatCompletion.choices[0]?.message?.content || "No response available" 
        });

    } catch (error) {
        console.log("Groq Error:", error.message);

        res.status(500).json({ 
            reply: "The AI service is currently unavailable. Please try again later." 
        });
    }
});

module.exports = router;