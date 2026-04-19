const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const fetchuser = require("../middleware/fetchuser");
const SymptomReport = require("../models/SymptomReport");
const ChatLog = require("../models/ChatLog");
const SystemConfig = require("../models/SystemConfig");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

router.post("/smart-advice", fetchuser, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.json({ answer: "Please ask something about your health or symptoms." });
    }

    // [FAILSAFE] Forced Premium Neural Prompt
    const systemPrompt = `You are the AuraMed Neural Uplink, a high-level diagnostic AI. 
    Your goal is to provide deep, structured, and clinically-professional health advice.
    
    CRITICAL INSTRUCTIONS:
    - DO NOT give short or generic answers.
    - Use EXACTly this structure:
      ### 🧬 NEURAL ANALYSIS
      Describe the condition with empathy.
      
      ### ⚠️ POTENTIAL INDICATORS
      Provide a bulleted list of 3-4 possible causes.
      
      ### 🛠️ TREATMENT PROTOCOLS
      Actionable steps or remedies.
      
      ### 🚨 CRITICAL WARNING
      Red flags for immediate doctor consultation.
      
    - Use Markdown for bolding and headers.
    - End with: "*AuraMed AI is a diagnostic tool, not a substitute for a licensed medical professional.*"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.65,
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;

    // Fast-log to Database
    const log = new ChatLog({ user: req.user.id, question, response: reply });
    await log.save();

    res.json({ answer: reply });

  } catch (error) {
    console.error("OpenAI API Error:", error.message || error);
    
    // Save fallback to DB so user history isn't lost
    const fallbackReply = "My AI brain is currently resting or the API key is missing. Please try again later.";
    try {
        const log = new ChatLog({ user: req.user.id, question: req.body.question, response: fallbackReply });
        await log.save();
    } catch(e) {}
    
    res.json({ answer: fallbackReply });
  }
});

// [NEW] AI Diagnosis Route with DB Save
router.post("/analyze-symptoms", fetchuser, async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: "Please provide symptoms to analyze." });
    }

    const symptomsText = symptoms.join(", ");

    let config = await SystemConfig.findOne({ key: 'ai_diagnosis_prompt' });
    const basePrompt = config ? config.value : `You are a highly advanced AI Medical Diagnostic tool. 
    Analyze the following symptoms: "{symptoms}".`;

    const systemPrompt = `${basePrompt.replace("{symptoms}", symptomsText)}
    Respond strictly in raw JSON format. No markdown blocks, no triple backticks. Just pure JSON.
    Format required exactly:
    {
      "possibleDiseases": [
        { "name": "string", "severity": "Medium" /* Low, Medium, High */, "probability": 85 /* 0-100 */ }
      ],
      "advice": "string clear advice mentioning consulting a doctor."
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.3,
      max_tokens: 400
    });

    const replyContent = completion.choices[0].message.content.trim();
    const aiResult = JSON.parse(replyContent.replace(/```json/g, "").replace(/```/g, ""));

    // Save to DB permanently
    const report = new SymptomReport({
      user: req.user.id,
      symptoms: symptoms,
      possibleDiseases: aiResult.possibleDiseases,
      advice: aiResult.advice
    });

    await report.save();
    res.json(report);

  } catch (error) {
    console.error("Diagnosis Error:", error);
    res.status(500).json({ error: "Could not process diagnosis securely." });
  }
});

// [NEW] Get past history
router.get("/symptom-history", fetchuser, async (req, res) => {
    try {
        const reports = await SymptomReport.find({ user: req.user.id }).sort({ date: -1 });
        res.json(reports);
    } catch (error) {
        console.error("History Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// [NEW] Purge ALL Symptom History
router.delete("/purge-symptoms", fetchuser, async (req, res) => {
    try {
        console.log(`[PURGE] User ${req.user.id} requested full symptom wipe...`);
        const result = await SymptomReport.deleteMany({ user: req.user.id });
        console.log(`[PURGE] Deleted ${result.deletedCount} reports.`);
        res.json({ message: "Diagnostic vault cleared" });
    } catch (error) {
        console.error("[PURGE ERROR]", error);
        res.status(500).json({ error: "Could not purge symptoms" });
    }
});

// [NEW] Delete Individual Symptom Report
router.delete("/symptom-history/:id", fetchuser, async (req, res) => {
    try {
        await SymptomReport.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: "Symptom report deleted" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete report" });
    }
});
// [NEW] Get AI Chat History
router.get("/chat-history", fetchuser, async (req, res) => {
    try {
        const chats = await ChatLog.find({ user: req.user.id }).sort({ date: -1 });
        res.json(chats);
    } catch (error) {
        console.error("Chat History Error:", error);
        res.status(500).json({ error: "Could not fetch chat history" });
    }
});

// [NEW] Purge ALL Chat History
router.delete("/purge-chat", fetchuser, async (req, res) => {
    try {
        console.log(`[PURGE] User ${req.user.id} requested full neural memory wipe...`);
        const result = await ChatLog.deleteMany({ user: req.user.id });
        console.log(`[PURGE] Deleted ${result.deletedCount} chat logs.`);
        res.json({ message: "Neural memory wiped successfully" });
    } catch (error) {
        console.error("[PURGE ERROR]", error);
        res.status(500).json({ error: "Could not purge chats" });
    }
});

// [NEW] Delete Chat History Log
router.delete("/chat-history/:id", fetchuser, async (req, res) => {
    try {
        await ChatLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: "Chat deleted" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete chat" });
    }
});

// [NEW] Edit/Regenerate Chat History Log
router.put("/chat-history/:id", fetchuser, async (req, res) => {
    try {
        const { question } = req.body;
        if(!question) return res.status(400).json({error: "Need question text"});

        // [FAILSAFE] Forced Premium Neural Prompt
        const systemPrompt = `You are the AuraMed Neural Uplink, a high-level diagnostic AI. 
        Your goal is to provide deep, structured, and clinically-professional health advice.
        
        CRITICAL INSTRUCTIONS:
        - DO NOT give short or generic answers.
        - Use EXACTly this structure:
          ### 🧬 NEURAL ANALYSIS
          Summary.
          ### ⚠️ POTENTIAL INDICATORS
          Bullet points.
          ### 🛠️ TREATMENT PROTOCOLS
          Actionable steps.
          ### 🚨 CRITICAL WARNING
          Red flags.
          
        - Use Markdown.
        - Include disclaimer.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question },
            ],
            temperature: 0.65,
            max_tokens: 500,
        });

        const reply = completion.choices[0].message.content;

        // 2. Update existing log in DB
        const updatedChat = await ChatLog.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { question: question, response: reply },
            { new: true }
        );

        res.json(updatedChat);
    } catch (error) {
        console.error("Chat Regeneration Error:", error);
        res.status(500).json({ error: "Could not modify and regenerate chat" });
    }
});

module.exports = router;