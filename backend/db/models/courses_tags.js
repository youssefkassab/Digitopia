"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CoursesTags extends Model {
    static associate(models) {
      // Junction table - relationships defined in Course and Tag models
    }
  }

  CoursesTags.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "CoursesTags",
      tableName: "courses_tags",
      timestamps: true,
      indexes: [
        {
          fields: ['course_id', 'tag_id'],
          unique: true // Prevent duplicate tag assignments
        },
        {
          fields: ['tag_id'], // Optimize queries by tag
        }
      ]
    }
  );

  return CoursesTags;
};
