const { Game } = require('../db/models');
const path = require('path');
const logger = require('../utils/logger');

const add = (req, res) => {
  try {
    // Extract file paths from uploaded files or form data
    let imgPath = req.body.img || null;
    let gamePath = req.body.gameurl || null;

    // Handle uploaded files (if any) - now supports flexible field names
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.mimetype.startsWith('image/') || file.fieldname.toLowerCase().includes('img')) {
          imgPath = file.filename; // Store only filename, not full path
        } else if (file.mimetype === 'text/html' || file.originalname.endsWith('.html') ||
                   file.fieldname.toLowerCase().includes('game') || file.fieldname.toLowerCase().includes('url')) {
          gamePath = file.filename; // Store only filename, not full path
        }
      });
    }

    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ error: 'Game name is required' });
    }

    // Create game using Sequelize model
    Game.create({
      name: req.body.name,
      description: req.body.description,
      grade: req.body.grade,
      unit: req.body.unit,
      lesson: req.body.lesson,
      img: imgPath,
      gameurl: gamePath
    })
      .then(() => res.status(201).json({
        message: 'Game created successfully.',
        img: imgPath, // Return only filename to frontend
        gameurl: gamePath // Return only filename to frontend
      }))
      .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e.message }));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error. ' + error.message });
  }
}
const getAll = (req, res) => {
  Game.findAll({
    attributes: ['id', 'name', 'description', 'grade', 'unit', 'lesson', 'img', 'gameurl'],
    order: [['createdAt', 'DESC']]
  })
    .then((games) => {
      // Return only filenames to frontend (no path prefixes)
      const gamesWithPaths = games.map(game => ({
        ...game.toJSON(),
        img: game.img, // Just filename, no /img/ prefix
        gameurl: game.gameurl // Just filename, no /games/ prefix
      }));
      res.status(200).json(gamesWithPaths);
    })
    .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e.message }));
}
const deletegame = (req, res) => {
  Game.destroy({
    where: { id: req.body.id }
  })
    .then(() => res.status(200).json({ message: 'Game deleted successfully.' }))
    .catch((e) => res.status(500).json({ error: 'Internal server error. ' + e.message }));
}
const update = (req, res) => {
  try {
    // Extract file paths from uploaded files or form data
    let imgPath = req.body.img || null;
    let gamePath = req.body.gameurl || null;

    // Track if new files are being uploaded
    let newImgUploaded = false;
    let newGameUploaded = false;

    // Handle uploaded files (if any) - now supports flexible field names
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.mimetype.startsWith('image/') || file.fieldname.toLowerCase().includes('img')) {
          imgPath = file.filename; // Store only filename, not full path
          newImgUploaded = true;
        } else if (file.mimetype === 'text/html' || file.originalname.endsWith('.html') ||
                   file.fieldname.toLowerCase().includes('game') || file.fieldname.toLowerCase().includes('url')) {
          gamePath = file.filename; // Store only filename, not full path
          newGameUploaded = true;
        }
      });
    }

    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ error: 'Game name is required' });
    }
    if (!req.body.id) {
      return res.status(400).json({ error: 'Game ID is required' });
    }

    // First get the current game data to retrieve old file paths
    Game.findByPk(req.body.id)
      .then(currentGame => {
        if (!currentGame) {
          throw new Error('Game not found');
        }

        const oldImgPath = currentGame.img;
        const oldGamePath = currentGame.gameurl;

        // Delete old files if new ones are being uploaded
        const fs = require('fs').promises;
        const path = require('path');

        const deletePromises = [];

        if (newImgUploaded && oldImgPath && oldImgPath) {
          // Old path is now just filename, so construct full path for deletion
          const oldImgFile = path.join(__dirname, '../public/img', oldImgPath);
          deletePromises.push(
            fs.unlink(oldImgFile).catch(err => logger.warn('Failed to delete old image:', { error: err.message }))
          );
        }

        if (newGameUploaded && oldGamePath && oldGamePath) {
          // Old path is now just filename, so construct full path for deletion
          const oldGameFile = path.join(__dirname, '../public/games', oldGamePath);
          deletePromises.push(
            fs.unlink(oldGameFile).catch(err => logger.warn('Failed to delete old game:', { error: err.message }))
          );
        }

        // Wait for file deletions to complete (if any)
        return Promise.all(deletePromises).then(() => {
          // Build update object with only provided fields
          const updateData = {
            name: req.body.name,
            description: req.body.description,
            grade: req.body.grade,
            unit: req.body.unit,
            lesson: req.body.lesson
          };

          // Track what fields are being updated for response
          const responseData = {
            message: 'Game updated successfully.'
          };

          // Only update img if new img data is provided (either from form field or file upload)
          if (imgPath !== null && imgPath !== undefined) {
            updateData.img = imgPath;
            responseData.img = imgPath; // Return only filename to frontend
          }

          // Only update gameurl if new gameurl data is provided (either from form field or file upload)
          if (gamePath !== null && gamePath !== undefined) {
            updateData.gameurl = gamePath;
            responseData.gameurl = gamePath; // Return only filename to frontend
          }

          // Then update the game in database with only the provided fields
          return currentGame.update(updateData).then(() => responseData);
        });
      })
      .then((responseData) => res.status(200).json(responseData))
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