'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user (teacher) can have many courses
      User.hasMany(models.Course, {
        foreignKey: 'teacher_id',
        as: 'teachingCourses',
        onDelete: 'SET NULL'
      });

      // Many-to-Many: users <-> courses (students)
      User.belongsToMany(models.Course, {
        through: 'course_users',
        foreignKey: 'user_id',
        otherKey: 'course_id',
        as: 'enrolledCourses'
      });

      // A user can have many chats
      User.hasMany(models.Chat, {
        foreignKey: 'userId',
        as: 'chats',
        onDelete: 'CASCADE'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 200]
      }
    },
    national_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'teacher', 'student', 'user'),
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: [['admin', 'teacher', 'student', 'user']]
      }
    },
    Grade: {
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        isIn: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']]
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        fields: ['email'], // Optimize login queries
        unique: true
      },
      {
        fields: ['national_number'], // Optimize ID lookups
        unique: true
      },
      {
        fields: ['role'], // Optimize role-based queries
      },
      {
        fields: ['isActive'], // Optimize active user queries
      }
    ]
  });

  return User;
};
