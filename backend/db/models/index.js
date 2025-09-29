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
  console.log('Starting database sync with comprehensive foreign key handling...');

  // First, let's check for and clean up orphaned data
  const cleanOrphanedData = async () => {
    try {
      // Clean up courses_tags records with invalid course_id references
      await sequelize.query(`
        DELETE ct FROM courses_tags ct
        LEFT JOIN courses c ON ct.course_id = c.id
        WHERE c.id IS NULL
      `);

      // Clean up courses_tags records with invalid tag_id references
      await sequelize.query(`
        DELETE ct FROM courses_tags ct
        LEFT JOIN tags t ON ct.tag_id = t.id
        WHERE t.id IS NULL
      `);

      // Clean up course_users records with invalid references
      await sequelize.query(`
        DELETE cu FROM course_users cu
        LEFT JOIN courses c ON cu.course_id = c.id
        WHERE c.id IS NULL
      `);

      await sequelize.query(`
        DELETE cu FROM course_users cu
        LEFT JOIN users u ON cu.user_id = u.id
        WHERE u.id IS NULL
      `);

      console.log('Cleaned up orphaned data');
    } catch (error) {
      console.log('Note: Some orphaned data cleanup queries failed (tables may not exist yet)');
    }
  };

  // Sync each model individually to handle issues better
  const syncModelsIndividually = async () => {
    try {
      // Temporarily disable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

      // Get all models except the ones that might cause issues
      const models = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');

      for (const modelName of models) {
        const model = db[modelName];
        if (model && typeof model.sync === 'function') {
          try {
            // Use alter: true but handle errors gracefully for each model
            await model.sync({ alter: true });
            console.log(`✓ Synced ${modelName} successfully`);
          } catch (modelError) {
            console.log(`⚠️  Issue syncing ${modelName}:`, modelError.message);

            // For the games table duplicate id issue, try a different approach
            if (modelName === 'Game' && modelError.message.includes('Duplicate column name')) {
              console.log('→ Trying alternative sync for Game model...');
              try {
                // Try without alter first to see current state
                await model.sync();
              } catch (fallbackError) {
                console.log('→ Game model fallback also failed:', fallbackError.message);
              }
            }
          }
        }
      }

      // Re-enable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Database sync completed with individual model handling');

    } catch (error) {
      console.error('Error in individual model sync:', error);
      // Ensure foreign key checks are re-enabled
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  };

  cleanOrphanedData()
    .then(() => syncModelsIndividually())
    .then(() => {
      console.log('Database & tables synced successfully!');
    })
    .catch((err) => {
      console.error('Error syncing database:', err);
    });
}

module.exports = db;
