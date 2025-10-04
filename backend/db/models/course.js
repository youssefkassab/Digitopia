'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // A course belongs to one teacher (user)
      Course.belongsTo(models.User, {
        foreignKey: 'teacher_id',
        as: 'teacher',
        onDelete: 'SET NULL', // Keep courses if teacher is deleted
        onUpdate: 'CASCADE'
      });

      // Many-to-Many: courses <-> users (students)
      Course.belongsToMany(models.User, {
        through: 'course_users',
        foreignKey: 'course_id',
        otherKey: 'user_id',
        as: 'students'
      });

      // Many-to-Many: courses <-> tags
      Course.belongsToMany(models.Tag, {
        through: 'courses_tags',
        foreignKey: 'course_id',
        otherKey: 'tag_id',
        as: 'tags'
      });
    }
  }

  Course.init({
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
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow courses without assigned teachers initially
      references: {
        model: 'users',
        key: 'id'
      }
    },
    max_students: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30 // Reasonable default for course capacity
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'completed'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true,
    indexes: [
      {
        fields: ['teacher_id'], // Optimize queries by teacher
      },
      {
        fields: ['date', 'time'], // Optimize scheduling queries
      },
      {
        fields: ['status'], // Optimize active course queries
      }
    ]
  });

  return Course;
};
