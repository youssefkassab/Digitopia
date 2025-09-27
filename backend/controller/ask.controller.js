const { ai } = require("../utils/embedding");
const { searchContent } = require("./search.controller");
const { generatePrompt } = require("../utils/prompt");
const { instructions } = require("../utils/instructions");

function truncateQuestion(question, maxLength = 1000) {
  if (question.length > maxLength) return question.slice(0, maxLength);
  return question;
}

async function ask(req, res) {
  try {
    let { question, grade, subject, cumulative } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Invalid or missing 'question'" });
    }
    if (typeof grade !== "string" || !grade.trim()) {
      return res.status(400).json({ error: "Invalid or missing 'grade'" });
    }
    if (
      cumulative !== undefined &&
      ![true, false, "true", "false"].includes(cumulative)
    ) {
      return res.status(400).json({ error: "Invalid 'cumulative'" });
    }

    cumulative = cumulative === true || cumulative === "true";
    question = truncateQuestion(question, 1000);

    const safetySettings = [
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE", // السماح بمحتوى بيولوجي/جنسي (تعليمي)
      },
      {
        category: "HARM_CATEGORY_CIVIC_INTEGRITY",
        threshold: "BLOCK_NONE", // السماح بمحتوى سياسي/دراسات اجتماعية
      },
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ];

    // if no history provided, start fresh
    let contents = [];

    const results = await searchContent(question, grade, subject, cumulative);
    const context = results.map(r => r.chunks).join("\n");
    const prompt = generatePrompt(context, question);
    
    const chat = ai.chats.create({ // if not streaming: generateContent
      model: "gemini-2.5-flash",
      history: contents,
      config: {
        safetySettings,
        systemInstruction: instructions,
        thinkingConfig: {
          thinkingBudget: -1,
          includeThoughts: true,
        },
      },
    });

    const result = await chat.sendMessageStream({
      message: prompt,
    });

    // add current user question
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });
    
    // const answer = result.text; // if not streaming
    let answer = "";

    for await (const chunk of result) {
      if (chunk.text) {
        answer += chunk.text;
        res.write(chunk.text);
      }
    }


    // add model response automatically
    contents.push({
      role: "model",
      parts: [{ text: answer }],
    });

    // res.json({ answer, context: results, history: contents }); // if not streaming
    res.end(); // end streaming
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { ask };