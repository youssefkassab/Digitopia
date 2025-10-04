'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      // Games can be associated with courses if needed
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
      allowNull: false,
      unique: true // Game names should be unique
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    unit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lesson: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    gameurl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true // Each game should have unique URL
    }
  }, {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: true,
    indexes: [
      {
        fields: ['grade', 'unit'], // Optimize queries by grade and unit
      },
      {
        fields: ['name'], // Optimize searches by game name
      }
    ]
  });

  return Game;
};
