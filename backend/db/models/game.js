'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      // Add associations here when needed
      // For example, if games should be associated with courses:
      // Game.belongsTo(models.Course, { foreignKey: 'course_id' });
    }
  }

  Game.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lesson: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    gameurl: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: true
  });

  return Game;
};
