"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CoursesTags extends Model {
    static associate(models) {
      // Adjust to match model names `course` and `tag`
      CoursesTags.belongsTo(models.course, {
        foreignKey: "course_id",
        onDelete: "CASCADE",
      });
      CoursesTags.belongsTo(models.tag, {
        foreignKey: "tag_id",
        onDelete: "CASCADE",
      });
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
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "courses_tags",
      tableName: "courses_tags",
      timestamps: true,
    }
  );

  return CoursesTags;
};
