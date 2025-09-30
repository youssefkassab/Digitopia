'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // A course belongs to one teacher (user)
      Course.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher' });

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
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
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
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses'
  });

  return Course;
};
