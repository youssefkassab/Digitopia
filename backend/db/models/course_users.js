"use strict";
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CourseUser extends Model {
    static associate(models) {
      // Junction table - no additional associations needed
      // Relationships are defined in Course and User models
    }
  }

  CourseUser.init(
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      enrolled_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.ENUM('enrolled', 'completed', 'dropped'),
        allowNull: false,
        defaultValue: 'enrolled'
      }
    },
    {
      sequelize,
      modelName: 'CourseUser',
      tableName: 'course_users',
      timestamps: true,
      indexes: [
        {
          fields: ['course_id', 'user_id'],
          unique: true // Prevent duplicate enrollments
        },
        {
          fields: ['user_id', 'status'], // Optimize queries by student status
        }
      ]
    }
  );

  return CourseUser;
};
