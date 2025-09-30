

// const { ai } = require("../utils/embedding");
// const { searchContent } = require("./search.controller");
// const { generatePrompt } = require("../utils/prompt");
// const { instructions } = require("../utils/instructions");
// const { Chat, User } = require('../db/models');

// function truncateQuestion(question, maxLength = 1000) {
//   if (question.length > maxLength) return question.slice(0, maxLength);
//   return question;
// }

// const getAllHistoryMessages = async (chatId, userId) => {
//   return await Chat.findAll({
//     where: { chatId, userId },
//     order: [['sentAt', 'DESC']]
//   });
// };

// async function ask(req, res) {
//   try {
//     let { question, grade, subject, cumulative, userId, chatId } = req.body;

//     if (typeof question !== "string" || !question.trim()) {
//       return res.status(400).json({ error: "Invalid or missing 'question'" });
//     }
//     if (typeof grade !== "string" || !grade.trim()) {
//       return res.status(400).json({ error: "Invalid or missing 'grade'" });
//     }
//     if (cumulative !== undefined && ![true, false, "true", "false"].includes(cumulative)) {
//       return res.status(400).json({ error: "Invalid 'cumulative'" });
//     }
//     if (!chatId) {
//       return res.status(400).json({ error: "Missing chatId" });
//     }
//     if (!userId) {
//       return res.status(400).json({ error: "Missing userId" });
//     }

//     cumulative = cumulative === true || cumulative === "true";
//     question = truncateQuestion(question, 1000);

//     const userExists = await User.findByPk(userId);
//     if (!userExists) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     const safetySettings = [
//       { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
//       { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" },
//       { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
//       { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
//       { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
//     ];

//     // Retrieve previous messages for context
//     let history = await getAllHistoryMessages(chatId, userId);
//     history = history.slice(0, 20);

//     const contents = history.map(h => ({
//       role: h.role,
//       parts: [{ text: h.text }]
//     }));

//     const results = await searchContent(question, grade, subject, cumulative);
//     const context = results.map(r => r.chunks).join("\n");
//     const prompt = generatePrompt(context, question);

//     await Chat.create({
//       chatId,
//       userId,
//       text: question,
//       role: "user",
//       title: results[0]?.title || null,
//       subject: subject || null
//     });

//     const contentsForCount = [
//       { role: "system", parts: [{ text: instructions }] },
//       ...contents,
//       { role: "user", parts: [{ text: prompt }] }
//     ];

//     const inputCountResponse = await ai.models.countTokens({
//     model: "gemini-2.5-flash",
//     contents: contentsForCount,
//     });

//     const inputTokens = inputCountResponse.totalTokens;

//     const chat = ai.chats.create({
//       model: "gemini-2.5-flash",
//       history: contents,
//       config: {
//         safetySettings,
//         systemInstruction: instructions,
//         thinkingConfig: { thinkingBudget: -1, },
//       },
//     });

//     const result = await chat.sendMessageStream({ message: prompt });

//     res.setHeader("Content-Type", "text/plain; charset=utf-8");
//     res.setHeader("Transfer-Encoding", "chunked");
//     res.setHeader("Cache-Control", "no-cache");

//     let answer = "";

//     for await (const chunk of result) {
//       if (chunk.text) {
//         answer += chunk.text;
//         res.write(chunk.text);
//         if (res.flush) res.flush();
//       }
//     }
    
//     await Chat.create({
//       chatId,
//       userId,
//       text: answer,
//       role: "model",
//       title: results[0]?.title || null,
//       subject: subject
//     });

//     res.end();

//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// }

// module.exports = { ask };
const { ai } = require("../utils/embedding");
const { searchContent } = require("./search.controller");
const { generatePrompt } = require("../utils/prompt");
const { instructions } = require("../utils/instructions");
const { Chat, User } = require('../db/models');

function truncateQuestion(question, maxLength = 1000) {
  if (question.length > maxLength) return question.slice(0, maxLength);
  return question;
}

// ✅ Fetch last 5 messages across all chats
const getLastMessages = async (userId, limit = 5) => {
  return await Chat.findAll({
    where: { userId },
    order: [['sentAt', 'DESC']],
    limit
  });
};

async function ask(req, res) {
  try {
    let { question, grade, subject, cumulative, userId, chatId } = req.body;

    if (!question?.trim()) return res.status(400).json({ error: "Invalid question" });
    if (!grade?.trim()) return res.status(400).json({ error: "Invalid grade" });
    if (!chatId) return res.status(400).json({ error: "Missing chatId" });
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    cumulative = cumulative === true || cumulative === "true";
    question = truncateQuestion(question, 1000);

    const userExists = await User.findByPk(userId);
    if (!userExists) return res.status(400).json({ error: "User not found" });

    const safetySettings = [
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ];

    // ✅ Get last 5 messages across all chats for context
    let history = await getLastMessages(userId, 5);
    history = history.reverse(); // chronological order

    const contents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const results = await searchContent(question, grade, subject, cumulative);
    const context = results.map(r => r.chunks).join("\n");
    const prompt = generatePrompt(context, question);

    // Save user question
    await Chat.create({
      chatId,
      userId,
      text: question,
      role: "user",
      title: results[0]?.title || null,
      subject: subject || null
    });

    const contentsForCount = [
      { role: "system", parts: [{ text: instructions }] },
      ...contents,
      { role: "user", parts: [{ text: prompt }] }
    ];

    const inputCountResponse = await ai.models.countTokens({
      model: "gemini-2.5-flash",
      contents: contentsForCount,
    });

    const inputTokens = inputCountResponse.totalTokens;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: contents,
      config: {
        safetySettings,
        systemInstruction: instructions,
        thinkingConfig: { thinkingBudget: -1 },
      },
    });

    const result = await chat.sendMessageStream({ message: prompt });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    let answer = "";

    for await (const chunk of result) {
      if (chunk.text) {
        answer += chunk.text;
        res.write(chunk.text);
      }
    }

    // Save AI answer
    await Chat.create({
      chatId,
      userId,
      text: answer,
      role: "model",
      title: results[0]?.title || null,
      subject: subject
    });

    res.end();

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { ask };
