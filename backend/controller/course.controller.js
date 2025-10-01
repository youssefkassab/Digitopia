const { sequelize, Sequelize } = require("../db/models");
const { QueryTypes } = Sequelize;

const createCourse = (req, res) => {
  const courseData = req.body;
  const tags = req.body.tags; // Array of tag id
  delete courseData.tags;
  if (req.user.role === "admin") {
    if (
      !courseData.name ||
      !courseData.description ||
      !courseData.price ||
      !courseData.teacher_id
    ) {
      return res
        .status(400)
        .json({
          error: "Name, description, price, and teacher id are required.",
        });
    }
  } else {
    if (!courseData.name || !courseData.description || !courseData.price) {
      return res
        .status(400)
        .json({ error: "Name, description, and price are required." });
    }
    courseData.teacher_id = req.user.id;
  }
  sequelize
    .transaction(async (t) => {
      // Explicit insert with named replacements (no createdAt/updatedAt to support current DB schema)
      const insertSql = `INSERT INTO courses (name, description, price, teacher_id) VALUES (:name, :description, :price, :teacher_id)`;
      const params = {
        name: courseData.name,
        description: courseData.description,
        price: courseData.price,
        teacher_id: courseData.teacher_id,
      };
      const [result, meta] = await sequelize.query(insertSql, {
        replacements: params,
        transaction: t,
        type: QueryTypes.INSERT,
      });
      let courseId = (meta && meta.insertId) || (result && result.insertId);
      if (!courseId) {
        const idRows = await sequelize.query("SELECT LAST_INSERT_ID() AS id", {
          transaction: t,
          type: QueryTypes.SELECT,
        });
        courseId = idRows && idRows[0] ? idRows[0].id : undefined;
      }
      if (!courseId) {
        throw new Error("Could not determine inserted course id");
      }

      // Normalize incoming tags to numeric IDs (supports numbers, numeric strings, or objects with id)
      const tagIds = Array.isArray(tags)
        ? tags
            .map((t) => {
              if (typeof t === "number") return t;
              if (typeof t === "string") {
                const n = parseInt(t, 10);
                return Number.isNaN(n) ? undefined : n;
              }
              if (t && typeof t === "object" && "id" in t) {
                const n = parseInt(t.id, 10);
                return Number.isNaN(n) ? undefined : n;
              }
              return undefined;
            })
            .filter((n) => Number.isFinite(n))
        : [];

      if (tagIds.length > 0) {
        // Build bulk values placeholders
        const rows = tagIds.map(() => "(?, ?)").join(",");
        const flat = tagIds.flatMap((tagId) => [courseId, tagId]);
        const tagQuery = `INSERT INTO courses_tags (course_id, tag_id) VALUES ${rows}`;
        await sequelize.query(tagQuery, {
          replacements: flat,
          transaction: t,
          type: QueryTypes.INSERT,
        });
        return { withTags: true };
      }
      return { withTags: false };
    })
    .then((outcome) => {
      if (outcome.withTags) {
        return res
          .status(201)
          .json({ message: "Course and tags created successfully." });
      }
      return res
        .status(201)
        .json({ message: "Course created successfully (no tags)." });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({
          error:
            "Internal server error. " +
            (err && err.message ? err.message : err),
        });
    });
};
const getAllCourses = (req, res) => {
  let quer = `SELECT c.id , c.name, c.description,c.price,c.teacher_id, COALESCE(GROUP_CONCAT(t.name SEPARATOR','), '') AS tags FROM courses AS c LEFT JOIN courses_tags AS ct ON c.id = ct.course_id LEFT JOIN tags AS t ON ct.tag_id = t.id GROUP BY c.id;`;
  sequelize
    .query(quer, { type: QueryTypes.SELECT })
    .then((results) => res.status(200).json(results))
    .catch((err) =>
      res.status(500).json({ error: "Internal server error." + err })
    );
};
const getAllTeacherCourses = (req, res) => {
  const baseSelect = `
  SELECT c.id, c.name, c.description, c.price, c.teacher_id,
         COALESCE(GROUP_CONCAT(t.name SEPARATOR ','), '') AS tags
  FROM courses AS c
  LEFT JOIN courses_tags AS ct ON c.id = ct.course_id
  LEFT JOIN tags AS t ON ct.tag_id = t.id
`;
  const quer =
    req.user.role === "admin"
      ? `${baseSelect} GROUP BY c.id`
      : `${baseSelect} WHERE c.teacher_id = ? GROUP BY c.id`;
  const params = req.user.role === "admin" ? [] : [req.user.id];
  sequelize
    .query(quer, { replacements: params, type: QueryTypes.SELECT })
    .then((results) => res.status(200).json(results))
    .catch(() => res.status(500).json({ error: "Internal server error." }));
};
const getCourseById = (req, res) => {
  const baseSelect = `SELECT c.id, c.name, c.description, c.price, c.teacher_id, COALESCE(GROUP_CONCAT(t.name SEPARATOR ','), '') AS tags FROM courses AS c LEFT JOIN courses_tags AS ct ON c.id = ct.course_id LEFT JOIN tags AS t ON ct.tag_id = t.id`;
  const quer =
    req.user.role === "admin"
      ? `${baseSelect} WHERE c.id = ? GROUP BY c.id`
      : `${baseSelect} WHERE c.id = ? AND c.teacher_id = ? GROUP BY c.id`;
  const id = req.params.id;
  const params = req.user.role === "admin" ? [id] : [id, req.user.id];
  sequelize
    .query(quer, { replacements: params, type: QueryTypes.SELECT })
    .then((results) => res.status(200).json(results[0]))
    .catch(() => res.status(500).json({ error: "Internal server error." }));
};
const updateCourse = (req, res) => {
  const courseData = req.body;
  const tags = courseData.tags; // Array of tag IDs
  delete courseData.tags;
  // If nothing to update at all
  const candidateKeys = [
    "name",
    "description",
    "price",
    "teacher_id",
    "date",
    "time",
  ];
  const keys = Object.keys(courseData).filter((k) => candidateKeys.includes(k));
  if (keys.length === 0 && !Array.isArray(tags)) {
    return res.status(400).json({ error: "Nothing to update." });
  }
  sequelize
    .transaction(async (t) => {
      // Dynamic SET clause for provided fields (preserving semantics)
      let updatedRows = 0;
      let existsWithinScope = null; // null = unknown, true/false = checked

      if (keys.length > 0) {
        const setClause = keys.map((k) => `${k} = ?`).join(", ");
        const values = keys.map((k) => courseData[k]);
        if (req.user.role === "admin") {
          const sql = `UPDATE courses SET ${setClause} WHERE id = ?`;
          const [resMeta] = await sequelize.query(sql, {
            replacements: [...values, req.body.id],
            transaction: t,
            type: QueryTypes.UPDATE,
          });
          const meta = Array.isArray(resMeta) ? resMeta[1] : resMeta;
          updatedRows = (meta && (meta.affectedRows || meta.rowCount)) || 0;
          if (updatedRows === 0) {
            const rows = await sequelize.query(
              `SELECT id FROM courses WHERE id = ?`,
              {
                replacements: [req.body.id],
                transaction: t,
                type: QueryTypes.SELECT,
              }
            );
            existsWithinScope = Array.isArray(rows) && rows.length > 0;
          }
        } else {
          const sql = `UPDATE courses SET ${setClause} WHERE id = ? AND teacher_id = ?`;
          const [resMeta] = await sequelize.query(sql, {
            replacements: [...values, req.body.id, req.user.id],
            transaction: t,
            type: QueryTypes.UPDATE,
          });
          const meta = Array.isArray(resMeta) ? resMeta[1] : resMeta;
          updatedRows = (meta && (meta.affectedRows || meta.rowCount)) || 0;
          if (updatedRows === 0) {
            const rows = await sequelize.query(
              `SELECT id FROM courses WHERE id = ? AND teacher_id = ?`,
              {
                replacements: [req.body.id, req.user.id],
                transaction: t,
                type: QueryTypes.SELECT,
              }
            );
            existsWithinScope = Array.isArray(rows) && rows.length > 0;
          }
        }
      }

      // Tags update inside the SAME transaction, with ownership checks
      let tagsChanged = false;
      let tagsCount = null;
      if (Array.isArray(tags)) {
        // Ensure course exists and ownership is valid for non-admins
        if (req.user.role === "admin") {
          const rows = await sequelize.query(
            `SELECT id FROM courses WHERE id = ?`,
            {
              replacements: [req.body.id],
              transaction: t,
              type: QueryTypes.SELECT,
            }
          );
          if (!rows || rows.length === 0) {
            const err = new Error("NOT_FOUND");
            err.code = "NOT_FOUND";
            throw err;
          }
        } else {
          const rows = await sequelize.query(
            `SELECT id FROM courses WHERE id = ? AND teacher_id = ?`,
            {
              replacements: [req.body.id, req.user.id],
              transaction: t,
              type: QueryTypes.SELECT,
            }
          );
          if (!rows || rows.length === 0) {
            const err = new Error("NOT_FOUND");
            err.code = "NOT_FOUND";
            throw err;
          }
        }

        // Delete existing and re-insert
        await sequelize.query(`DELETE FROM courses_tags WHERE course_id = ?`, {
          replacements: [req.body.id],
          transaction: t,
          type: QueryTypes.DELETE,
        });

        tagsCount = tags.length;
        if (tags.length > 0) {
          const rows = tags.map(() => "(?, ?)").join(",");
          const flat = tags.flatMap((tagId) => [req.body.id, tagId]);
          await sequelize.query(
            `INSERT INTO courses_tags (course_id, tag_id) VALUES ${rows}`,
            { replacements: flat, transaction: t, type: QueryTypes.INSERT }
          );
        }
        tagsChanged = true;
      }

      return {
        updatedRows,
        tagsChanged,
        tagsCount,
        hadFieldUpdates: keys.length > 0,
        existsWithinScope,
      };
    })
    .then((outcome) => {
      // Build response based on what changed
      if (!outcome.hadFieldUpdates && !outcome.tagsChanged) {
        // Should not happen due to early return, but keep safety
        return res.status(400).json({ error: "Nothing to update." });
      }

      if (outcome.hadFieldUpdates && outcome.tagsChanged) {
        // Course fields and tags processed
        if (outcome.updatedRows === 0 && outcome.existsWithinScope === false) {
          return res
            .status(404)
            .json({ error: "Course not found or not owned by user." });
        }
        if (outcome.updatedRows === 0 && outcome.existsWithinScope) {
          return res
            .status(200)
            .json({
              message: "No changes detected. Tags updated successfully.",
            });
        }
        return res
          .status(200)
          .json({ message: "Course and tags updated successfully." });
      }

      if (outcome.hadFieldUpdates && !outcome.tagsChanged) {
        if (outcome.updatedRows === 0 && outcome.existsWithinScope === false) {
          return res
            .status(404)
            .json({ error: "Course not found or not owned by user." });
        }
        if (outcome.updatedRows === 0 && outcome.existsWithinScope) {
          return res.status(200).json({ message: "No changes detected." });
        }
        return res
          .status(200)
          .json({ message: "Course updated successfully." });
      }

      // Only tags changed
      if (!outcome.hadFieldUpdates && outcome.tagsChanged) {
        // Ownership and existence have been validated inside the transaction
        if (outcome.tagsCount && outcome.tagsCount > 0) {
          return res
            .status(200)
            .json({ message: "Course tags updated successfully." });
        }
        return res
          .status(200)
          .json({ message: "Course updated successfully (no tags)." });
      }

      return res.status(200).json({ message: "Course updated successfully." });
    })
    .catch((err) => {
      if (err && err.code === "NOT_FOUND") {
        return res
          .status(404)
          .json({ error: "Course not found or not owned by user." });
      }
      return res.status(500).json({ error: "Internal server error." });
    });
};
const deleteCourse = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Course ID is required." });
  }

  let deleteCourseQuery = `DELETE FROM courses WHERE id = ? AND teacher_id = ?`;
  const deleteTagsQuery = `DELETE FROM courses_tags WHERE course_id = ?`;

  if (req.user.role === "admin") {
    deleteCourseQuery = `DELETE FROM courses WHERE id = ?`;
  }

  try {
    await sequelize.transaction(async (t) => {
      // Delete tags first
      await sequelize.query(deleteTagsQuery, {
        replacements: [id],
        transaction: t,
        type: QueryTypes.DELETE,
      });

      // Delete course
      const params = req.user.role === "admin" ? [id] : [id, req.user.id];

      const [results, metadata] = await sequelize.query(deleteCourseQuery, {
        replacements: params,
        transaction: t,
      });

      const affected =
        (metadata && (metadata.affectedRows || metadata.rowCount)) || 0;

      console.log("Deleted rows:", affected);

      if (affected === 0) {
        const err = new Error("NOT_FOUND");
        err.code = "NOT_FOUND";
        throw err;
      }
    });

    return res.status(200).json({ message: "Course deleted successfully." });
  } catch (err) {
    if (err && err.code === "NOT_FOUND") {
      return res
        .status(404)
        .json({ error: "Course not found or not owned by user." });
    }

    console.error("Delete course error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getTags = (req, res) => {
  const query = `SELECT * FROM tags`;
  sequelize
    .query(query, { type: QueryTypes.SELECT })
    .then((results) => res.status(200).json(results))
    .catch(() => res.status(500).json({ error: "Internal server error." }));
};
const createTag = (req, res) => {
  const tag = req.body;
  const query = `INSERT INTO tags (name) VALUES (?)`;
  sequelize
    .query(query, { replacements: [tag.name] })
    .then(() => res.status(200).json({ message: "Tag created successfully." }))
    .catch(() => res.status(500).json({ error: "Internal server error." }));
};
module.exports = {
  createCourse,
  getAllCourses,
  getAllTeacherCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getTags,
  createTag,
};
