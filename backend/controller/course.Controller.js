const db = require('../config/db');

const createCourse = (req, res) => {
    const courseData = req.body;
    if (!courseData.name || !courseData.description || !courseData.price) {
        return res.status(400).json({ error: 'Name, description, and price are required.' });
    }
    const quer = `INSERT INTO courses SET ?`;
    db.query(quer, courseData, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(201).json({ message: 'Course created successfully.' });
    });
}
const getAllCourses = (req, res) => {
    let quer = `SELECT * FROM courses`;
    db.query(quer, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json(results);
    });
}
const getAllTeacherCourses = (req, res) => {
    let quer = `SELECT * FROM courses WHERE teacher_id = ?`;
    if (req.user.role === 'admin') {
        quer = `SELECT * FROM courses`;
    }
    db.query(quer, [req.user.id || req.user.role === 'admin'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json(results);
    });
}
const getCourseById = (req, res) => {
    let quer = `SELECT * FROM courses WHERE id = ? AND teacher_id = ?`;
    if (req.user.role === 'admin') {
        quer = `SELECT * FROM courses WHERE id = ?`;   
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
    let quer = `UPDATE courses SET ? WHERE id = ? AND teacher_id = ?`;
    if (req.user.role === 'admin') {
        quer = `UPDATE courses SET ? WHERE id = ?`;
    }
    db.query(quer, [courseData, req.body.id, req.user.id || req.user.role === 'admin'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json({ message: 'Course updated successfully.' });
    });
}
const deleteCourse = (req, res) => {
    let quer = `DELETE FROM courses WHERE id = ? AND teacher_id = ?`;
    if (req.user.role === 'admin') {
        quer = `DELETE FROM courses WHERE id = ?`;
    }
    db.query(quer, [req.body.id, req.user.id || req.user.role === 'admin'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json({ message: 'Course deleted successfully.' });
    });
}
module.exports = {
    createCourse,
    getAllCourses,
    getAllTeacherCourses,
    getCourseById,
    updateCourse,
    deleteCourse
}
