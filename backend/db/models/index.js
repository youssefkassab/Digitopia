const configenv = require('../config/config');
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../../utils/logger');
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
const { User, Course, Post, Tag, Game, Chat, Message } = db;

// User associations
if (User && Course) {
  User.hasMany(Course, {
    foreignKey: 'teacher_id',
    as: 'teachingCourses',
    onDelete: 'SET NULL'
  });
  Course.belongsTo(User, {
    foreignKey: 'teacher_id',
    as: 'teacher',
    onDelete: 'SET NULL'
  });
}

if (User && Chat) {
  User.hasMany(Chat, {
    foreignKey: 'userId',
    as: 'chats',
    onDelete: 'CASCADE'
  });
  Chat.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });
}

// Course associations
if (Course && Tag) {
  Course.belongsToMany(Tag, {
    through: 'courses_tags',
    foreignKey: 'course_id',
    otherKey: 'tag_id',
    as: 'tags'
  });
  Tag.belongsToMany(Course, {
    through: 'courses_tags',
    foreignKey: 'tag_id',
    otherKey: 'course_id',
    as: 'courses'
  });
}

// Post associations
if (Post && Tag) {
  Post.belongsToMany(Tag, {
    through: 'post_tags',
    foreignKey: 'post_id',
    otherKey: 'tag_id',
    as: 'tags'
  });
  Tag.belongsToMany(Post, {
    through: 'post_tags',
    foreignKey: 'tag_id',
    otherKey: 'post_id',
    as: 'posts'
  });
}

if (Post && User) {
  Post.belongsTo(User, {
    foreignKey: 'sender',
    as: 'author',
    onDelete: 'CASCADE'
  });
}

// Many-to-Many: users <-> courses (students)
if (User && Course) {
  User.belongsToMany(Course, {
    through: 'course_users',
    foreignKey: 'user_id',
    otherKey: 'course_id',
    as: 'enrolledCourses'
  });
  Course.belongsToMany(User, {
    through: 'course_users',
    foreignKey: 'course_id',
    otherKey: 'user_id',
    as: 'students'
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;


// Only sync in non-production for developer convenience
//if ((configenv.NODE_ENV || 'development') !== 'production') {
//  logger.info('Starting database sync (sequelize.sync) in non-production...');
//  sequelize.sync()
//    .then(() => {
//      logger.info('Database & tables synced successfully!');
//      console.log('Database & tables synced successfully!');
//    })
//    .catch((err) => {
//      logger.error('Error syncing database:', { error: err.message, stack: err.stack });
//    });
//}

module.exports = db;
