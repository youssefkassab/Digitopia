const { sequelize, Sequelize } = require('../db/models');
const { QueryTypes } = Sequelize;
const path = require('path');

const add = (req, res) => {
  try {
    // Extract file paths from uploaded files
    let imgPath = req.body.img || null;
    let gamePath = req.body.gameurl || null;

    // Handle uploaded files
    if (req.files) {
      if (req.files.imgFile && req.files.imgFile[0]) {
        imgPath = '/img/' + req.files.imgFile[0].filename;
      }
      if (req.files.gameFile && req.files.gameFile[0]) {
        gamePath = '/games/' + req.files.gameFile[0].filename;
      }
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS games (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        grade VARCHAR(50),
        unit VARCHAR(100),
        lesson VARCHAR(100),
        img VARCHAR(500),
        gameurl VARCHAR(500),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    const query = `INSERT INTO games (name, description, grade, unit, lesson, img, gameurl) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [req.body.name, req.body.description, req.body.grade, req.body.unit, req.body.lesson, imgPath, gamePath];

    // First, ensure the table exists
    sequelize.query(createTableQuery)
      .then(() => {
        // Then insert the game
        return sequelize.query(query, { replacements: values, type: QueryTypes.INSERT });
      })
      .then(() => res.status(201).json({
        message: 'Game created successfully.',
        img: imgPath,
        gameurl: gamePath
      }))
      .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e.message }));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error. ' + error.message });
  }
}
const getAll = (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS games (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      grade VARCHAR(50),
      unit VARCHAR(100),
      lesson VARCHAR(100),
      img VARCHAR(500),
      gameurl VARCHAR(500),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const selectQuery = `SELECT id, name, description, grade, unit, lesson, img, gameurl FROM games`;
  const insertSampleDataQuery = `
    INSERT IGNORE INTO games (name, description, grade, unit, lesson, img, gameurl) VALUES
    ('Bending Light', 'Learn about light refraction and how light bends when passing through different materials', '1', 'Light & Optics', 'Refraction', 'https://picsum.photos/300/200?random=1', '/games/bending-light_en.html'),
    ('Build an Atom', 'Discover how atoms are constructed and learn about protons, neutrons, and electrons', '1', 'Atomic Structure', 'Atoms', 'https://picsum.photos/300/200?random=2', '/games/build-an-atom_en.html'),
    ('Forces and Motion', 'Explore the fundamental forces that govern motion and understand Newton\'s laws', '2', 'Physics', 'Motion', 'https://picsum.photos/300/200?random=3', '/games/forces-and-motion-basics_en.html'),
    ('Trigonometry Tour', 'Master trigonometry concepts with interactive visualizations and practical examples', '3', 'Mathematics', 'Trigonometry', 'https://picsum.photos/300/200?random=4', '/games/trig-tour_en.html')
  `;

  // First, ensure the table exists
  sequelize.query(createTableQuery)
    .then(() => {
      // Then insert sample data if table is empty
      return sequelize.query(`SELECT COUNT(*) as count FROM games`);
    })
    .then(countResult => {
      if (countResult[0][0].count === 0) {
        return sequelize.query(insertSampleDataQuery);
      }
      return Promise.resolve();
    })
    .then(() => {
      // Finally fetch the games
      return sequelize.query(selectQuery, { type: QueryTypes.SELECT });
    })
    .then((results) => {
      // Ensure we always return an array
      const games = Array.isArray(results) ? results : (results[0] || []);
      res.status(200).json(games);
    })
    .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e.message }));
}
const deletegame = (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS games (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      grade VARCHAR(50),
      unit VARCHAR(100),
      lesson VARCHAR(100),
      img VARCHAR(500),
      gameurl VARCHAR(500),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const quer = `DELETE FROM games WHERE id = ?`;

  // First, ensure the table exists
  sequelize.query(createTableQuery)
    .then(() => {
      // Then delete the game
      return sequelize.query(quer, { replacements: [req.body.id], type: QueryTypes.DELETE });
    })
    .then(() => res.status(200).json({ message: 'Game deleted successfully.' }))
    .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e.message }));
}
const update = (req, res) => {
  try {
    // Extract file paths from uploaded files
    let imgPath = req.body.img || null;
    let gamePath = req.body.gameurl || null;

    // Handle uploaded files
    if (req.files) {
      if (req.files.imgFile && req.files.imgFile[0]) {
        imgPath = '/img/' + req.files.imgFile[0].filename;
      }
      if (req.files.gameFile && req.files.gameFile[0]) {
        gamePath = '/games/' + req.files.gameFile[0].filename;
      }
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS games (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        grade VARCHAR(50),
        unit VARCHAR(100),
        lesson VARCHAR(100),
        img VARCHAR(500),
        gameurl VARCHAR(500),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    const query = `UPDATE games SET name = ?, description = ?, grade = ?, unit = ?, lesson = ?, img = ?, gameurl = ? WHERE id = ?`;
    const values = [req.body.name, req.body.description, req.body.grade, req.body.unit, req.body.lesson, imgPath, gamePath, req.body.id];

    // First, ensure the table exists
    sequelize.query(createTableQuery)
      .then(() => {
        // Then update the game
        return sequelize.query(query, { replacements: values, type: QueryTypes.UPDATE });
      })
      .then(() => res.status(200).json({
        message: 'Game updated successfully.',
        img: imgPath,
        gameurl: gamePath
      }))
      .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e.message }));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error. ' + error.message });
  }
}
module.exports = {
  getAll,
  add,
  deletegame,
  update
}