const { generateEmbedding } = require("../utils/embedding");
const { connectDB } = require("../utils/db");
const { AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");

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
