const db = require('../config/db');

const createCourse = (req, res) => {
    const courseData = req.body;
    const tags = req.body.tags; // Array of tag names
    delete courseData.tags;
    if (req.user.role === 'admin') {
        if (!courseData.name || !courseData.description || !courseData.price || !courseData.teacher_id) {
            return res.status(400).json({ error: 'Name, description, price, and teacher id are required.' });
        }} else {
        if (!courseData.name || !courseData.description || !courseData.price) {
            return res.status(400).json({ error: 'Name, description, and price are required.' });
        }
        courseData.teacher_id = req.user.id;
    }
        const quer = `INSERT INTO courses SET ?`;
        db.query(quer, courseData, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error.'+ err });
            }
             const courseId = results.insertId;
        if (Array.isArray(tags) && tags.length > 0) {
            // Prepare bulk insert for courses_tags
            const values = tags.map(tagId => [courseId, tagId]);
            const tagQuery = `INSERT INTO courses_tags (course_id, tag_id) VALUES ?`;
            db.query(tagQuery, [values], (tagErr) => {
                if (tagErr) {
                    return res.status(500).json({ error: 'Course created, but failed to add tags.' });
                }
                return res.status(201).json({ message: 'Course and tags created successfully.' });
            });
    } else {
         return res.status(201).json({ message: 'Course created successfully (no tags).' });
    }
        });

}
const getAllCourses = (req, res) => {
    let quer = `SELECT c.id , c.name, c.description,c.price,c.teacher_id, GROUP_CONCAT(t.name SEPARATOR',')AS tags FROM courses AS C LEFT JOIN courses_tags AS ct ON c.id =ct.course_id LEFT JOIN tags AS t ON ct.tag_id=t.id GROUP BY c.id;`;
    db.query(quer, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' + err });
        }
        return res.status(200).json(results);
    });
}
const getAllTeacherCourses = (req, res) => {
    let quer = `SELECT * FROM courses WHERE teacher_id = ? GROUP_CONCAT(t.name SEPARATOR',')AS tags FROM courses AS C LEFT JOIN courses_tags AS ct ON c.id =ct.course_id LEFT JOIN tags AS t ON ct.tag_id=t.id GROUP BY c.id;`;
    if (req.user.role === 'admin') {
        quer = `SELECT * FROM courses GROUP_CONCAT(t.name SEPARATOR',')AS tags FROM courses AS C LEFT JOIN courses_tags AS ct ON c.id =ct.course_id LEFT JOIN tags AS t ON ct.tag_id=t.id GROUP BY c.id;`;
    }
    db.query(quer, [req.user.id || req.user.role === 'admin'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json(results);
    });
}
const getCourseById = (req, res) => {
    let quer = `SELECT * FROM courses WHERE id = ? AND teacher_id = ? GROUP_CONCAT(t.name SEPARATOR',')AS tags FROM courses AS C LEFT JOIN courses_tags AS ct ON c.id =ct.course_id LEFT JOIN tags AS t ON ct.tag_id=t.id GROUP BY c.id;`;
    if (req.user.role === 'admin') {
        quer = `SELECT * FROM courses WHERE id = ? GROUP_CONCAT(t.name SEPARATOR',')AS tags FROM courses AS C LEFT JOIN courses_tags AS ct ON c.id =ct.course_id LEFT JOIN tags AS t ON ct.tag_id=t.id GROUP BY c.id;`;
    }
    db.query(quer, [req.body.id, req.user.id || req.user.role === 'admin'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json(results[0]);
    });
}
const updateCourse = (req, res) => {
    const courseData = req.body;
    const tags = courseData.tags; // Array of tag IDs
    delete courseData.tags;
    let quer = `UPDATE courses SET ? WHERE id = ? AND teacher_id = ?`;
    if (req.user.role === 'admin') {
        quer = `UPDATE courses SET ? WHERE id = ?`;
    }
    db.query(quer, [courseData, req.body.id, req.user.id || req.user.role === 'admin'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
         if (Array.isArray(tags)) {
            const deleteTagsQuery = `DELETE FROM courses_tags WHERE course_id = ?`;
            db.query(deleteTagsQuery, [req.body.id], (delErr) => {
                if (delErr) {
                    return res.status(500).json({ error: 'Course updated, but failed to update tags.' });
                }
                if (tags.length > 0) {
                    const now = new Date();
                    const values = tags.map(tagId => [req.body.id, tagId, now]);
                    const insertTagsQuery = `INSERT INTO courses_tags (course_id, tag_id, updatedAt) VALUES ?`;
                    db.query(insertTagsQuery, [values], (insErr) => {
                        if (insErr) {
                            return res.status(500).json({ error: 'Course updated, but failed to add new tags.'});
                        }
                        return res.status(200).json({ message: 'Course and tags updated successfully.' });
                    });
                } else {
                    return res.status(200).json({ message: 'Course updated successfully (no tags).' });
                }
            });
        } else {
            return res.status(200).json({ message: 'Course updated successfully.' });
        }
    });
}
const deleteCourse = (req, res) => {
    let quer = `DELETE FROM courses WHERE id = ? AND teacher_id = ?`;
    let querTags = `DELETE FROM courses_tags WHERE course_id = ?`;        
    if (req.user.role === 'admin') {
        quer = `DELETE FROM courses WHERE id = ?`;
    }
    db.query(querTags, [req.body.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.'+ err });
        }
    db.query(quer, [req.body.id, req.user.id || req.user.role === 'admin'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.'+ err });
        }    
            return res.status(200).json({ message: 'Course deleted successfully.' });
    });
    });
}
const getTags = (req,res)=> {
    const query = `SELECT * FROM tags`
    db.query(query,(err,results)=>{
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json(results);
    })
}
const createTag = (req,res)=> {
    const tag = req.body
    const query = `INSERT INTO tags SET ?`
    db.query(query,tag,(err,results)=>{
         if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json({message: 'Tag created successfully.' });
    })
}
module.exports = {
    createCourse,
    getAllCourses,
    getAllTeacherCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getTags,
    createTag
}
