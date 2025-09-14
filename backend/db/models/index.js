'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define associations
const { Course, Message, Post, Tag, PostTag } = db;

if (Post && Tag && PostTag) {
  Post.belongsToMany(Tag, { through: PostTag, foreignKey: 'post_id' });
  Tag.belongsToMany(Post, { through: PostTag, foreignKey: 'tag_id' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;


// Automatically sync models with the database (not recommended for production)
console.log('Starting database sync (sequelize.sync)...');
sequelize.sync()
  .then(() => {
    console.log('Database & tables synced successfully!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

module.exports = db;
