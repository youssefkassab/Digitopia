const configenv = require('../config/config');
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = configenv.NODE_ENV || 'development';
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

// Define associations consistently
const { User, Course, Post, Tag, Game } = db;

// User <-> Course (teacher)
if (User && Course) {
  User.hasMany(Course, { foreignKey: 'teacher_id' });
  Course.belongsTo(User, { foreignKey: 'teacher_id' });
}

// Course <-> Tag via courses_tags join table
if (Course && Tag) {
  Course.belongsToMany(Tag, { through: 'courses_tags', foreignKey: 'course_id', otherKey: 'tag_id' });
  Tag.belongsToMany(Course, { through: 'courses_tags', foreignKey: 'tag_id', otherKey: 'course_id' });
}

// Post <-> Tag via post_tags join table
if (Post && Tag) {
  Post.belongsToMany(Tag, { through: 'post_tags', foreignKey: 'postId', otherKey: 'tagId' });
  Tag.belongsToMany(Post, { through: 'post_tags', foreignKey: 'tagId', otherKey: 'postId' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;


// Only sync in non-production for developer convenience
if ((configenv.NODE_ENV || 'development') !== 'production') {
  console.log('Starting database sync (sequelize.sync) in non-production...');
  sequelize.sync()
    .then(() => {
      console.log('Database & tables synced successfully!');
    })
    .catch((err) => {
      console.error('Error syncing database:', err);
    });
}

module.exports = db;
