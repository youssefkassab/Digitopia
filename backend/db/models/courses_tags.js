"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CoursesTags extends Model {
    static associate(models) {
      CoursesTags.belongsTo(models.course, {
        foreignKey: "course_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      CoursesTags.belongsTo(models.tag, {
        foreignKey: "tag_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
