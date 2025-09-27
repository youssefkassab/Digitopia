const { generateEmbedding } = require("../utils/embedding");
const { connectDB } = require("../utils/db");
const { AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");

/**
 * Perform a vector-based search over curriculum content using an embedding of the question.
 *
 * Filters results by grade (or grades 1..grade when cumulative is true) and an optional subject,
 * and returns the top 5 matching documents with a vector search score and selected fields.
 *
 * @param {string} question - The text query to embed and use for the vector search.
 * @param {string} grade - Grade level as a stringified integer (e.g., "3"). When `cumulative` is true, grades 1 through this grade are included.
 * @param {string} [subject] - Optional subject to restrict results (e.g., "math").
 * @param {boolean} [cumulative=false] - If true, include all grades from 1 up to `grade`.
 * @returns {Array<Object>} Array of matching documents containing: grade, subject, unit_number, unit_name, lesson_number, lesson_name, idea_title, chunks, and score.
 * @throws {Error} If the generated embedding is missing or not an array.
 */
async function searchContent(question, grade, subject, cumulative = false) {
  const { collection } = await connectDB(AI_DB_NAME, AI_COLLECTION_NAME);

  const queryEmbedding = await generateEmbedding(question);
  if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
    throw new Error("queryEmbedding is invalid (not an array)");
  }

  console.log("queryEmbedding length:", queryEmbedding.length);

  // build match filter (grade required)
  const matchFilter = {};
  if (cumulative) {
    // grades from "1" to grade (string)
    const gradesList = [];
    for (let i = 1; i <= parseInt(grade, 10); i++) {
      gradesList.push(String(i));
    }
    matchFilter.grade = { $in: gradesList };
  } else {
    matchFilter.grade = grade; // grade as string
  }
  if (subject) {
    matchFilter.subject = subject;
  }

  const pipeline = [
    {
      $vectorSearch: {
        queryVector: queryEmbedding,
        path: "embedding",
        numCandidates: 50,
        limit: 5,
        index: "curriculum_index",
        filter: matchFilter,
      },
    },
    {
      $project: {
        _id: 0,
        grade: 1,
        subject: 1,
        unit_number: 1,
        unit_name: 1,
        lesson_number: 1,
        lesson_name: 1,
        idea_title: 1,
        chunks: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];

  const results = await collection.aggregate(pipeline).toArray();

  console.log("search results:", results);

  return results;
}

/**
 * Handle an HTTP request to perform a vector-based content search using the provided question, grade, and subject.
 *
 * Validates required fields in req.body, normalizes the optional `cumulative` flag, invokes searchContent, and sends the results as JSON.
 * Sends HTTP 400 for invalid input and HTTP 500 for internal errors.
 *
 * @param {import('express').Request} req - Express request with a JSON body containing:
 *   - question: non-empty string
 *   - grade: string representing a number
 *   - subject: non-empty string
 *   - cumulative (optional): boolean or string "true"/"false"
 * @param {import('express').Response} res - Express response used to send JSON responses and status codes.
 */
async function search(req, res) {
  try {
    let { question, grade, subject, cumulative } = req.body;
    
    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Invalid or missing 'question'" });
    }
    if (typeof grade !== "string" || !grade.trim() || isNaN(Number(grade))) {
      return res.status(400).json({ error: "Invalid or missing 'grade'" });
    }
    if (typeof subject !== "string" || !subject.trim()) {
      return res.status(400).json({ error: "Invalid or missing 'subject'" });
    }
    if (
      cumulative !== undefined &&
      ![true, false, "true", "false"].includes(cumulative)
    ) {
      return res.status(400).json({ error: "Invalid 'cumulative'" });
    }

    cumulative = cumulative === true || cumulative === "true";

    const results = await searchContent(question, grade, subject, cumulative);

    res.json(results);
  } catch (err) {
    console.error("Error in search:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { search, searchContent };
